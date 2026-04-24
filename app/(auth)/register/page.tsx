import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RegisterForm from "@/components/shared/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <Link 
        href="/" 
        className="absolute top-6 left-6 btn btn-ghost btn-sm gap-2 uppercase font-black text-[10px] opacity-50 hover:opacity-100"
      >
        <ArrowLeft size={16} /> Kembali
      </Link>

      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/5 rounded-[2.5rem] overflow-hidden">
        <div className="card-body p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">
              BIKIN <span className="text-base-content">CETAK</span>
            </h1>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] mt-1">Gabung Bikin Cetak Sekarang</p>
          </div>

          <RegisterForm />

          <p className="mt-10 text-center text-[11px] font-medium opacity-50">
            Sudah punya akun?
            <Link href="/login" className="text-primary font-black link-hover uppercase ml-1 tracking-wider">
              Masuk Disini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}