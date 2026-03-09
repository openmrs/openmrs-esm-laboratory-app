import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getDefaultsFromConfigSchema,
  launchWorkspace2,
  useConfig,
  type Order,
  type Patient,
} from '@openmrs/esm-framework';
import { configSchema, type Config } from '../../config-schema';
import AddLabRequestResultsAction from './add-lab-request-results-action.component';

const mockLaunchWorkspace2 = jest.mocked(launchWorkspace2);
const mockUseConfig = jest.mocked(useConfig<Config>);

const mockOrder = {
  patient: {
    uuid: 'patient-uuid',
    person: {
      display: 'John Doe',
    },
  } as Partial<Patient>,
  encounter: {
    uuid: 'encounter-uuid',
    visit: {
      uuid: 'visit-uuid',
    },
  },
} as unknown as Order;

describe('AddLabRequestResultsAction', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
      laboratoryOrderTypeUuid: 'lab-order-type-uuid',
    });
  });

  it('opens the results workspace with the same-window lab-order workspace configured', async () => {
    const user = userEvent.setup();

    render(<AddLabRequestResultsAction order={mockOrder} />);

    await user.click(screen.getByRole('button', { name: /Add lab results/i }));

    expect(mockLaunchWorkspace2).toHaveBeenCalledWith(
      'lab-app-test-results-form-workspace',
      expect.objectContaining({
        patient: mockOrder.patient,
        order: mockOrder,
        invalidateLabOrders: expect.any(Function),
        labOrderWorkspaceName: 'lab-app-test-results-add-lab-order-workspace',
      }),
      {
        patient: mockOrder.patient,
        patientUuid: mockOrder.patient.uuid,
        encounterUuid: mockOrder.encounter.uuid,
        visitContext: mockOrder.encounter.visit,
      },
    );
  });
});
