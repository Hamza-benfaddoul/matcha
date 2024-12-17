import { useState } from "react";
import CreatableSelect from "react-select/creatable";

const isValidTag = (tag: string) => {
  const tagRegex = /^#[a-zA-Z0-9_]{2,15}$/; // Must start with #, 2-15 letters/numbers/underscores
  return tagRegex.test(tag);
};

interface TagSelectorProps {
  existingTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSelector = ({ existingTags, onTagsChange }: TagSelectorProps) => {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (newTags: any) => {
    const validTags: any = [];
    let hasError = false;

    newTags.forEach((tag: any) => {
      if (isValidTag(tag.value)) {
        validTags.push(tag);
      } else {
        hasError = true;
      }
    });

    if (hasError) {
      setError("Some tags are invalid. Use # followed by 2-15 letters/numbers.");
    } else {
      setError("");
    }

    setTags(validTags);
    onTagsChange(validTags.map((t: any) => t.value));
  };

  return (
    <div>
      <CreatableSelect
        isMulti
        onChange={handleChange}
        options={existingTags.map((tag) => ({ value: tag, label: tag }))}
        placeholder="Add or select tags..."
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TagSelector;
