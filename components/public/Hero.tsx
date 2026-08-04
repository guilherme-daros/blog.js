import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="pt-[152px] px-6 pb-20 max-w-[80rem] mx-auto text-center max-[820px]:pt-[120px] max-[820px]:pb-[60px]">
      <div className="inline-block font-mono text-xs tracking-[1.92px] uppercase text-primary border border-primary rounded-[var(--radius)] py-[6px] px-4 mb-8">
        // Market Intelligence
      </div>
      <h1 className="text-[60px] font-normal leading-[60px] tracking-[-2.88px] text-neutral-950 dark:text-white mb-6 max-[820px]:text-[40px] max-[820px]:leading-[44px] max-[820px]:tracking-[-1.5px]">
        Insights for the modern investor
      </h1>
      <p className="text-lg leading-[28px] text-muted-foreground max-w-[600px] mx-auto mb-10 max-[820px]:text-base max-[820px]:leading-6">
        Deep technical analysis, market commentary, and portfolio strategy &mdash;
        built for those who treat investing as a craft.
      </p>
      <div className="inline-flex gap-4 max-[820px]:flex-col max-[820px]:w-full max-[820px]:max-w-[320px] max-[820px]:mx-auto">
        <Button href="#posts">
          Read latest
        </Button>
        <Button href="#newsletter" variant="outline">
          Subscribe
        </Button>
      </div>
    </section>
  );
}
