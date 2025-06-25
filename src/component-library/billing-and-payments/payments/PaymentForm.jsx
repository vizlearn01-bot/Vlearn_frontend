import React from "react";
import SelectField from "../../forms/SelectField";
import FormDialog from "../../forms/FormDialog";
import MpesaPaymentForm from "./MpesaPaymentForm";
import TextInput from "../../forms/TextInput";
import { createFormDataGroup } from "../../forms/FormWrapper";

export const MakePaymentDialog = ({ component, invoiceDetails }) => {
    const [errors, setErrors] = React.useState({});

    const paymentDetailsFormDataGroup = createFormDataGroup({
        name: "payment_details",
        fields: ["mpesa_phone_number"],
    });

    return (
        <FormDialog
            title={"Make Payment"}
            errors={errors}
            setErrors={setErrors}
            component={component}
            actionUrl={`/billing-and-payments/invoices/${invoiceDetails?.invoice_number}/payment-transactions/list`}
            formDataGroups={[paymentDetailsFormDataGroup]}
        >
            <PaymentForm
                amount={invoiceDetails?.total_amount}
                errors={errors}
                setErrors={setErrors}
            />
        </FormDialog>
    );
};

const PaymentForm = ({ amount, errors, setErrors, defaultValues }) => {
    const paymentMethodOptions = [{ value: "MPESA", label: "M-Pesa" }];
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(
        defaultValues?.payment_method || ""
    );
    return (
        <div className="flex flex-col space-y-3">
            <TextInput
                name={"amount"}
                label={"Amount"}
                defaultValue={amount}
                type="number"
                readOnly
                internalControlledField={false}
            />
            <SelectField
                name={"payment_method"}
                label={"Payment Method"}
                options={paymentMethodOptions}
                error={Boolean(errors?.payment_method)}
                helpText={errors?.payment_method}
                defaultValue={selectedPaymentMethod}
                onChange={setSelectedPaymentMethod}
                internalControlledField={false}
            />
            {Boolean(selectedPaymentMethod == "MPESA") && (
                <MpesaPaymentForm errors={errors?.payment_details} />
            )}
        </div>
    );
};

export default PaymentForm;
