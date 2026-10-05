import type { Role } from "@/config/nav";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
};
