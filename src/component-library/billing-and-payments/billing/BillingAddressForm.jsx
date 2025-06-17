import React from "react";
import TextInput from "../../forms/TextInput";

const BillingAddressForm = ({ errors, setErrors, defaultValues, readOnly }) => {
    const [firstName, setFirstName] = React.useState(
        defaultValues?.first_name || ""
    );
    const [lastName, setLastName] = React.useState(
        defaultValues?.last_name || ""
    );

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
                <TextInput
                    label={"First Name"}
                    error={Boolean(errors?.first_name)}
                    helpText={errors?.first_name}
                    readOnly={readOnly}
                    defaultValue={firstName}
                    onChange={setFirstName}
                    internalControlledField={false}
                />
                <TextInput
                    label={"Last Name"}
                    error={Boolean(errors?.last_name)}
                    helpText={errors?.last_name}
                    readOnly={readOnly}
                    defaultValue={lastName}
                    onChange={setLastName}
                    internalControlledField={false}
                />
                <input
                    type="hidden"
                    name="full_name"
                    value={`${firstName} ${lastName}`}
                />
            </div>

            <TextInput
                name={"phone_number"}
                label={"Phone Number"}
                error={Boolean(errors?.phone_number)}
                helpText={errors?.phone_number}
                defaultValue={defaultValues?.phone_number}
                readOnly={readOnly}
            />
            <TextInput
                name={"email"}
                label={"Email"}
                error={Boolean(errors?.email)}
                helpText={errors?.email}
                defaultValue={defaultValues?.email}
                readOnly={readOnly}
                required={false}
            />

            <div className="flex flex-col sm:flex-row gap-3">
                <TextInput
                    name={"city"}
                    label={"City"}
                    error={Boolean(errors?.address?.city)}
                    helpText={errors?.address?.city}
                    defaultValue={defaultValues?.address?.city}
                    readOnly={readOnly}
                />
                <TextInput
                    name={"street_address"}
                    label={"Street Address"}
                    error={Boolean(errors?.address?.street_address)}
                    helpText={errors?.address?.street_address}
                    defaultValue={defaultValues?.address?.street_address}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
};

export default BillingAddressForm;
