import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";

export async function ApproverOrder(body: any) {
  const abortController = new AbortController();

  return openmrsFetch(`${restBaseUrl}/approveorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: body,
  });
}
