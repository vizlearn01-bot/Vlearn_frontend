import React from "react";
import { useFetcher } from "react-router";
import Alert from "../alerts/Alert";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

// Helper function to check if a string is valid JSON
const isJsonString = (str) => {
    if (typeof str !== "string") return false;
    try {
        const json = JSON.parse(str);
        return typeof json === "object" && json !== null;
    } catch (e) {
        return false;
    }
};

// Try to parse a value as JSON if it's a JSON string, otherwise return the original value
const parseJsonIfPossible = (value) => {
    if (isJsonString(value)) {
        return JSON.parse(value);
    }
    return value;
};

// Ensure value is properly stringified if it's an object
const safeStringify = (value) => {
    if (value instanceof File || value instanceof Blob) {
        return value;
    }
    if (typeof value === "object" && value !== null) {
        return JSON.stringify(value);
    }
    return value;
};

export const createFormDataGroup = ({ name, fields, options = {} }) => {
    const { nestedGroups = [], fileFields = [], fieldMapping = {} } = options;

    if (!Array.isArray(fields)) {
        throw new Error("Fields must be an array of strings.");
    }

    // Validate that fileFields are all included in fields
    for (const fileField of fileFields) {
        if (!fields.includes(fileField)) {
            throw new Error(
                `File field '${fileField}' must be included in the fields array.`
            );
        }
    }

    return {
        name,
        fields,
        nestedGroups,
        fileFields,
        fieldMapping,
    };
};

// Helper function to remove empty objects recursively, but preserve empty arrays
const removeEmptyObjects = (obj) => {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    // Handle arrays - preserve intentionally empty arrays
    if (Array.isArray(obj)) {
        // If it's an empty array to begin with, preserve it
        if (obj.length === 0) {
            return obj;
        }

        const filtered = obj
            .map(removeEmptyObjects)
            .filter((item) => item !== undefined);
        return filtered.length ? filtered : undefined;
    }

    // Handle objects
    const result = {};
    let hasValues = false;

    for (const key in obj) {
        const value = removeEmptyObjects(obj[key]);
        if (value !== undefined) {
            result[key] = value;
            hasValues = true;
        }
    }

    return hasValues ? result : undefined;
};

// Find the complete nesting path for a field
const findFieldNestingPath = (field, groups, currentPath = []) => {
    for (const group of groups) {
        // Check if this field is directly in this group (and not a nested group name)
        if (
            group.fields.includes(field) &&
            !group.nestedGroups.some((ng) => ng.name === field)
        ) {
            return [
                ...currentPath,
                {
                    group: group,
                    isField: true,
                },
            ];
        }

        // Check nested groups
        for (const nestedGroup of group.nestedGroups || []) {
            // Add this group to the path
            const newPath = [
                ...currentPath,
                {
                    group: group,
                    isField: false,
                },
            ];

            // Recursively check in the nested group
            const result = findFieldNestingPath(field, [nestedGroup], newPath);
            if (result) return result;
        }
    }

    return null;
};

// Helper function to get the mapped field name if it exists
const getMappedFieldName = (field, group) => {
    if (!group.fieldMapping) return field;
    return group.fieldMapping[field] || field;
};

