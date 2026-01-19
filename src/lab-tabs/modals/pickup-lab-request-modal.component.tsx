import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { showNotification, showSnackbar, useAbortController, type Order } from '@openmrs/esm-framework';
import { setFulfillerStatus, useInvalidateLabOrders } from '../../laboratory.resource';

interface PickupLabRequestModal {
  closeModal: () => void;
  order: Order;
}

const PickupLabRequestModal: React.FC<PickupLabRequestModal> = ({ order, closeModal }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortController = useAbortController();
  const invalidateLabOrders = useInvalidateLabOrders();

  const handlePickup = () => {
    setIsSubmitting(true);
    setFulfillerStatus(order.uuid, 'IN_PROGRESS', abortController).then(
      () => {
        invalidateLabOrders();
        setIsSubmitting(false);
        closeModal();
        showSnackbar({
          isLowContrast: true,
          title: t('pickedAnOrder', 'Picked an order'),
          kind: 'success',
          subtitle: t('orderPickedSuccessfully', 'You have successfully picked an order'),
        });
      },
      (error) => {
        setIsSubmitting(false);
        showNotification({
          title: t('errorPickingOrder', 'Error picking order'),
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      },
    );
  };

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('pickRequest', 'Pick lab request')} />
      <ModalBody>
        <p>
          {t(
            'pickRequestConfirmationText',
            'Continuing will update the request status to "In Progress" and advance it to the next stage. Are you sure you want to proceed?',
          )}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('discard', 'Discard')}
        </Button>
        <Button type="submit" onClick={handlePickup} disabled={isSubmitting}>
          {t('pickupLabRequest', 'Pick up lab request')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default PickupLabRequestModal;
