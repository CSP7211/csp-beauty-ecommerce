"use client";

import { X, Plus, ShoppingBag } from "lucide-react";
import { Product, categoryEmojis, stockBadgeClass } from "@/lib/data";

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (sku: string) => void;
}

export default function ProductDetail({ product, onClose, onAdd }: ProductDetailProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 flex justify-between items-center">
          <h2 className="font-serif text-2xl">Product Details</h2>
          <button onClick={onClose} className="text-charcoal-light hover:text-charcoal">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 pt-0">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-72 md:h-96 bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E1] rounded-2xl flex items-center justify-center text-8xl">
              {categoryEmojis[product.category]}
            </div>
            <div>
              <div className="text-[13px] font-bold uppercase tracking-widest text-rose-dark mb-2">{product.brand}</div>
              <h2 className="font-serif text-2xl md:text-3xl mb-2">{product.name}</h2>
              <div className="text-3xl font-bold mb-2">
                ${product.wholesale.toFixed(2)} <span className="text-base text-charcoal-light font-normal">wholesale</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs bg-cream px-3 py-1.5 rounded-full">SKU: <strong>{product.sku}</strong></span>
                <span className="text-xs bg-cream px-3 py-1.5 rounded-full">Size: <strong>{product.size}</strong></span>
                <span className="text-xs bg-cream px-3 py-1.5 rounded-full">MOQ: <strong>{product.moq} units</strong></span>
                <span className="text-xs bg-cream px-3 py-1.5 rounded-full">Origin: <strong>{product.origin}</strong></span>
                <span className="text-xs bg-cream px-3 py-1.5 rounded-full">GS1: <strong>{product.gs1}</strong></span>
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${stockBadgeClass(product.stock)}`}>
                  Stock: <strong>{product.stock}</strong>
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-charcoal-light mb-6">
                Premium {product.category.toLowerCase()} from {product.brand}. Manufactured in {product.origin} under strict quality controls. 
                GS1-compliant barcode {product.gs1} for customs and supply chain tracking. 
                Minimum order quantity: {product.moq} units. 25% wholesale margin applied.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { onAdd(product.sku); onClose(); }}
                  className="btn-primary flex items-center gap-2 px-6 py-3.5 text-base"
                >
                  <Plus className="w-5 h-5" />
                  Add to Basket
                </button>
                <button onClick={onClose} className="px-6 py-3.5 border border-black/10 rounded-full font-semibold hover:bg-cream transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
