import React from "react";
import { Form, Link, useActionData, useNavigate } from "react-router";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import TextInput from "../../forms/TextInput";
import Alert from "../../alerts/Alert";
import Button from "../../butttons/Button";

const ResetPasswordForm = () => {
    const actionData = useActionData();
    const [errors, setErrors] = React.useState({});
    const navigator = useNavigate();

    React.useEffect(() => {
        if (actionData !== undefined) {
            if (actionData.responseCode === 200) {
                setErrors({});
                navigator("/authentication/signin");
            } else {
                setErrors(actionData.responseData.errors);
            }
        }
    }, [actionData]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-sm lg:max-w-md space-y-5">
            <LockClosedIcon className="h-10 w-10 text-secondary" />

            <h2 className="text-center text-xl font-semi-bold leading-9">
                Reset your password.
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
                    name={"email"}
                    label={"Email"}
                    error={Boolean(errors.email)}
                    helpText={
                        Boolean(errors.email)
                            ? errors.email
                            : "If an account associated with this email address is found. We shall sent an email with further instructions"
                    }
                    type="email"
                />
                <Button type="submit">Reset Password</Button>
            </Form>
            <Button variant="text">
                <Link to="/authentication/signin">Back to sign in.</Link>
            </Button>
        </div>
    );
};

export default ResetPasswordForm;
