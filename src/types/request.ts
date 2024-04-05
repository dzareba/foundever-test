import axios, { AxiosRequestConfig } from "axios";
import { TMovieData } from "./movies";

export type QueryParam = {
  required: boolean;
  default?: any;
};

export type RequestQuery = {
  [key: string]: QueryParam;
};

export type RequestObject = {
  api: typeof axios;
  method: METHOD;
  path: string;
  query: RequestQuery;
};

export type QueryType = {
  query: {
    with_genres: string | null;
    page: number;
  };
};

export type ApiResponse = {
  status: string;
  isSuccess: boolean;
  data: TMovieData[];
};

export type ApiError = {
  status: string;
  isSuccess: boolean;
};

export type ResponseParams = {
  method: string;
  path: string;
  exec: () => Promise<HttpRequestResponse>;
};

export type HttpRequestResponse = {
  status?: number;
  data?: TMovieData[];
  errors?: string;
  isSuccess: boolean;
};

export type ApiConfig = {
  api: typeof axios;
  method: METHOD;
  path: string;
  params?: Record<string, ParamConfig>;
  query?: Record<string, any>;
  body?: any;
  config?: AxiosRequestConfig;
};

export type RequestOverrides = {
  api?: typeof axios;
  path?: string | null;
  params?: Record<string, ParamConfig>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  config?: AxiosRequestConfig;
};

export type RequestBuilderReturn = {
  method: METHOD;
  path: string;
  body: string;
  exec: () => Promise<any>;
};

export type ParamConfig = {
  required?: boolean;
  default?: any;
  format: (value: any) => any;
  validators: Array<(value: any) => boolean>;
};

export enum METHOD {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}
