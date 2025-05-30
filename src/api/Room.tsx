// src/lib/api/rfid.ts
import { useAlert } from '../context/AlertContext';
import { CreateRoomRequest, LoginRequest, UpdateRoomRequest } from '../types/RequestDTO';
import { LoginResponse } from '../types/ResponseDTO';
import { apiService } from './axios/axios';

export const GetAllRoom = async (): Promise<any | undefined> => {
    try{
        const res = await apiService.get('/Room/GetAll')
        return res
    }
    catch(ex:any){
        // ถ้าเป็น 401 ไม่ต้อง log
        if (ex.response && ex.response.status === 401) {
        // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        // error อื่น log ปกติ
        console.error(ex)
        return ex
    }
}

export const GetRoomId = async (id:number): Promise<any | undefined> => {
    try{
        const res =  await apiService.get('/Booking/GetById/' + id)
        return res
    }
    catch(ex:any){
                // ถ้าเป็น 401 ไม่ต้อง log
        if (ex.response && ex.response.status === 401) {
            // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        // error อื่น log ปกติ
        console.error(ex)
        return ex.status
    }
}

export const CreateRoom = async (data:CreateRoomRequest): Promise<any | undefined> => {
    try{
        const res = await apiService.post('/Room/CreateRoom',data)
        return res
    }
    catch(ex:any){
        if (ex.response && ex.response.status === 401) {
            // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        console.error(ex)
        return ex.status
    }
}

export const UpdateRoom = async (data:UpdateRoomRequest): Promise<any | undefined> => {
    try{
        const res = await apiService.put('/Room/UpdateRoom',data)
        return res
    }
    catch(ex:any){
        if (ex.response && ex.response.status === 401) {
            // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        console.error(ex)
        return ex.status
    }
}

export const DeleteRoom = async (id:number):Promise<any> => {
    try{
        const res = await apiService._delete('/Room/DeleteRoom/' + id)
        return res
    }
    catch(ex:any)
    {
        if (ex.response && ex.response.status === 401) {
            // อาจคืนค่า null หรือ undefined ก็ได้
            return null
        }
        console.error(ex)
        return ex
    }
}