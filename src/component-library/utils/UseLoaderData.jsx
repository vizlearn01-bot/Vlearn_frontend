import React from "react";
import { useLoaderData } from "react-router";

const UseLoaderData = ({ setData }) => {
    const loaderData = useLoaderData();

    React.useEffect(() => {
        if (
            loaderData !== undefined &&
            loaderData !== null &&
            loaderData.responseCode === 200
        ) {
            if (setData) {
                setData(loaderData);
            }
        }
    }, [loaderData]);

    return <></>;
};

export default UseLoaderData;
