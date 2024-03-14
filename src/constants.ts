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

export const laboratoryConcepts = [
  {
    uuid: "161939AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Whole blood",
  },
  {
    uuid: "1001AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Serum",
  },
  {
    uuid: "1002AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Plasma",
  },
  {
    uuid: "159994AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Urine",
  },
  {
    uuid: "159993AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Stool",
  },
  {
    uuid: "159665AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "High Vaginal Swab",
  },
  {
    uuid: "123529AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Urethral Swab",
  },
  {
    uuid: "1004AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Sputum",
  },
  {
    uuid: "159995AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Cerebrospinal Fluid",
  },
  {
    uuid: "128047AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Pus",
  },
  {
    uuid: "163363AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Nasal Swab",
  },
  {
    uuid: "162614AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Oropharyngeal Swab",
  },
  {
    uuid: "163368AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Semen",
  },
  {
    uuid: "163420AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Bone Marrow",
  },
  {
    uuid: "159996AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Synovial Fluid",
  },
  {
    uuid: "163369AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Tissue Biopsies",
  },
  {
    uuid: "160013AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Saliva",
  },
  {
    uuid: "155311AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Amniotic Fluid",
  },
  {
    uuid: "163349AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Pleural fluid",
  },
  {
    uuid: "163366AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Pericardial fluid ",
  },
  {
    uuid: "159997AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Peritoneal fluid",
  },
  {
    uuid: "159998AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Gastric fluid",
  },
];
