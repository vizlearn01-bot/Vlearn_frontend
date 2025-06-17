import React from "react";
import NavigationItem from "./NavigationItem";

const VerticalNavigation = ({ navigationItems = [], title = null }) => {
    return (
        <>
            {Boolean(title) && (
                <p className="font-semibold py-[11px] text-grey-800 border-b pl-2">
                    {title}
                </p>
            )}

            {Boolean(navigationItems.length > 0) && (
                <ul role="list" className="w-full">
                    {navigationItems.map((item) => (
                        <li key={item.route}>
                            <NavigationItem item={item} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default VerticalNavigation;
