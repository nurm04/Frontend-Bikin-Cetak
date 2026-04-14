"use client";
import { useState } from 'react';
import { Search, User } from 'lucide-react';
import SwapTheme from '../ui/SwapTheme';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRODUCT_CATEGORIES } from "@/lib/data";
import { slugify } from "@/lib/utils";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const isHome = pathname === '/';

  const toggleMenu = (key: string) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-4 md:px-12 lg:px-20 sticky top-0 z-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={-1} className="menu menu-sm md:menu-md dropdown-content bg-base-100 z-10 mt-3 w-screen p-2 shadow-xl -ms-4 md:-ms-12">
              {PRODUCT_CATEGORIES.map((menu) => (
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
          <Link href="/" className="btn btn-ghost text-2xl font-bold text-primary tracking-tighter">
            BIKIN<span className="text-base-content">CETAK</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <label className="input bg-primary/10 border border-transparent flex items-center gap-2 w-96 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:outline-none">
            <Search size={18} className="text-primary" />
            <input type="text" className="grow outline-none bg-transparent" placeholder="Cari brosur, banner..." />
          </label>
        </div>

        <div className="navbar-end gap-3">
          <Link href="/login" className="btn btn-ghost hidden md:flex border-none hover:bg-primary/10 group">
            <User size={18} className="text-primary group-hover:scale-110 transition-transform" />
            <span>Sign Up / Sign In</span>
          </Link>
          <SwapTheme />
        </div>
      </div>

      {isHome && (
        <div className="navbar bg-base-100 hidden lg:flex justify-center border-t border-base-200 px-4 md:px-12 lg:px-20">
          <ul className="menu menu-horizontal p-0 scrollbar-hide">
            {PRODUCT_CATEGORIES.map((menu) => (
              <li key={menu.key} className="dropdown dropdown-hover dropdown-center">
                <div role="button" className="text-[11px] font-semibold uppercase hover:text-primary transition-colors py-3 px-4">
                  {menu.label}
                </div>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-10 w-56 p-2 shadow-2xl border-t-4 border-primary mt-0">
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