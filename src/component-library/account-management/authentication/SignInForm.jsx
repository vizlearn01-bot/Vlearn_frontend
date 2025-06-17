import React from "react";
import { Form, Link, useActionData, useNavigate } from "react-router";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import TextInput from "../../forms/TextInput";
import Alert from "../../alerts/Alert";
import { AuthenticationContext } from "./AuthenticationContextProvider";
import Button from "../../butttons/Button";

const SignInForm = () => {
    const actionData = useActionData();
    const [errors, setErrors] = React.useState({});
    const authContext = React.useContext(AuthenticationContext);
    const navigator = useNavigate();

    React.useEffect(() => {
        if (actionData !== undefined) {
            if (actionData.responseCode === 200) {
                setErrors({});
                authContext.signInUser(actionData.responseData.data);
            } else {
                setErrors(actionData.responseData.errors);
            }
        }
    }, [actionData]);

    React.useEffect(() => {
        if (authContext?.userDetails) {
            navigator("/");
        }
    }, [authContext]);
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-sm lg:max-w-md space-y-5">
            <LockClosedIcon className="h-10 w-10 text-secondary" />

            <h2 className="text-center text-xl font-semi-bold leading-9">
                Sign in to your account.
            </h2>

            <Form
                className="w-full flex flex-col space-y-5"
                method="post"
                action=""
            >
                {Boolean(errors.detail) && (
                    <Alert
                        message={errors.detail}
                        severity="error"
                        onDismiss={() => {
                            setErrors((prevErrors) => {
                                const newErrors = { ...prevErrors };
                                delete newErrors["detail"];
                                return newErrors;
                            });
                        }}
                    />
                )}
                <TextInput
                    name={"username"}
                    label={"Username/Email"}
                    error={Boolean(errors.username)}
                    helpText={Boolean(errors.username) ? errors.username : null}
                />
                <TextInput
                    name={"password"}
                    label={"Password"}
                    type="password"
                    error={Boolean(errors.password)}
                    helpText={Boolean(errors.password) ? errors.password : null}
                />
                <Button type="submit">Sign In</Button>
            </Form>
            <Button variant="text">
                <Link to="/authentication/reset-password">
                    Forgot Password?
                </Link>
            </Button>
            <Button variant="text">
                <Link to="/authentication/signup">
                    Don't have an account? Sign up
                </Link>
            </Button>
        </div>
    );
};

export default SignInForm;
