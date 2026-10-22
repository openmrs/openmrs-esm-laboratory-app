import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonSet,
  Form,
  InlineNotification,
  NumberInput,
  RadioButton,
  RadioButtonGroup,
  Stack,
  TextInput,
} from '@carbon/react';
import {
  fetchCurrentPatient,
  launchWorkspace2,
  showSnackbar,
  useConfig,
  useSession,
  Workspace2,
  type Workspace2DefinitionProps,
} from '@openmrs/esm-framework';
import { type Config } from '../../config-schema';
import { useInvalidateLabOrders } from '../../laboratory.resource';
import { birthdateFromAge, createWalkInPatient, createWalkInVisit, generateIdentifier } from './add-walk-in.resource';
import styles from './add-walk-in-workspace.scss';

interface AddWalkInWorkspaceProps {
  workspaceTitle?: string;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    givenName: parts[0],
    familyName: parts.length > 1 ? parts.slice(1).join(' ') : parts[0],
  };
}

/**
 * Registers a lab-only walk-in patient with a minimal form (name, phone, gender, age),
 * starts a visit for them and opens the order basket so the requested test can be ordered.
 */
export default function AddWalkInWorkspace({
  workspaceProps,
  closeWorkspace,
}: Workspace2DefinitionProps<AddWalkInWorkspaceProps>) {
  const { t } = useTranslation();
  const session = useSession();
  const { walkIn, laboratoryOrderTypeUuid, patientIdIdentifierTypeUuid } = useConfig<Config>();
  const invalidateLabOrders = useInvalidateLabOrders();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const locationUuid = session?.sessionLocation?.uuid;
  const isFormValid = fullName.trim().length > 0 && phoneNumber.trim().length > 0 && gender !== '' && Number(age) > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!locationUuid) {
      setErrorMessage(t('noSessionLocation', 'No session location is set. Select a location before adding a walk-in.'));
      return;
    }

    const abortController = new AbortController();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const identifier = await generateIdentifier(walkIn.identifierSourceUuid, abortController);
      const { data: newPatient } = await createWalkInPatient(
        {
          ...splitName(fullName),
          gender: gender as 'M' | 'F',
          birthdate: birthdateFromAge(Number(age)),
          phoneNumber,
          phoneNumberAttributeTypeUuid: walkIn.phoneNumberAttributeTypeUuid,
          locationUuid,
          identifier,
          identifierTypeUuid: patientIdIdentifierTypeUuid,
          walkInIdentifierTypeUuid: walkIn.walkInIdentifierTypeUuid,
        },
        abortController,
      );
      const { data: newVisit } = await createWalkInVisit(
        newPatient.uuid,
        walkIn.visitTypeUuid,
        locationUuid,
        walkIn.visitAttributeTypeUuid,
        abortController,
      );
      // The order basket expects a FHIR patient (it keys basket items by `patient.id`)
      const patient = await fetchCurrentPatient(newPatient.uuid);

      showSnackbar({
        title: t('walkInAdded', 'Walk-in added'),
        subtitle: t('walkInAddedSubtitle', '{{name}} has been added. Select the test to complete the request.', {
          name: fullName.trim(),
        }),
        kind: 'success',
      });

      await closeWorkspace();

      launchWorkspace2(
        'add-test-order-basket-workspace',
        {},
        {
          patientUuid: newPatient.uuid,
          patient,
          visitContext: newVisit,
          visibleOrderPanels: [laboratoryOrderTypeUuid],
          labOrderWorkspaceName: 'add-test-order-basket-add-lab-order-workspace',
          onOrderBasketSubmitted: () => {
            invalidateLabOrders();
          },
        },
      );
    } catch (error) {
      setErrorMessage(
        error?.responseBody?.error?.message ??
          error?.message ??
          t('walkInCreationFailed', 'Something went wrong while adding this walk-in. Please try again.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Workspace2 title={workspaceProps?.workspaceTitle ?? t('addWalkIn', 'Add walk-in patient')}>
      <Form className={styles.form} onSubmit={handleSubmit}>
        <Stack gap={5}>
          {errorMessage && (
            <InlineNotification
              kind="error"
              lowContrast
              title={t('error', 'Error')}
              subtitle={errorMessage}
              onCloseButtonClick={() => setErrorMessage(null)}
            />
          )}

          <TextInput
            id="walkin-full-name"
            labelText={t('fullName', 'Full name')}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />

          <TextInput
            id="walkin-phone-number"
            type="tel"
            labelText={t('phoneNumber', 'Phone number')}
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />

          <RadioButtonGroup
            legendText={t('gender', 'Gender')}
            name="walkin-gender"
            valueSelected={gender}
            onChange={(value) => setGender(value as 'M' | 'F')}
          >
            <RadioButton labelText={t('male', 'Male')} value="M" id="walkin-gender-male" />
            <RadioButton labelText={t('female', 'Female')} value="F" id="walkin-gender-female" />
          </RadioButtonGroup>

          <NumberInput
            id="walkin-age"
            label={t('ageInYears', 'Age (years)')}
            min={0}
            max={120}
            value={age}
            onChange={(_event, { value }) => setAge(value === '' ? '' : Number(value))}
            allowEmpty
          />

          <ButtonSet className={styles.buttonSet}>
            <Button kind="secondary" onClick={() => closeWorkspace()} disabled={isSubmitting}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button kind="primary" type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? t('saving', 'Saving...') : t('continueToTestSelection', 'Continue to test selection')}
            </Button>
          </ButtonSet>
        </Stack>
      </Form>
    </Workspace2>
  );
}
