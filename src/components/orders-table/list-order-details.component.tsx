import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import {
  Accordion,
  AccordionItem,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import { capitalize } from 'lodash-es';
import { ExtensionSlot, formatDate, parseDate } from '@openmrs/esm-framework';
import { type GroupedOrders } from '../../types';
import styles from './list-order-details.scss';

type OrderDetailsRowProps = {
  label: ReactNode;
  value: ReactNode;
};

export interface ListOrdersDetailsProps {
  groupedOrders: GroupedOrders;
}

const OrderDetailRow = ({ label, value }: OrderDetailsRowProps) => {
  return (
    <StructuredListRow className={styles.orderDetailsRow}>
      <StructuredListCell className={styles.orderDetailsCell}>
        <span className={styles.orderDetailsTextBold}>{label}</span>
      </StructuredListCell>
      <StructuredListCell className={styles.orderDetailsCell}>
        <span className={styles.orderDetailsText}>{value}</span>
      </StructuredListCell>
    </StructuredListRow>
  );
};
const ListOrderDetails: React.FC<ListOrdersDetailsProps> = ({ groupedOrders }) => {
  const { t } = useTranslation();
  const originalOrders = groupedOrders?.originalOrders ?? [];

  return (
    <div>
      {originalOrders.map((order) => (
        <div key={order.orderNumber} className={styles.orderDetailsContainer}>
          <StructuredListWrapper className={styles.orderDetailsWrapper}>
            <StructuredListBody>
              <OrderDetailRow
                label={t('urgencyStatus', 'Urgency:')}
                value={
                  <div className={styles.priorityPill} data-urgency={order.urgency?.replace('_', ' ')}>
                    {capitalize(order.urgency?.replace(/_/g, ' '))}
                  </div>
                }
              />
              <OrderDetailRow label={t('testOrdered', 'Test ordered:')} value={order.display} />
              <OrderDetailRow
                label={t('orderStatus', 'Status:')}
                value={
                  <div
                    className={styles.statusPill}
                    data-status={(order.fulfillerStatus ?? 'Order not picked').replace('_', ' ')}
                  >
                    {capitalize(order.fulfillerStatus?.replace('_', ' ')) || t('orderNotPicked', 'Order not picked')}
                  </div>
                }
              />
              <OrderDetailRow label={t('orderNumbers', 'Order number:')} value={order.orderNumber} />
              <OrderDetailRow
                label={t('orderDate', 'Order date:')}
                value={formatDate(parseDate(order.dateActivated))}
              />
              <OrderDetailRow label={t('orderedBy', 'Ordered By:')} value={order.orderer?.display} />
              <OrderDetailRow
                label={t('orderInstructions', 'Instructions:')}
                value={order.instructions ?? t('NoInstructionLeft', 'No instructions are provided.')}
              />

              {order.fulfillerStatus === 'DECLINED' && (
                <OrderDetailRow label={t('reasonForDecline', 'Reason for decline:')} value={order.fulfillerComment} />
              )}
            </StructuredListBody>
          </StructuredListWrapper>
          {(order.fulfillerStatus === 'COMPLETED' || order.fulfillerStatus === 'DRAFT') && (
            <Accordion>
              <AccordionItem
                open={order.fulfillerStatus === 'COMPLETED'}
                title={<span className={styles.accordionTitle}>{t('viewTestResults', 'View test results')}</span>}
              >
                <div className={styles.viewResults}>
                  <ExtensionSlot
                    className={styles.labResultSlot}
                    state={{ order: order }}
                    name="completed-lab-order-results-slot"
                  />
                </div>
              </AccordionItem>
            </Accordion>
          )}

          <div className={styles.buttonSection}>
            {order.fulfillerStatus === 'RECEIVED' || order.fulfillerStatus == null ? (
              <>
                <div className={styles.testsOrderedActions}>
                  <ExtensionSlot state={{ order: order }} name="rejected-ordered-actions-slot" />
                  <ExtensionSlot state={{ order: order }} name="tests-ordered-actions-slot" />
                  <ExtensionSlot state={{ order: order }} name="add-lab-order-details-slot" />
                </div>
              </>
            ) : order.fulfillerStatus === 'IN_PROGRESS' ? (
              <>
                <div className={styles.testsOrderedActions}>
                  <ExtensionSlot
                    className={styles.menuLink}
                    state={{ order: order }}
                    name="inprogress-tests-actions-slot"
                  />
                </div>
              </>
            ) : order.fulfillerStatus === 'DRAFT' ? (
              <>
                <div className={styles.testsOrderedActions}>
                  <ExtensionSlot
                    className={styles.menuLink}
                    state={{ order: order }}
                    name="amended-ordered-actions-slot"
                  />
                  <ExtensionSlot
                    className={styles.menuLink}
                    state={{ order: order }}
                    name="approved-ordered-actions-slot"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListOrderDetails;
