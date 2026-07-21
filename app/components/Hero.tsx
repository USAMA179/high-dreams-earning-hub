import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute left-[-8%] top-0 h-72 w-72 rounded-full bg-indigo-100/80 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-sky-100/80 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm shadow-emerald-100/80">
              Trusted hub for verified earning opportunities
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Your Gateway to Online Earning
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Get exclusive access to 12+ verified earning platforms with step-by-step guidance and priority support. Start your earning journey today.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800">
                Start Earning Today
              </Link>
              <Link href="#platforms" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                View Demo
              </Link>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
                <p className="text-3xl font-semibold text-indigo-600">500+</p>
                <p className="mt-3 text-sm text-slate-600">Active Members</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
                <p className="text-3xl font-semibold text-indigo-600">12+</p>
                <p className="mt-3 text-sm text-slate-600">Verified Platforms</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
                <p className="text-3xl font-semibold text-indigo-600">Trusted</p>
                <p className="mt-3 text-sm text-slate-600">&amp; Verified</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-2xl shadow-slate-200/60">
              <div className="mb-6 flex items-center justify-between rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-lg">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Verified Dashboard</p>
                  <p className="mt-2 text-xl font-semibold">Premium platform access</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold text-white">Live</div>
              </div>
              <div className="grid gap-4">
                {[
                  { label: 'Quality onboarding', value: 'Step-by-step guidance' },
                  { label: 'Fast support', value: 'Help when you need it' },
                  { label: 'Lifetime access', value: 'Pay once, get forever' },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
