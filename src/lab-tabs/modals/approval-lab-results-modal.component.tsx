import React, { useState } from 'react';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import {
  ExtensionSlot,
  restBaseUrl,
  showNotification,
  showSnackbar,
  useAbortController,
  useConfig,
  type Order,
} from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import { type Config } from '../../config-schema';
import { setFulfillerStatus } from '../../laboratory-resource';

interface ApproveLabResultsModal {
  closeModal: () => void;
  order: Order;
}

const ApproveLabResultsModal: React.FC<ApproveLabResultsModal> = ({ order, closeModal }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { laboratoryOrderTypeUuid } = useConfig<Config>();
  const abortController = useAbortController();

  const handleApproval = () => {
    setIsSubmitting(true);
    setFulfillerStatus(order.uuid, 'COMPLETED', abortController).then(
      () => {
        mutate(
          (key) =>
            typeof key === 'string' && key.startsWith(`${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}`),
          undefined,
          { revalidate: true },
        );
        setIsSubmitting(false);
        closeModal();
        showSnackbar({
          isLowContrast: true,
          title: t('resultsApproved', 'Results Approved'),
          kind: 'success',
          subtitle: t('labResultsApprovedSuccessfully', 'Lab results have been successfully approved and finalized'),
        });
      },
      (error) => {
        setIsSubmitting(false);
        showNotification({
          title: t('errorApprovingResults', 'Error approving results'),
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      },
    );
  };

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('approveLabResults', 'Approve Lab Results')} />
      <ModalBody>
        <p>
          {t(
            'approveResultsConfirmationText',
            'You are about to approve and finalize these lab results. Once approved, the results will be marked as complete and made available to clinicians. Are you sure you want to proceed?',
          )}
        </p>
        <>
          <ExtensionSlot state={{ order: order }} name="completed-lab-order-results-slot" />
        </>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button type="submit" onClick={handleApproval} disabled={isSubmitting}>
          {t('approveResults', 'Approve Results')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default ApproveLabResultsModal;
