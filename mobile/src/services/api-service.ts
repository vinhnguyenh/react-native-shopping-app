import axios, { AxiosError, AxiosResponse } from 'axios';

import { env } from '../config/env';
import { ProductsResponse } from '../models/product';

const normalizedBaseUrl = env.apiUrl.replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

type ForbiddenHandler = () => Promise<void> | void;

let onForbidden: ForbiddenHandler | null = null;

const isForbiddenError = (error: AxiosError): boolean =>
  error.response?.status === 403;

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (isForbiddenError(error) && onForbidden) {
      await onForbidden();
    }

    return Promise.reject(error);
  },
);

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username: string;
  role?: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginResponse {
  status: boolean;
  data: {
    user: IUserResponse;
    token: string;
  };
}

export const apiService = {
  baseUrl: normalizedBaseUrl,
  client: apiClient,
  setForbiddenHandler: (handler: ForbiddenHandler | null): void => {
    onForbidden = handler;
  },
  fetchData: (): Promise<AxiosResponse> =>
    axios.get('https://jsonplaceholder.typicode.com/photos'),
  login: (payload: ILoginPayload): Promise<AxiosResponse<ILoginResponse>> =>
    apiClient.post<ILoginResponse>('/login', payload),
  getProducts: (): Promise<AxiosResponse<ProductsResponse>> =>
    apiClient.get<ProductsResponse>('/product'),
};
