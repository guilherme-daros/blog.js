export default function Metrics() {
  return (
    <section className="border-y border-border bg-panel/30 py-4 px-6 overflow-x-auto scrollbar-hide hidden md:block">
      <div className="max-w-[80rem] mx-auto flex justify-between gap-8 min-w-[700px]">
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-muted-foreground uppercase tracking-[1px]">IBOV</div>
          <div className="text-white font-medium flex items-baseline gap-1">
            131,902 <span className="text-[10px] text-muted-foreground">pts</span>
          </div>
          <div className="text-[#16a34a] font-medium">+1.42%</div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-muted-foreground uppercase tracking-[1px]">USD/BRL</div>
          <div className="text-white font-medium flex items-baseline gap-1">5.6412</div>
          <div className="text-destructive font-medium">-0.38%</div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-muted-foreground uppercase tracking-[1px]">SELIC</div>
          <div className="text-white font-medium flex items-baseline gap-1">
            14.25 <span className="text-[10px] text-muted-foreground">% a.a.</span>
          </div>
          <div className="text-[#16a34a] font-medium">+0.50pp</div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-muted-foreground uppercase tracking-[1px]">IPCA 12M</div>
          <div className="text-white font-medium flex items-baseline gap-1">
            5.48 <span className="text-[10px] text-muted-foreground">%</span>
          </div>
          <div className="text-destructive font-medium">-0.12pp</div>
        </div>
      </div>
    </section>
  );
}
