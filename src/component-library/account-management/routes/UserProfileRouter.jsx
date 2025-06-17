import React from "react";
import ProtectedRoute from "../authentication/ProtectedRoute";
import { Outlet, useRoutes } from "react-router";
import { apiBaseUrl } from "../../../config/constantVariables";
import {
    getRequestTemplate,
    nonGetRequestTemplate,
} from "../../../util-functions/requestTemplates";
import AppSideBar from "../../layout/sidebars/AppSideBar";
import ScaffoldWithSideBar from "../../layout/scaffold/ScaffoldWithSideBar";
import UserProfile from "../users/user-profiles/UserProfile";
import { useAuthenticationContext } from "../authentication/AuthenticationContextProvider";

export const UserProfileRoutes = () => {
    const authContext = useAuthenticationContext();
    return {
        path: "profile",
        element: (
            <ProtectedRoute>
                <Outlet />
            </ProtectedRoute>
        ),
        action: async ({ request }) => {
            return nonGetRequestTemplate(
                request,
                `${apiBaseUrl}/api/accounts/users/${authContext?.userDetails?.uid}/`
            );
        },
        children: [
            {
                index: true,
                element: (
                    <UserProfile />
                ),
                loader: async ({ request }) => {
                    return getRequestTemplate(
                        request,
                        `${apiBaseUrl}/api/accounts/users/${authContext?.userDetails?.uid}/`,
                        true
                    );
                },
            },
            {
                path: "change-password",
                action: async ({ request }) => {
                    return nonGetRequestTemplate(
                        request,
                        `${apiBaseUrl}/api/accounts/users/${authContext?.userDetails?.uid}/change-password/`
                    );
                },
            },
        ],
    };
};

const UserProfileRouter = () => {
    return useRoutes(UserProfileRoutes());
};

export default UserProfileRouter;
