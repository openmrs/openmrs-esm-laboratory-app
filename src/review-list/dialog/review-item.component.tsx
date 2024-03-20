import React, { useMemo } from "react";
import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InlineLoading,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "../dialog/review-item.scss";
import {
  GroupMember,
  useGetEncounterById,
} from "../../patient-chart/patient-laboratory-order-results.resource";
import { useGetConceptById } from "../../patient-chart/results-summary/results-summary.resource";
import { ApproverOrder } from "./review-item.resource";
import { showNotification, showSnackbar } from "@openmrs/esm-framework";
import { Result } from "../../work-list/work-list.resource";

interface ReviewItemDialogProps {
  encounterUuid: string;
  orderItem: Result;
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
  orderItem,
  closeModal,
}) => {
  const { t } = useTranslation();

  const { encounter, isLoading } = useGetEncounterById(encounterUuid);

  const testsOrder = useMemo(() => {
    return encounter?.obs?.filter(
      (item) => item?.order?.display === orderItem?.display
    );
  }, [encounter?.obs, orderItem?.display]);

  const filteredGroupedResults = useMemo(() => {
    let groupedResults = [];

    testsOrder?.forEach((element) => {
      groupedResults[element?.concept?.display] = element;
    });

    return groupedResults;
  }, [testsOrder]);

  // handle approve
  const approveOrder = async (e) => {
    e.preventDefault();

    ApproverOrder({ orders: `${orderItem?.uuid}` }).then(
      () => {
        showSnackbar({
          isLowContrast: true,
          title: t("approveOrder", "Approve Order"),
          kind: "success",
          subtitle: t(
            "successfullyApproved",
            `You have successfully approved Order `
          ),
        });
        closeModal();
      },
      (err) => {
        showNotification({
          title: t(`errorApproving order', 'Error Approving a order`),
          kind: "error",
          critical: true,
          description: err?.message,
        });
      }
    );
  };

  // get Units
  const ValueUnits: React.FC<ValueUnitsProps> = ({ conceptUuid }) => {
    const { concept, isLoading, isError } = useGetConceptById(conceptUuid);

    if (isLoading) return <InlineLoading status="active" />;
    if (isError) return <span>Error</span>;

    return (
      <span className={styles.valueWidget}>{concept?.units ?? "N/A"}</span>
    );
  };

  // get Reference Range
  const ReferenceRange: React.FC<ValueUnitsProps> = ({ conceptUuid }) => {
    const { concept, isLoading, isError } = useGetConceptById(conceptUuid);

    if (isLoading) return <InlineLoading status="active" />;
    if (isError) return <span>Error</span>;

    const lowNormal = concept?.lowNormal || "--";
    const hiNormal = concept?.hiNormal || "--";

    return (
      <>
        {concept?.hiNormal === undefined || concept?.lowNormal === undefined ? (
          "N/A"
        ) : (
          <div>
            <span>{lowNormal}</span> : <span>{hiNormal}</span>
          </div>
        )}
      </>
    );
  };

  const RowGroupMembers: React.FC<ResultsRowProps> = ({ groupMembers }) => (
    <>
      {groupMembers?.map((element, index) => (
        <tr key={index}>
          <td>{element?.concept.display}</td>
          <td>
            {typeof element.value === "object"
              ? element.value.display
              : element.value}
          </td>
          <td>
            <ReferenceRange conceptUuid={element.concept.uuid} />
          </td>
          <td>
            <ValueUnits conceptUuid={element.concept.uuid} />
          </td>
        </tr>
      ))}
    </>
  );

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
                {Object.keys(filteredGroupedResults).length > 0
                  ? Object.keys(filteredGroupedResults).map((test) => {
                      const { uuid, groupMembers } =
                        filteredGroupedResults[test];
                      const isGrouped = uuid && groupMembers?.length > 0;

                      return (
                        <tr key={test} style={{ margin: "10px" }}>
                          {test}

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
                              {isGrouped && (
                                <RowGroupMembers groupMembers={groupMembers} />
                              )}
                              {!isGrouped && (
                                <tr>
                                  <td>
                                    <span>
                                      {
                                        filteredGroupedResults[test]?.order
                                          ?.display
                                      }
                                    </span>
                                  </td>
                                  <td>
                                    <span>
                                      {
                                        filteredGroupedResults[test]?.value
                                          ?.display
                                      }
                                    </span>
                                  </td>
                                  <td>
                                    <span>{"N/A"}</span>
                                  </td>
                                  <td>
                                    <span>{"N/A"}</span>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </tr>
                      );
                    })
                  : "No tests were added"}
              </tbody>
            </table>
          </section>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit" onClick={approveOrder}>
            {t("approveResult", "Approve Result")}
          </Button>
        </ModalFooter>
      </Form>
    </div>
  );
};
export default ReviewItem;
