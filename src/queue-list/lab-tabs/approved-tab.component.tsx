import React from "react";
import CompletedList from "../../completed-list/completed-list.component";

// Define the props interface for the component
interface DyComponentProps {
  name: string;
}

// Define the functional component using TypeScript
const DyComponent: React.FC<DyComponentProps> = ({ name }) => {
  return (
    <div>
      {/* <div className={styles.headerBtnContainer}></div> */}
      <CompletedList fulfillerStatus={"COMPLETED"} />
    </div>
  );
};

export default DyComponent;
