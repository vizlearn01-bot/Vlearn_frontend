import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const RichTextEditor = ({
    label = null,
    name,
    error = false,
    helpText = null,
    defaultValue = null,
    onChange = null,
    className = "",
    internalControlledField = true,
    ...props
}) => {
    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const [editorContent, setEditorContent] = useState("");
    const inputId = React.useId();

    React.useEffect(() => {
        if (defaultValue && internalControlledField) {
            setEditorContent(defaultValue);
        }
    }, [defaultValue]);

    const handleEditorChange = (content) => {
        if (internalControlledField) {
            setEditorContent(content);
        }
        if (onChange) onChange(content);
    };

    return (
        <>
            {Boolean(label) && (
                <p className="block font-medium mb-2">{label}</p>
            )}
            <input
                type="hidden"
                id={inputId}
                {...(name && { name: name })}
                value={internalControlledField ? editorContent : defaultValue}
            />
            <ReactQuill
                theme="snow"
                value={internalControlledField ? editorContent : defaultValue}
                onChange={handleEditorChange}
                modules={modules}
                className={classNames(
                    "flex flex-col h-full rounded-xs",
                    className
                )}
                {...props}
            />
            {Boolean(helpText) && (
                <p
                    className={classNames(
                        error ? "text-red-600" : "text-gray-500",
                        "mt-1 text-sm"
                    )}
                >
                    {helpText}
                </p>
            )}
        </>
    );
};

export default RichTextEditor;
