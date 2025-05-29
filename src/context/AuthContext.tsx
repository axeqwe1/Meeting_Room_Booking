import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "../types/user";
import { useNavigate } from "react-router-dom";
import { Me, SignIn, SignOut } from "../api/Auth";
import { LoginRequest } from "../types/RequestDTO";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (data: LoginRequest) => Promise<boolean>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean; // เพิ่มบรรทัดนี้

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // โหลดข้อมูล user จาก /me ตอน mount (หรือ refresh)
    useEffect(() => {
        // ตัวอย่างใน useEffect หรือฟังก์ชันที่เรียก Me
        const fetchMe = async () => {
            try {
                const res = await Me();
                if (res && res.data) {
                setUser(res.data);
                } else {
                setUser(null);
                }
            } catch (err: any) {
                // ตรวจสอบว่าเป็น 401 หรือไม่ ถ้าใช่ ไม่ต้อง console.error
                if (err.response && err.response.status === 401) {
                setUser(null);
                // ไม่ต้อง log error ออก console
                } else {
                // เหตุอื่นๆ log ได้
                console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    // login: เรียก API signin และโหลด user ใหม่
    const login = async (data: LoginRequest): Promise<boolean> => {
        try {
            const response = await SignIn(data);
            if (response?.status === 200) {
                // หลัง login แล้วโหลด user อีกรอบ
                const profile = await Me();
                if (profile && profile.data) {
                    setUser(profile.data);
                }
                return true;
            } else {
                setUser(null);
                return false;
            }
        } catch {
            setUser(null);
            return false;
        }
    };

    // logout: เรียก API logout และ clear user
    const logout = async () => {
        await SignOut();
        setUser(null);
    };

    // isAuthenticated: user != null และไม่กำลังโหลด
    const isAuthenticated = !!user && !loading;

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated,loading }}>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                <div className="loading loading-spinner loading-lg"></div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};