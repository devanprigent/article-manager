// Libraries
import { useState } from 'react'
import { Label } from "reactstrap";
import "../style/tags.css"

/**
 * The goal of this component is to provide a user interface for managing tags. 
 * It allows users to input tags through an input field.
 */
function Tags({ onChange }) {
    const [tags, setTags] = useState([])

    function handleKeyDown(e) {
        if ((e.key === 'Delete') || (e.key === 'Backspace')) {
            removeTag(tags.length - 1);
        }
        if (e.key !== 'Enter') return
        const value = e.target.value
        if (!value.trim()) return
        const newTags = [...tags, value];
        update(newTags);
        setTags(newTags);
        e.target.value = '';
    }

    function removeTag(index) {
        const newTags = tags.filter((el, i) => i !== index);
        update(newTags);
        setTags(newTags);
    }

    function update(newTags) {
        onChange({
            "target": {
                "name": "tags",
                "value": newTags
            }
        });
    }

    return (
        <>
            <Label for="tags">
                <b>Tags</b>
            </Label>
            <div className="tags-input-container">
                {tags.map((tag, index) => (
                    <div className="tag-item" key={tag.name}>
                        <span className="text" onKeyDown={() => removeTag(index)} >{tag}</span>
                        <span className="close" onClick={() => removeTag(index)}>&times;</span>
                    </div>
                ))}
                <input name="tags" onKeyDown={handleKeyDown} type="text" className="tags-input" />
            </div>
        </>
    )
}

// Exportation
export default Tags;