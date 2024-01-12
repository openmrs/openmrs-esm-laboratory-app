import React from "react";
import styles from "./result-form.scss";
import { TextInput, Select, SelectItem } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { ConceptReference } from "./result-form.resource";
import { Controller } from "react-hook-form";

interface ResultFormFieldProps {
  concept: ConceptReference;
  control: any;
  register: any;
}
const ResultFormField: React.FC<ResultFormFieldProps> = ({
  concept,
  control,
  register,
}) => {
  const { t } = useTranslation();
  const isTextOrNumeric =
    concept.datatype?.display === "Text" ||
    concept.datatype?.display === "Numeric";
  const isCoded = concept.datatype?.display === "Coded";
  const isPanel = concept.setMembers?.length > 0;

  return (
    <>
      {isTextOrNumeric && (
        <Controller
          control={control}
          name="testResult"
          render={({ field }) => (
            <TextInput
              key={concept.uuid}
              className={styles.textInput}
              {...field}
              type={concept.datatype.display === "Numeric" ? "number" : "text"}
              labelText={concept?.display}
              autoFocus
            />
          )}
        />
      )}
      {isCoded && (
        <Controller
          name="testResult"
          control={control}
          render={({ field }) => (
            <Select
              key={concept.uuid}
              className={styles.textInput}
              {...field}
              type="text"
              labelText={concept?.display}
            >
              <SelectItem text={t("option", "Choose an Option")} value="" />

              {concept?.answers?.map((answer) => (
                <SelectItem
                  key={answer.uuid}
                  text={answer.display}
                  value={answer.uuid}
                >
                  {answer.display}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      )}

      {isPanel &&
        concept.setMembers.map((member) => (
          <TextInput
            key={member.uuid}
            className={styles.textInput}
            {...register(member.uuid as any)}
            type={member.datatype.display === "Numeric" ? "number" : "text"}
            labelText={member.display}
            autoFocus
          />
        ))}
    </>
  );
};

export default ResultFormField;
