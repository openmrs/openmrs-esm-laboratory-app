import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getDefaultsFromConfigSchema,
  launchWorkspace2,
  showSnackbar,
  useConfig,
  useVisit,
  type Visit,
} from '@openmrs/esm-framework';
import { configSchema, type Config } from '../../config-schema';
import { useInvalidateLabOrders } from '../../laboratory.resource';
import AddTestOrderButton from './add-test-order-button.component';

vi.mock('../../laboratory.resource', () => ({
  useInvalidateLabOrders: vi.fn(),
}));

const mockLaunchWorkspace2 = vi.mocked(launchWorkspace2);
const mockShowSnackbar = vi.mocked(showSnackbar);
const mockUseConfig = vi.mocked(useConfig<Config>);
const mockUseVisit = vi.mocked(useVisit);
const mockUseInvalidateLabOrders = vi.mocked(useInvalidateLabOrders);

const mockPatient: fhir.Patient = {
  resourceType: 'Patient',
  id: 'patient-uuid',
  name: [{ given: ['John'], family: 'Doe' }],
};

const baseVisitReturn = {
  mutate: vi.fn(),
  isValidating: false,
  isLoading: false,
  currentVisit: null,
  currentVisitIsRetrospective: false,
};

type OnPatientSelected = (
  patientUuid: string,
  patient: fhir.Patient,
  launchChildWorkspace: unknown,
  closeWorkspace: () => Promise<boolean>,
) => void;

function getOnPatientSelected(): OnPatientSelected {
  const patientSearchCall = mockLaunchWorkspace2.mock.calls.find(
    ([name]) => name === 'add-test-order-patient-search-workspace',
  );
  const workspaceProps = patientSearchCall?.[1] as { onPatientSelected: OnPatientSelected } | undefined;
  return workspaceProps!.onPatientSelected;
}

describe('AddTestOrderButton', () => {
  const mockInvalidateLabOrders = vi.fn();

  beforeEach(() => {
    mockUseInvalidateLabOrders.mockReturnValue(mockInvalidateLabOrders);
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
      laboratoryOrderTypeUuid: 'lab-order-type-uuid',
    });
    mockUseVisit.mockReturnValue({
      ...baseVisitReturn,
      error: null,
      activeVisit: null,
    });
  });

  it('launches the order basket with visit context when the selected patient has an active visit', async () => {
    const activeVisit = { uuid: 'visit-uuid' } as Visit;
    mockUseVisit.mockReturnValue({
      ...baseVisitReturn,
      error: null,
      activeVisit,
    });

    const user = userEvent.setup();
    render(<AddTestOrderButton />);
    await user.click(screen.getByRole('button', { name: /add test order/i }));

    const onPatientSelected = getOnPatientSelected();
    const closeWorkspace = vi.fn().mockResolvedValue(true);

    await act(async () => {
      onPatientSelected('patient-uuid', mockPatient, vi.fn(), closeWorkspace);
    });

    await waitFor(() => {
      expect(closeWorkspace).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockLaunchWorkspace2).toHaveBeenCalledWith(
        'add-test-order-basket-workspace',
        expect.anything(),
        expect.objectContaining({
          patientUuid: 'patient-uuid',
          patient: mockPatient,
          visitContext: activeVisit,
          visibleOrderPanels: ['lab-order-type-uuid'],
          labOrderWorkspaceName: 'add-test-order-basket-add-lab-order-workspace',
          onOrderBasketSubmitted: expect.any(Function),
        }),
      );
    });
    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });

  it('shows a warning snackbar when the selected patient has no active visit', async () => {
    const user = userEvent.setup();
    render(<AddTestOrderButton />);
    await user.click(screen.getByRole('button', { name: /add test order/i }));

    const onPatientSelected = getOnPatientSelected();

    await act(async () => {
      onPatientSelected('patient-uuid', mockPatient, vi.fn(), vi.fn().mockResolvedValue(true));
    });

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Visit required',
          kind: 'warning',
        }),
      );
    });
    expect(mockLaunchWorkspace2).not.toHaveBeenCalledWith(
      'add-test-order-basket-workspace',
      expect.anything(),
      expect.anything(),
    );
  });

  it('shows an error snackbar when the visit fetch fails', async () => {
    mockUseVisit.mockReturnValue({
      ...baseVisitReturn,
      error: new Error('Network error'),
      activeVisit: null,
    });

    const user = userEvent.setup();
    render(<AddTestOrderButton />);
    await user.click(screen.getByRole('button', { name: /add test order/i }));

    const onPatientSelected = getOnPatientSelected();

    await act(async () => {
      onPatientSelected('patient-uuid', mockPatient, vi.fn(), vi.fn().mockResolvedValue(true));
    });

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error checking visit status',
          subtitle: 'Network error',
          kind: 'error',
        }),
      );
    });
    expect(mockLaunchWorkspace2).not.toHaveBeenCalledWith(
      'add-test-order-basket-workspace',
      expect.anything(),
      expect.anything(),
    );
  });
});
