import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Card = ({
    title = null,
    subTitle = null,
    actions = null,
    children,
    footer = null,
    className = "rounded-xs",
    cardContentClassName = "p-3",
}) => {
    return (
        <div
            className={classNames(
                "bg-white shadow-2xs ring-1 ring-gray-200 flex flex-col w-full",
                className
            )}
        >
            {Boolean(title || subTitle || actions) && (
                <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
                    <div className="flex flex-1 flex-col space-y-2">
                        {Boolean(title) && (
                            <div className="text-base font-semibold leading-6">
                                {title}
                            </div>
                        )}
                        {Boolean(subTitle) && (
                            <div className="text-sm text-gray-400">
                                {subTitle}
                            </div>
                        )}
                    </div>
                    {Boolean(actions) && (
                        <div className="ml-auto">{actions}</div>
                    )}
                </div>
            )}
            <div className={classNames(cardContentClassName)}>{children}</div>
            {Boolean(footer) && (
                <div className="px-3 py-3 mt-auto border-t border-gray-300">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
