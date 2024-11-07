import React from 'react';
import usePatientAge from '../../laboratory-resource';
import { InlineLoading } from '@carbon/react';

export const PatientAge: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { patientAge, isLoading: isPatientAgeLoading } = usePatientAge(patientUuid);
  if (isPatientAgeLoading) {
    return <InlineLoading />;
  }
  return <p>{patientAge ?? '--'}</p>;
};
