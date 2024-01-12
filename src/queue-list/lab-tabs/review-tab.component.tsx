import React from "react";
import ReviewList from "../../review-list/review-list.component";
import styles from "./lab-tabs.scss";

// Define the props interface for the component
interface ByComponentProps {
  name: string;
}

const ByComponent: React.FC<ByComponentProps> = ({ name }) => {
  return (
    <div>
      <div className={styles.headerBtnContainer}></div>
      <ReviewList fulfillerStatus={"IN_PROGRESS"} />
    </div>
  );
};

export default ByComponent;
