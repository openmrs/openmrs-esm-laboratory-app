import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tag,
  StructuredListWrapper,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Button,
} from '@carbon/react';
import capitalize from 'lodash-es/capitalize';
import { ListOrdersDetailsProps } from '../../types';
import styles from './list-order-details.scss';
import { ExtensionSlot, useLayoutType } from '@openmrs/esm-framework';
import { Edit } from '@carbon/react/icons';
const ListOrderDetails: React.FC<ListOrdersDetailsProps> = (props) => {
  const { t } = useTranslation();
  const orders = props.groupedOrders?.orders;
  const isTablet = useLayoutType() === 'tablet';

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
              <div className={styles.buttonSection}>
                <span className={styles.nameOrder}>
                  {t('ordererName', 'Orderer Name: ')} {capitalize(row.orderer?.display)}
                </span>
                <div className={styles.actionButtons}>
                  {row.fulfillerStatus === 'New' ||
                  row.fulfillerStatus === 'RECEIVED' ||
                  row.fulfillerStatus == null ? (
                    <ExtensionSlot
                      className={styles.menuLink}
                      state={{ order: row }}
                      name="tests-ordered-actions-slot"
                    />
                  ) : row.fulfillerStatus === 'COMPLETED' ? (
                    <ExtensionSlot
                      className={styles.menuLink}
                      state={{ order: row }}
                      name="completed-ordered-actions-slot"
                    />
                  ) : row.fulfillerStatus === 'IN_PROGRESS' ? (
                    <ExtensionSlot
                      className={styles.menuLink}
                      state={{ order: row }}
                      name="inprogress-tests-actions-slot"
                    />
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
