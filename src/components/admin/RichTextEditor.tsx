import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link2, 
  ImagePlus, Youtube, Twitter, FileImage, CornerDownLeft
} from 'lucide-react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  onAddMedia: (media: { type: string, url: string }) => void;
}

const RichTextEditor = ({ initialValue, onChange, onAddMedia }: RichTextEditorProps) => {
  const [value, setValue] = useState(initialValue);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textareaRef = useState<HTMLTextAreaElement | null>(null);
  
  // Keep track of the selection
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd
    });
  };
  
  const insertFormat = (before: string, after: string = '') => {
    const textarea = textareaRef[0];
    if (!textarea) return;
    
    const currentValue = value;
    const { start, end } = selection;
    const selectedText = currentValue.substring(start, end);
    
    const newValue = 
      currentValue.substring(0, start) + 
      before + 
      selectedText + 
      after + 
      currentValue.substring(end);
    
    setValue(newValue);
    onChange(newValue);
    
    // Focus and restore selection (plus formatting characters)
    setTimeout(() => {
      textarea.focus();
      const newPosition = end + before.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };
  
  const formatHandlers = {
    bold: () => insertFormat('**', '**'),
    italic: () => insertFormat('_', '_'),
    underline: () => insertFormat('<u>', '</u>'),
    unorderedList: () => insertFormat('\n- '),
    orderedList: () => insertFormat('\n1. '),
    link: (url: string, text: string) => {
      if (!url) return;
      const linkText = text || 'Link text';
      insertFormat(`[${linkText}](${url})`);
    }
  };
  
  const handleAddMedia = (type: string, url: string) => {
    if (!url) return;
    
    let mediaMarkdown = '';
    
    switch (type) {
      case 'image':
        mediaMarkdown = `![Image](${url})`;
        break;
      case 'youtube':
        mediaMarkdown = `<YoutubeEmbed url="${url}" />`;
        break;
      case 'twitter':
        mediaMarkdown = `<TwitterEmbed id="${url}" />`;
        break;
      default:
        mediaMarkdown = `[Media](${url})`;
    }
    
    // Insert at current cursor position
    const textarea = textareaRef[0];
    if (textarea) {
      const { start } = selection;
      const newValue = 
        value.substring(0, start) + 
        mediaMarkdown + 
        value.substring(start);
      
      setValue(newValue);
      onChange(newValue);
      
      // Add to media items list
      onAddMedia({ type, url });
    }
  };
  
  return (
    <div className="border-0">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatHandlers.bold}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatHandlers.italic}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatHandlers.underline}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatHandlers.unorderedList}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatHandlers.orderedList}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-border mx-1" />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Add Link"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Insert Link</h3>
              <div className="space-y-2">
                <Input 
                  id="link-url" 
                  placeholder="URL (https://...)" 
                  className="text-sm"
                />
                <Input 
                  id="link-text" 
                  placeholder="Link Text (optional)" 
                  className="text-sm"
                />
                <Button 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const linkUrl = (document.getElementById('link-url') as HTMLInputElement).value;
                    const linkText = (document.getElementById('link-text') as HTMLInputElement).value;
                    formatHandlers.link(linkUrl, linkText);
                  }}
                >
                  Insert Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="w-px h-8 bg-border mx-1" />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Add Image"
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Insert Image</h3>
              <div className="space-y-2">
                <Input 
                  id="image-url" 
                  placeholder="Image URL" 
                  className="text-sm"
                />
                <Button 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const imageUrl = (document.getElementById('image-url') as HTMLInputElement).value;
                    handleAddMedia('image', imageUrl);
                  }}
                >
                  Insert Image
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Add YouTube Video"
            >
              <Youtube className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Insert YouTube Video</h3>
              <div className="space-y-2">
                <Input 
                  id="youtube-url" 
                  placeholder="YouTube URL or Video ID" 
                  className="text-sm"
                />
                <Button 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const youtubeUrl = (document.getElementById('youtube-url') as HTMLInputElement).value;
                    handleAddMedia('youtube', youtubeUrl);
                  }}
                >
                  Insert YouTube Video
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Add Twitter Embed"
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Insert Twitter Post</h3>
              <div className="space-y-2">
                <Input 
                  id="twitter-url" 
                  placeholder="Tweet URL or ID" 
                  className="text-sm"
                />
                <Button 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const twitterUrl = (document.getElementById('twitter-url') as HTMLInputElement).value;
                    handleAddMedia('twitter', twitterUrl);
                  }}
                >
                  Insert Tweet
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Textarea
        ref={(ref) => textareaRef[0] = ref}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        onSelect={handleSelect}
        className="min-h-[400px] border-0 focus-visible:ring-0 rounded-none font-mono text-sm resize-y"
        placeholder="Write your content here... Use markdown or the formatting buttons above."
      />
    </div>
  );
};

export default RichTextEditor;
