import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const CheckBox = ({
    label = null,
    name,
    checked = false,
    readOnly = false,
    disabled = false,
    onChange = null,
    helpText = null,
    required = true,
    error = false,
    internalControlledField = true,
    ...props
}) => {
    const [enabled, setEnabled] = React.useState(checked);
    const inputId = React.useId();

    React.useEffect(() => {
        if (internalControlledField) {
            setEnabled(checked);
        }
    }, [checked]);

    const handleChange = (e) => {
        if (internalControlledField) {
            setEnabled(e.target.checked);
        }
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    return (
        <>
            <div className="flex flex-col">
                <div className="flex gap-x-2 items-center py-2">
                    <input
                        type="hidden"
                        {...(name && { name: name })}
                        value={internalControlledField ? enabled : checked}
                    />
                    <input
                        type="checkbox"
                        id={inputId}
                        checked={internalControlledField ? enabled : checked}
                        className={classNames(
                            error
                                ? "text-error-main ring-error-main focus:ring-2 focus:ring-error-main "
                                : readOnly
                                ? "ring-gray-200 focus:ring-gray-200"
                                : "ring-outline shadow-2xs focus:ring-2 focus:ring-primary-palette-800",
                            "ring-1 ring-inset border-0 bg-inherit rounded-xs"
                        )}
                        onChange={readOnly ? null : handleChange}
                        readOnly={readOnly}
                        disabled={disabled}
                        required={required}
                        {...props}
                    />
                    {Boolean(label) && (
                        <label htmlFor={inputId} className="block font-medium">
                            {label}
                            {required && (
                                <span className="text-error-main">*</span>
                            )}
                        </label>
                    )}
                </div>
                {Boolean(helpText) && (
                    <p
                        className={classNames(
                            error ? "text-red-600" : "text-gray-500",
                            "text-sm pl-6"
                        )}
                    >
                        {helpText}
                    </p>
                )}
            </div>
        </>
    );
};

export default CheckBox;
