import React from 'react';
import {
  Plane,
  Globe,
  ChevronDown,
  Mail,
  Lock,
  EyeOff,
  Sparkles,
  BriefcaseBusiness,
  BarChart3,
  ArrowRight,
  Star,
} from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <section className="relative bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 p-6 text-white sm:p-10">
          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30">
              <Plane size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TripCraft</h1>
              <p className="text-sm text-cyan-100">Travel Package Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Create Exceptional
              <br />
              Travel <span className="text-amber-200">Experiences</span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-cyan-50 sm:text-base">
              AI-powered tools to help travel businesses
              <br />
              build, manage and grow with ease.
            </p>
          </div>

          <div className="space-y-4">
            <article className="flex items-start gap-3 rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
              <div className="mt-0.5 rounded-lg bg-violet-500/80 p-2">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-semibold">AI-Powered Creation</h3>
                <p className="text-sm text-cyan-100">Generate itineraries, descriptions and content in seconds.</p>
              </div>
            </article>

            <article className="flex items-start gap-3 rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
              <div className="mt-0.5 rounded-lg bg-sky-500/80 p-2">
                <BriefcaseBusiness size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Smart Management</h3>
                <p className="text-sm text-cyan-100">Organize packages, bookings and clients effortlessly.</p>
              </div>
            </article>

            <article className="flex items-start gap-3 rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
              <div className="mt-0.5 rounded-lg bg-emerald-500/80 p-2">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Grow Your Business</h3>
                <p className="text-sm text-cyan-100">Insights and analytics to scale your travel business.</p>
              </div>
            </article>
          </div>

          <div className="mt-8 rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
            <p className="text-sm text-cyan-50">Trusted by travel businesses worldwide</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="flex items-center -space-x-2">
                <span className="h-8 w-8 rounded-full border-2 border-white bg-cyan-200" />
                <span className="h-8 w-8 rounded-full border-2 border-white bg-sky-200" />
                <span className="h-8 w-8 rounded-full border-2 border-white bg-blue-200" />
                <span className="h-8 w-8 rounded-full border-2 border-white bg-indigo-200" />
                <strong className="pl-3 text-sm font-semibold">+2K</strong>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <Star size={16} fill="currentColor" className="text-amber-300" />
                <div>
                  <h4 className="text-sm font-semibold text-white">4.8/5</h4>
                  <small className="text-cyan-100">from 1,250+ reviews</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 sm:p-10">
          <button className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50" type="button">
            <Globe size={16} /> English <ChevronDown size={14} />
          </button>

          <div className="mx-auto mt-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back <span role="img" aria-label="wave">👋</span>
            </h2>
            <p className="mt-2 text-sm text-slate-500">Login to your TripCraft account</p>

            <label className="mt-6 block text-sm font-medium text-slate-700">Email address</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-200">
              <Mail size={18} className="text-slate-400" />
              <input className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none" type="email" placeholder="Enter your email" />
            </div>

            <div className="mt-5 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <a className="text-sm font-medium text-cyan-700 hover:text-cyan-800" href="#">Forgot password?</a>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-200">
              <Lock size={18} className="text-slate-400" />
              <input className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none" type="password" placeholder="Enter your password" />
              <EyeOff size={18} className="text-slate-400" />
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <input className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700" type="button">
              <ArrowRight size={18} /> Login to Dashboard
            </button>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <p className="text-xs uppercase tracking-wide text-slate-400">or continue with</p>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50" type="button">G Continue with Google</button>
            <button className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50" type="button">M Continue with Microsoft</button>
            <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50" type="button">A Continue with Apple</button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account? <a className="font-semibold text-cyan-700 hover:text-cyan-800" href="#">Sign up now</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
