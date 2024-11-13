import React from 'react';
import { useAppContext, OpenmrsDatePicker } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { DateFilterContext } from '../../types';
import styles from './orders-date-range-picker.scss';

const OpenmrsDateRangePicker = ({ dateRange, onDateRangeChange, maxDate }) => {
  const { t } = useTranslation();

  const handleDateChange = (index, date) => {
    const updatedDateRange = [...dateRange];
    updatedDateRange[index] = date;
    onDateRangeChange(updatedDateRange);
  };

  return (
    <div className={styles.dateRangePicker}>
      <p>{t('dateRange', 'Date range')}:</p>
      <div className={styles.datePickers}>
        {['start', 'finish'].map((type, index) => (
          <OpenmrsDatePicker
            key={type}
            id={`date-picker-input-id-${type}`}
            value={dateRange[index]}
            onChange={(date) => handleDateChange(index, date)}
            maxDate={maxDate}
          />
        ))}
      </div>
    </div>
  );
};

export const OrdersDateRangePicker = () => {
  const currentDate = new Date();
  const { dateRange, setDateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
    setDateRange: () => {},
  };

  return (
    <div className={styles.datePickerWrapper}>
      <OpenmrsDateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} maxDate={currentDate} />
    </div>
  );
};
