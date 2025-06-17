import React from "react";
import TextInput from "./TextInput";
import Button, { IconButton } from "../butttons/Button";
import { EyeIcon, VariableIcon } from "@heroicons/react/24/outline";
import CenteredDialog from "../dialogs/CenteredDialog";
import SelectField from "./SelectField";
import ListInputField from "./ListInputField";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getVariables = (
    templateString,
    startDelimiter = "{{",
    endDelimiter = "}}"
) => {
    const variables = [];
    const regex = new RegExp(
        `${escapeRegExp(startDelimiter)}(.*?)${escapeRegExp(endDelimiter)}`,
        "g"
    );
    let match;

    while ((match = regex.exec(templateString)) !== null) {
        variables.push(match[1]);
    }

    return variables;
};

const getString = ({
    templateString,
    exampleValues,
    startDelimiter = "{{",
    endDelimiter = "}}",
}) => {
    let output = templateString;

    for (const exampleValue of exampleValues) {
        const regex = new RegExp(
            `${escapeRegExp(startDelimiter)}${
                exampleValue.variable.path
            }${escapeRegExp(endDelimiter)}`,
            "g"
        );
        if (exampleValue.variable.field_type === "list") {
            let replacement = "";
            if (Array.isArray(exampleValue.example_value)) {
                // Check if it's an array
                for (let i = 0; i < exampleValue.example_value.length; i++) {
                    replacement += exampleValue.example_value[i];
                    if (i < exampleValue.example_value.length - 1) {
                        // Add a separator if needed
                        replacement += ", ";
                    }
                }
            } else {
                replacement = exampleValue.example_value;
            }
            output = output.replace(regex, replacement);
        } else {
            output = output.replace(regex, exampleValue.example_value);
        }
    }

    return output;
};

