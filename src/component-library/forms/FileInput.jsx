import React from "react";
import Button from "../butttons/Button";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const FileInput = ({
    name,
    accept = "*",
    label = "",
    required = true,
    multiple = false,
    defaultValue = null,
    error = false,
    helpText = null,
    onChange = null,
    ...props
}) => {
    const [inputValue, setInputValue] = React.useState(defaultValue);
    const inputRef = React.useRef(null);
    const inputId = React.useId();

    React.useEffect(() => {
        if (onChange) {
            onChange(inputValue);
        }
    }, [inputValue]);

    const handleReset = () => {
        setInputValue(multiple ? [] : null);
    };

    const onInputChange = (event) => {
        const files = event.target.files;
        if (files) {
            setInputValue(multiple ? Array.from(files) : files[0]);
        }
    };

    const getDisplayValue = () => {
        if (!inputValue) return "Upload a file";
        if (multiple) {
            return inputValue.length === 0
                ? "No files chosen"
                : `${inputValue.length} file${
                      inputValue.length === 1 ? "" : "s"
                  } selected`;
        }
        return inputValue.name;
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) {
            setInputValue(multiple ? Array.from(files) : files[0]);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <div className="flex items-center space-x-2">
                {Boolean(label) && (
                    <p className="font-medium text-left pointer-events-none">
                        {label}
                        {required && <span className="text-error-main">*</span>}
                    </p>
                )}
                <label
                    htmlFor={inputId}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="relative text-sm cursor-pointer rounded-md bg-white font-semibold text-primary-palette-500 hover:text-primary-palette-600 active:text-primary-palette-700 disabled:text-primary-palette-200 hover:underline"
                >
                    <span>{getDisplayValue()}</span>
                    <input
                        id={inputId}
                        ref={inputRef}
                        onChange={onInputChange}
                        required={required}
                        {...(name && { name: name })}
                        type="file"
                        multiple={multiple}
                        className="sr-only"
                        accept={accept}
                        {...props}
                    />
                </label>
                {Boolean(inputValue) && (
                    <Button onClick={handleReset} variant="text" color="error">
                        Remove
                    </Button>
                )}
            </div>
            {Boolean(helpText) && (
                <p
                    className={classNames(
                        error ? "text-error-main" : "text-gray-500",
                        "mt-2 text-sm"
                    )}
                >
                    {helpText}
                </p>
            )}
        </div>
    );
};

export default FileInput;
