import React from "react";
import TextInput from "../../forms/TextInput";

const MpesaPaymentForm = ({ errors, setErrors, defaultValues }) => {
    return (
        <div className="flex flex-col space-y-3">
            <TextInput
                name={"mpesa_phone_number"}
                label={"Phone Number"}
                defaultValue={defaultValues?.mpesa_phone_number}
                error={Boolean(errors?.mpesa_phone_number)}
                helpText={errors?.mpesa_phone_number}
            />
        </div>
    );
};

export default MpesaPaymentForm;
