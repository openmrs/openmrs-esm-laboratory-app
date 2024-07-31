import React from "react";
import styles from "./orderDetail.scss";

export const OrderDetail: React.FC<{ label: string; value: string | any }> = ({
  label,
  value,
}) => {
  return (
    <div>
      <p className={styles.bodyLong01}>
        <span className={styles.label01}>{label}</span>
        {" : "}
        <span className={styles.displayValue}>{value}</span>
      </p>
    </div>
  );
};
