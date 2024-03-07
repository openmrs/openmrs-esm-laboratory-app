import React from "react";
import ReviewList from "../review-list/review-list.component";

const ReviewComponent = () => {
  return (
    <div>
      <ReviewList fulfillerStatus={"IN_PROGRESS"} />
    </div>
  );
};

export default ReviewComponent;
