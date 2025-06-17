import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const TabsContainer = ({
    tabs = [],
    className = "",
    manual = false,
    shoWTabList = true,
    defaultIndex = 0,
    selectedIndex = null,
    onSelectedIndexChange = null,
}) => {
    const [activeIdex, setActiveIdex] = React.useState(0);

    React.useEffect(() => {
        if (selectedIndex !== null) {
            setActiveIdex(selectedIndex);
        }
    }, [selectedIndex]);

    return (
        <TabGroup
            className={classNames("w-full h-full ", className)}
            manual={manual}
            defaultIndex={defaultIndex}
            selectedIndex={activeIdex}
            onChange={(index) => {
                setActiveIdex(index);
                onSelectedIndexChange && onSelectedIndexChange(index);
            }}
        >
            <TabList
                className={classNames(
                    "border-b",
                    Boolean(shoWTabList) ? "" : "hidden"
                )}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        className="inline-flex items-center border-b-2 py-2.5 px-2 font-medium text-gray-500 data-hover:text-gray-700 border-transparent data-hover:border-outline data-selected:border-primary-palette-900 data-selected:text-primary-palette-900"
                    >
                        {Boolean(tab.icon) && (
                            <tab.icon
                                className="h-5 w-5 mr-2"
                                aria-hidden="true"
                            />
                        )}
                        <span className="text-nowrap">{tab.label}</span>
                    </Tab>
                ))}
            </TabList>
            <TabPanels
                className={classNames("h-full", shoWTabList ? "mt-4" : "")}
            >
                {tabs.map((tab, index) => (
                    <TabPanel key={index} className={"h-full"}>
                        {tab.content}
                    </TabPanel>
                ))}
            </TabPanels>
        </TabGroup>
    );
};

export default TabsContainer;
