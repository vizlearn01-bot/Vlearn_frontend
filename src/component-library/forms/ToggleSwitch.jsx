import React from "react";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const ToggleSwitch = ({
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

    const handleChange = (value) => {
        if (internalControlledField) {
            setEnabled(value);
        }
        if (onChange) {
            onChange(value);
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
                        id={inputId}
                    />
                    <Switch
                        checked={internalControlledField ? enabled : checked}
                        onChange={readOnly ? null : handleChange}
                        disabled={disabled}
                        className={classNames(
                            error
                                ? "text-error-main ring-error-main ring-2 focus:ring-error-main"
                                : readOnly
                                ? "focus:ring-gray-200"
                                : "focus:ring-indigo-600",
                            "group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2  focus:ring-offset-2 data-checked:bg-indigo-600"
                        )}
                        {...props}
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                        />
                    </Switch>
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
                            "text-sm"
                        )}
                    >
                        {helpText}
                    </p>
                )}
            </div>
        </>
    );
};

export default ToggleSwitch;
