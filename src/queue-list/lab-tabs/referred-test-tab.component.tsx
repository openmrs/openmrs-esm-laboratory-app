import React from "react";
import { EmptyState } from "@openmrs/esm-patient-common-lib";

// Define the props interface for the component
interface NyComponentProps {
  name: string;
}

// Define the functional component using TypeScript
const NyComponent: React.FC<NyComponentProps> = ({ name }) => {
  return (
    // <div>
    //    <div className={styles.headerBtnContainer}></div>
    //   <ReviewList fulfillerStatus={"IN_PROGRESS"} />
    // </div>
    <div>
      {/* <div className={styles.headerBtnContainer}></div> */}
      <EmptyState
        displayText={"referred tests"}
        headerTitle={"Referred tests"}
      />
    </div>
  );
};

export default NyComponent;
