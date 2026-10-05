import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";

async function signOut(request: NextRequest) {
  if (isSupabaseConfigured) {
    const supabase = await getSupabaseServer();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
}

export const GET = signOut;
export const POST = signOut;
