import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const buttonStyle = {
    contained: {
        primary:
            "text-on-primary bg-primary-palette-500 border-primary-palette-500 hover:bg-primary-palette-600 hover:border-primary-palette-600 active:bg-primary-palette-700 active:border-primary-palette-700 disabled:bg-primary-palette-100 disabled:text-primary-palette-400 disabled:border-primary-palette-100",
        secondary:
            "bg-secondary-palette-500 border-secondary-palette-500 text-secondary-palette-950 hover:bg-secondary-palette-600 hover:border-secondary-palette-600 active:bg-secondary-palette-700 active:border-secondary-palette-700 disabled:bg-secondary-palette-100 disabled:text-secondary-palette-400 disabled:border-secondary-palette-100",
        info: "text-on-info bg-info-palette-500 hover:bg-info-palette-600 active:bg-info-palette-700 disabled:bg-info-palette-100 disabled:text-info-palette-400",
        warning:
            "bg-warning-palette-500 border-warning-palette-500 text-warning-palette-950 hover:bg-warning-palette-600 hover:border-warning-palette-600 active:bg-warning-palette-700 active:border-warning-palette-700 disabled:bg-warning-palette-100 disabled:border-warning-palette-100 disabled:text-warning-palette-400",
        error: "bg-red-500 text-on-error border-red-500 hover:bg-red-600 hover:border-red-600 active:bg-red-700 active:border-red-700 disabled:bg-red-100 disabled:border-red-100 disabled:text-red-400",
        success:
            "text-on-success text-on-success bg-success-palette-500 border-success-palette-500 hover:bg-success-palette-600 hover:border-success-palette-600 active:bg-success-palette-700 active:border-success-palette-700 disabled:bg-success-palette-100 disabled:border-success-palette-100 disabled:text-success-palette-400",
    },
    outlined: {
        primary:
            "text-primary-palette-500 border-primary-palette-500 hover:text-primary-palette-600 hover:border-primary-palette-600 active:text-primary-palette-700 active:border-primary-palette-700 disabled:text-primary-palette-200 disabled:border-primary-palette-200",
        secondary:
            "text-secondary-palette-600 border-secondary-palette-600 hover:text-secondary-palette-700 hover:border-secondary-palette-700 active:text-secondary-palette-800 active:border-secondary-palette-800 disabled:text-secondary-palette-300 disabled:border-secondary-palette-300",
        info: "text-info-palette-500 border-info-palette-500 hover:text-info-palette-600 hover:border-info-palette-600 active:text-info-palette-700 active:border-info-palette-700 disabled:text-info-palette-200 disabled:border-info-palette-200",
        warning:
            "text-warning-palette-700 border-warning-palette-700 hover:text-warning-palette-800 hover:border-warning-palette-800 active:text-warning-palette-900 active:border-warning-palette-900 disabled:text-warning-palette-500 disabled:border-warning-palette-500",
        error: "text-red-600 border-red-600 hover:text-red-700 hover:border-red-700 active:text-red-800 active:border-red-800 disabled:text-red-200 disabled:border-red-200",
        success:
            "text-success-palette-500 border-success-palette-500 hover:text-success-palette-600 hover:border-success-palette-600 active:text-success-palette-700 active:border-success-palette-700 disabled:text-success-palette-200 disabled:border-success-palette-200",
    },
    text: {
        primary:
            "text-primary-palette-500 hover:text-primary-palette-600 active:text-primary-palette-700 disabled:text-primary-palette-200",
        secondary:
            "text-secondary-palette-600 hover:text-secondary-palette-700 active:text-secondary-palette-800 disabled:text-secondary-palette-300",
        info: "text-info-palette-500 hover:text-info-palette-600 active:text-info-palette-700 disabled:text-info-palette-200",
        warning:
            "text-warning-palette-700 hover:text-warning-palette-800 active:text-warning-palette-900 disabled:text-warning-palette-500",
        error: "text-red-600 hover:text-red-700 active:text-red-800 disabled:text-red-200",
        success:
            "text-success-palette-500 hover:text-success-palette-600 active:text-success-palette-700 disabled:text-success-palette-200",
    },
};

export const IconButton = ({
    disabled = false,
    variant = "contained",
    color = "primary",
    className = "p-1.5 items-center justify-center rounded-full",
    type = "button",
    onClick = null,
    as: Component = "button",
    children,
}) => {
    return (
        <Component
            className={classNames(
                className,
                buttonStyle[variant][color],
                "text-sm border cursor-pointer"
            )}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </Component>
    );
};

const Button = ({
    disabled = false,
    variant = "contained",
    color = "primary",
    className = "",
    type = "button",
    onClick = null,
    as: Component = "button",
    children,
}) => {
    return (
        <Component
            className={classNames(
                buttonStyle[variant][color],
                Boolean(variant == "text")
                    ? "hover:underline"
                    : "rounded-full px-3 py-1 text-center text-sm/6 border flex justify-center items-center cursor-pointer",
                "text-sm",
                className
            )}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </Component>
    );
};

export default Button;
