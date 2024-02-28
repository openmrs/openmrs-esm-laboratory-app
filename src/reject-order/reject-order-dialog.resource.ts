import {
  FetchResponse,
  openmrsFetch,
  restBaseUrl,
  useConfig,
} from "@openmrs/esm-framework";

export async function RejectOrder(uuid: string, body: any) {
  const abortController = new AbortController();

  return openmrsFetch(`${restBaseUrl}/order/${uuid}/fulfillerdetails/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: body,
  });
}
