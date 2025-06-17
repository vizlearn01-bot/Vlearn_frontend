import React from "react";
import { NavLink } from "react-router";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const NavigationItem = ({ item }) => {
    return (
        <NavLink
            end={Boolean(item.exact)}
            to={item.route}
            key={item.route}
            className={({ isActive, isPending }) =>
                classNames(
                    isActive
                        ? "text-primary-palette-800 border-primary-palette-800 border-b-2 "
                        : "hover:bg-primary-palette-50 border-outline-variant",
                    "flex items-center py-[11px] border-b px-5 font-semibold "
                )
            }
            aria-current={(isActive) => (isActive ? "page" : undefined)}
        >
            {Boolean(item.icon) && (
                <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
            )}
            <span className="">{item.label}</span>
        </NavLink>
    );
};

export default NavigationItem;
