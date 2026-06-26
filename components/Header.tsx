"use client";

import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  basketCount: number;
  onToggleBasket: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ basketCount, onToggleBasket, searchValue, onSearchChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 h-[72px] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-rose to-gold rounded-xl flex items-center justify-center text-white font-bold text-xl">
          C
        </div>
        <div>
          <div className="font-serif text-xl font-semibold text-charcoal">CSP Beauty</div>
          <div className="text-[11px] text-rose-dark font-medium tracking-widest uppercase">Hyper-Local Wholesale</div>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="flex items-center gap-3 bg-cream px-4 py-2.5 rounded-full w-full">
          <Search className="w-4 h-4 text-charcoal-light" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands, SKUs..."
            className="bg-transparent border-none outline-none text-sm w-full font-sans"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-rose-dark">Catalog</a>
          <a href="#" className="text-sm font-medium text-charcoal-light hover:text-rose-dark transition-colors">Orders</a>
          <a href="#" className="text-sm font-medium text-charcoal-light hover:text-rose-dark transition-colors">Suppliers</a>
          <a href="#" className="text-sm font-medium text-charcoal-light hover:text-rose-dark transition-colors">Analytics</a>
        </nav>

        <button
          onClick={onToggleBasket}
          className="relative bg-charcoal text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-charcoal-light transition-all hover:-translate-y-0.5"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Basket</span>
          {basketCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-dark text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {basketCount}
            </span>
          )}
        </button>

        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-black/5 p-6 lg:hidden shadow-lg">
          <div className="flex flex-col gap-4">
            <a href="#" className="text-sm font-medium text-rose-dark">Catalog</a>
            <a href="#" className="text-sm font-medium text-charcoal-light">Orders</a>
            <a href="#" className="text-sm font-medium text-charcoal-light">Suppliers</a>
            <a href="#" className="text-sm font-medium text-charcoal-light">Analytics</a>
            <div className="flex items-center gap-3 bg-cream px-4 py-2.5 rounded-full">
              <Search className="w-4 h-4 text-charcoal-light" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
