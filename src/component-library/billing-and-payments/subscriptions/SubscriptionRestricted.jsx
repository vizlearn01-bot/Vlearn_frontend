import React from "react";
import { useSubscriptionContext } from "./SubscriptionContextProvider";
import { Link } from "react-router";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import Button from "../../butttons/Button";

const SubscriptionRestricted = ({
    allowedSubscriptionPlans,
    fallBackComponent = (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center my-10 flex flex-col items-center">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full">
                    <ShieldExclamationIcon strokeWidth={1} className="text-custom-orange" />
                </div>
                <h3 className="mt-2 text-lg font-bold text-custom-orange">
                    Not Allowed! <br /> You do not have an active subscription for this.
                </h3>
                <p className="my-1 text-lg text-custom-blue">
                     Renew your subscription below to gain access
                </p>
                <Link to={"/billing-and-payments/subscriptions"}>
                    <Button variant="text">Go to Subscriptions</Button>
                </Link>
            </div>
        </div>
    ),
    children,
}) => {
    const subscriptionContext = useSubscriptionContext();
    const [allowed, setAllowed] = React.useState(false);

    React.useEffect(() => {
        if (subscriptionContext?.activeSubscriptions) {
            if (allowedSubscriptionPlans?.length > 0) {
                subscriptionContext.activeSubscriptions.forEach((subscription) => {
                    if (
                        allowedSubscriptionPlans.includes(
                            subscription.plan_id
                        )
                    ) {
                        setAllowed(true);
                        return;
                    }
                });
            } else {
                setAllowed(true);
            }
        }
    }, [subscriptionContext, allowedSubscriptionPlans]);

    return allowed ? children : fallBackComponent;
};

export default SubscriptionRestricted;
