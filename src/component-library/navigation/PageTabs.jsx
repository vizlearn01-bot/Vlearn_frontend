import React from "react";
import HorizontalNavigation from "./HorizontalNavigation";

const PageTabs = ({ navigation = [] }) => {
    return (
        <div>
            <div className="gap-y-4 flex flex-wrap items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-outline-variant">
                <div className="grow overflow-x-auto">
                    <HorizontalNavigation navigation={navigation} />
                </div>
            </div>
        </div>
    );
};

export default PageTabs;
