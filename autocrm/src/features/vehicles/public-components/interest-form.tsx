"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { submitPublicLeadAction } from "@/features/leads/public-actions";
import { readUtm, type Utm } from "@/features/leads/utm";
import { useTenant } from "@/features/tenants/tenant-provider";
import { waLink } from "@/features/whatsapp/lib";

/** "Tenho interesse": vira lead no CRM (dedup por telefone, rodízio entre vendedores). */
export function InterestForm({ vehicleId, vehicleName, compact }: { vehicleId: string; vehicleName: string; compact?: boolean }) {
  const tenant = useTenant();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();
  const utm = useRef<Utm>({});
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    utm.current = readUtm(window.location.search);
  }, []);

  if (done) {
    const storeLink = waLink(tenant.whatsapp, `Olá! Acabei de pedir informações sobre o ${vehicleName}. ${window.location.href.split("?")[0]}`);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-2 text-center">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.05 }}>
          <CheckCircle2 className="size-10 text-success" />
        </motion.span>
        <div>
          <p className="font-semibold">Recebemos seu interesse!</p>
          <p className="mt-1 text-sm text-muted-foreground">Um consultor da {tenant.name} vai te chamar no WhatsApp em instantes.</p>
        </div>
        {tenant.whatsapp && (
          <Button asChild variant="whatsapp" size="lg" className="w-full">
            <a href={storeLink} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Falar agora no WhatsApp
            </a>
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const res = await submitPublicLeadAction({
            name,
            phone,
            vehicleId,
            utm: utm.current,
            website: honeypot.current?.value,
          });
          if (!res.ok) return setError(res.error);
          setDone(true);
        });
      }}
      className="flex flex-col gap-3"
    >
      {!compact && <p className="text-sm font-semibold">Gostou? Receba as condições no seu WhatsApp</p>}
      <Field label="Seu nome" htmlFor="if-name">
        <Input id="if-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required minLength={2} />
      </Field>
      <Field label="WhatsApp" htmlFor="if-phone">
        <PhoneInput id="if-phone" value={phone} onChange={setPhone} required />
      </Field>
      {/* honeypot: invisível para pessoas */}
      <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] size-px opacity-0" aria-hidden />
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} role="alert" className="text-[13px] text-danger">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending && <Loader2 className="animate-spin" />} Tenho interesse
      </Button>
      <p className="text-center text-[11px] text-subtle-foreground">Seus dados são usados só para o atendimento da {tenant.name}.</p>
    </form>
  );
}
