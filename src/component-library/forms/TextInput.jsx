import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const TextInput = ({
    label = null,
    name,
    type = "text",
    autocomplete = null,
    required = true,
    error = false,
    helpText = null,
    defaultValue = "",
    isTextArea = false,
    placeholder = "",
    leadingIcon = null,
    trailingIcon = null,
    readOnly = false,
    disabled = false,
    onChange = null,
    internalControlledField = true,
    className = "rounded-sm",
    ...props
}) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputId = React.useId();

    React.useEffect(() => {
        if (defaultValue && internalControlledField) {
            setInputValue(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        if (internalControlledField) {
            setInputValue(e.target.value);
        }
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="flex flex-col w-full">
            {Boolean(label) && (
                <label htmlFor={inputId} className="font-semibold text-left mb-2">
                    {label}{" "}
                    {required && <span className="text-error-main">*</span>}
                </label>
            )}
            <div
                className={classNames(
                    "flex h-full min-h-10 items-center outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600",
                    error
                        ? "outline-error-main text-error-main"
                        : readOnly || disabled
                        ? "outline-gray-200 text-gray-400"
                        : "outline-gray-400",
                    className
                )}
            >
                {leadingIcon && (
                    <div className="h-full p-1.5 hrink-0 text-base select-none sm:text-sm/6">
                        {leadingIcon}
                    </div>
                )}
                {isTextArea ? (
                    <textarea
                        id={inputId}
                        {...(name && { name: name })}
                        type={type}
                        autoComplete={autocomplete}
                        required={required}
                        value={
                            internalControlledField
                                ? inputValue
                                : defaultValue || ""
                        }
                        onChange={readOnly ? null : handleChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        rows={4}
                        disabled={disabled}
                        {...props}
                        className="p-1.5 text-base placeholder:text-gray-400 focus:outline-hidden sm:text-sm/6 w-full h-full min-h-10 border-0 focus:ring-0 focus:border-0"
                    />
                ) : (
                    <input
                        id={inputId}
                        {...(name && { name: name })}
                        type={type}
                        autoComplete={autocomplete}
                        required={required}
                        value={
                            internalControlledField
                                ? inputValue
                                : defaultValue || ""
                        }
                        onChange={readOnly ? null : handleChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        disabled={disabled}
                        {...props}
                        className="p-1.5 text-base placeholder:text-gray-400 focus:outline-hidden sm:text-sm/6 w-full h-full min-h-10 border-0 focus:ring-0 focus:border-0"
                    />
                )}

                {Boolean(error || Boolean(trailingIcon)) && (
                    <div className="flex p-1.5 space-x-2 h-full">
                        {error && (
                            <div className="pointer-events-none my-auto">
                                <ExclamationCircleIcon
                                    className="h-5 w-5 text-error-main"
                                    aria-hidden="true"
                                />
                            </div>
                        )}
                        {trailingIcon && (
                            <div className="cursor-pointer h-full hrink-0 text-base select-none sm:text-sm/6">
                                {trailingIcon}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {Boolean(helpText) && (
                <p
                    className={classNames(
                        error ? "text-error-main" : "text-gray-400",
                        "mt-1 text-sm"
                    )}
                >
                    {helpText}
                </p>
            )}
        </div>
    );
};

export default TextInput;
