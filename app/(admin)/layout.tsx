import Sidebar from "@/components/layouts/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-base-200">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-base-100/50 backdrop-blur-md border-b border-base-content/5 flex items-center justify-end px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="badge badge-success gap-2 font-bold p-3 text-[10px] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Server ERP Online
             </div>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}