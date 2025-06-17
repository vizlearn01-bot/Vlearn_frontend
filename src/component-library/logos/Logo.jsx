import React from "react";
import HorizontalLogo from "../../assets/images/svgs/bizna-logo.svg";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Logo = ({ className, orientation = "horizontal" }) => {
    return (
        <div
            className={classNames(
                className,
                "flex items-center justify-center"
            )}
        >
            <img
                src={HorizontalLogo}
                alt="Bizna Logo"
                className="h-full w-auto"
            />
        </div>
    );
};

export default Logo;
