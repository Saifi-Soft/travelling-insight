
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlus, Link2, Upload } from 'lucide-react';

interface MediaUploaderProps {
  currentImage?: string;
  onImageSelected: (url: string) => void;
}

const MediaUploader = ({ currentImage, onImageSelected }: MediaUploaderProps) => {
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onImageSelected(imageUrl);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setImageUrl(loadEvent.target.result.toString());
          onImageSelected(loadEvent.target.result.toString());
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // In a real application, this would upload to a server or CDN
  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    
    try {
      // Simulate an upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, this would be the URL returned from the server
      const uploadedUrl = URL.createObjectURL(uploadedFile);
      setImageUrl(uploadedUrl);
      onImageSelected(uploadedUrl);
      
      // Success message would go here
    } catch (error) {
      // Error handling would go here
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <Tabs defaultValue="url">
        <TabsList className="mb-4">
          <TabsTrigger value="url">
            <Link2 className="mr-2 h-4 w-4" /> URL
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="url">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button type="submit" disabled={!imageUrl}>
              Set Image
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <div className="flex flex-col items-center">
              <ImagePlus className="h-8 w-8 text-muted-foreground mb-4" />
              
              <div className="text-sm text-muted-foreground mb-4">
                <span className="font-medium">Click to upload</span> or drag and drop
                <p>SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
              
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label 
                htmlFor="file-upload" 
                className="bg-primary text-primary-foreground cursor-pointer px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Select File
              </Label>
            </div>
          </div>
          
          {uploadedFile && (
            <div className="flex flex-col items-center space-y-3">
              <p className="text-sm">{uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)</p>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading} 
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {imageUrl && (
        <div className="mt-6">
          <Label>Preview</Label>
          <div className="mt-2 border rounded-md overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="max-h-64 w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Error';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
