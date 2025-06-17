import React from "react";
import { NavLink } from "react-router";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const HorizontalNavigation = ({ navigation = [], exact = false }) => {
    return (
        <nav
            className="w-full flex overflow-x-auto space-x-5 grow"
            aria-label="Tabs"
        >
            {navigation.map((item) => (
                <NavLink
                    end={exact ? true : Boolean(item.exact)}
                    to={item.route}
                    key={item.route}
                    className={({ isActive, isPending }) =>
                        classNames(
                            isActive
                                ? "text-primary-palette-800 border-primary-palette-800 "
                                : "text-gray-600 hover:text-gray-800 border-transparent hover:border-outline ",
                            "inline-flex items-center border-b-3 py-2.5 px-2 font-semibold"
                        )
                    }
                    aria-current={(isActive) => (isActive ? "page" : undefined)}
                >
                    {Boolean(item.icon) && (
                        <item.icon
                            className="h-5 w-5 mr-2"
                            aria-hidden="true"
                        />
                    )}

                    <span className="text-nowrap">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default HorizontalNavigation;
