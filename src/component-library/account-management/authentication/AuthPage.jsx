import React from "react";
import { useNavigation } from "react-router";
import LoadingScreen from "../../utils/LoadingScreen";
import NotificationBar from "../../alerts/NotificationBar";
import Logo from "../../logos/Logo";

const AuthPage = ({ children }) => {
    const navigation = useNavigation();

    return (
        <>
            {Boolean(
                navigation.state == "loading" ||
                    navigation.state == "submitting"
            ) && <LoadingScreen />}

            <NotificationBar />

            <div className="min-h-screen flex flex-col md:grid grid-cols-12">
                <div className="p-6 md:col-span-6 lg:col-span-7 bg-primary-container flex items-center justify-center flex-col space-y-5">
                    <Logo
                        orientation="horizontal"
                        className="h-16 w-full md:hidden"
                    />
                    <Logo
                        orientation="vertical"
                        className="h-40 lg:h-48 w-full hidden md:flex"
                    />
                </div>
                <div className="flex flex-col items-center md:justify-center flex-1 p-10 md:col-span-6 lg:col-span-5">
                    {children}
                </div>
            </div>
        </>
    );
};

export default AuthPage;
