import React from "react";
import { useSearchParams } from "react-router";
import TextInput from "../forms/TextInput";

const StartEndDateFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    React.useEffect(() => {
        const startDateParam = searchParams.get("start_date");
        const endDateParam = searchParams.get("end_date");
        if (startDateParam && startDateParam !== startDate) {
            setStartDate(startDateParam);
        }
        if (endDateParam && endDateParam !== endDate) {
            setEndDate(endDateParam);
        }
    }, [searchParams]);

    React.useEffect(() => {
        if (startDate) {
            searchParams.set("start_date", startDate);
        } else {
            searchParams.delete("start_date");
        }
        if (endDate) {
            searchParams.set("end_date", endDate);
        } else {
            searchParams.delete("end_date");
        }
        setSearchParams(searchParams);
    }, [startDate, endDate]);

    return (
        <div className="flex flex-col sm:flex-row items-end gap-2">
            <div className="flex items-center text-sm font-medium">
                From:
                <TextInput
                    type="date"
                    className="ml-1.5 rounded-sm"
                    onChange={setStartDate}
                    internalControlledField={false}
                    defaultValue={startDate}
                />
            </div>
            <div className="flex items-center text-sm font-medium">
                To:
                <TextInput
                    type="date"
                    className="ml-1.5 rounded-sm"
                    onChange={setEndDate}
                    internalControlledField={false}
                    defaultValue={endDate}
                />
            </div>
        </div>
    );
};

export default StartEndDateFilter;
