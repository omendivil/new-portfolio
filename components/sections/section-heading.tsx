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
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
        {eyebrow}
      </p>
      <div className="space-y-2">
        <h2
          className={cn(
            "text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl",
            align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "text-base leading-7 text-muted sm:text-lg",
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
