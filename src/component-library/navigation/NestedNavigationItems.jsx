import React from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useLocation, matchPath } from "react-router";
import NavigationItem from "./NavigationItem";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const NestedNavigationItems = ({
    title,
    icon: Icon = null,
    navigationItems = [],
    baseRoute,
    defaultOpen = false,
}) => {
    const location = useLocation();
    const match = baseRoute
        ? matchPath(`${baseRoute}/*`, location.pathname)
        : null;
    const disclosureKey = `disclosure-${Boolean(match)}`;

    return (
        <Disclosure
            as="div"
            open
            defaultOpen={defaultOpen ? defaultOpen : Boolean(match)}
            key={disclosureKey}
        >
            {({ open }) => (
                <>
                    <DisclosureButton
                        className={classNames(
                            open
                                ? "text-primary-palette-800 border-primary-palette-800 border-b-2"
                                : "hover:bg-primary-palette-50 border-outline-variant",
                            "flex items-center py-[11px] border-b px-5 font-semibold w-full"
                        )}
                    >
                        <div className="flex-1 flex">
                            {Boolean(Icon) && (
                                <Icon
                                    className="h-5 w-5 mr-2"
                                    aria-hidden="true"
                                />
                            )}
                            {title}
                        </div>
                        <ChevronRightIcon
                            className={classNames(
                                open ? "rotate-90" : "",
                                "h-5 w-5 shrink-0"
                            )}
                            aria-hidden="true"
                        />
                    </DisclosureButton>
                    <DisclosurePanel as="ul">
                        {Boolean(navigationItems.length > 0) && (
                            <ul role="list" className="w-full pl-4">
                                {navigationItems.map((item) => (
                                    <li key={item.route}>
                                        <NavigationItem item={item} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
};

export default NestedNavigationItems;
