// Libraries
import React, { useState, KeyboardEvent } from "react";
import { Tag } from "../Tools/Types";

interface TagsProps {
  onChange: (newTags: Tag[]) => void;
  currentTags: Tag[];
}

/**
 * The goal of this component is to provide a user interface for managing tags.
 * It allows users to input tags through an input field.
 */
function TagsForm({ onChange, currentTags }: Readonly<TagsProps>) {
  const [tags, setTags] = useState<Tag[]>(currentTags);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const value: string = e.currentTarget.value;
    if ((e.key === "Delete" || e.key === "Backspace") && !value.trim()) {
      removeTag(tags.length - 1);
    }
    if (e.key !== "Enter") return;
    if (!value.trim()) return;
    e.currentTarget.value = "";
    addTag(value);
  }

  function addTag(name: string) {
    if (tags.some((tag) => tag.name === name)) return;
    const newTag: Tag = {
      id: 0,
      name: name,
    };
    const newTags = [...tags, newTag];
    onChange(newTags);
    setTags(newTags);
  }

  function removeTag(index: number) {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
    setTags(newTags);
  }

  return (
    <>
      <label htmlFor="tags">
        <b>Tags</b>
      </label>
      <div className="border border-gray-300 bg-white p-2 rounded flex items-center flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            className="flex flex-row space-x-2 bg-gray-300 px-3 py-2 rounded-full items-center"
            key={tag.name}
          >
            <span className="text" onKeyDown={() => removeTag(index)}>
              {tag.name}
            </span>
            <span
              className="bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center"
              onKeyDown={handleKeyDown}
              onClick={() => removeTag(index)}
            >
              &times;
            </span>
          </div>
        ))}
        <input
          name="tags"
          onKeyDown={handleKeyDown}
          placeholder="..."
          type="text"
          className="flex-grow p-y-2 border-none outline-none bg-white"
        />
      </div>
    </>
  );
}

// Exportation
export default TagsForm;
