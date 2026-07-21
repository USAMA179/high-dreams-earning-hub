import Link from "next/link";

export default function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Why choose us</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Premium tools for earning without the noise
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We provide everything you need to start earning online successfully with a polished, easy-to-follow experience.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                { icon: '✓', title: '12+ Verified Platforms', desc: 'Access curated earning websites that actually pay' },
                { icon: '✓', title: 'Trusted & Verified', desc: 'Every platform is tested and verified by our team' },
                { icon: '✓', title: 'Instant Access', desc: 'Get started immediately after verification' },
                { icon: '✓', title: 'Real Earning', desc: 'Start earning from day one with proven methods' },
              ].map((feature, idx) => (
                <div key={idx} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-600 text-white text-xl shadow-sm shadow-indigo-200/40">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-slate-900 p-10 text-white shadow-2xl shadow-indigo-200/20">
            <div className="text-sm uppercase tracking-[0.35em] text-indigo-200">One-time access</div>
            <div className="mt-6 text-5xl font-semibold tracking-tight">$19.99</div>
            <div className="mt-2 text-lg text-indigo-200">USD only</div>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              Pay once, access forever. No recurring fees, no hidden charges.
            </p>

            <ul className="mt-8 space-y-4 text-sm leading-7 text-slate-200">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-xl">✓</span>
                Access to 12+ verified earning platforms
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-xl">✓</span>
                Step-by-step guidance for each platform
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-xl">✓</span>
                Exclusive referral links with bonus earnings
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-xl">✓</span>
                Priority support from our team
              </li>
            </ul>

            <Link href="/signup" className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/10 transition hover:bg-slate-100">
              Unlock Access Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
