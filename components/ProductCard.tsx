"use client";

import { Plus } from "lucide-react";
import { Product, categoryEmojis, stockBadgeClass } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  onAdd: (sku: string) => void;
  onClick: (sku: string) => void;
  index: number;
}

export default function ProductCard({ product, onAdd, onClick, index }: ProductCardProps) {
  return (
    <div
      className="product-card animate-fade-in"
      style={{ animationDelay: `${index * 0.03}s` }}
      onClick={() => onClick(product.sku)}
    >
      <div className="h-56 bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E1] flex items-center justify-center relative overflow-hidden group">
        <span className="text-6xl transition-transform duration-400 group-hover:scale-105">
          {categoryEmojis[product.category]}
        </span>
        <span className="absolute top-3 left-3 bg-rose-dark text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {product.category}
        </span>
        <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${stockBadgeClass(product.stock)}`}>
          {product.stock}
        </span>
      </div>
      <div className="p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-rose-dark mb-1.5">{product.brand}</div>
        <div className="text-[15px] font-semibold text-charcoal leading-snug mb-2 line-clamp-2">{product.name}</div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-charcoal-light bg-cream px-2.5 py-1 rounded-full">{product.size}</span>
          <span className="text-xs text-gold font-medium">{product.origin}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-charcoal">${product.wholesale.toFixed(2)}</span>
            <span className="text-xs text-charcoal-light line-through">${product.cost.toFixed(2)} cost</span>
            <span className="text-[11px] text-green-600 font-semibold">25% margin</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product.sku); }}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
