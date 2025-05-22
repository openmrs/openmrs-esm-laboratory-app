import React from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionItem,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
  Tag,
} from '@carbon/react';
import { capitalize, lowerCase } from 'lodash-es';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { type ListOrdersDetailsProps } from '../../types';
import styles from './list-order-details.scss';

type OrderDetailsRowProps = {
  label: ReactNode;
  value: ReactNode;
};

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
  const orders = groupedOrders?.orders ?? [];

  return (
    <div>
      {orders.map((row) => (
        <div key={row.orderNumber} className={styles.orderDetailsContainer}>
          <StructuredListWrapper className={styles.orderDetailsWrapper}>
            <StructuredListBody>
              <OrderDetailRow
                label={t('urgencyStatus', 'Urgency:')}
                value={
                  <div className={styles.priorityPill} data-urgency={lowerCase(row.urgency?.replace('_', ' ') || '')}>
                    {t(row.urgency, capitalize(row.urgency?.replace('_', ' ') || ''))}
                  </div>
                }
              />
              <OrderDetailRow label={t('testOrdered', 'Test ordered:')} value={capitalize(row.display)} />
              <OrderDetailRow
                label={t('orderStatus', 'Status:')}
                value={
                  <div
                    className={styles.statusPill}
                    data-status={lowerCase(row.fulfillerStatus?.replace('_', ' ') || '')}
                  >
                    {t(row.fulfillerStatus, capitalize(row.fulfillerStatus?.replace('_', ' ')))}
                  </div>
                }
              />
              <OrderDetailRow label={t('orderNumbers', 'Order number:')} value={capitalize(row.orderNumber)} />
              <OrderDetailRow label={t('orderDate', 'Order Date:')} value={row.dateActivated} />
              <OrderDetailRow label={t('orderedBy', 'Ordered By:')} value={capitalize(row.orderer?.display)} />
              <OrderDetailRow
                label={t('orderInstructions', 'Instructions:')}
                value={row.instructions ?? t('NoInstructionLeft', 'No instructions are provided.')}
              />

              {row.fulfillerStatus === 'DECLINED' && (
                <OrderDetailRow label={t('reasonForDecline', 'Reason for decline:')} value={row.fulfillerComment} />
              )}
            </StructuredListBody>
          </StructuredListWrapper>
          {row.fulfillerStatus === 'COMPLETED' && (
            <Accordion>
              <AccordionItem
                title={<span className={styles.accordionTitle}>{t('viewTestResults', 'View test results')}</span>}
              >
                <div className={styles.viewResults}>
                  <ExtensionSlot
                    className={styles.labResultSlot}
                    state={{ order: row }}
                    name="completed-lab-order-results-slot"
                  />
                </div>
              </AccordionItem>
            </Accordion>
          )}

          <div className={styles.buttonSection}>
            {/* @ts-ignore */}
            {row.fulfillerStatus === 'New' || row.fulfillerStatus === 'RECEIVED' || row.fulfillerStatus == null ? (
              <>
                <div className={styles.testsOrderedActions}>
                  <ExtensionSlot state={{ order: row }} name="rejected-ordered-actions-slot" />
                  <ExtensionSlot state={{ order: row }} name="tests-ordered-actions-slot" />
                </div>
              </>
            ) : row.fulfillerStatus === 'IN_PROGRESS' ? (
              <>
                <div className={styles.testsOrderedActions}>
                  <ExtensionSlot
                    className={styles.menuLink}
                    state={{ order: row }}
                    name="inprogress-tests-actions-slot"
                  />
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListOrderDetails;
