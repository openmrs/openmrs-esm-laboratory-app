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

interface ReviewItemDialogProps {
  encounterUuid: string;
  closeModal: () => void;
}

interface ResultsRowProps {
  groupMembers: GroupMember[];
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

                  <td>--</td>

                  <td>--</td>
                </>
              ) : typeof element.value === "object" ? (
                <>
                  <td>{element?.concept.display}</td>

                  <td>{element?.value.display}</td>

                  <td>--</td>

                  <td>--</td>
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
