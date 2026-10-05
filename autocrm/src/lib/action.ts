export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export const DEMO_MODE_ERROR = "Modo demonstração: configure o Supabase (.env.local) para salvar alterações.";

export function zodFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = i.path.map(String).join(".");
    if (k && !out[k]) out[k] = i.message;
  }
  return out;
}

/** Traduz erros comuns do Postgres/Supabase para mensagens amigáveis. */
export function friendlyDbError(error: { code?: string; message: string }): string {
  if (error.code === "23505") return "Já existe um registro com esses dados.";
  if (error.code === "42501") return error.message.includes("Apenas") ? error.message : "Você não tem permissão para esta ação.";
  if (error.code === "23514") return error.message;
  return "Não foi possível salvar. Tente novamente.";
}
