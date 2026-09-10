import { useState, type KeyboardEvent } from 'react';

interface TagsProps {
  onChange: (newTags: string[]) => void;
  currentTags: string[];
}

function TagsForm({ onChange, currentTags }: Readonly<TagsProps>) {
  const [tags, setTags] = useState<string[]>(currentTags);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const value: string = e.currentTarget.value;
    if ((e.key === 'Delete' || e.key === 'Backspace') && !value.trim()) {
      removeTag(tags.length - 1);
    }
    if (e.key !== 'Enter') return;
    if (!value.trim()) return;
    e.currentTarget.value = '';
    addTag(value);
  }

  function addTag(name: string) {
    if (tags.includes(name)) return;
    const newTags = [...tags, name];
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
      <label htmlFor="tags" className="text-slate-800 dark:text-slate-100">
        <b>Tags</b>
      </label>
      <div className="tags-input-wrapper flex flex-wrap items-center gap-2 rounded border border-slate-100 bg-white p-2">
        {tags.map((tag, index) => (
          <div className="tag-chip flex flex-row items-center space-x-2 rounded-full bg-slate-200 px-3 py-2 dark:bg-slate-700" key={tag}>
            <span className="text-slate-800 dark:text-slate-100" onKeyDown={() => removeTag(index)}>
              {tag}
            </span>
            <span
              className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white transition-colors duration-150 hover:bg-red-700 hover:shadow-sm active:bg-red-800 dark:hover:bg-red-500 dark:active:bg-red-600"
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
          className="tags-text-input flex-grow border-none bg-white p-y-2 text-slate-900 outline-none placeholder:text-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>
    </>
  );
}

// Exportation
export default TagsForm;
