"use client";

import { useMemo } from "react";
import { allProducts, brands, categories } from "@/lib/data";

interface SidebarProps {
  selectedCats: string[];
  selectedBrands: string[];
  selectedStock: string[];
  minPrice: string;
  maxPrice: string;
  onCatChange: (cats: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onStockChange: (stock: string[]) => void;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
}

export default function Sidebar({
  selectedCats, selectedBrands, selectedStock,
  minPrice, maxPrice,
  onCatChange, onBrandChange, onStockChange,
  onMinPriceChange, onMaxPriceChange
}: SidebarProps) {
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
    return counts;
  }, []);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(p => counts[p.brand] = (counts[p.brand] || 0) + 1);
    return counts;
  }, []);

  const toggleFilter = (value: string, current: string[], setter: (v: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-black/5 p-6 h-[calc(100vh-72px)] overflow-y-auto fixed hidden lg:block">
      <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-light mb-4">Categories</h3>
      <div className="mb-7 space-y-1">
        {categories.map(cat => (
          <label key={cat} className="flex items-center gap-3 py-2 cursor-pointer text-sm text-charcoal-light hover:text-charcoal transition-colors">
            <input
              type="checkbox"
              checked={selectedCats.includes(cat)}
              onChange={() => toggleFilter(cat, selectedCats, onCatChange)}
              className="w-[18px] h-[18px] accent-rose-dark cursor-pointer"
            />
            <span>{cat}</span>
            <span className="ml-auto text-xs text-gold font-medium">{catCounts[cat] || 0}</span>
          </label>
        ))}
      </div>

      <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-light mb-4">Brands</h3>
      <div className="mb-7 space-y-1">
        {brands.slice(0, 15).map(brand => (
          <label key={brand} className="flex items-center gap-3 py-2 cursor-pointer text-sm text-charcoal-light hover:text-charcoal transition-colors">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => toggleFilter(brand, selectedBrands, onBrandChange)}
              className="w-[18px] h-[18px] accent-rose-dark cursor-pointer"
            />
            <span>{brand}</span>
            <span className="ml-auto text-xs text-gold font-medium">{brandCounts[brand] || 0}</span>
          </label>
        ))}
      </div>

      <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-light mb-4">Price Range (USD)</h3>
      <div className="mb-7 flex items-center gap-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          placeholder="Min"
          className="w-20 px-3 py-2 border border-black/10 rounded-lg text-sm"
        />
        <span className="text-sm text-charcoal-light">—</span>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          placeholder="Max"
          className="w-20 px-3 py-2 border border-black/10 rounded-lg text-sm"
        />
      </div>

      <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-light mb-4">Stock Status</h3>
      <div className="space-y-1">
        {["In Stock", "Low Stock", "On Order"].map(stock => (
          <label key={stock} className="flex items-center gap-3 py-2 cursor-pointer text-sm text-charcoal-light hover:text-charcoal transition-colors">
            <input
              type="checkbox"
              checked={selectedStock.includes(stock)}
              onChange={() => toggleFilter(stock, selectedStock, onStockChange)}
              className="w-[18px] h-[18px] accent-rose-dark cursor-pointer"
            />
            <span>{stock}</span>
            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              stock === "In Stock" ? "bg-green-100 text-green-700" :
              stock === "Low Stock" ? "bg-orange-100 text-orange-700" :
              "bg-red-100 text-red-700"
            }`}>
              {stock === "In Stock" ? "Live" : stock === "Low Stock" ? "Alert" : "Order"}
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
}
