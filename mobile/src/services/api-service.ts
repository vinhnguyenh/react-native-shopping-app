import axios, { AxiosResponse } from 'axios';

import { env } from '../config/env';

const normalizedBaseUrl = env.apiUrl.replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

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
  fetchData: (): Promise<AxiosResponse> =>
    axios.get('https://jsonplaceholder.typicode.com/photos'),
  login: (payload: ILoginPayload): Promise<AxiosResponse<ILoginResponse>> =>
    apiClient.post<ILoginResponse>('/login', payload),
};
