"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import WhatsAppIcon from "./ui/WhatsAppIcon";
import { whatsappLink } from "@/config/site";

export default function WhatsAppFloat() {
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setShow(v > 0.3));

  // Esconde o botão enquanto o formulário está na tela, para não cobrir os botões dele
  useEffect(() => {
    const el = document.getElementById("diagnostico");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && !formVisible && (
        <motion.a
          href={whatsappLink("Olá, BuildScale! Quero saber mais sobre o diagnóstico gratuito.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a BuildScale no WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)] md:bottom-8 md:right-8 md:h-16 md:w-16"
        >
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s]" />
          <WhatsAppIcon className="relative h-7 w-7 md:h-8 md:w-8" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
