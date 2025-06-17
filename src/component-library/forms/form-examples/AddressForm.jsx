import React from "react";
import TextInput from "../TextInput";

const AddressForm = ({ errors = {}, defaulValues }) => {
    const [address, setAddress] = React.useState({});

    React.useEffect(() => {
        if (defaulValues) {
            setAddress(defaulValues);
        }
    }, [defaulValues]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 w-full">
            <div className="col-span-full sm:col-span-3">
                <TextInput
                    label={"City/Town"}
                    error={Boolean(errors?.city)}
                    helpText={Boolean(errors?.city) && errors?.city}
                    onChange={(value) => {
                        setAddress((prev) => {
                            return { ...prev, ...{ city: value } };
                        });
                    }}
                    defaultValue={address?.city}
                    internalControlledField={false}
                />
            </div>
            <div className="col-span-full sm:col-span-3">
                <TextInput
                    label={"Street Address"}
                    error={Boolean(errors?.street_address)}
                    helpText={
                        Boolean(errors?.street_address) &&
                        errors?.street_address
                    }
                    onChange={(value) => {
                        setAddress((prev) => {
                            return { ...prev, ...{ street_address: value } };
                        });
                    }}
                    defaultValue={address?.street_address}
                    internalControlledField={false}
                />
            </div>
            <div className="col-span-full">
                <TextInput
                    label={"Building/Apartment"}
                    error={Boolean(errors?.building)}
                    helpText={Boolean(errors?.building) && errors?.building}
                    onChange={(value) => {
                        setAddress((prev) => {
                            return { ...prev, ...{ building: value } };
                        });
                    }}
                    defaultValue={address?.building}
                    internalControlledField={false}
                    required={false}
                />
            </div>
            <div className="col-span-full">
                <TextInput
                    label={"Description"}
                    error={Boolean(errors?.description)}
                    helpText={
                        Boolean(errors?.description) && errors?.description
                    }
                    isTextArea
                    required={false}
                    onChange={(value) => {
                        setAddress((prev) => {
                            return { ...prev, ...{ description: value } };
                        });
                    }}
                    defaultValue={address?.description}
                    internalControlledField={false}
                />
            </div>
            <input
                type="hidden"
                name="address"
                value={JSON.stringify(address)}
            />
        </div>
    );
};

export default AddressForm;
