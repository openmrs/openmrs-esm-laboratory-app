import React from "react";
import ReviewList from "../review-list/review-list.component";
import styles from "../queue-list/laboratory-queue.scss";

const ReviewComponent = () => {
  return (
    <div>
      <ReviewList fulfillerStatus={"IN_PROGRESS"} />
    </div>
  );
};

export default ReviewComponent;
