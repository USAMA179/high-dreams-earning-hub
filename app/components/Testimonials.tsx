'use client';

const testimonials = [
  {
    initials: 'AS',
    name: 'Ahsan Shah',
    location: 'Lahore',
    text: 'This platform made it easy for me to discover real earning opportunities, and the onboarding felt professional from day one.',
  },
  {
    initials: 'NR',
    name: 'Nadia Rehman',
    location: 'Karachi',
    text: 'I was skeptical at first, but the clarity and support here helped me complete my first verified task within hours.',
  },
  {
    initials: 'ZK',
    name: 'Zeeshan Khan',
    location: 'Islamabad',
    text: 'The dashboard is clean and fast. I liked how simple it was to find which earning platforms actually matched my schedule.',
  },
  {
    initials: 'MN',
    name: 'Mahnoor Niazi',
    location: 'Rawalpindi',
    text: 'I appreciated the step-by-step approach. Everything was explained clearly so I could start earning without confusion.',
  },
  {
    initials: 'BB',
    name: 'Bilal Butt',
    location: 'Multan',
    text: 'Support answered my questions quickly and the resources were up-to-date. It felt like a polished service, not a guesswork site.',
  },
  {
    initials: 'SN',
    name: 'Sobia Nazir',
    location: 'Faisalabad',
    text: 'The experience was smooth, and I felt confident using the recommended platforms because everything was already vetted.',
  },
  {
    initials: 'HA',
    name: 'Hamza Ali',
    location: 'Sialkot',
    text: 'I enjoyed the premium feel of the interface. It kept me focused and helped me manage my earning options clearly.',
  },
  {
    initials: 'FA',
    name: 'Farah Azam',
    location: 'Gujranwala',
    text: 'The setup was fast and the instructions were straightforward. It saved me time compared to other earning services I tried.',
  },
  {
    initials: 'PT',
    name: 'Pervaiz Tariq',
    location: 'Peshawar',
    text: 'I liked that the platform focused on real opportunities instead of flashy promises. The verification process was simple too.',
  },
  {
    initials: 'MY',
    name: 'Mariam Yousaf',
    location: 'Hyderabad',
    text: 'Adding the referral code was easy, and I felt the service was responsive and professional the whole way through.',
  },
  {
    initials: 'BM',
    name: 'Bilquis Mir',
    location: 'Bahawalpur',
    text: 'The dashboard gives me the confidence to keep tracking my progress. I especially liked the clear member guidance.',
  },
  {
    initials: 'SD',
    name: 'Saad Durrani',
    location: 'Sargodha',
    text: 'The platform delivered exactly what it promised. I have a better understanding of how to earn online and where to start.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-white py-24">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-100 to-transparent" />
      <div className="mx-auto relative max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Member stories</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            What real members are saying
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Discover authentic feedback from people across Pakistan who used High Dreams Earning Hub to begin their online earning journey.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_-35px_rgba(15,23,42,0.25)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-600 text-lg font-semibold text-white shadow-lg shadow-sky-200/40">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-950">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.location}</p>
                </div>
              </div>
              <p className="mt-6 text-slate-600 leading-7">“{testimonial.text}”</p>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
                <span className="text-emerald-600">●</span>
                Verified Member
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 shadow-sm shadow-slate-200/40">
          <p className="font-semibold text-slate-900">Disclaimer:</p>
          <p className="mt-2">
            These screenshots are examples from third-party earning platforms and do not represent guaranteed earnings on High Dreams Earning Hub. We do not own or operate these platforms. Platform availability and features may change over time.
          </p>
        </div>
      </div>
    </section>
  );
}
