import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserTagsProps {
  userTags: string[];
  canDelete?: boolean;
  handleTagChange?: (tags: string[]) => void;
}


const UserTags = ({ userTags, canDelete=false, handleTagChange }: UserTagsProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const handleDelete = (e: any, tagToDelete: string) => {
    e.preventDefault();
    const newTags = tags.filter(tag => tag !== tagToDelete);
    
    setTags(newTags);
    handleTagChange && handleTagChange(newTags);
  };
  useEffect(() => {
    setTags(userTags);
  }, [userTags]);

  return (
    <div className="flex flex-wrap gap-2 my-2">
      {tags.map((tag, index) => (
        <Badge key={index}>
          {tag} 
          {canDelete && <Button onClick={(e) => handleDelete(e, tag)} className="w-1 h-1 hover:bg-transparent">X</Button>}
        </Badge>
      ))}
    </div>
  );
};
export default UserTags