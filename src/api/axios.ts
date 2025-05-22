import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL){
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env')
}

const Axios = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Content-Type': 'application/json'
    }
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


export const apiService = {
    get,
    post,
    put,
    patch,
    _delete,
    mediaUpload,
    request
}