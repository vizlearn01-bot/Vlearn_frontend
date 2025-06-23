import React from "react";
import { useSubscriptionContext } from "./SubscriptionContextProvider";
import { Link } from "react-router";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import Button from "../../butttons/Button";

const SubscriptionRestricted = ({
    allowedSubscriptionPlans,
    fallBackComponent = (
        <div className="text-center my-10 flex flex-col items-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full ">
                <ShieldExclamationIcon />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Not Allowed!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                You do not have an active subscription for this.
            </p>
            <Link to={"/billing-and-payments/subscriptions"}>
                <Button variant="text">Go to Subscriptions</Button>
            </Link>
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
