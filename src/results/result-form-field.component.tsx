import React from 'react';
import { Select, SelectItem, TextInput, NumberInput } from '@carbon/react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ConceptReference } from './result-form.resource';
import styles from './result-form.scss';

interface ResultFormFieldProps {
  concept: ConceptReference;
  control: any;
  register: any;
}

const ResultFormField: React.FC<ResultFormFieldProps> = ({ concept, control }) => {
  const { t } = useTranslation();

  const isText = (concept: ConceptReference) => concept.datatype?.display === 'Text';
  const isNumeric = (concept: ConceptReference) => concept.datatype?.display === 'Numeric';
  const isCoded = (concept: ConceptReference) => concept.datatype?.display === 'Coded';
  const isPanel = (concept: ConceptReference) => concept.setMembers?.length > 0;

  const printValueRange = (concept: ConceptReference) => {
    if (concept?.datatype?.display === 'Numeric') {
      const maxVal = Math.max(concept?.hiAbsolute, concept?.hiCritical, concept?.hiNormal);
      const minVal = Math.min(concept?.lowAbsolute, concept?.lowCritical, concept?.lowNormal);
      return ` (${minVal ?? 0} - ${maxVal > 0 ? maxVal : '--'} ${concept?.units ?? ''})`;
    }
    return '';
  };

  return (
    <>
      {isText(concept) && (
        <Controller
          control={control}
          name={concept.uuid}
          render={({ field }) => (
            <TextInput
              key={concept.uuid}
              className={styles.textInput}
              {...field}
              type="text"
              labelText={concept?.display ?? ''}
              autoFocus
              allowEmpty
            />
          )}
        />
      )}

      {isNumeric(concept) && (
        <Controller
          control={control}
          name={concept.uuid}
          render={({ field }) => (
            <NumberInput
              key={concept.uuid}
              className={styles.numberInput}
              value={field.value || ''}
              onChange={(event) => field.onChange(event.target.value)}
              label={concept?.display + printValueRange(concept)}
              id={concept.uuid}
              step={1}
              autoFocus
              hideSteppers
              disableWheel
              allowEmpty
            />
          )}
        />
      )}

      {isCoded(concept) && (
        <Controller
          name={concept.uuid}
          control={control}
          render={({ field }) => (
            <Select
              key={concept.uuid}
              className={styles.textInput}
              {...field}
              labelText={concept?.display ?? ''}
              allowEmpty
            >
              <SelectItem text={t('chooseOption', 'Choose an option')} value="" />
              {concept?.answers?.map((answer) => (
                <SelectItem key={answer.uuid} text={answer.display} value={answer.uuid}>
                  {answer.display}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      )}

      {isPanel(concept) &&
        concept.setMembers?.map((member, index) => (
          <React.Fragment key={member.uuid}>
            {isText(member) && (
              <Controller
                control={control}
                name={member.uuid}
                render={({ field }) => (
                  <TextInput
                    key={member.uuid}
                    className={styles.textInput}
                    {...field}
                    type="text"
                    labelText={member?.display ?? ''}
                    autoFocus={index === 0}
                    allowEmpty
                  />
                )}
              />
            )}

            {isNumeric(member) && (
              <Controller
                control={control}
                name={member.uuid}
                render={({ field }) => (
                  <NumberInput
                    key={member.uuid}
                    className={styles.numberInput}
                    value={field.value || ''}
                    onChange={(event) => field.onChange(event.target.value)}
                    label={member?.display + printValueRange(member)}
                    id={member.uuid}
                    step={1}
                    autoFocus={index === 0}
                    hideSteppers
                    disableWheel
                    allowEmpty
                  />
                )}
              />
            )}

            {isCoded(member) && (
              <Controller
                name={member.uuid}
                control={control}
                render={({ field }) => (
                  <Select
                    key={member.uuid}
                    className={styles.textInput}
                    {...field}
                    labelText={member?.display ?? ''}
                    autoFocus={index === 0}
                    allowEmpty
                  >
                    <SelectItem text={t('chooseOption', 'Choose an option')} value="" />
                    {member?.answers?.map((answer) => (
                      <SelectItem key={answer.uuid} text={answer.display} value={answer.uuid}>
                        {answer.display}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            )}
          </React.Fragment>
        ))}
    </>
  );
};

export default ResultFormField;
