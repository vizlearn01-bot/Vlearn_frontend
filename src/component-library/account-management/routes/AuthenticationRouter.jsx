import React from "react";
import { Navigate, useRoutes } from "react-router";
import AuthPage from "../authentication/AuthPage";
import SignInForm from "../authentication/SignInForm";
import SignUpForm from "../authentication/SignUpForm";
import ResetPasswordForm from "../authentication/ResetPasswordForm";
import { nonGetRequestTemplate } from "../../../util-functions/requestTemplates";
import { apiBaseUrl } from "../../../config/constantVariables";
import { useAuthenticationContext } from "../authentication/AuthenticationContextProvider";

export const AuthenticationRoutes = ({ includeSignUpPage = true }) => {
    const authContext = useAuthenticationContext();
    const baseRoutes = [
        {
            index: true,
            element: Boolean(authContext?.userDetails) ? (
                <Navigate to="/" replace />
            ) : (
                <Navigate to="signin" replace />
            ),
        },
        {
            path: "signin",
            element: (
                <AuthPage>
                    <SignInForm />
                </AuthPage>
            ),
            action: async ({ request }) => {
                return nonGetRequestTemplate(
                    request,
                    `${apiBaseUrl}/api/accounts/auth-tokens/generate/`,
                    false
                );
            },
        },
        {
            path: "reset-password",
            element: (
                <AuthPage>
                    <ResetPasswordForm />
                </AuthPage>
            ),
            action: async ({ request }) => {
                return nonGetRequestTemplate(
                    request,
                    `${apiBaseUrl}/api/accounts/users/reset-password/`,
                    false
                );
            },
        },
    ];
    
    return {
        path: "authentication",
        children: includeSignUpPage
            ? [
                  ...baseRoutes,
                  {
                      path: "signup",
                      element: (
                          <AuthPage>
                              <SignUpForm />
                          </AuthPage>
                      ),
                      action: async ({ request }) => {
                          return nonGetRequestTemplate(
                              request,
                              `${apiBaseUrl}/api/accounts/register/`,
                              false
                          );
                      },
                  },
              ]
            : baseRoutes,
    };
};

const AuthenticationRouter = () => {
    return useRoutes(AuthenticationRoutes());
};

export default AuthenticationRouter;
