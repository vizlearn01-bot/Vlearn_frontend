import React from "react";

const SimpleSideBar = ({ children, header, footer }) => {
    return (
        <div className="flex flex-col w-full h-full overflow-y-auto">
            <div className="min-h-14 lg:min-h-16 border-b border-outline-variant flex items-center">
                {header}
            </div>
            <div className="flex-1 grow">{children}</div>
            {Boolean(footer) && (
                <div className="min-h-14 border-t border-outline-variant flex items-center">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default SimpleSideBar;
