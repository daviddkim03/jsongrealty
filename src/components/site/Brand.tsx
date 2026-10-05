import { cn } from "@/lib/utils"

export function Brand({ className }: { className?: string }) {
  return (
    <a
      href="/"
      className={cn(
        "inline-flex items-baseline gap-2 rounded-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="font-heading text-[1.625rem] leading-none font-medium tracking-tight">
        <span className="italic">JS</span>ong
      </span>{" "}
      <span className="text-[0.65rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
        Realty
      </span>
    </a>
  )
}
