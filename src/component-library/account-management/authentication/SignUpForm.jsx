import React from "react";
import { Form, Link, useActionData, useNavigate } from "react-router";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import TextInput from "../../forms/TextInput";
import Alert from "../../alerts/Alert";
import Button from "../../butttons/Button";

const SignUpForm = () => {
    const actionData = useActionData();
    const [errors, setErrors] = React.useState({});
    const navigator = useNavigate();

    React.useEffect(() => {
        if (actionData !== undefined) {
            if (
                actionData.responseCode === 200 ||
                actionData.responseCode === 201
            ) {
                setErrors({});
                navigator("/authentication/signin");
            } else {
                setErrors(actionData.responseData.errors);
            }
        }
    }, [actionData]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-sm lg:max-w-md space-y-5 ">
            <LockClosedIcon className="h-10 w-10 text-secondary" />

            <h2 className="text-center text-xl font-semi-bold leading-9">
                Create an account.
            </h2>

            <Form
                className="flex w-full flex-col space-y-5"
                method="post"
                action="/authentication/signup"
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
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-full sm:col-span-1">
                        <TextInput
                            name={"first_name"}
                            label={"First Name"}
                            error={Boolean(errors.first_name)}
                            helpText={
                                Boolean(errors.first_name)
                                    ? errors.first_name
                                    : null
                            }
                        />
                    </div>
                    <div className="col-span-full sm:col-span-1">
                        <TextInput
                            name={"last_name"}
                            label={"Last Name"}
                            error={Boolean(errors.last_name)}
                            helpText={
                                Boolean(errors.last_name)
                                    ? errors.last_name
                                    : null
                            }
                        />
                    </div>
                </div>
                <TextInput
                    name={"email"}
                    label={"Email"}
                    error={Boolean(errors.email)}
                    helpText={Boolean(errors.email) ? errors.email : null}
                    type="email"
                />
                <TextInput
                    name={"account_name"}
                    label={"Business Name"}
                    error={Boolean(errors.account_name)}
                    helpText={
                        Boolean(errors.account_name)
                            ? errors.account_name
                            : null
                    }
                />
                <TextInput
                    name={"username"}
                    label={"Username"}
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
                <TextInput
                    name={"password2"}
                    label={"Confirm Password"}
                    type="password"
                    error={Boolean(errors.password2)}
                    helpText={
                        Boolean(errors.password2) ? errors.password2 : null
                    }
                />
                <Button type="submit">Sign Up</Button>
            </Form>
            <Button variant="text">
                <Link to="/authentication/signin">
                    Already have an account? Sign in.
                </Link>
            </Button>
        </div>
    );
};

export default SignUpForm;
