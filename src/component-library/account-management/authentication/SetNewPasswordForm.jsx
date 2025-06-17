import React from "react";
import { Form } from "react-router";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import TextInput from "../../forms/TextInput";
import Alert from "../../alerts/Alert";
import Button from "../../butttons/Button";

const SetNewPasswordForm = () => {
    const [errors, setErrors] = React.useState({});
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-sm lg:max-w-md space-y-5">
            <LockClosedIcon className="h-10 w-10 text-secondary" />

            <h2 className="text-center text-xl font-semi-bold leading-9">
                Set new password.
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
                    name={"password1"}
                    label={"Password"}
                    type="password"
                    error={Boolean(errors.password)}
                    helpText={Boolean(errors.password) ? errors.password : null}
                />
                <TextInput
                    name={"password2"}
                    label={"Confirm Password"}
                    type="password2"
                    error={Boolean(errors.password2)}
                    helpText={
                        Boolean(errors.password2) ? errors.password2 : null
                    }
                />
                <div>
                    <Button type="submit">Set New Password</Button>
                </div>
            </Form>
        </div>
    );
};

export default SetNewPasswordForm;
