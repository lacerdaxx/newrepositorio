import Tag from "./Tag";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

export default function SectionHeading({ tag, title, subtitle, className }: { tag: string; title: React.ReactNode; subtitle?: React.ReactNode; className?: string }) {
  return (
    <Reveal className={cn("mx-auto max-w-3xl text-center", className)}>
      <Tag>{tag}</Tag>
      <h2 className="h-section mt-5 text-balance">{title}</h2>
      {subtitle && <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
