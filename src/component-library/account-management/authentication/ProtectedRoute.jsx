import React from "react";
import { Navigate } from "react-router";
import LoadingScreen from "../../utils/LoadingScreen";
import UserContext from "../../../Context/UserContext";

const ProtectedRoute = ({ children, redirectUrl = "/login" }) => {
    const userContext = React.useContext(UserContext);

    return Boolean(userContext == null) ? (
        <LoadingScreen />
    ) : Boolean(userContext?.token == null) ? (
        <Navigate to={redirectUrl} />
    ) : Boolean(userContext?.user == null) ? (
        <LoadingScreen message="Getting User Details..." />
    ) : (
        children
    );
};

export default ProtectedRoute;
