import Link from "next/link";
import { LogIn, Mail, Lock, ArrowLeft } from "lucide-react";
import AuthInput from "@/components/ui/AuthInput";

export default function Login() {
  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <Link 
        href="/" 
        className="absolute top-6 left-6 btn btn-ghost btn-sm gap-2 uppercase font-bold text-[10px] opacity-70"
      >
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>

      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-content/5 rounded-[2.5rem] overflow-hidden">
        <div className="card-body p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-primary tracking-tighter uppercase">
              BIKIN <span className="text-base-content">CETAK</span>
            </h1>
            <div className="h-1 w-10 bg-primary mx-auto rounded-full mt-1"></div>
          </div>

          <form className="space-y-5">
            <AuthInput
              label="Alamat Email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              icon={<Mail size={18} />}
            />

            <AuthInput
              label="Kata Sandi"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              rightLabel={
                <Link href="#" className="text-primary font-bold text-[10px] uppercase hover:underline">
                  Lupa?
                </Link>
              }
            />

            <button type="submit" className="btn btn-primary w-full rounded-2xl shadow-lg shadow-primary/30 uppercase font-black tracking-widest mt-4">
              Masuk Akun
              <LogIn size={18} className="ml-2" />
            </button>
          </form>

          <div className="flex flex-col gap-3">
            <button className="btn bg-white text-black rounded-2xl border-[#e5e5e5]">
							<svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
							Sign In with Google
						</button>
          </div>

          <p className="mt-10 text-center text-[11px] font-medium opacity-50">
            Belum punya akun Bikin Cetak?{" "}
            <Link href="/register" className="text-primary font-black link-hover uppercase ml-1">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}