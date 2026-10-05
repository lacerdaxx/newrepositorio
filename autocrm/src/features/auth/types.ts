import type { AppRole } from "@/types/database";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  tenantId: string | null;
  avatarUrl: string | null;
  active: boolean;
};
