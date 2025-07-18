import React from "react";
import { useFetcher } from "react-router";

const GetFetcherData = ({ children }) => {
    const [fetcherData, setFetcherData] = React.useState(undefined);
    const [data, setData] = React.useState(undefined);
    const [errors, setErrors] = React.useState({});
    const fetcher = useFetcher();

    React.useEffect(() => {
        console.log("Fetcher Data:", fetcher.data);
        
        if (fetcher.data) {
            if (
                fetcher.data.responseCode === 200 ||
                fetcher.data.responseCode === 201
            ) {
                setFetcherData(fetcher.data);
                setData(fetcher.data?.responseData?.data);
            } else {
                setErrors(fetcher.data?.responseData?.errors);
            }
        }
    }, [fetcher.data]);

    return (
        Boolean(children) && (
            <>
                {Boolean(typeof children === "function") ? (
                    children({
                        fetcherState: fetcher.state,
                        fetcherData,
                        data,
                        loadData: (url, options) => {
                            if (url && fetcher.state === "idle") {
                                console.log("Loading data from URL:", url);
                                
                                fetcher.load(url);
                            }
                        },
                        errors,
                        setErrors,
                    })
                ) : (
                    <>{children}</>
                )}
            </>
        )
    );
};

export default GetFetcherData;
