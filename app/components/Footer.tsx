export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-16 px-6 text-slate-700">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-slate-950">High Dreams Earning Hub</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
              Your gateway to verified online earning opportunities with premium support and streamlined onboarding.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Quick Links</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li><a href="#platforms" className="transition hover:text-slate-900">Platforms</a></li>
              <li><a href="#features" className="transition hover:text-slate-900">Why Us</a></li>
              <li><a href="#testimonials" className="transition hover:text-slate-900">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Legal</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li><a href="#" className="transition hover:text-slate-900">Privacy Policy</a></li>
              <li><a href="#" className="transition hover:text-slate-900">Terms of Service</a></li>
              <li><a href="#" className="transition hover:text-slate-900">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-sm text-slate-500">
          <p className="mb-4">
            <strong>Disclaimer:</strong> We do not own or operate these platforms. We only provide access, guidance, and verified links to trusted earning websites.
          </p>
          <p className="text-center">
            Project by Arsh Group of Companies | © 2026 High Dreams Earning Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
