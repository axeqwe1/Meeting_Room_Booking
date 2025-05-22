import { User } from "./user";

interface LoginResponse {
  user: User;
  token: string;
}