import React from "react";
import { useAuthenticationContext } from "./AuthenticationContextProvider";
import DropDownMenu from "../../dropdown-menus/DropDownMenu";
import { ArrowLeftStartOnRectangleIcon, UserCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import Button from "../../butttons/Button";

const AuthenticatedUserActionButton = ({
    uerProfileRoute = "/settings/profile",
}) => {
    const authContext = useAuthenticationContext();
    return (
        <DropDownMenu
            component={
                <Button variant="text" as="div">
                    <UserCircleIcon className="size-6" />
                </Button>
            }
            menuItems={[
                {
                    label: "Profile",
                    icon: UserIcon,
                    url: uerProfileRoute,
                },
                {
                    label: "Logout",
                    icon: ArrowLeftStartOnRectangleIcon,
                    onClick: async () => {
                        authContext?.signOutUser();
                    },
                },
            ]}
        />
    );
};

export default AuthenticatedUserActionButton;
