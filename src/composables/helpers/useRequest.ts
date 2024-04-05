import {
  ApiConfig,
  RequestObject,
  RequestOverrides,
  METHOD,
  RequestBuilderReturn,
} from "@/types/request";
import { AxiosInstance, AxiosRequestConfig } from "axios";

export default (
  { api, method, path, query: queryBuilder = {} }: RequestObject,
  { query: queryValue = {}, body: bodyValue = {} }: RequestOverrides = {}
): RequestBuilderReturn => {
  try {
    return buildRequest(
      {
        api,
        method,
        path: path,
        params: {},
        query: queryBuilder,
        body: {},
        config: {},
      },
      {
        api,
        path: null,
        params: {},
        query: queryValue,
        body: bodyValue,
        config: {},
      }
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};

function buildRequest(
  {
    api,
    method,
    path: path,
    params: paramsBuilder,
    query: queryBuilder,
    body: bodyBuilder,
    config: configBuilder,
  }: ApiConfig,
  {
    path: forcedPath,
    params: paramsValue,
    query: queryValue,
    body: bodyValue,
    config: configRequest,
  }: any
) {
  let finalPath = forcedPath || path;

  const config = { ...configBuilder, ...configRequest };

  if (!paramsBuilder && !queryBuilder && !bodyBuilder) {
    return requestBuilder(api, method, path, config);
  }

  //If procedural path configuration
  if (!forcedPath) {
    if (paramsBuilder && Object.keys(paramsBuilder).length) {
      let params = path.split("/").filter((path: string) => path.includes(":"));
      params = params.map((param: any) => param.replace(":", ""));
      if (params.length !== Object.keys(paramsBuilder).length) {
        throw Error(
          `'params' field is not correctly implementing 'path' params declaration. [Ex1]`
        );
      }

      const paramsBuilderKeys = Object.keys(paramsBuilder);
      for (let key of paramsBuilderKeys) {
        if (!params.includes(key)) {
          throw Error(
            `'params' field is not correctly implementing 'path' params declaration. [Ex2]`
          );
        } else {
          if (paramsBuilder[key].required && paramsValue[key] === undefined) {
            throw Error(
              ` params '${key}' is required but not setted in request.`
            );
          } else if (paramsValue[key]) {
            if (typeof paramsBuilder[key].format === "function") {
              paramsValue[key] = paramsBuilder[key].format(paramsValue[key]);
            }
            const validated = paramsBuilder[key].validators
              ? paramsBuilder[key].validators.some(
                  (func: any) => func(paramsValue[key]) === true
                )
              : true;
            if (validated) {
              finalPath = finalPath.replace(`:${key}`, paramsValue[key]);
            } else {
              throw Error(
                ` params '${key}' is not valid. Required: ${paramsBuilder[
                  key
                ].validators.join(", ")}`
              );
            }
          }
        }
      }
    }

    if (queryBuilder && Object.keys(queryBuilder).length) {
      const queryBuilderKeys = Object.keys(queryBuilder);
      for (let key of queryBuilderKeys) {
        if (queryBuilder[key].required && queryValue[key] === undefined) {
          if (!queryBuilder[key].default)
            throw Error(
              ` query '${key}' is required but not setted in request.`
            );
          else queryValue[key] = queryBuilder[key].default;
        } else if (queryValue[key]) {
          if (typeof queryBuilder[key].format === "function") {
            queryValue[key] = queryBuilder[key].format(queryValue[key]);
          }
          const validated = queryBuilder[key].validators
            ? queryBuilder[key].validators.some(
                (func: any) => func(queryValue[key]) === true
              )
            : true;
          if (!validated) {
            throw Error(
              ` query '${key}' is not valid. Required: ${queryBuilder[
                key
              ].validators.join(", ")}`
            );
          }
        }
      }
      finalPath = finalPath + "?" + new URLSearchParams(queryValue).toString();
    }

    if (bodyBuilder && Object.keys(bodyBuilder).length) {
      const bodyBuilderKeys = Object.keys(bodyBuilder);
      for (let key of bodyBuilderKeys) {
        if (bodyBuilder[key].required && bodyValue[key] === undefined) {
          throw Error(` body '${key}' is required but not setted in request.`);
        } else if (bodyValue[key]) {
          if (typeof bodyBuilder[key].format === "function") {
            bodyValue[key] = bodyBuilder[key].format(bodyValue[key]);
          }
          const validated = bodyBuilder[key].validators
            ? bodyBuilder[key].validators.some(
                (func: any) => func(bodyValue[key]) === true
              )
            : true;
          if (!validated) {
            throw Error(
              ` body '${key}' is not valid. Required: ${bodyBuilder[
                key
              ].validators.join(", ")}`
            );
          }
        }
      }
    }
  }
  //If scriptural forced path
  else {
    finalPath = forcedPath;
  }

  return requestBuilder(api, method, finalPath, bodyValue, config);
}

function requestBuilder(
  api: AxiosInstance,
  method: METHOD,
  pathValue: any,
  bodyValue: Record<string, any>,
  config: AxiosRequestConfig = {}
): RequestBuilderReturn {
  if (config.headers) {
    config.headers = {
      ...api.defaults.headers.common,
      ...api.defaults.headers[method],
      ...config.headers,
    };
  }
  // console.log('useRequest CONFIG',config);
  return {
    method: method,
    path: pathValue,
    body: JSON.stringify(bodyValue),
    exec: [METHOD.GET, METHOD.DELETE].includes(method)
      ? () => api[method.toLowerCase() as "get" | "delete"](pathValue, config)
      : () =>
          api[method.toLowerCase() as "post" | "put" | "patch"](
            pathValue,
            bodyValue,
            config
          ),
  };
}
