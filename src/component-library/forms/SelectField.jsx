import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const SelectField = ({
    label,
    name,
    required = true,
    error = false,
    helpText = null,
    defaultValue,
    options = [],
    onChange = null,
    disabled = false,
    readOnly = false,
    allowMultiple = false,
    allowBlank = false,
    palceholder,
    leadingIcon = null,
    trailingIcon = null,
    className = "",
    internalControlledField = true,
    ...props
}) => {
    const [selectedValues, setSelectedValues] = React.useState(
        allowMultiple ? [] : ""
    );
    const inputId = React.useId();

    React.useEffect(() => {
        if (defaultValue && internalControlledField) {
            setSelectedValues(defaultValue || "");
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        if (allowMultiple) {
            let selected = Array.from(
                e.target.selectedOptions,
                (option) => option.value
            );
            console.log(selected);

            if (internalControlledField) {
                setSelectedValues(selected);
            }
            if (onChange) {
                onChange(selected);
            }
        } else {
            if (internalControlledField) {
                setSelectedValues(e.target.value);
            }
            if (onChange) {
                onChange(e.target.value);
            }
        }
    };

    return (
        <div className={classNames("flex flex-col w-full", className)}>
            <label htmlFor={inputId} className="font-semibold text-left mb-2">
                {label} {required && <span className="text-error-main">*</span>}
            </label>

            <div
                className={classNames(
                    "flex rounded-sm h-full min-h-10 items-center outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600",
                    error
                        ? "outline-error-main text-error-main"
                        : readOnly || disabled
                        ? "outline-gray-200 text-gray-400"
                        : "outline-gray-400"
                )}
            >
                {leadingIcon && (
                    <div className="h-full p-1.5 hrink-0 text-base select-none sm:text-sm/6">
                        {leadingIcon}
                    </div>
                )}
                <select
                    id={inputId}
                    {...(name && { name: name })}
                    required={required}
                    onChange={readOnly ? undefined : handleChange}
                    disabled={disabled}
                    multiple={allowMultiple}
                    size={allowMultiple ? 5 : 0}
                    value={
                        internalControlledField
                            ? selectedValues
                            : defaultValue || ""
                    }
                    readOnly={readOnly}
                    {...props}
                    className="p-1.5 text-base placeholder:text-gray-400 focus:outline-hidden sm:text-sm/6 w-full h-full min-h-10 border-0 focus:ring-0 focus:border-0"
                >
                    <option value="" disabled>
                        {Boolean(palceholder)
                            ? palceholder
                            : Boolean(allowMultiple)
                            ? "Select one or more options."
                            : "Select an option"}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}

                    {Boolean(
                        (internalControlledField &&
                            selectedValues.length > 0) ||
                            Boolean(
                                !internalControlledField &&
                                    defaultValue?.length > 0
                            )
                    ) &&
                        Boolean(allowBlank || !required) && (
                            <option value="">Clear Selection</option>
                        )}

                    {Boolean(options.length < 1) && (
                        <option value="" disabled>
                            No option available
                        </option>
                    )}
                </select>
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
            {Boolean(helpText) ? (
                <p
                    className={classNames(
                        error ? "text-error-main" : "text-gray-400",
                        "mt-2 text-sm"
                    )}
                >
                    {helpText}
                </p>
            ) : (
                Boolean(allowMultiple) && (
                    <p
                        className={classNames(
                            error ? "text-error-main" : "text-gray-400",
                            "mt-2 text-sm"
                        )}
                    >
                        Hold down “Control”, or “Command” on a Mac, to select
                        more than one.
                    </p>
                )
            )}
        </div>
    );
};

export default SelectField;
