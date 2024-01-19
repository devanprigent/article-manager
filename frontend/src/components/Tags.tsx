// Libraries
import React, { useState, KeyboardEvent } from 'react';
import { Label } from "reactstrap";
import "../style/tags.css"

interface TagsProps {
    onChange: (newTags: string[]) => void;
}

/**
 * The goal of this component is to provide a user interface for managing tags. 
 * It allows users to input tags through an input field.
 */
function Tags({ onChange }: TagsProps) {
    const [tags, setTags] = useState<string[]>([])

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if ((e.key === 'Delete') || (e.key === 'Backspace')) {
            removeTag(tags.length - 1);
        }
        if (e.key !== 'Enter') return
        const value: string = e.currentTarget.value
        if (!value.trim()) return
        const newTags = [...tags, value];
        onChange(newTags);
        setTags(newTags);
        e.currentTarget.value = '';
    }

    function removeTag(index: number) {
        const newTags = tags.filter((_, i) => i !== index);
        onChange(newTags);
        setTags(newTags);
    }

    return (
        <>
            <Label for="tags">
                <b>Tags</b>
            </Label>
            <div className="tags-input-container">
                {tags.map((tag, index) => (
                    <div className="tag-item" key={tag}>
                        <span className="text" onKeyDown={() => removeTag(index)} >{tag}</span>
                        <span className="close" onKeyDown={handleKeyDown} onClick={() => removeTag(index)}>&times;</span>
                    </div>
                ))}
                <input name="tags" onKeyDown={handleKeyDown} type="text" className="tags-input" />
            </div>
        </>
    )
}

// Exportation
export default Tags;