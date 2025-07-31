import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { OpenmrsDateRangePicker, useAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from '../../types';
import styles from './orders-date-range-picker.scss';

export const OrdersDateRangePicker = () => {
  const { t } = useTranslation();
  const currentDate = new Date();

  const { dateRange, setDateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
    setDateRange: () => {},
  };

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('dateRange', 'Date range')}:</p>
      <OpenmrsDateRangePicker
        value={dateRange}
        onChange={(dates: [Date, Date]) => setDateRange(dates)}
        id="ordersDateRangePicker"
        data-testid="ordersDateRangePicker"
        labelText=""
        maxDate={currentDate}
        startName="start"
        endName="end"
      />
    </div>
  );
};
