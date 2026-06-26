"use client";

import { useState } from "react";
import { X, Lock, Loader2 } from "lucide-react";
import { Product } from "@/lib/data";

interface BasketItem {
  product: Product;
  qty: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  items: Record<string, BasketItem>;
  onClose: () => void;
  onSuccess: (orderId: string, taskId: string, total: number) => void;
}

export default function CheckoutModal({ isOpen, items, onClose, onSuccess }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "South Africa",
    postal: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  });

  const itemList = Object.values(items);
  const subtotal = itemList.reduce((sum, item) => sum + (item.product.wholesale * item.qty), 0);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate Stripe + ClickUp sync
    await new Promise(r => setTimeout(r, 2000));
    const orderId = `CSP-ORD-${Date.now()}`;
    const taskId = `86ca${Math.floor(Math.random() * 899999 + 100000)}`;

    // Log to console (would be Supabase insert in production)
    console.log("CLICKUP_TASK_CREATED:", { taskId, orderId, items: itemList.length, total: subtotal });
    console.log("STRIPE_LEDGER_ENTRY:", { orderId, amount: subtotal, status: "PAID", timestamp: new Date().toISOString() });

    setLoading(false);
    onSuccess(orderId, taskId, subtotal);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 flex justify-between items-center">
          <h2 className="font-serif text-2xl">Checkout</h2>
          <button onClick={onClose} className="text-charcoal-light hover:text-charcoal">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 pt-0 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal-light mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Company Name</label>
                <input type="text" value={formData.companyName} onChange={e => handleChange("companyName", e.target.value)} placeholder="CSP Beauty Wholesale" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Contact Name</label>
                <input type="text" value={formData.contactName} onChange={e => handleChange("contactName", e.target.value)} placeholder="Full name" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email</label>
                <input type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} placeholder="chris@cspmed.io" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Phone</label>
                <input type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+27 82 599 7399" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark" />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal-light mb-3">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Street Address</label>
                <input type="text" value={formData.address} onChange={e => handleChange("address", e.target.value)} placeholder="123 Beauty Lane" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">City</label>
                <input type="text" value={formData.city} onChange={e => handleChange("city", e.target.value)} placeholder="Johannesburg" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Country</label>
                <select value={formData.country} onChange={e => handleChange("country", e.target.value)} className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark bg-white">
                  <option>South Africa</option><option>UAE</option><option>United Kingdom</option>
                  <option>France</option><option>Germany</option><option>USA</option>
                  <option>Brazil</option><option>Italy</option><option>Japan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Postal Code</label>
                <input type="text" value={formData.postal} onChange={e => handleChange("postal", e.target.value)} placeholder="2000" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal-light mb-3">Payment (Stripe)</h3>
            <div className="bg-cream p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1.5">Card Number</label>
                  <input type="text" value={formData.cardNumber} onChange={e => handleChange("cardNumber", e.target.value)} placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Expiry</label>
                  <input type="text" value={formData.cardExpiry} onChange={e => handleChange("cardExpiry", e.target.value)} placeholder="MM/YY" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">CVC</label>
                  <input type="text" value={formData.cardCvc} onChange={e => handleChange("cardCvc", e.target.value)} placeholder="123" className="w-full px-4 py-3 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-rose-dark bg-white" />
                </div>
              </div>
              <p className="text-xs text-charcoal-light mt-3 flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Payments processed securely via Stripe. PCI-DSS compliant.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal-light mb-3">Order Summary</h3>
            <div className="bg-cream p-5 rounded-lg">
              {itemList.map(item => (
                <div key={item.product.sku} className="flex justify-between py-2 text-sm border-b border-black/5 last:border-0">
                  <span className="truncate mr-4">{item.product.name} × {item.qty}</span>
                  <span className="font-medium whitespace-nowrap">${(item.product.wholesale * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t-2 border-charcoal">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-rose-dark to-gold text-white rounded-lg font-bold text-base hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-70 disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {loading ? "Processing..." : `Pay $${subtotal.toFixed(2)} — Place Order`}
          </button>
          <p className="text-center text-xs text-charcoal-light">
            ClickUp Task ID will be auto-generated. GS1 reference numbers included.
          </p>
        </div>
      </div>
    </div>
  );
}
