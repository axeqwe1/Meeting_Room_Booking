import { createContext, useState,useContext, ReactNode } from "react";
import {User} from "../types/user"
interface AuthContextType  {
    user: User | null;
    setUser: (user:User) => void
    login: (userData:User) => void
    logout: () => void
    isAuthenticate: () => boolean;  // ✅ แก้ตรงนี้
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error('useAuth must be used within a NavProvider')
    }
    return context
}
interface AuthProviderProps{
    children: ReactNode
}
export const AuthProvider : React.FC<AuthProviderProps> = ({children}) => {
    const [user,setUser] = useState<User | null>(null)

    const login = (userData:User) => {
        // ควรเก็บ token ใน localStorage หรือ cookies ด้วย
        localStorage.setItem('token', userData.token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const isAuthenticate = () => {
        return !!localStorage.getItem('token');
    }

    return (
        <AuthContext.Provider value={{user,setUser,login,logout,isAuthenticate}}>
            {children}
        </AuthContext.Provider>
    )
}