import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import UserTags from "./UserTags";

const isValidTag = (tag: string) => {
  const tagRegex = /^#[a-zA-Z0-9_]{2,15}$/; // Must start with #, 2-15 letters/numbers/underscores
  return tagRegex.test(tag);
};

interface TagSelectorProps {
  existingTags: string[];
  userTags?: string[];
  onTagsChange: (tags: string[]) => void;
  onTagsEdited: (tags: string[]) => void;
}

const TagSelector = ({ existingTags, userTags, onTagsChange, onTagsEdited }: TagSelectorProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleTagsChange = (selectedTags: string[]) => {
    console.log("tags came from userTags to tag selector: ", selectedTags);
    // setTags(selectedTags);
    onTagsEdited(selectedTags);
  };

  const filteredExistingTags = existingTags.filter(tag => !userTags?.includes(tag));

  const handleChange = (newTags: any) => {
    const validTags: any = [];
    let hasError = false;

    newTags.forEach((tag: any) => {
      if (isValidTag(tag.value)) {
        validTags.push(tag.value);
      } else {
        hasError = true;
      }
    });
    
    tags.forEach((tag: any) => {
        validTags.push(tag);
    });
    
    if (hasError) {
      setError("Some tags are invalid. Use # followed by 2-15 letters/numbers.");
    } else {
      setError("");
    }

    // setTags(validTags);
    // onTagsChange(validTags.map((t: any) => t.value));
    console.log("the valid tags are: ", validTags);
    onTagsChange(validTags);
  };

  return (
    <div>
      <CreatableSelect
        isMulti
        onChange={handleChange}
        options={filteredExistingTags.map((tag) => ({ value: tag, label: tag }))}
        placeholder="Add or select tags..."
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <UserTags userTags={userTags || []} handleTagChange={handleTagsChange} canDelete={true} />
    </div>
  );
};

export default TagSelector;
