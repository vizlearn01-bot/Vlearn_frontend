import React from "react";
import { useRouteError } from "react-router";
import Logo from "../logos/Logo";

const ErrorPage = ({ message }) => {
    let error = useRouteError();
    console.error(error);
    let errorMessage = "";
    try {
        errorMessage = `${error.status} ${error.statusText}\n${error.error.message}`;
    } catch (err) {
        try {
            errorMessage = error.message;
            if (errorMessage === "Failed to fetch") {
                errorMessage =
                    "Unable to connect, please confirm your internet connection.";
            } else {
                errorMessage = "An unknown error occurred.";
            }
        } catch (err2) {
            console.error(err2);
            errorMessage = "An unknown error occurred.";
        }
    }
    return (
        <div className="flex flex-col justify-center text-center items-center p-10 min-h-screen">
            <Logo className={"h-20"} orientation="vertical" />
            <h1 className="text-3xl ">Oops!</h1>
            <p>Something went wrong.</p>
            <p className="text-error-main">
                {message ? message : errorMessage}
            </p>
        </div>
    );
};

export default ErrorPage;
