import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthorProps {
  name: string;
  avatar: string;
}

const PostAuthorWithAvatar = ({ author }: { author: AuthorProps }) => {
  const initials = author.name
    .split(" ")
    .map(part => part[0])
    .join("");

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{author.name}</span>
    </div>
  );
};

export default PostAuthorWithAvatar;