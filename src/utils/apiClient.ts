import axios, { AxiosInstance } from "axios";

import { AUTH_STORAGE_KEY } from "@spt/store/authStore";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  env: {
    // The FormData class to be used to automatically serialize the payload into a FormData object
    FormData: globalThis?.FormData,
  },
});


api.interceptors.request.use(
  function (config) {
    let token = "";

    if (typeof window !== "undefined") {
      if (typeof (config?.headers as any).authorization === "undefined") {
        const tokenModel = JSON.parse(
          localStorage.getItem(AUTH_STORAGE_KEY) || "{}"
        );

        if (tokenModel?.state?.token) {
          token = tokenModel?.state?.token;
        }
      }
    }
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...config.headers,
    } as any;

    return config;
  },
  function (error: any) {
    if (getOnlineStatus() === "offline") {
      error = {
        message:
          "You are currently offline. Kindly turn on your network or try again",
      };
      return Promise.reject(error);
    }
  }
);
api.interceptors.response.use(null, function (error) {
  // if (error?.response?.status === 401 || error?.response?.status === 403) {
  //   console.log('token')
  // }

  return Promise.reject(error);
});

function getOnlineStatus() {
  return navigator.onLine ? "online" : "offline";
}

if (typeof window !== "undefined") {
  window.addEventListener("offline", getOnlineStatus);
  window.addEventListener("online", getOnlineStatus);
}

export default api;