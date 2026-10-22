import { openmrsFetch, restBaseUrl, type Visit } from '@openmrs/esm-framework';

export interface WalkInPatientPayload {
  givenName: string;
  familyName: string;
  gender: 'M' | 'F';
  birthdate: string;
  phoneNumber?: string;
  phoneNumberAttributeTypeUuid?: string;
  locationUuid: string;
  /** The facility identifier (e.g. OpenMRS ID) generated for the walk-in patient. */
  identifier: string;
  identifierTypeUuid: string;
  /** Optional dedicated walk-in identifier type. When set, a walk-in identifier is added and marked preferred. */
  walkInIdentifierTypeUuid?: string;
}

/**
 * Generates a human-readable walk-in identifier such as `WI-20260101-1234`.
 */
export function generateWalkInIdentifier(date = new Date()): string {
  const stamp = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join(
    '',
  );
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `WI-${stamp}-${suffix}`;
}

/**
 * Returns an ISO date (YYYY-MM-DD) for someone who is `ageInYears` old today.
 */
export function birthdateFromAge(ageInYears: number, today = new Date()): string {
  const birthdate = new Date(Date.UTC(today.getFullYear() - ageInYears, today.getMonth(), today.getDate()));
  return birthdate.toISOString().split('T')[0];
}

export async function generateIdentifier(identifierSourceUuid: string, abortController: AbortController) {
  const response = await openmrsFetch<{ identifier: string }>(
    `${restBaseUrl}/idgen/identifiersource/${identifierSourceUuid}/identifier`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: {},
    },
  );
  return response.data.identifier;
}

export function buildWalkInPatientBody(payload: WalkInPatientPayload) {
  const identifiers = [
    {
      identifier: payload.identifier,
      identifierType: payload.identifierTypeUuid,
      location: payload.locationUuid,
      preferred: !payload.walkInIdentifierTypeUuid,
    },
  ];

  if (payload.walkInIdentifierTypeUuid) {
    identifiers.unshift({
      identifier: generateWalkInIdentifier(),
      identifierType: payload.walkInIdentifierTypeUuid,
      location: payload.locationUuid,
      preferred: true,
    });
  }

  const phoneNumber = payload.phoneNumber?.trim();
  const attributes =
    phoneNumber && payload.phoneNumberAttributeTypeUuid
      ? [{ attributeType: payload.phoneNumberAttributeTypeUuid, value: phoneNumber }]
      : [];

  return {
    identifiers,
    person: {
      names: [{ givenName: payload.givenName, familyName: payload.familyName }],
      gender: payload.gender,
      birthdate: payload.birthdate,
      birthdateEstimated: true,
      attributes,
    },
  };
}

export function createWalkInPatient(payload: WalkInPatientPayload, abortController: AbortController) {
  return openmrsFetch<{ uuid: string; display: string }>(`${restBaseUrl}/patient`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal,
    body: buildWalkInPatientBody(payload),
  });
}

export function createWalkInVisit(
  patientUuid: string,
  visitTypeUuid: string,
  locationUuid: string,
  visitAttributeTypeUuid: string | undefined,
  abortController: AbortController,
) {
  return openmrsFetch<Visit>(`${restBaseUrl}/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal,
    body: {
      patient: patientUuid,
      visitType: visitTypeUuid,
      location: locationUuid,
      startDatetime: new Date().toISOString(),
      attributes: visitAttributeTypeUuid ? [{ attributeType: visitAttributeTypeUuid, value: true }] : [],
    },
  });
}
