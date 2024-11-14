import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tile, Accordion, AccordionItem } from '@carbon/react';
import { ExtensionSlot, launchWorkspace, showModal } from '@openmrs/esm-framework';
import { ListOrdersDetailsProps } from '../../types';
import styles from './list-order-details.scss';
import { OrderDetail } from './order-detail.component';

const ListOrderDetails: React.FC<ListOrdersDetailsProps> = (props) => {
  const { t } = useTranslation();
  const orders = props.groupedOrders?.orders;

  return (
    <div className={styles.ordersContainer}>
      {orders &&
        orders.map((row) => (
          <Tile className={styles.orderTile}>
            <div>
              <OrderDetail label={t('date', 'Date').toUpperCase()} value={row.dateActivated} />
              <OrderDetail label={t('orderNumber', 'Order number').toUpperCase()} value={row.orderNumber} />
              <OrderDetail label={t('procedure', 'Procedure').toUpperCase()} value={row.display} />
              <OrderDetail label={t('status', 'Status').toUpperCase()} value={row.fulfillerStatus} />
              <OrderDetail label={t('urgency', 'Urgency').toUpperCase()} value={row.urgency} />
              <OrderDetail label={t('orderer', 'Orderer').toUpperCase()} value={row.orderer?.display} />
              <OrderDetail label={t('instructions', 'Instructions').toUpperCase()} value={row.instructions ?? '--'} />
            </div>

            <div className={styles.actionButtons}>
              {row.fulfillerStatus === 'New' || row.fulfillerStatus === 'RECEIVED' || row.fulfillerStatus == null ? (
                <ExtensionSlot className={styles.menuLink} state={{ order: row }} name="tests-ordered-actions-slot" />
              ) : row.fulfillerStatus === 'IN_PROGRESS' ? (
                <ExtensionSlot
                  className={styles.menuLink}
                  state={{ order: row }}
                  name="inprogress-tests-actions-slot"
                />
              ) : row.fulfillerStatus === 'COMPLETED' ? (
                <ExtensionSlot
                  className={styles.menuLink}
                  state={{ order: row }}
                  name="completed-ordered-actions-slot"
                />
              ) : (
                <div></div>
              )}
              {row.fulfillerStatus === 'COMPLETED' && (
                <div className={styles.accordionContainer}>
                  <Accordion>
                    <AccordionItem title={t('results', 'Results')}>
                      <ExtensionSlot
                        className={styles.labResultSlot}
                        state={{ order: row }}
                        name="completed-lab-order-results-slot"
                      />
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </Tile>
        ))}
    </div>
  );
};

export default ListOrderDetails;
