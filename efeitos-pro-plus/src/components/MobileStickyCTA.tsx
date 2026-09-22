import { ArrowRight } from "lucide-react";
import { PURCHASE_URL } from "../config";

export default function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 p-3 backdrop-blur-lg lg:hidden">
      <a href={PURCHASE_URL} className="btn-primary w-full !py-3.5">
        Quero o Efeitos PRO+
        <ArrowRight size={16} />
      </a>
    </div>
  );
}
