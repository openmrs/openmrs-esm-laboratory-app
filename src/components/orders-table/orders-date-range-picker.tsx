import { DatePicker, DatePickerInput } from '@carbon/react';
import React from 'react';
import styles from './orders-date-range-picker.scss';
import { useTranslation } from 'react-i18next';

export const OrdersDateRangePicker = ({
  onChange,
  currentValues,
}: {
  onChange: (dates: Array<Date>) => void;
  currentValues: Array<Date>;
}) => {
  const currentDate = new Date();
  const { t } = useTranslation();

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('dateRange', 'Date range')}:</p>
      <DatePicker
        datePickerType="range"
        className={styles.dateRangePicker}
        onClose={onChange}
        maxDate={currentDate.toISOString()}
        value={currentValues}
      >
        <DatePickerInput id="date-picker-input-id-start" placeholder="mm/dd/yyyy" size="md" />
        <DatePickerInput id="date-picker-input-id-finish" placeholder="mm/dd/yyyy" size="md" />
      </DatePicker>
    </div>
  );
};
