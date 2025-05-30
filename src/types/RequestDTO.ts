import { User } from "./user";

export interface LoginRequest {
    username:string
    password:string
    rememberMe:boolean
}

export interface CreateRoomRequest {
    roomname:string,
    capacity:number,
    location:string,
    factory:string,
    imageUrl:string,
    amentities:string[]
}

export interface UpdateRoomRequest {
    roomid:number,
    roomname:string,
    capacity:number,
    location:string,
    factory:string,
    imageUrl:string,
    amentities:string[]
}

export interface CreateBookingRequest {
    roomId:number,
    user_id:string,
    title:string,
    descripsion:string,
    start_date:Date,
    end_date:Date,
    attendees:string[]
}

export interface UpdateBookingRequest {
    bookingId:number,
    roomId:number,
    user_id:string,
    title:string,
    descripsion:string,
    start_date:Date,
    end_date:Date,
    attendees:string[]
}