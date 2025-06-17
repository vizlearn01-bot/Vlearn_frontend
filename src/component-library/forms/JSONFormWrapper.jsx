import React from "react";

const JSONFormWrapper = ({
    onSubmit,
    onChange,
    name,
    className = "",
    children,
    ...props
}) => {
    const parseValue = (value) => {
        // If the value is a string and looks like a valid JSON string
        if (typeof value === "string") {
            try {
                // Attempt to parse the value as JSON
                return JSON.parse(value);
            } catch (error) {
                // If parsing fails, return the original value
                return value;
            }
        }
        // If it's not a string, return the original value
        return value;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formElement = e.target;
        const formData = new FormData(formElement);

        // Convert FormData to an object with parsed values
        const data = Object.fromEntries(
            Array.from(formData.entries()).map(([key, value]) => [
                key,
                parseValue(value),
            ])
        );

        if (onSubmit) {
            onSubmit(data);
        }
    };

    const [values, setValues] = React.useState({});

    React.useEffect(() => {
        if (onChange) {
            onChange(values);
        }
    }, [values]);

    return (
        <form
            action=""
            onSubmit={handleSubmit}
            className={className}
            {...props}
        >
            {typeof children === "function"
                ? children({
                      onChange: (value) => {
                          setValues((prev) => {
                              return { ...prev, ...value };
                          });
                      },
                  })
                : children}
        </form>
    );
};

export default JSONFormWrapper;
