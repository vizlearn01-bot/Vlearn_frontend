import React from "react";

const PageHeader = ({ title = "", actions = null }) => {
    return (
        <div className="border-b border-gray-200">
            <div className="px-4 sm:px-6 md:px-8 gap-y-4 flex flex-wrap items-center justify-between">
                {Boolean(title) && (
                    <div className="flex py-[9px]">
                        <span className="h3 font-medium md:text-lg">
                            {title}
                        </span>
                    </div>
                )}
                {Boolean(actions) && (
                    <div className="shrink-0 py-[6px] ml-auto">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
