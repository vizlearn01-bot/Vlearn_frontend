import { apiBaseUrl } from "../../../config/constantVariables";
import {
    getRequestTemplate,
    nonGetRequestTemplate,
} from "../../../util-functions/requestTemplates";
import SubscriptionList from "../../billing-and-payments/subscriptions/SubscriptionList";
import { Navigate, Outlet, useRoutes } from "react-router";
import ProtectedRoute from "../authentication/ProtectedRoute";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../Context/UserContext";
import DashboardOutlet from "../../../Pages/User/DashboardOutlet";

export const BillingAndPaymentsRoutes = () => {

    const userContext = useContext(UserContext)


    return {
        path: "billing-and-payments",
        element: (
            <ProtectedRoute>
                <DashboardOutlet />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="subscriptions" replace />,
            },
            {
                path: "subscriptions",
                children: [
                    {
                        index: true,
                        element: <SubscriptionList />,
                        loader: async ({ request }) => {
                            return getRequestTemplate(
                                request,
                                `${apiBaseUrl}/api/subscriptions/users/${userContext?.user?.id}/subscriptions/`,
                                true
                            );
                        },
                    },
                    {
                        path: "list",
                        loader: async ({ request }) => {
                            return getRequestTemplate(
                                request,
                                `${apiBaseUrl}/api/subscriptions/users/${userContext?.user?.id}/subscriptions/`,
                                true
                            );
                        },
                        action: async ({ request }) => {
                            return nonGetRequestTemplate(
                                request,
                                `${apiBaseUrl}/api/subscriptions/users/${userContext?.user?.id}/subscriptions/`,
                                true
                            );
                        },
                    },

                    {
                        path: "active",
                        loader: async ({ request }) => {
                            return getRequestTemplate(
                                request,
                                `${apiBaseUrl}/api/subscriptions/users/${userContext?.user?.id}/subscriptions/active/`,
                                true
                            );
                        },
                    },
                    {
                        path: "plans",
                        children: [
                            {
                                path: "list",
                                loader: async ({ request }) => {
                                    return getRequestTemplate(
                                        request,
                                        `${apiBaseUrl}/api/subscriptions/plans/`
                                    );
                                },
                            },
                        ],
                    },
                ],
            },
            {
                path: "invoices",
                children: [
                    {
                        path: "list",
                        loader: async ({ request }) => {
                            return getRequestTemplate(
                                request,
                                `${apiBaseUrl}/api/billing-and-payments/users/${userContext?.user?.id}/invoices/`
                            );
                        },
                        action: async ({ request }) => {
                            return nonGetRequestTemplate(
                                request,
                                `${apiBaseUrl}/api/billing-and-payments/users/${userContext?.user?.id}/invoices/`
                            );
                        },
                    },
                    {
                        path: ":invoiceNumber",
                        children: [
                            {
                                path: "details",
                                loader: async ({ request, params }) => {
                                    return getRequestTemplate(
                                        request,
                                        `${apiBaseUrl}/api/billing-and-payments/users/${userContext?.user?.id}/invoices/${params.invoiceNumber}/`
                                    );
                                },
                                action: async ({ request, params }) => {
                                    return nonGetRequestTemplate(
                                        request,
                                        `${apiBaseUrl}/api/billing-and-payments/users/${userContext?.user?.id}/invoices/${params.invoiceNumber}/`
                                    );
                                },
                            },
                            {
                                path: "invoice-items",
                                children: [
                                    {
                                        path: "list",
                                        loader: async ({ request, params }) => {
                                            return getRequestTemplate(
                                                request,
                                                `${apiBaseUrl}/api/billing-and-payments/invoices/${params.invoiceNumber}/invoice-items/`
                                            );
                                        },
                                        action: async ({ request, params }) => {
                                            return nonGetRequestTemplate(
                                                request,
                                                `${apiBaseUrl}/api/billing-and-payments/invoices/${params.invoiceNumber}/invoice-items/`
                                            );
                                        },
                                    },
                                    {
                                        path: ":invoiceItemId",
                                        loader: async ({ request, params }) => {
                                            return getRequestTemplate(
                                                request,
                                                `${apiBaseUrl}/api/billing-and-payments/invoices/${params.invoiceNumber}/invoice-items/${params.invoiceItemId}/`
                                            );
                                        },
                                        action: async ({ request, params }) => {
                                            return nonGetRequestTemplate(
                                                request,
                                                `${apiBaseUrl}/api/billing-and-payments/invoices/${params.invoiceNumber}/invoice-items/${params.invoiceItemId}/`
                                            );
                                        },
                                    },
                                ],
                            },
                            {
                                path: "payment-transactions",
                                children: [
                                    {
                                        path: "list",
                                        loader: async ({ request, params }) => {
                                            return getRequestTemplate(
                                                request,
                                                `${apiBaseUrl}/api/billing-and-payments/invoices/${params.invoiceNumber}/payment-transactions/`
                                            );
                                        },
                                        action: async ({ request, params }) => {
                                            return nonGetRequestTemplate(
                                                request,
                                                `${apiBaseUrl}/api/billing-and-payments/invoices/${params.invoiceNumber}/payment-transactions/`
                                            );
                                        },
                                    },
                                    {
                                        path: ":paymentTransactionId",
                                        loader: async ({ request, params }) => {
                                            return getRequestTemplate(
                                                request,
                                                `${apiBaseUrl}/api/billing-and-payments/invoices/${params.invoiceNumber}/payment-transactions/${params.paymentTransactionId}/`
                                            );
                                        },
                                        action: async ({ request, params }) => {
                                            return nonGetRequestTemplate(
                                                request,
                                                `${apiBaseUrl}/api/billing-and-payments/invoices/${params.invoiceNumber}/payment-transactions/${params.paymentTransactionId}/`
                                            );
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };
};

const BillingAndPaymentsRouter = () => {
    return useRoutes(BillingAndPaymentsRoutes());
};

export default BillingAndPaymentsRouter;
