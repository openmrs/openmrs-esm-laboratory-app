import { Type } from "@openmrs/esm-framework";

export const configSchema = {
  laboratoryOrderTypeUuid: {
    _type: Type.String,
    _default: "52a447d3-a64a-11e3-9aeb-50e549534c5e",
    _description: "Uuid for orderType",
  },
  targetPatientDashboard: {
    _type: Type.String,
    _default: "Results Viewer",
    _description:
      "The patient chart dashboard to navigate to from the lab app.",
  },
};

export type Config = {
  laboratoryOrderTypeUuid: string;
  targetPatientDashboard: string;
};