const FormWrapper = ({
    formDataGroups,
    children,
    onFormSubmit,
    method,
    action,
    onSuccess = null,
    setErrors = null,
    errors = {},
    readOnly = false,
    className = "",
    ...formProps
}) => {
    const fetcher = useFetcher();

    React.useEffect(() => {
        if (fetcher.data) {
            if (
                fetcher.data.responseCode === 201 ||
                fetcher.data.responseCode === 200
            ) {
                setErrors({});
                if (onSuccess) {
                    onSuccess(fetcher.data);
                }
            } else {
                if (setErrors) {
                    setErrors(fetcher.data.responseData.errors);
                }
            }
        }
    }, [fetcher.data]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const initialFormData = new FormData(event.currentTarget);
        const finalFormData = new FormData();

        // Store all files for easy access
        const fileRegistry = {};

        if (formDataGroups) {
            // Create an object to store all the processed data
            const processedData = {};

            // Track which fields have been processed
            const processedKeys = new Set();

            // First pass: Initialize the top-level groups
            for (const group of formDataGroups) {
                processedData[group.name] = {};
            }

            // Second pass: Process all form fields
            for (const [field, value] of initialFormData.entries()) {
                if (value === null || value === undefined) continue;

                // Find the complete nesting path for this field
                const nestingPath = findFieldNestingPath(field, formDataGroups);

                if (nestingPath) {
                    // Process the field according to its nesting path
                    let currentObj = processedData;
                    let previousObj = null;
                    let lastGroupName = "";

                    // Navigate through the nesting path to find where to place the field
                    for (let i = 0; i < nestingPath.length; i++) {
                        const { group, isField } = nestingPath[i];
                        previousObj = currentObj;

                        if (i === 0) {
                            // Top level group
                            currentObj = currentObj[group.name];
                            lastGroupName = group.name;
                        } else {
                            // Nested group
                            if (!currentObj[group.name]) {
                                currentObj[group.name] = {};
                            }
                            currentObj = currentObj[group.name];
                            lastGroupName = group.name;
                        }
                    }

                    // Now currentObj points to the correct location to add the field

                    // Get the leaf group (the one that directly contains the field)
                    const leafGroup = nestingPath[nestingPath.length - 1].group;

                    // Get the mapped field name if available
                    const mappedFieldName = getMappedFieldName(
                        field,
                        leafGroup
                    );

                    // Check if this is a file field
                    const isFileField =
                        leafGroup.fileFields &&
                        leafGroup.fileFields.includes(field);

                    if (isFileField && value instanceof File && value.name) {
                        // Generate path for the file
                        const filePath = nestingPath
                            .map((item) => item.group.name)
                            .join(".");

                        const fileKey = `${filePath}.${mappedFieldName}`;
                        finalFormData.append(fileKey, value);

                        currentObj[mappedFieldName] = {
                            name: value.name,
                            type: value.type,
                            size: value.size,
                            isFile: true,
                            fileKey: fileKey,
                        };

                        fileRegistry[fileKey] = value;
                    } else {
                        // Regular field - use the mapped field name
                        currentObj[mappedFieldName] =
                            parseJsonIfPossible(value);
                    }

                    processedKeys.add(field);
                }
            }

            // Final pass: Add the processed data to finalFormData
            for (const group of formDataGroups) {
                const cleanedGroupData = removeEmptyObjects(
                    processedData[group.name]
                );

                if (cleanedGroupData !== undefined) {
                    finalFormData.append(
                        group.name,
                        JSON.stringify(cleanedGroupData)
                    );
                }
            }

            // Add any remaining fields that weren't in any group
            for (const [key, value] of initialFormData.entries()) {
                if (!processedKeys.has(key) && value !== null) {
                    const parsedValue = parseJsonIfPossible(value);
                    finalFormData.append(key, safeStringify(parsedValue));
                }
            }

            // Clean the entire processed data object for use in onFormSubmit
            const cleanedProcessedData = removeEmptyObjects(processedData);

            if (onFormSubmit) {
                onFormSubmit(finalFormData, cleanedProcessedData, fileRegistry);
            } else if (fetcher && method && action) {
                fetcher.submit(finalFormData, {
                    method: method,
                    action: action,
                    encType: "multipart/form-data",
                });
            }
        } else {
            // Handle form submission without data groups
            for (const [key, value] of initialFormData.entries()) {
                if (value !== null) {
                    const parsedValue = parseJsonIfPossible(value);
                    finalFormData.append(key, safeStringify(parsedValue));
                }
            }
            if (onFormSubmit) {
                onFormSubmit(finalFormData);
            } else if (fetcher && method && action) {
                fetcher.submit(finalFormData, {
                    method: method,
                    action: action,
                    encType: "multipart/form-data",
                });
            }
        }
    };

    return (
        <form
            {...formProps}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="flex flex-col flex-1"
        >
            {Boolean(errors.detail) && (
                <Alert
                    message={errors.detail}
                    severity="error"
                    onDismiss={() => {
                        let newErrors = { ...errors };
                        delete newErrors["detail"];
                        setErrors(newErrors);
                    }}
                />
            )}
            {Boolean(errors.non_field_errors) && (
                <Alert
                    message={errors.non_field_errors}
                    severity="error"
                    onDismiss={() => {
                        let newErrors = { ...errors };
                        delete newErrors["non_field_errors"];
                        setErrors(newErrors);
                    }}
                />
            )}
            <div className={classNames("flex-1", className)}>{children}</div>
        </form>
    );
};

export default FormWrapper;
