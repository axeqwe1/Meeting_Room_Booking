// src/lib/api/rfid.ts
import { LoginRequest } from '../types/RequestDTO';
import { LoginResponse } from '../types/ResponseDTO';
import { apiService } from './axios/axios';

export const SignIn = async (data:LoginRequest): Promise<any | undefined> => {
    try{
        const res = await apiService.post('/Auth/signin',data)
        console.log(res)
        return res
    }catch(ex:any){
                // ถ้าเป็น 401 ไม่ต้อง log
        if (ex.response && ex.response.status === 401) {
            // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        // error อื่น log ปกติ
        console.error(ex)
    }
}

export const SignOut = async () => {
    try{
        await apiService.post('/Auth/logout')
    }
    catch(ex:any){
                // ถ้าเป็น 401 ไม่ต้อง log
        if (ex.response && ex.response.status === 401) {
            // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        // error อื่น log ปกติ
        console.error(ex)
    }
}

export const Me = async ():Promise<any> => {
    try {
        const res = await apiService.get('/Auth/me')
        return res
    } catch (ex: any) {
        // ถ้าเป็น 401 ไม่ต้อง log
        if (ex.response && ex.response.status === 401) {
            // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        // error อื่น log ปกติ
        console.error(ex)
    }
}

export const refreshToken = async ():Promise<any> => {
    try{
        const res = await apiService.post('/Auth/refresh')
        return res
    } catch (ex: any) {
        // ถ้าเป็น 401 ไม่ต้อง log
        if (ex.response && ex.response.status === 401) {
            // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        // error อื่น log ปกติ
        // console.error(ex)
    }
}