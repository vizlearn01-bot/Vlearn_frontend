import React from "react";
import UseFetcherData from "../../utils/UseFetcherData";
import UserContext from "../../../Context/UserContext";

const SubscriptionContext = React.createContext(null);

export const useSubscriptionContext = () => {
    return React.useContext(SubscriptionContext);
};

const SubscriptionContextProvider = ({ children }) => {
    const [activeSubscriptions, setActiveSubscriptions] = React.useState([]);
    const userContext = React.useContext(UserContext)

    return (
        <>
            {Boolean(userContext?.user) && (
                <UseFetcherData
                    url={`/billing-and-payments/subscriptions/active`}
                    setData={(data) => {
                        setActiveSubscriptions(data.responseData.data);
                    }}
                />
            )}

            <SubscriptionContext.Provider
                value={{
                    activeSubscriptions,
                }}
            >
                {children}
            </SubscriptionContext.Provider>
        </>
    );
};

export default SubscriptionContextProvider;
