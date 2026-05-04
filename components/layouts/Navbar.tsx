/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from 'react';
import { Search, User, LogOut, ShoppingBag } from 'lucide-react';
import SwapTheme from '../ui/SwapTheme';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ItemData } from "@/services/itemService";
import { slugify } from "@/lib/utils";

interface NavbarProps {
  items: ItemData[];
}

const Navbar = ({ items = [] }: NavbarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [emailUser, setEmailUser] = useState<string>("Pelanggan");
  
  const pathname = usePathname();
  const router = useRouter();  

  useEffect(() => {
    const checkStatus = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            console.log("ISI TOKEN GUE:", payload);
            
            const rawName = payload.email || "Pelanggan"; 
            const cleanName = rawName.includes("_") ? rawName.split(" ").slice(1).join(" ") : rawName;
            
            setEmailUser(cleanName);
          } catch (error) {
            setEmailUser("Pelanggan");
          }
        } else {
          setIsLoggedIn(false);
        }
      }
    };

    checkStatus();
  }, [pathname]);

  const handleLogout = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  };

  const isHome = pathname === '/';
  const toggleMenu = (key: string) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const dynamicCategories = items
  .filter((group) => group.item_group_name.toLowerCase() !== "services")
  .map((group) => ({
    key: slugify(group.item_group_name),
    label: group.item_group_name,
    submenu: group.templates.map((t) => ({ name: t.item_name }))
  }));

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-4 md:px-12 lg:px-20 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={-1} className="menu menu-sm md:menu-md dropdown-content bg-base-100 z-10 mt-3 w-screen p-2 shadow-xl -ms-4 md:-ms-12">
              {dynamicCategories.map((menu) => (
                <li key={menu.key}>
                  <details open={openMenu === menu.key}>
                    <summary onClick={(e) => { e.preventDefault(); toggleMenu(menu.key); }}>
                      {menu.label}
                    </summary>
                    <ul className="p-2">
                      {menu.submenu.map((item, i) => (
                        <li key={i}>
                          <Link href={`/produk/${slugify(item.name)}`}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost p-0 px-2 flex items-center gap-2 hover:bg-transparent">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image 
                src="/favicon.ico" 
                alt="BikinCetak Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black text-primary tracking-tighter hidden md:block">
              BIKIN<span className="text-base-content">CETAK</span>
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          {/* <label className="input bg-primary/10 border border-transparent flex items-center gap-2 w-96 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:outline-none rounded-2xl">
            <Search size={18} className="text-primary" />
            <input type="text" className="grow outline-none bg-transparent" placeholder="Cari brosur, banner..." />
          </label> */}
        </div>

        <div className="navbar-end gap-3">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="btn btn-ghost hidden md:flex border-none hover:bg-primary/10 group rounded-xl">
                <User size={18} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-widest">Sign In</span>
              </Link>
              <SwapTheme />
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar bg-primary/10 hover:bg-primary/20 transition-colors">
                <div className="w-10 rounded-full flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
              </div>
              
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-4 w-56 p-2 shadow-xl border border-base-content/5">
                
                <li className="pointer-events-none mb-2 w-full max-w-full overflow-hidden">
                  <div className="block px-3 py-2 bg-primary/5 rounded-xl w-full max-w-full overflow-hidden box-border">
                    <span className="font-bold text-sm truncate text-primary block w-full">
                      {emailUser}
                    </span>
                  </div>
                </li>
                
                <li>
                  <Link href="/profile" className="py-2 font-bold flex items-center gap-3">
                    <User size={16} className="opacity-70" />
                    Profil Saya
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="py-2 font-bold flex items-center gap-3">
                    <ShoppingBag size={16} className="opacity-70" />
                    Keranjang
                  </Link>
                </li>
                
                <div className="divider my-0 opacity-30"></div>
                
                <li>
                  <div className="py-1 flex justify-between items-center hover:bg-transparent cursor-default active:bg-transparent">
                    <span className="font-bold text-xs opacity-70">Ganti Tema</span>
                    <div className="-mr-2">
                      <SwapTheme />
                    </div>
                  </div>
                </li>
                
                <div className="divider my-0 opacity-30"></div>
                
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="py-2 text-error font-black flex items-center gap-3 hover:bg-error/10 hover:text-error focus:text-error"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {isHome && (
        <div className="navbar bg-base-100 hidden lg:flex justify-center border-t border-base-200 px-4 md:px-12 lg:px-20">
          <ul className="menu menu-horizontal p-0 scrollbar-hide">
            {dynamicCategories.map((menu) => (
              <li key={menu.key} className="dropdown dropdown-hover dropdown-center">
                <div role="button" className="text-[11px] font-semibold uppercase hover:text-primary transition-colors py-3 px-4">
                  {menu.label}
                </div>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-50 w-56 p-2 shadow-2xl border-t-4 border-primary mt-0">
                  {menu.submenu.map((item, i) => (
                    <li key={i}>
                      <Link href={`/produk/${slugify(item.name)}`}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;