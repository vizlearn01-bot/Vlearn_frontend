import React from "react";
import { useFetcher } from "react-router";

const UseFetcherData = ({ url, setErrors, setData, maxRetries = 3 }) => {
    const [loadUrl, setLoadUrl] = React.useState("");
    const fetcher = useFetcher();
    const [tries, setTries] = React.useState(0);

    React.useEffect(() => {
        if (loadUrl !== url) {
            setLoadUrl(url);
        }
    }, [url]);

    React.useEffect(() => {
        if (loadUrl && fetcher.state === "idle") {
            fetcher.load(loadUrl);
        }
    }, [loadUrl]);

    React.useEffect(() => {
        if (fetcher.state === "idle") {
            if (fetcher.data) {
                if (
                    fetcher.data.responseCode === 200 ||
                    fetcher.data.responseCode === 201
                ) {
                    if (setData) {
                        setData(fetcher.data);
                    }
                } else {
                    if (setErrors) {
                        setErrors(fetcher.data);
                    }
                }
            }
        }
    }, [fetcher]);

    return <></>;
};

export default UseFetcherData;
