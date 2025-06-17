import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Container = ({ className, children }) => {
    return (
        <div
            className={classNames(className, "p-4 sm:p-6 md:p-8 w-full h-full")}
        >
            {children}
        </div>
    );
};

export default Container;
