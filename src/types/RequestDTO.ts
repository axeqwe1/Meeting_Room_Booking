import { User } from "./user";

export interface LoginRequest {
    username:string
    password:string
    rememberMe:boolean
}