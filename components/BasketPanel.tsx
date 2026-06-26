"use client";

import { X, Minus, Plus, CreditCard } from "lucide-react";
import { Product } from "@/lib/data";

interface BasketItem {
  product: Product;
  qty: number;
}

interface BasketPanelProps {
  isOpen: boolean;
  items: Record<string, BasketItem>;
  onClose: () => void;
  onUpdateQty: (sku: string, delta: number) => void;
  onRemove: (sku: string) => void;
  onCheckout: () => void;
}

export default function BasketPanel({ isOpen, items, onClose, onUpdateQty, onRemove, onCheckout }: BasketPanelProps) {
  const itemList = Object.values(items);
  const count = itemList.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = itemList.reduce((sum, item) => sum + (item.product.wholesale * item.qty), 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-[998] transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div className={`fixed top-[72px] right-0 w-full max-w-md h-[calc(100vh-72px)] bg-white shadow-2xl z-[999] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <h2 className="font-serif text-2xl">Your Basket</h2>
          <button onClick={onClose} className="text-2xl text-charcoal-light hover:text-charcoal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {itemList.length === 0 ? (
            <div className="text-center py-12 text-charcoal-light">
              <div className="text-5xl mb-4 opacity-50">🛒</div>
              <p>Your basket is empty</p>
              <p className="text-sm mt-2">Add products to get started</p>
            </div>
          ) : (
            itemList.map(item => (
              <div key={item.product.sku} className="flex gap-4 p-4 bg-cream rounded-lg mb-3 items-center">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {item.product.category === "Fragrance" ? "🌹" : item.product.category === "Skincare" ? "✨" : item.product.category === "Makeup" ? "💄" : "🧴"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{item.product.name}</div>
                  <div className="text-[11px] text-rose-dark font-semibold uppercase">{item.product.brand} • {item.product.sku}</div>
                  <div className="text-sm font-bold mt-0.5">${item.product.wholesale.toFixed(2)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateQty(item.product.sku, -1)} className="w-7 h-7 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.product.sku, 1)} className="w-7 h-7 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button onClick={() => onRemove(item.product.sku)} className="text-red-500 hover:text-red-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-black/5 bg-white">
          <div className="flex justify-between mb-2 text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-3 text-sm">
            <span>Shipping</span>
            <span className="text-charcoal-light">Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 border-t border-black/10">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={itemList.length === 0}
            className="w-full mt-4 bg-gradient-to-r from-charcoal to-charcoal-light text-white py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
