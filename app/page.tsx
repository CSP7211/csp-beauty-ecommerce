"use client";

import { useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import BasketPanel from "@/components/BasketPanel";
import ProductDetail from "@/components/ProductDetail";
import CheckoutModal from "@/components/CheckoutModal";
import Toast from "@/components/Toast";
import { allProducts, brands, filterProducts, Product } from "@/lib/data";
import { ChevronDown } from "lucide-react";

interface BasketItem {
  product: Product;
  qty: number;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [selectedCats, setSelectedCats] = useState<string[]>([
    "Fragrance", "Skincare", "Makeup", "Haircare", "Body Care",
    "Men's Grooming", "Sun Care", "Tools & Brushes", "Sets & Kits"
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(brands);
  const [selectedStock, setSelectedStock] = useState<string[]>(["In Stock", "Low Stock", "On Order"]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [basket, setBasket] = useState<Record<string, BasketItem>>({});
  const [basketOpen, setBasketOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "warning" });

  const filtered = useMemo(() => {
    return filterProducts(
      allProducts,
      search,
      selectedCats,
      selectedBrands,
      selectedStock,
      parseFloat(minPrice) || 0,
      parseFloat(maxPrice) || Infinity,
      sort
    );
  }, [search, selectedCats, selectedBrands, selectedStock, minPrice, maxPrice, sort]);

  const basketCount = useMemo(() => {
    return Object.values(basket).reduce((sum, item) => sum + item.qty, 0);
  }, [basket]);

  const showToast = useCallback((message: string, type: "success" | "warning" = "success") => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const addToBasket = useCallback((sku: string) => {
    const product = allProducts.find(p => p.sku === sku);
    if (!product) return;
    if (product.stock === "On Order") {
      showToast("⚠️ This item is On Order — cannot add to basket", "warning");
      return;
    }
    setBasket(prev => {
      const updated = { ...prev };
      if (!updated[sku]) {
        updated[sku] = { product, qty: 0 };
      }
      updated[sku].qty++;
      return updated;
    });
    showToast(`${product.brand} added to basket`);
  }, [showToast]);

  const updateQty = useCallback((sku: string, delta: number) => {
    setBasket(prev => {
      const updated = { ...prev };
      if (!updated[sku]) return prev;
      updated[sku].qty += delta;
      if (updated[sku].qty <= 0) {
        delete updated[sku];
      }
      return updated;
    });
  }, []);

  const removeFromBasket = useCallback((sku: string) => {
    setBasket(prev => {
      const updated = { ...prev };
      delete updated[sku];
      return updated;
    });
  }, []);

  const handleCheckoutSuccess = useCallback((orderId: string, taskId: string, total: number) => {
    setBasket({});
    setCheckoutOpen(false);
    showToast(`Order ${orderId} placed! ClickUp Task: ${taskId}. Total: $${total.toFixed(2)}`);
  }, [showToast]);

  const openDetail = useCallback((sku: string) => {
    const product = allProducts.find(p => p.sku === sku);
    if (product) setDetailProduct(product);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Header
        basketCount={basketCount}
        onToggleBasket={() => setBasketOpen(!basketOpen)}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="pt-[72px] flex min-h-[calc(100vh-72px)]">
        <Sidebar
          selectedCats={selectedCats}
          selectedBrands={selectedBrands}
          selectedStock={selectedStock}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCatChange={setSelectedCats}
          onBrandChange={setSelectedBrands}
          onStockChange={setSelectedStock}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
        />

        <main className="lg:ml-72 flex-1 p-6 md:p-8">
          <Hero productCount={filtered.length} />

          {/* Mobile Search + Sort */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-sm mb-3">
              <svg className="w-4 h-4 text-charcoal-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm">
            <div className="hidden md:block text-sm text-charcoal-light">
              Showing <strong className="text-charcoal">{filtered.length}</strong> products
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-charcoal-light hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="appearance-none bg-cream px-4 py-2.5 pr-10 rounded-lg text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="brand">Brand</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-light" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-charcoal-light">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg">No products match your filters</p>
              <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.sku}
                  product={product}
                  onAdd={addToBasket}
                  onClick={openDetail}
                  index={i}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <BasketPanel
        isOpen={basketOpen}
        items={basket}
        onClose={() => setBasketOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeFromBasket}
        onCheckout={() => { setBasketOpen(false); setCheckoutOpen(true); }}
      />

      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAdd={addToBasket}
        />
      )}

      <CheckoutModal
        isOpen={checkoutOpen}
        items={basket}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onHide={hideToast}
        type={toast.type}
      />
    </div>
  );
}
