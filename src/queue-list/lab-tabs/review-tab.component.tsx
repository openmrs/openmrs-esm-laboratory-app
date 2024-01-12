import React from "react";
import ReviewList from "../../review-list/review-list.component";
import styles from "./lab-tabs.scss";

interface ReviewListComponentProps {
  name: string;
}

const ReviewListComponent: React.FC<ReviewListComponentProps> = () => {
  return (
    <div>
      <div className={styles.headerBtnContainer}></div>
      <ReviewList fulfillerStatus={"IN_PROGRESS"} />
    </div>
  );
};

export default ReviewListComponent;
