import { HttpRequestResponse, QueryType, RequestObject } from "@/types/request";
import useRequest from "./helpers/useRequest";
import useResponse from "./helpers/useResponse";

export default (
  requestConstructor: RequestObject,
  requestValues: QueryType = {} as QueryType
): Promise<HttpRequestResponse> => {
  let response;
  let valuesKeys = Object.keys(requestValues);
  let postRequestValues;

  const isValuesKeys =
    valuesKeys.length &&
    !valuesKeys.some((key: string) =>
      ["path", "params", "query", "body"].includes(key)
    );

  // Shortcut for POST : If no 'params','query','body' keys in requestValues object, so it is 'body' object itself.
  if (isValuesKeys) {
    const body = { ...requestValues };
    postRequestValues = {
      body,
    };
  }

  const reqVals = isValuesKeys ? postRequestValues : requestValues;
  console.log(requestConstructor);
  console.log(reqVals);

  const request = useRequest(requestConstructor, reqVals);
  console.log(
    "►►►",
    request.method.toUpperCase(),
    request.path,
    requestConstructor,
    reqVals
  );

  if (request)
    response = useResponse({
      method: request.method,
      path: request.path,
      exec: request.exec,
    });
  else throw new Error("Something went wront with your API request.");
  return response;
};
