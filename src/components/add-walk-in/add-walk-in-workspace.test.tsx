import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  fetchCurrentPatient,
  getDefaultsFromConfigSchema,
  launchWorkspace2,
  useConfig,
  useSession,
  type Session,
  type Visit,
} from '@openmrs/esm-framework';
import { configSchema, type Config } from '../../config-schema';
import { useInvalidateLabOrders } from '../../laboratory.resource';
import { createWalkInPatient, createWalkInVisit, generateIdentifier } from './add-walk-in.resource';
import AddWalkInWorkspace from './add-walk-in-workspace.component';

vi.mock('@openmrs/esm-framework', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  fetchCurrentPatient: vi.fn(),
}));

vi.mock('../../laboratory.resource', () => ({
  useInvalidateLabOrders: vi.fn(),
}));

vi.mock('./add-walk-in.resource', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  generateIdentifier: vi.fn(),
  createWalkInPatient: vi.fn(),
  createWalkInVisit: vi.fn(),
}));

const mockUseConfig = vi.mocked(useConfig<Config>);
const mockUseSession = vi.mocked(useSession);
const mockUseInvalidateLabOrders = vi.mocked(useInvalidateLabOrders);
const mockLaunchWorkspace2 = vi.mocked(launchWorkspace2);
const mockFetchCurrentPatient = vi.mocked(fetchCurrentPatient);
const mockGenerateIdentifier = vi.mocked(generateIdentifier);
const mockCreateWalkInPatient = vi.mocked(createWalkInPatient);
const mockCreateWalkInVisit = vi.mocked(createWalkInVisit);

const fhirPatient = { resourceType: 'Patient', id: 'patient-uuid' } as fhir.Patient;
const visit = { uuid: 'visit-uuid' } as Visit;

function renderWorkspace() {
  const props = { workspaceProps: {}, closeWorkspace: vi.fn().mockResolvedValue(true) };
  render(<AddWalkInWorkspace {...(props as unknown as React.ComponentProps<typeof AddWalkInWorkspace>)} />);
}

async function fillInForm(age: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/full name/i), 'Baby Doe');
  await user.type(screen.getByLabelText(/phone number/i), '0800000000');
  await user.click(screen.getByLabelText(/female/i));
  await user.type(screen.getByLabelText(/age \(years\)/i), age);
  return user;
}

const submitButton = () => screen.getByRole('button', { name: /continue to test selection/i });

describe('AddWalkInWorkspace', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue(getDefaultsFromConfigSchema(configSchema) as Config);
    mockUseSession.mockReturnValue({ sessionLocation: { uuid: 'location-uuid' } } as Session);
    mockUseInvalidateLabOrders.mockReturnValue(vi.fn());
    mockGenerateIdentifier.mockResolvedValue('100008E');
    mockCreateWalkInPatient.mockResolvedValue({ data: { uuid: 'patient-uuid' } } as Awaited<
      ReturnType<typeof createWalkInPatient>
    >);
    mockCreateWalkInVisit.mockResolvedValue({ data: visit } as Awaited<ReturnType<typeof createWalkInVisit>>);
    mockFetchCurrentPatient.mockResolvedValue(fhirPatient);
  });

  it('accepts an age of zero for infants', async () => {
    renderWorkspace();
    expect(submitButton()).toBeDisabled();

    const user = await fillInForm('0');
    expect(submitButton()).toBeEnabled();

    await user.click(submitButton());
    await waitFor(() =>
      expect(mockLaunchWorkspace2).toHaveBeenCalledWith(
        'add-test-order-basket-workspace',
        {},
        expect.objectContaining({ patientUuid: 'patient-uuid', patient: fhirPatient, visitContext: visit }),
      ),
    );
  });

  it('does not create the patient again when retrying after the visit failed', async () => {
    mockCreateWalkInVisit.mockRejectedValueOnce(new Error('Visit could not be saved'));
    renderWorkspace();
    const user = await fillInForm('30');

    await user.click(submitButton());
    expect(await screen.findByText('Visit could not be saved')).toBeInTheDocument();

    await user.click(submitButton());
    await waitFor(() => expect(mockLaunchWorkspace2).toHaveBeenCalled());
    expect(mockCreateWalkInPatient).toHaveBeenCalledTimes(1);
    expect(mockGenerateIdentifier).toHaveBeenCalledTimes(1);
    expect(mockCreateWalkInVisit).toHaveBeenCalledTimes(2);
  });

  it('does not create the patient or visit again when retrying after loading the patient failed', async () => {
    mockFetchCurrentPatient.mockRejectedValueOnce(new Error('Patient could not be loaded'));
    renderWorkspace();
    const user = await fillInForm('30');

    await user.click(submitButton());
    expect(await screen.findByText('Patient could not be loaded')).toBeInTheDocument();

    await user.click(submitButton());
    await waitFor(() => expect(mockLaunchWorkspace2).toHaveBeenCalled());
    expect(mockCreateWalkInPatient).toHaveBeenCalledTimes(1);
    expect(mockCreateWalkInVisit).toHaveBeenCalledTimes(1);
    expect(mockFetchCurrentPatient).toHaveBeenCalledTimes(2);
  });
});