const SelectVariableDialog = ({
    variables,
    onSubmit,
    includeVariableExamples = true,
}) => {
    const [variableOptions, setVariableOptions] = React.useState([]);
    React.useEffect(() => {
        if (variables) {
            const options = variables.map((variable) => ({
                label: ` ${variable.path} (${variable.field_type})`,
                value: variable.path,
            }));
            setVariableOptions(options);
        }
    }, [variables]);

    const [addVariableDialogOpen, setAddVariableDialogOpen] =
        React.useState(false);
    const [currentVariable, setcurrentVariable] = React.useState(null);

    const [valueType, setValueType] = React.useState("text");
    React.useEffect(() => {
        if (currentVariable) {
            if (currentVariable.field_type == "select") {
                setValueType("text");
            } else if (currentVariable.field_type == "list") {
                setValueType(currentVariable.child.field_type);
            } else {
                setValueType(currentVariable.field_type);
            }
        }
    }, [currentVariable]);

    const [example_value, setExampleValue] = React.useState("");

    const [errors, setErrors] = React.useState({});
    const validate = (data) => {
        let requiredFields = ["variable"];
        if (includeVariableExamples) {
            requiredFields.push("example_value");
        }

        let newErrors = {};
        requiredFields.forEach((field) => {
            if (!data[field]) {
                newErrors[field] = `This field is required`;
            }
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return false;
        }
        return true;
    };

    return (
        <>
            <IconButton
                onClick={() => {
                    setAddVariableDialogOpen(true);
                }}
                variant="outlined"
                className="size-6 flex items-center justify-center rounded-full"
            >
                <VariableIcon className="size-4" />
            </IconButton>
            <CenteredDialog
                title={"Add Variable"}
                defaultOpen={addVariableDialogOpen}
                onClose={() => {
                    setAddVariableDialogOpen(false);
                }}
                className="flex flex-col "
            >
                <div className="flex flex-col space-y-3">
                    <SelectField
                        label={"Variable"}
                        name={"variable"}
                        options={variableOptions}
                        defaultValue={currentVariable?.path || ""}
                        onChange={(value) => {
                            if (value === "") {
                                setcurrentVariable(null);
                                return;
                            }
                            let variable = variables.find(
                                (variable) => variable.path === value
                            );
                            setcurrentVariable(variable);
                            setExampleValue("");
                        }}
                        internalControlledField={false}
                        error={errors?.variable}
                        helpText={errors?.variable}
                    />
                    {includeVariableExamples && (
                        <>
                            {Boolean(currentVariable?.field_type === "list") ? (
                                <ListInputField
                                    label={"Example Values"}
                                    type={valueType}
                                    defaultValue={example_value}
                                    onChange={(value) => {
                                        setExampleValue(value);
                                    }}
                                    internalControlledField={false}
                                    error={errors?.example}
                                    helpText={errors?.example}
                                    required={includeVariableExamples}
                                />
                            ) : (
                                <TextInput
                                    label={"Example Value"}
                                    type={valueType}
                                    defaultValue={example_value}
                                    onChange={(value) => {
                                        setExampleValue(value);
                                    }}
                                    internalControlledField={false}
                                    error={errors?.example}
                                    helpText={errors?.example}
                                    required={includeVariableExamples}
                                />
                            )}
                        </>
                    )}

                    <Button
                        onClick={() => {
                            let data = {
                                variable: currentVariable,
                            };
                            if (includeVariableExamples) {
                                data.example_value = example_value;
                            }
                            if (validate(data)) {
                                onSubmit(data);
                                setAddVariableDialogOpen(false);
                            }
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </CenteredDialog>
        </>
    );
};

const TemplateTextField = ({
    variableList,
    label = null,
    name,
    required = true,
    error = false,
    setErrors,
    helpText = null,
    defaultValue = null,
    isTextArea = false,
    placeholder = "",
    readOnly = false,
    disabled = false,
    onChange = null,
    includeVariableExamples = true,
    internalControlledField = true,
    trailingIcon,
    allowedVariableTypes = [
        "text",
        "number",
        "list",
        "date",
        "time",
        "datetime",
    ],
    type = "text",
    ...props
}) => {
    const [variableOptions, setVariableOptions] = React.useState([]);
    React.useEffect(() => {
        if (variableList) {
            let variables = [];
            variableList.map((variable) => {
                if (allowedVariableTypes.includes(variable.field_type)) {
                    variables.push(variable);
                }
            });
            setVariableOptions(variables);
        }
    }, [variableList]);

    const [template, setTemplate] = React.useState("");
    const [exampleValues, setExampleValues] = React.useState([]);
    React.useEffect(() => {
        if (defaultValue && internalControlledField) {
            if (typeof defaultValue === "string") {
                setTemplate(defaultValue);
            } else {
                if (defaultValue?.template) {
                    setTemplate(defaultValue?.template);
                }
                if (defaultValue?.example_values) {
                    setExampleValues(defaultValue?.example_values);
                }
            }
        }
    }, [defaultValue, internalControlledField]);

    const [validationErrors, setvalidationErrors] = React.useState({});
    const validatetemplateVariables = ({ template, examples, setExamples }) => {
        let templateVariables = getVariables(template);
        let newExampleValues = [];
        let newValidationErrors = {};

        templateVariables.map((templateVariable) => {
            let variable = variableOptions?.find(
                (variableOption) => variableOption.path == templateVariable
            );
            if (variable) {
                let exampleValue = examples?.find(
                    (example) => example.variable.path == variable.path
                );
                if (exampleValue) {
                    newExampleValues.push(exampleValue);
                }
            } else {
                if (templateVariable == "") {
                    newValidationErrors["empty_variable"] =
                        "Variable name cannot be empty";
                    return;
                }
                newValidationErrors[
                    templateVariable
                ] = `Variable ${templateVariable} not found`;
            }
        });
        setvalidationErrors(newValidationErrors);
        if (setExamples) {
            setExamples(newExampleValues);
        }
        if (Object.keys(newValidationErrors).length > 0) {
            return false;
        }
        return true;
    };

    React.useEffect(() => {
        if (internalControlledField) {
            if (template) {
                validatetemplateVariables({
                    template,
                    setExamples: setExampleValues,
                    examples: exampleValues,
                });
            }
        } else {
            if (defaultValue) {
                if (typeof defaultValue === "string") {
                    validatetemplateVariables({
                        template: defaultValue,
                    });
                } else {
                    if (defaultValue?.template) {
                        validatetemplateVariables({
                            template: defaultValue?.template,
                            examples: defaultValue?.example_values,
                            setExamples: includeVariableExamples
                                ? (data) => {
                                      onChange({
                                          example_values: data,
                                      });
                                  }
                                : null,
                        });
                    }
                }
            }
        }
    }, [template, defaultValue, variableOptions]);

    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => {
        if (validationErrors) {
            if (typeof validationErrors === "object") {
                let errorList = Object.values(validationErrors).join(", ");
                setErrorMessage(errorList);
            } else {
                setErrorMessage(validationErrors);
            }
        } else {
            setErrorMessage("");
        }
    }, [validationErrors]);

    return (
        <>
            <TextInput
                label={label}
                type={Boolean(type == "number") ? "text" : type}
                required={required}
                error={error || Boolean(errorMessage)}
                helpText={helpText || errorMessage}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                isTextArea={isTextArea}
                defaultValue={
                    internalControlledField
                        ? template
                        : Boolean(typeof defaultValue === "string")
                        ? defaultValue
                        : defaultValue?.template || ""
                }
                internalControlledField={false}
                onChange={(value) => {
                    if (internalControlledField) {
                        setTemplate(value);
                    } else {
                        if (includeVariableExamples) {
                            onChange({ template: value });
                        } else {
                            onChange(value);
                        }
                    }
                }}
                trailingIcon={
                    <div
                        className={classNames(
                            isTextArea
                                ? "flex flex-col space-y-2"
                                : "flex space-x-2 items-center",
                            "h-full"
                        )}
                    >
                        {Boolean(trailingIcon) && trailingIcon}
                        {!readOnly && (
                            <SelectVariableDialog
                                variables={variableOptions}
                                onSubmit={(data) => {
                                    if (internalControlledField) {
                                        setTemplate((prev) => {
                                            return `${prev}{{${data.variable.path}}}`;
                                        });
                                    } else {
                                        if (typeof defaultValue === "string") {
                                            let newTemplate = `${defaultValue}{{${data.variable.path}}}`;
                                            onChange(newTemplate);
                                        } else {
                                            let newTemplate = `${
                                                defaultValue?.template || ""
                                            }{{${data.variable.path}}}`;
                                            onChange({
                                                template: newTemplate,
                                            });
                                        }
                                    }

                                    if (includeVariableExamples) {
                                        if (internalControlledField) {
                                            setExampleValues((prev) => {
                                                return [
                                                    ...prev,
                                                    {
                                                        variable: data.variable,
                                                        example_value:
                                                            data.example_value,
                                                    },
                                                ];
                                            });
                                        } else {
                                            let newExampleValues = [
                                                ...(defaultValue?.example_values ||
                                                    []),
                                                {
                                                    variable: data.variable,
                                                    example_value:
                                                        data.example_value,
                                                },
                                            ];
                                            onChange({
                                                example_values:
                                                    newExampleValues,
                                            });
                                        }
                                    }
                                }}
                                includeVariableExamples={
                                    includeVariableExamples
                                }
                            />
                        )}
                        {includeVariableExamples && (
                            <CenteredDialog
                                component={
                                    <IconButton
                                        variant="outlined"
                                        className="size-6 flex items-center justify-center rounded-full"
                                    >
                                        <EyeIcon className="size-4" />
                                    </IconButton>
                                }
                                title={"Preview"}
                            >
                                <TextInput
                                    isTextArea={isTextArea}
                                    readOnly
                                    defaultValue={getString({
                                        templateString: internalControlledField
                                            ? template
                                            : Boolean(
                                                  typeof defaultValue ===
                                                      "string"
                                              )
                                            ? defaultValue
                                            : defaultValue?.template || "",
                                        exampleValues: internalControlledField
                                            ? exampleValues || []
                                            : defaultValue?.example_values ||
                                              [],
                                    })}
                                />
                            </CenteredDialog>
                        )}
                    </div>
                }
                {...props}
            />
            <input
                type="hidden"
                name={name}
                value={
                    internalControlledField
                        ? includeVariableExamples
                            ? JSON.stringify({
                                  template: template,
                                  example_values: exampleValues,
                              })
                            : template
                        : defaultValue
                }
            />
        </>
    );
};

export default TemplateTextField;
