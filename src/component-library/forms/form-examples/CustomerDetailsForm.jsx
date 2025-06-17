import React from "react";
import TextInput from "../TextInput";

const CustomerDetailsForm = ({
    initial = {},
    errors = {},
    includeName = true,
    readOnly = false,
    hiddenInputName = null,
    onChange = null,
}) => {
    const [customerDetails, setCustomerDetails] = React.useState({});

    React.useEffect(() => {
        if (onChange) {
            onChange(customerDetails);
        }
    }, [customerDetails]);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2">
                <TextInput
                    label="First Name"
                    error={Boolean(errors.first_name)}
                    helpText={
                        Boolean(errors.first_name) ? errors.first_name : null
                    }
                    onChange={(value) => {
                        setCustomerDetails((prev) => {
                            return { ...prev, ...{ first_name: value } };
                        });
                    }}
                    defaultValue={initial.first_name}
                    readOnly={readOnly}
                    {...(includeName && { name: "first_name" })}
                />
                <TextInput
                    label="Last Name"
                    error={Boolean(errors.last_name)}
                    helpText={
                        Boolean(errors.last_name) ? errors.last_name : null
                    }
                    onChange={(value) => {
                        setCustomerDetails((prev) => {
                            return { ...prev, ...{ last_name: value } };
                        });
                    }}
                    defaultValue={initial.last_name}
                    readOnly={readOnly}
                    {...(includeName && { name: "last_name" })}
                />
            </div>
            <TextInput
                label="Phone Number"
                error={Boolean(errors.phone_number)}
                helpText={
                    Boolean(errors.phone_number) ? errors.phone_number : null
                }
                placeholder="254"
                onChange={(value) => {
                    setCustomerDetails((prev) => {
                        return { ...prev, ...{ phone_number: value } };
                    });
                }}
                defaultValue={initial.phone_number}
                readOnly={readOnly}
                {...(includeName && { name: "phone_number" })}
            />
            {/* <TextInput
                label="Email"
                error={Boolean(errors.email)}
                helpText={Boolean(errors.email) ? errors.email : null}
                required={false}
                onChange={(value) => {
                    setCustomerDetails((prev) => {
                        return { ...prev, ...{ email: value } };
                    });
                }}
                defaultValue={initial.email}
                readOnly={readOnly}
                {...(includeName && { name: "email" })}
            /> */}
            {Boolean(hiddenInputName) && (
                <input
                    type="hidden"
                    name={hiddenInputName}
                    value={JSON.stringify(customerDetails)}
                />
            )}
        </div>
    );
};

export default CustomerDetailsForm;
