export const moduleName = "@openmrs/esm-laboratory-app";

export const LABORATARORY_ENCOUNTER_TYPE =
  "cbf01392-ca29-11e9-a32f-2a2ae2dbcce4";
export const TEST_ORDER_ENCOUNTER_TYPE = "dca07f4a-30ab-102d-86b0-7a5022ba4115";
export const uriText = "http://dev.kenyahmis.org/openmrs/ws/rest/v1/concept/";
//Add the concept here for additionEntries
export const GROUP_CONCEPT = ["163126AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"];
//Add the display here for additionEntries
export const GROUP_DISPLAY = ["Blood"];
export const STOOL_CONCEPT_ID = "159993AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
export const STOOL_DISPLAY = "Stool";
export const additionEntries = GROUP_CONCEPT.map((concept, index) => ({
  uuid: concept,
  display: GROUP_DISPLAY[index],
  links: [
    {
      rel: "self",
      uri: `${uriText}${concept}`,
      resourceAlias: "concept",
    },
  ],
}));
