"use client";

interface HeroProps {
  productCount: number;
}

export default function Hero({ productCount }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-charcoal to-charcoal-light rounded-2xl p-10 md:p-12 text-white mb-8 relative overflow-hidden">
      <div className="absolute -top-1/2 -right-1/5 w-[500px] h-[500px] bg-rose/15 rounded-full blur-3xl" />
      <div className="relative z-10">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">Wholesale Beauty, Simplified</h1>
        <p className="text-base opacity-80 max-w-lg">
          1,100+ premium products from 30 global brands. Real-time stock synced from ClickUp. 25% margin locked.
        </p>
        <div className="flex flex-wrap gap-8 mt-6">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-gold-light">{productCount.toLocaleString()}</div>
            <div className="text-xs uppercase tracking-widest opacity-70 mt-1">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-gold-light">30</div>
            <div className="text-xs uppercase tracking-widest opacity-70 mt-1">Brands</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-gold-light">25%</div>
            <div className="text-xs uppercase tracking-widest opacity-70 mt-1">Margin</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-gold-light">48h</div>
            <div className="text-xs uppercase tracking-widest opacity-70 mt-1">Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
}
