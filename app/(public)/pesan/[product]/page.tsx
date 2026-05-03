import PesanClient from "./PesanClient";

export default function PesanPage() {
  return (
    <main className="min-h-screen bg-base-200 py-10 px-4 md:px-12">
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">
          Checkout <span className="text-primary">Pemesanan</span>
        </h1>
        <div className="h-1 w-12 bg-primary rounded-full mt-1"></div>
      </div>
      
      {/* Komponen Client yang akan menangani pengambilan data storage */}
      <PesanClient />
    </main>
  );
}