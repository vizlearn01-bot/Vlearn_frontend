import React from "react";

const SectionHeader = ({ title = null, actions = null }) => {
    return (
        <div className="border-b border-gray-200 pb-2 sm:flex sm:items-center sm:justify-between">
            {Boolean(title) && <h6 className="h6">{title}</h6>}
            {Boolean(actions) && actions}
        </div>
    );
};

export default SectionHeader;
