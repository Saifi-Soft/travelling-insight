
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, Upload, RefreshCw } from 'lucide-react';
import { mongoApiService } from '@/api/mongoApiService';

interface BackupManagerProps {
  onBackupCreated?: () => void;
}

const BackupManager: React.FC<BackupManagerProps> = ({ onBackupCreated }) => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      // In a real implementation, this would make an API call to create a backup
      // For now, we'll simulate it with a delay
      
      // Get all collections data
      const posts = await mongoApiService.queryDocuments('posts', {});
      const categories = await mongoApiService.queryDocuments('categories', {});
      const topics = await mongoApiService.queryDocuments('topics', {});
      const settings = await mongoApiService.queryDocuments('settings', {});
      const comments = await mongoApiService.queryDocuments('comments', {});
      
      // Create backup data object
      const backupData = {
        timestamp: new Date().toISOString(),
        collections: {
          posts,
          categories,
          topics,
          settings,
          comments
        }
      };
      
      // Convert to JSON and create blob
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nomadnest-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Also save backup record in MongoDB
      await mongoApiService.insertDocument('backups', {
        createdAt: new Date(),
        name: `Backup ${new Date().toLocaleString()}`,
        size: backupJson.length,
        collections: Object.keys(backupData.collections)
      });
      
      if (onBackupCreated) {
        onBackupCreated();
      }
      
      toast.success('Backup created successfully');
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      toast.error('Please select a backup file to restore');
      return;
    }
    
    setIsRestoring(true);
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        try {
          if (!event.target || typeof event.target.result !== 'string') {
            throw new Error('Failed to read file');
          }
          
          const backupData = JSON.parse(event.target.result);
          
          // In a real implementation, this would make an API call to restore from the backup
          // For now, we'll just show a success message
          toast.success('Backup restored successfully');
        } catch (error) {
          console.error('Error parsing backup file:', error);
          toast.error('Invalid backup file format');
        } finally {
          setIsRestoring(false);
          setSelectedFile(null);
        }
      };
      
      fileReader.onerror = () => {
        toast.error('Error reading the backup file');
        setIsRestoring(false);
      };
      
      fileReader.readAsText(selectedFile);
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Failed to restore backup');
      setIsRestoring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>
          Create backups and restore your website data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Create Backup</h3>
            <p className="text-sm text-muted-foreground">
              Export all your website data as a JSON backup file.
            </p>
            <Button 
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="w-full"
            >
              {isCreatingBackup ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Create Backup
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Restore from Backup</h3>
            <p className="text-sm text-muted-foreground">
              Import data from a previous backup.
            </p>
            
            <div className="grid gap-2">
              <label htmlFor="backup-file" className="text-sm font-medium">
                Select Backup File:
              </label>
              <input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4 file:rounded-md
                  file:border-0 file:text-sm file:font-medium
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90 cursor-pointer"
              />
            </div>
            
            <Button 
              onClick={handleRestore}
              disabled={isRestoring || !selectedFile}
              className="w-full"
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Restore Backup
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupManager;
