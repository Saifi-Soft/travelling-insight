import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Author } from '@/types/common';

interface PostAuthorProps {
  author: Author | { name: string; avatar: string };
  isSidebar?: boolean;
}

const PostAuthor = ({ author, isSidebar = false }: PostAuthorProps) => {
  return (
    <div className={isSidebar ? "bg-muted/30 rounded-lg p-6 mb-8" : "flex items-center space-x-4 mb-8"}>
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className={isSidebar ? "h-16 w-16" : "h-12 w-12"}>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className={isSidebar ? "font-bold text-lg" : "font-medium"}>{author.name}</h3>
          <p className="text-sm text-muted-foreground">
            Travel Writer & Photographer
          </p>
        </div>
      </div>
      
      {isSidebar && (
        <>
          <p className="text-muted-foreground mb-4">
            Sarah has been exploring Asia for over a decade and specializes in uncovering hidden gems and authentic local experiences.
          </p>
          <Button variant="outline" className="w-full">View Profile</Button>
        </>
      )}
    </div>
  );
};

export default PostAuthor;