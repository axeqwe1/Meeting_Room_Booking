// src/lib/api/rfid.ts
import { useAlert } from '../context/AlertContext';
import { CreateBookingRequest, CreateRoomRequest, LoginRequest, UpdateBookingRequest, UpdateRoomRequest } from '../types/RequestDTO';
import { LoginResponse } from '../types/ResponseDTO';
import { apiService } from './axios/axios';

export const GetAllBooking = async (): Promise<any | undefined> => {
    try{
        const res = await apiService.get('/Booking/GetAll')
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

export const GetBookingId = async (id:number): Promise<any | undefined> => {
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

export const CreateBooking = async (data:CreateBookingRequest): Promise<any | undefined> => {
    try{
        const res = await apiService.post('/Booking/CreateBooking',data)
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

export const UpdateBooking = async (data:UpdateBookingRequest): Promise<any | undefined> => {
    try{
        const res = await apiService.put('/Booking/UpdateBooking', data)
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

export const DeleteBooking = async (id:number):Promise<any> => {
    try{
        const res = await apiService._delete('/Booking/DeleteBooking/' + id)
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