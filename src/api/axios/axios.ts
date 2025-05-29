import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import { refreshToken, SignOut } from "../Auth";

const API_BASE_URL = import.meta.env.VITE_API_KEY;

if(!API_BASE_URL){
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env')
}

const Axios = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Content-Type': 'application/json'
    },
    withCredentials: true // ต้องใส่สำหรับ cookie cross-origin
})


const get = (url:string,config:AxiosRequestConfig = {}) : Promise<AxiosResponse> => {
    return Axios({
        method:'get',
        url,
        ...config,
    })
}

const post = (url:string,data = {},config:AxiosRequestConfig = {}) : Promise<AxiosResponse> => {
    return Axios({
        method:'post',
        url,
        data,
        ...config,
    })
}

const put = (url:string,data = {},config:AxiosRequestConfig = {}) : Promise<AxiosResponse> => {
    return Axios({
        method:'put',
        url,
        data,
        ...config,
    })
}

const patch = (url:string,data = {},config:AxiosRequestConfig = {}) : Promise<AxiosResponse> => {
    return Axios({
        method:'patch',
        url,
        data,
        ...config,
    })
}

const _delete = (url:string,data = {},config:AxiosRequestConfig = {}) : Promise<AxiosResponse> => {
    return Axios({
        method:'delete',
        url,
        data,
        ...config,
    })
}

const mediaUpload = (url:string,data = {},config: AxiosRequestConfig = {}) : Promise<AxiosResponse> => {
    return Axios({
        method: 'post',
        url,
        data,
        ...config,
    })
}

const request = (config: AxiosRequestConfig = {}) : Promise<AxiosResponse> => {
    return Axios(config)
}

// --- เพิ่ม interceptor สำหรับ refresh token ---
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

// --- Interceptor สำหรับ Refresh Token ---
Axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // รายชื่อ endpoint ที่ 'ไม่ควร' refresh token
    const ignoreRefresh = ["/auth/login", "/auth/refresh"].some(path =>
      originalRequest.url?.toLowerCase().includes(path)
    );

    // เงื่อนไข: โดน 401, ยังไม่ retry, ไม่ใช่ endpoint พิเศษ
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !ignoreRefresh
    ) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        // ถ้า refresh สำเร็จ ลองยิง request เดิมซ้ำอีก 1 รอบ
        return Axios(originalRequest);
      } catch (err) {
        // ถ้า refresh ไม่สำเร็จ (เช่น refresh token หมดอายุ) ให้ logout
        SignOut();
        return Promise.reject(err);
      }
    }

    // ถ้าโดน 401 ที่ endpoint ห้าม refresh หรือ request ที่ retry แล้ว ยัง 401 → logout ทันที
    if (
      error.response?.status === 401 &&
      (ignoreRefresh || originalRequest._retry)
    ) {
      SignOut();
      return Promise.reject(error);
    }

    // กรณีอื่น ๆ ปล่อย error ตามปกติ
    return Promise.reject(error);
  }
);

export const apiService = {
    get,
    post,
    put,
    patch,
    _delete,
    mediaUpload,
    request,
    Axios
}