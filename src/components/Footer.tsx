export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-foreground/5 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-2xl font-extrabold tracking-tighter opacity-20">VITREOUS</div>
        <div className="flex gap-10 font-mono text-[10px] uppercase tracking-widest opacity-40">
          <span>Provenance</span>
          <span>Process</span>
          <span>Legal</span>
        </div>
      </div>
    </footer>
  );
}
