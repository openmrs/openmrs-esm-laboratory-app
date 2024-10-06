import { DatePicker, DatePickerInput } from '@carbon/react';
import { useStore } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { labDateRange } from '../../laboratory-resource';
import styles from './orders-date-range-picker.scss';

export const OrdersDateRangePicker = () => {
  const currentDate = new Date();
  const { dateRange } = useStore(labDateRange);
  const { t } = useTranslation();

  const handleOrdersDateRangeChange = (dates: Array<Date>) => {
    labDateRange.setState({ dateRange: dates });
  };

  const hasCheckedForDateRangeMismatch: boolean = JSON.parse(
    sessionStorage.getItem('has-checked-for-date-range-mismatch') || 'false',
  );

  const startOfToday = dayjs().startOf('day');

  if (dayjs(dateRange[0]).isBefore(startOfToday, 'day') && !hasCheckedForDateRangeMismatch) {
    labDateRange.setState({ dateRange: [startOfToday.toDate(), new Date()] });
    sessionStorage.setItem('has-checked-for-date-range-mismatch', 'true');
  }

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('dateRange', 'Date range')}:</p>
      <DatePicker
        datePickerType="range"
        className={styles.dateRangePicker}
        onClose={handleOrdersDateRangeChange}
        maxDate={currentDate.toISOString()}
        value={dateRange}
      >
        <DatePickerInput id="date-picker-input-id-start" placeholder="mm/dd/yyyy" size="md" />
        <DatePickerInput id="date-picker-input-id-finish" placeholder="mm/dd/yyyy" size="md" />
      </DatePicker>
    </div>
  );
};
