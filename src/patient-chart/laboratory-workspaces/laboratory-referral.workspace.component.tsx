import React from "react";

import { DefaultWorkspaceProps } from "@openmrs/esm-patient-common-lib";

export const LaboratoryWorkspace: React.FC<DefaultWorkspaceProps> = ({
  closeWorkspace,
  promptBeforeClosing,
}) => {
  return (
    <>
      <span>Testing</span>
    </>
  );
};

export default LaboratoryWorkspace;
