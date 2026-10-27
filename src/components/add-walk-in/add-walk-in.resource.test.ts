import { describe, expect, it, vi } from 'vitest';
import { openmrsFetch } from '@openmrs/esm-framework';
import {
  birthdateFromAge,
  buildWalkInPatientBody,
  createWalkInVisit,
  type WalkInPatientPayload,
} from './add-walk-in.resource';

const mockOpenmrsFetch = vi.mocked(openmrsFetch);

const payload: WalkInPatientPayload = {
  givenName: 'Jane',
  familyName: 'Doe',
  gender: 'F',
  birthdate: '1996-10-22',
  phoneNumber: ' 0800000000 ',
  phoneNumberAttributeTypeUuid: 'phone-attribute-type-uuid',
  locationUuid: 'location-uuid',
  identifier: '100008E',
  identifierTypeUuid: 'openmrs-id-type-uuid',
};

describe('add-walk-in resource', () => {
  it('computes an estimated birthdate from an age', () => {
    expect(birthdateFromAge(30, new Date(2026, 9, 22))).toBe('1996-10-22');
  });

  it('computes a birthdate of today for an infant aged zero', () => {
    expect(birthdateFromAge(0, new Date(2026, 9, 22))).toBe('2026-10-22');
  });

  it('builds a patient with the facility identifier as preferred and the phone number as an attribute', () => {
    const body = buildWalkInPatientBody(payload);

    expect(body.identifiers).toEqual([
      {
        identifier: '100008E',
        identifierType: 'openmrs-id-type-uuid',
        location: 'location-uuid',
        preferred: true,
      },
    ]);
    expect(body.person).toEqual({
      names: [{ givenName: 'Jane', familyName: 'Doe' }],
      gender: 'F',
      birthdate: '1996-10-22',
      birthdateEstimated: true,
      attributes: [{ attributeType: 'phone-attribute-type-uuid', value: '0800000000' }],
    });
  });

  it('adds the generated walk-in identifier as the preferred identifier', () => {
    const body = buildWalkInPatientBody({
      ...payload,
      walkInIdentifier: { identifier: 'WI-0001', identifierTypeUuid: 'walk-in-id-type-uuid' },
    });

    expect(body.identifiers).toHaveLength(2);
    expect(body.identifiers[0]).toEqual(
      expect.objectContaining({ identifier: 'WI-0001', identifierType: 'walk-in-id-type-uuid', preferred: true }),
    );
    expect(body.identifiers[1]).toEqual(
      expect.objectContaining({ identifierType: 'openmrs-id-type-uuid', preferred: false }),
    );
  });

  it('flags the visit with the walk-in visit attribute only when one is configured', async () => {
    mockOpenmrsFetch.mockResolvedValue({ data: {} } as Awaited<ReturnType<typeof openmrsFetch>>);

    await createWalkInVisit(
      'patient-uuid',
      'visit-type-uuid',
      'location-uuid',
      'walk-in-attribute-uuid',
      new AbortController(),
    );
    expect(mockOpenmrsFetch.mock.calls[0][1].body).toEqual(
      expect.objectContaining({
        patient: 'patient-uuid',
        visitType: 'visit-type-uuid',
        location: 'location-uuid',
        attributes: [{ attributeType: 'walk-in-attribute-uuid', value: true }],
      }),
    );

    await createWalkInVisit('patient-uuid', 'visit-type-uuid', 'location-uuid', '', new AbortController());
    expect(mockOpenmrsFetch.mock.calls[1][1].body).toEqual(expect.objectContaining({ attributes: [] }));
  });
});
