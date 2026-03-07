import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3.5 sm:space-y-4", align === "center" && "text-center")}>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted sm:text-xs">
        {eyebrow}
      </p>
      <div className="space-y-2.5 sm:space-y-3">
        <h2
          className={cn(
            "text-balance text-[clamp(1.9rem,7vw,3rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-text sm:text-4xl",
            align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "text-pretty text-[0.98rem] leading-7 text-muted sm:text-lg sm:leading-8",
              align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
