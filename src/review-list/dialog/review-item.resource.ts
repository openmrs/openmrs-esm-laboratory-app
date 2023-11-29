import { FetchResponse, openmrsFetch, useConfig } from "@openmrs/esm-framework";

export async function ApproverOrder(body: any) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/approveorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: body,
  });
}
