import React from "react";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import { useAuthenticationContext } from "./AuthenticationContextProvider";

const RestrictedRoute = ({
    children,
    allowedRoles = [],
    account = null,
    adminOnly = false,
}) => {
    const authContext = useAuthenticationContext();
    const [allowed, setallowed] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (allowedRoles.length > 0) {
            if (authContext?.userDetails?.roles) {
                authContext?.userDetails?.roles?.forEach((role) => {
                    if (allowedRoles.includes(role)) {
                        setallowed(true);
                        return;
                    }
                });
            }
        }
        if (account) {
            if (authContext?.userDetails?.account !== account) {
                setallowed(false);
            }
        }
        if (adminOnly) {
            if (
                authContext?.userDetails?.account_relationship !== "ADMIN" &&
                authContext?.userDetails?.account_relationship !== "OWNER"
            ) {
                setallowed(false);
            }
        }
    }, [authContext]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return allowed ? (
        children
    ) : (
        <div className="text-center my-10 flex flex-col items-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full ">
                <ShieldExclamationIcon />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Not Allowed!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                This page has restricted access.
            </p>
            <button
                onClick={handleGoBack}
                className="mt-4 rounded-md bg-white font-medium text-primary-600 hover:text-primary-500"
            >
                Go Back!
            </button>
        </div>
    );
};

export default RestrictedRoute;
