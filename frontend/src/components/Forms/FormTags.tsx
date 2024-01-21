// Libraries
import React, { useState, KeyboardEvent } from 'react';
import { Tag } from "../Tools/Types";
import { Label } from "reactstrap";
import "../../style/tags.css"

interface TagsProps {
    onChange: (newTags: Tag[]) => void;
    currentTags: Tag[];
}

/**
 * The goal of this component is to provide a user interface for managing tags. 
 * It allows users to input tags through an input field.
 */
function Tags({ onChange, currentTags }: Readonly<TagsProps>) {
    const [tags, setTags] = useState<Tag[]>(currentTags)

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        const value: string = e.currentTarget.value;
        if (((e.key === 'Delete') || (e.key === 'Backspace')) && (!value.trim())) {
            removeTag(tags.length - 1);
        }
        if (e.key !== 'Enter') return
        if (!value.trim()) return
        e.currentTarget.value = "";
        addTag(value);
    }

    function addTag(nom: string) {
        if (tags.some(tag => tag.nom === nom)) return
        const newTag: Tag = {
            id: 0,
            nom: nom
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
            <Label for="tags">
                <b>Tags</b>
            </Label>
            <div className="tags-input-container">
                {tags.map((tag, index) => (
                    <div className="tag-item" key={tag.nom}>
                        <span className="text" onKeyDown={() => removeTag(index)} >{tag.nom}</span>
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