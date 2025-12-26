export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
}
