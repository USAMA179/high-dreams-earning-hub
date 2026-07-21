import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-slate-900 to-sky-700 py-24 text-white">
      <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_55%)]" />
      <div className="mx-auto relative max-w-7xl px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">Ready to start</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Join the High Dreams community and start earning smarter.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
                Hundreds of users are already earning through our verified platforms. Don’t miss out on this opportunity.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-end">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-white/20 transition hover:bg-slate-100">
                Start Earning Today
              </Link>
              <button className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
