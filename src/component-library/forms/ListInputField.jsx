import React from "react";
import TextInput from "./TextInput";
import Button from "../butttons/Button";
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import Chip from "../chips/Chip";
import TemplateTextField from "./TemplateTextField";

const ListInputField = ({
    label,
    name,
    type = "text",
    autocomplete,
    required = true,
    error = false,
    helpText,
    defaultValue,
    placeholder = "",
    leadingIcon = null,
    readOnly = false,
    disabled = false,
    onChange = null,
    trailingIcon,
    internalControlledField = true,
    allowVariableUse = false,
    variableList,
    ...props
}) => {
    const [input, setInput] = React.useState("");
    const [inputList, setInputList] = React.useState([]);

    React.useEffect(() => {
        if (defaultValue && internalControlledField) {
            setInputList(defaultValue);
        }
    }, [defaultValue]);

    const inputId = React.useId();

    const handleChange = () => {
        if (internalControlledField) {
            setInputList((prev) => {
                if (prev.includes(input)) {
                    return prev;
                } else {
                    return [...prev, input];
                }
            });
        }
        if (onChange) {
            if (!defaultValue.includes(input)) {
                onChange([...defaultValue, input]);
            }
        }
    };

    const [errorStateHelpText, setErrorStateHelpText] = React.useState("");

    React.useEffect(() => {
        if (error) {
            let helpText = "";
            if (Array.isArray(error)) {
                let error_list = [];
                function isPlainObject(value) {
                    // First handle null and non-objects
                    if (value === null || typeof value !== "object") {
                        return false;
                    }
                    // Special objects like Arrays, Dates, RegExp, etc. will have different prototypes
                    const prototype = Object.getPrototypeOf(value);
                    // Plain objects have prototype equal to Object.prototype
                    // or null (for objects created with Object.create(null))
                    return prototype === Object.prototype || prototype === null;
                }

                error.map((item) => {
                    if (!isPlainObject(item)) {
                        error_list.push(item);
                    }
                });

                helpText = error_list.join(" \n\n");
            } else if (typeof error === "object") {
                helpText = Object.values(error).join(", ");
            } else {
                helpText = error;
            }
            setErrorStateHelpText(helpText);
        }
    }, [error]);

    return (
        <div className="space-y-2">
            {Boolean(label) && (
                <label htmlFor={inputId} className="font-medium text-left mb-2">
                    {label}{" "}
                    {required && <span className="text-error-main">*</span>}
                </label>
            )}

            {allowVariableUse ? (
                <TemplateTextField
                    includeVariableExamples={false}
                    variableList={variableList}
                    defaultValue={input}
                    onChange={setInput}
                    internalControlledField={false}
                    type={type}
                    autocomplete={autocomplete}
                    required={false}
                    error={Boolean(error)}
                    helpText={Boolean(error) ? errorStateHelpText : helpText}
                    placeholder={placeholder}
                    leadingIcon={leadingIcon}
                    readOnly={readOnly}
                    disabled={disabled}
                    trailingIcon={
                        <div className="flex space-x-2">
                            {Boolean(input !== "") && (
                                <Button
                                    onClick={() => {
                                        if (input === "" || input === "{{}}") {
                                            return;
                                        }
                                        handleChange();
                                        setInput("");
                                    }}
                                    variant="text"
                                    className="flex items-center space-x-1"
                                >
                                    <span className="p-x-1">Add</span>
                                    <ArrowRightIcon className="size-3" />
                                </Button>
                            )}
                            {Boolean(trailingIcon) && trailingIcon}
                        </div>
                    }
                    allowedVariableTypes={[type]}
                    {...props}
                />
            ) : (
                <TextInput
                    defaultValue={input}
                    onChange={setInput}
                    internalControlledField={false}
                    type={type}
                    autocomplete={autocomplete}
                    required={false}
                    error={Boolean(error)}
                    helpText={Boolean(error) ? errorStateHelpText : helpText}
                    placeholder={placeholder}
                    leadingIcon={leadingIcon}
                    readOnly={readOnly}
                    disabled={disabled}
                    trailingIcon={
                        <div className="flex space-x-2">
                            {Boolean(input !== "") && (
                                <Button
                                    onClick={() => {
                                        if (input === "") {
                                            return;
                                        }
                                        handleChange();
                                        setInput("");
                                    }}
                                    variant="text"
                                    className="flex items-center space-x-1"
                                >
                                    <span className="p-x-1">Add</span>
                                    <ArrowRightIcon className="size-3" />
                                </Button>
                            )}
                            {Boolean(trailingIcon) && trailingIcon}
                        </div>
                    }
                    {...props}
                />
            )}

            {internalControlledField ? (
                <>
                    {inputList.length > 0 && (
                        <div className="flex space-x-2">
                            {inputList.map((text) => {
                                return (
                                    <Chip
                                        key={text}
                                        label={text}
                                        actions={
                                            <Button
                                                variant="text"
                                                onClick={() => {
                                                    setInputList((prev) =>
                                                        prev.filter(
                                                            (t) => t !== text
                                                        )
                                                    );
                                                }}
                                                className="m-2"
                                            >
                                                <TrashIcon className="size-4" />
                                            </Button>
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {defaultValue?.length > 0 && (
                        <div className="flex space-x-2">
                            {defaultValue.map((text) => {
                                return (
                                    <Chip
                                        key={text}
                                        label={text}
                                        actions={
                                            <Button
                                                variant="text"
                                                onClick={() => {
                                                    onChange(
                                                        defaultValue.filter(
                                                            (t) => t !== text
                                                        )
                                                    );
                                                }}
                                                className="m-2"
                                            >
                                                <TrashIcon className="size-4" />
                                            </Button>
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            <div className="relative">
                <input
                    type="text"
                    {...(name && { name: name })}
                    value={
                        internalControlledField
                            ? Boolean(inputList?.length > 0)
                                ? JSON.stringify(inputList)
                                : required
                                ? ""
                                : JSON.stringify([])
                            : Boolean(defaultValue?.length > 0)
                            ? JSON.stringify(defaultValue)
                            : required
                            ? ""
                            : JSON.stringify([])
                    }
                    className="sr-only"
                    required={required}
                    onChange={() => {
                        /*empty function to prevent browser error*/
                    }}
                />
            </div>
        </div>
    );
};

export default ListInputField;
