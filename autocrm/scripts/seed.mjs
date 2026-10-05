// Seed inicial: agência (superadmin), loja de exemplo e equipe.
// Uso: node --env-file=.env.local scripts/seed.mjs
// Idempotente: pode rodar mais de uma vez.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (.env.local)");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

const PASSWORD = process.env.SEED_PASSWORD || "autocrm123";
const SUPERADMIN_EMAIL = process.env.SEED_SUPERADMIN_EMAIL || "agencia@autocrm.dev";

async function ensureUser(email, fullName, appMeta) {
  const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
  const existing = list?.users.find((u) => u.email === email);
  if (existing) return existing.id;
  const { data, error } = await db.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    app_metadata: appMeta,
    user_metadata: { full_name: fullName },
  });
  if (error) throw new Error(`${email}: ${error.message}`);
  return data.user.id;
}

async function ensureTenant(t) {
  const { data: found } = await db.from("tenants").select("id").eq("slug", t.slug).maybeSingle();
  if (found) return found.id;
  const { data, error } = await db.from("tenants").insert(t).select("id").single();
  if (error) throw new Error(`${t.slug}: ${error.message}`);
  return data.id;
}

const tenants = [
  {
    name: "ABC Multimarcas",
    slug: "abc-multimarcas",
    primary_color: "#e30613",
    secondary_color: "#0a0a0a",
    whatsapp: "5561999990000",
    team: [
      ["Ricardo Mendes", "gerente@abcmultimarcas.com.br", "gerente"],
      ["Ana Ribeiro", "ana@abcmultimarcas.com.br", "vendedor"],
      ["Pedro Lima", "pedro@abcmultimarcas.com.br", "vendedor"],
      ["Lucas Martins", "lucas@abcmultimarcas.com.br", "vendedor"],
    ],
  },
  {
    name: "Goiânia Motors",
    slug: "goiania-motors",
    primary_color: "#16a34a",
    secondary_color: "#052e16",
    whatsapp: "5562999990000",
    team: [
      ["Juliana Prado", "gerente@goianiamotors.com.br", "gerente"],
      ["Marcos Teixeira", "marcos@goianiamotors.com.br", "vendedor"],
      ["Carla Nunes", "carla@goianiamotors.com.br", "vendedor"],
    ],
  },
];

await ensureUser(SUPERADMIN_EMAIL, "Agência", { role: "superadmin" });
console.log(`✓ superadmin ${SUPERADMIN_EMAIL}`);

for (const { team, ...t } of tenants) {
  const id = await ensureTenant(t);
  for (const [name, email, role] of team) await ensureUser(email, name, { role, tenant_id: id });
  console.log(`✓ ${t.name} (${t.slug}) + ${team.length} usuários`);
}
console.log(`\nSenha de todos os usuários: ${PASSWORD}`);
