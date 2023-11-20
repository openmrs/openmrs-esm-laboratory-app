import React, { useMemo, useState } from "react";
import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InlineLoading,
  Checkbox,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { useGetEncounterById } from "../../patient-chart/laboratory-item/view-laboratory-item.resource";
import styles from "../review-list.scss";
import { GroupMember } from "../../patient-chart/laboratory-order.resource";
import { useGetConceptById } from "../../patient-chart/results-summary/results-summary.resource";

interface ReviewItemDialogProps {
  encounterUuid: string;
  closeModal: () => void;
}

interface ResultsRowProps {
  groupMembers: GroupMember[];
}

interface ValueUnitsProps {
  conceptUuid: string;
}

const ReviewItem: React.FC<ReviewItemDialogProps> = ({
  encounterUuid,
  closeModal,
}) => {
  const { t } = useTranslation();

  const { encounter, isLoading, isError } = useGetEncounterById(encounterUuid);

  const testsOrder = useMemo(() => {
    return encounter?.obs.filter((item) => item?.order?.type === "testorder");
  }, [encounter?.obs]);

  const filteredGroupedResults = useMemo(() => {
    let groupedResults = [];

    testsOrder?.forEach((element) => {
      groupedResults[element.order.display] = element;
    });
    return groupedResults;
  }, [testsOrder]);

  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (test, groupMembers) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [test]: {
        groupMembers,
      },
    }));
  };

  // get Units
  const ValueUnits: React.FC<ValueUnitsProps> = ({ conceptUuid }) => {
    const {
      concept: concept,
      isLoading,
      isError,
    } = useGetConceptById(conceptUuid);
    if (isLoading) {
      return <InlineLoading status="active" />;
    }
    if (isError) {
      return <span>Error</span>;
    }
    return <span style={{ marginLeft: "10px" }}>{concept?.units}</span>;
  };

  // get Reference Range
  const ReferenceRange: React.FC<ValueUnitsProps> = ({ conceptUuid }) => {
    const {
      concept: concept,
      isLoading,
      isError,
    } = useGetConceptById(conceptUuid);
    if (isLoading) {
      return <InlineLoading status="active" />;
    }
    if (isError) {
      return <span>Error</span>;
    }
    return (
      <>
        {concept?.hiNormal === undefined || concept?.lowNormal === undefined ? (
          "N/A"
        ) : (
          <div>
            <span>{concept?.lowNormal ? concept?.lowNormal : "--"}</span> :{" "}
            <span>{concept?.hiNormal ? concept?.hiNormal : "--"}</span>
          </div>
        )}
      </>
    );
  };

  const RowTest: React.FC<ResultsRowProps> = ({ groupMembers }) => {
    return (
      <>
        {groupMembers?.map((element, index) => {
          return (
            <tr key={index}>
              {typeof element.value === "number" ? (
                <>
                  <td>{element?.concept.display}</td>

                  <td>{element?.value}</td>

                  <td>
                    {
                      <ReferenceRange
                        conceptUuid={groupMembers[index].concept.uuid}
                      />
                    }
                  </td>

                  <td>
                    {
                      <ValueUnits
                        conceptUuid={groupMembers[index].concept.uuid}
                      />
                    }
                  </td>
                </>
              ) : typeof element.value === "object" ? (
                <>
                  <td>{element?.concept.display}</td>

                  <td>{element?.value.display}</td>

                  <td>
                    {
                      <ReferenceRange
                        conceptUuid={groupMembers[index].concept.uuid}
                      />
                    }
                  </td>

                  <td>
                    {
                      <ValueUnits
                        conceptUuid={groupMembers[index].concept.uuid}
                      />
                    }
                  </td>
                </>
              ) : (
                <td>{element?.display}</td>
              )}
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <Form>
        <ModalHeader
          closeModal={closeModal}
          title={t("approveResult", "Approve Result")}
        />
        <ModalBody>
          {isLoading && (
            <InlineLoading
              className={styles.bannerLoading}
              iconDescription="Loading"
              description="Loading banner"
              status="active"
            />
          )}
          <section className={styles.section}>
            <table>
              <tbody>
                {Object.keys(filteredGroupedResults).map((test, index) => (
                  <tr key={test} style={{ margin: "10px" }}>
                    <Checkbox
                      key={index}
                      style={{
                        margin: "10px",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                      onChange={() =>
                        handleCheckboxChange(
                          test,
                          filteredGroupedResults[test].groupMembers
                        )
                      }
                      labelText={test}
                      id={`test-${test}`}
                      checked={checkedItems[test] || false}
                    />

                    <table style={{ margin: "10px" }}>
                      <thead>
                        <tr>
                          <th>Tests</th>
                          <th>Result</th>
                          <th>Reference Range</th>
                          <th>Units</th>
                        </tr>
                      </thead>
                      <tbody>
                        <RowTest
                          groupMembers={
                            filteredGroupedResults[test].groupMembers
                          }
                        />
                      </tbody>
                    </table>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit">{t("approveResult", "Approve Result")}</Button>
        </ModalFooter>
      </Form>
    </div>
  );
};
export default ReviewItem;
