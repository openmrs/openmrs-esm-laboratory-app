import React from 'react';
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
import capitalize from 'lodash-es/capitalize';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { type ListOrdersDetailsProps } from '../../types';
import styles from './list-order-details.scss';

const ListOrderDetails: React.FC<ListOrdersDetailsProps> = (props) => {
  const { t } = useTranslation();
  const orders = props.groupedOrders?.orders;

  return (
    <div>
      {orders &&
        orders.map((row) => (
          <div className={styles.orderDetailsContainer}>
            <div className={styles.orderUrgency}></div>
            <div className={styles.orderHeader}>
              <span className={styles.orderNumber}>
                {t('orderNumbers', 'Order number:')} {row.orderNumber}
              </span>
              <span className={styles.orderDate}>
                {t('orderDate', 'Order Date:')} {row.dateActivated}
              </span>
            </div>
            <div className={styles.orderStatus}>
              {t('orderStatus', 'Status:')}
              <Tag size="lg" type={row.fulfillerStatus ? 'green' : 'red'}>
                {row.fulfillerStatus || t('orderNotPicked', 'Order not picked')}
              </Tag>
            </div>
            <div>
              <div className={styles.orderUrgency}>
                <span className={styles.urgencyStatus}>
                  {t('urgencyStatus', 'Urgency: ')} {capitalize(row.urgency)}
                </span>
              </div>
              <StructuredListWrapper>
                <StructuredListBody>
                  <StructuredListRow>
                    <StructuredListCell>{t('testOrdered', 'Test ordered: ')}</StructuredListCell>
                    <StructuredListCell>{capitalize(row?.display)}</StructuredListCell>
                    <br />
                    <StructuredListCell>
                      <span className={styles.instructionLabel}>{t('orderInStruction', 'Instructions: ')}</span>
                      <span className={styles.instructions}>
                        {row.instructions ?? (
                          <Tag size="lg" type="red">
                            {t('NoInstructionLeft', 'No instructions are provided.')}
                          </Tag>
                        )}
                      </span>
                    </StructuredListCell>
                  </StructuredListRow>
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

                    {row.fulfillerStatus === 'COMPLETED' && (
                      <ExtensionSlot
                        className={styles.menuLink}
                        state={{ order: row }}
                        name="completed-ordered-actions-slot"
                      />
                    )}
                  </AccordionItem>
                </Accordion>
              )}
              {row.fulfillerStatus === 'DECLINED' && (
                <StructuredListRow>
                  <StructuredListCell> {t('reasonForDecline', 'Reason for decline:')}</StructuredListCell>
                  <StructuredListCell>{row.fulfillerComment}</StructuredListCell>
                </StructuredListRow>
              )}
              <StructuredListRow>
                <StructuredListCell>
                  <span className={styles.nameOrder}>
                    {t('ordererName', 'Orderer Name: ')} {capitalize(row.orderer?.display)}
                  </span>
                </StructuredListCell>
              </StructuredListRow>

              <div className={styles.buttonSection}>
                <div className={styles.actionButtons}>
                  {/* @ts-ignore */}
                  {row.fulfillerStatus === 'New' ||
                  row.fulfillerStatus === 'RECEIVED' ||
                  row.fulfillerStatus == null ? (
                    <>
                      <div className={styles.actionButtons}>
                        <div className={styles.rejectButton}>
                          <ExtensionSlot state={{ order: row }} name="rejected-ordered-actions-slot" />
                        </div>
                        <div className={styles.testsOrderedActions}>
                          <ExtensionSlot state={{ order: row }} name="tests-ordered-actions-slot" />
                        </div>
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
            </div>
          </div>
        ))}
    </div>
  );
};

export default ListOrderDetails;
