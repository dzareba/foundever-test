import axios from "axios";

export type QueryParam = {
  required: boolean;
  default?: any;
};

export type RequestQuery = {
  [key: string]: QueryParam;
};

export type RequestObject = {
  api: typeof axios;
  method: "GET" | "POST" | "PUT" | "DELETE";
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
};

export type ResponseParams = {
  method: string;
  path: string;
  exec: () => Promise<HttpRequestResponse>;
};

export type HttpRequestResponse = {
  status?: number;
  data?: any;
  errors?: any;
};
