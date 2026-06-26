export interface Product {
  sku: string;
  brand: string;
  name: string;
  category: string;
  size: string;
  cost: number;
  wholesale: number;
  margin: number;
  stock: "In Stock" | "Low Stock" | "On Order";
  moq: number;
  origin: string;
  gs1: string;
}

export const brands = [
  "Kiko Milano", "Guerlain", "Babor", "Uriage", "Medik8",
  "Dior", "Chanel", "Lancôme", "Estée Lauder", "Clarins",
  "La Roche-Posay", "Vichy", "CeraVe", "The Ordinary", "Nuxe",
  "L'Oréal Paris", "Maybelline", "NYX", "MAC", "Bobbi Brown",
  "Tom Ford", "YSL Beauty", "Givenchy", "Armani Beauty", "Shiseido",
  "SK-II", "Kiehl's", "Clinique", "Origins", "Aesop"
];

export const categories = [
  "Fragrance", "Skincare", "Makeup", "Haircare", "Body Care",
  "Men's Grooming", "Sun Care", "Tools & Brushes", "Sets & Kits"
];

export const stockStatuses = ["In Stock", "Low Stock", "On Order"] as const;
export const origins = ["France", "Italy", "USA", "UK", "Germany", "Japan", "South Korea", "UAE", "Switzerland", "Australia", "South Africa", "China"];

export const categoryEmojis: Record<string, string> = {
  "Fragrance": "🌹", "Skincare": "✨", "Makeup": "💄", "Haircare": "💇",
  "Body Care": "🧴", "Men's Grooming": "🧔", "Sun Care": "☀️",
  "Tools & Brushes": "🖌️", "Sets & Kits": "🎁"
};

export const stockBadgeClass = (stock: string) => {
  switch(stock) {
    case "In Stock": return "bg-green-100 text-green-700";
    case "Low Stock": return "bg-orange-100 text-orange-700";
    case "On Order": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

function generateProducts(): Product[] {
  const data: Product[] = [];

  const fragranceTypes = ["Eau de Parfum", "Eau de Toilette", "Parfum", "Cologne"];
  const fragranceNotes = ["Intense", "Fresh", "Noir", "Rose", "Citrus", "Woody"];
  const sizes = ["30ml", "50ml", "75ml", "100ml", "150ml"];

  // Fragrance (400 items for demo, scaled from 4000)
  for(let i=0; i<400; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*242+8).toFixed(2);
    data.push({
      sku: `CSP-FRG-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Fragrance",
      name: `${brand} ${fragranceTypes[Math.floor(Math.random()*fragranceTypes.length)]} ${fragranceNotes[Math.floor(Math.random()*fragranceNotes.length)]} ${sizes[Math.floor(Math.random()*sizes.length)]}`,
      size: sizes[Math.floor(Math.random()*sizes.length)],
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12,24][Math.floor(Math.random()*4)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  // Skincare (300 items)
  const skincareTypes = ["Moisturizer", "Serum", "Cleanser", "Toner", "Eye Cream", "Face Mask", "Exfoliator", "Sunscreen"];
  const skincareSizes = ["15ml", "30ml", "50ml", "75ml", "100ml"];
  for(let i=0; i<300; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*175+5).toFixed(2);
    data.push({
      sku: `CSP-SKN-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Skincare",
      name: `${brand} ${skincareTypes[Math.floor(Math.random()*skincareTypes.length)]} ${skincareSizes[Math.floor(Math.random()*skincareSizes.length)]}`,
      size: skincareSizes[Math.floor(Math.random()*skincareSizes.length)],
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12,24][Math.floor(Math.random()*4)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  // Makeup (250 items)
  const makeupTypes = ["Foundation", "Concealer", "Mascara", "Lipstick", "Eyeshadow Palette", "Blush", "Bronzer", "Highlighter"];
  const shades = ["Natural", "Beige", "Nude", "Red", "Pink"];
  for(let i=0; i<250; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*116+4).toFixed(2);
    data.push({
      sku: `CSP-MKP-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Makeup",
      name: `${brand} ${makeupTypes[Math.floor(Math.random()*makeupTypes.length)]} ${shades[Math.floor(Math.random()*shades.length)]}`,
      size: ["5ml", "10ml", "15ml", "30ml", "N/A"][Math.floor(Math.random()*5)],
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12,24][Math.floor(Math.random()*4)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  // Haircare (80 items)
  const hairTypes = ["Shampoo", "Conditioner", "Hair Mask", "Hair Oil", "Styling Cream", "Hairspray"];
  for(let i=0; i<80; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*74+6).toFixed(2);
    data.push({
      sku: `CSP-HRC-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Haircare",
      name: `${brand} ${hairTypes[Math.floor(Math.random()*hairTypes.length)]} ${["100ml","200ml","250ml","400ml","500ml"][Math.floor(Math.random()*5)]}`,
      size: ["100ml","200ml","250ml","400ml","500ml"][Math.floor(Math.random()*5)],
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12,24][Math.floor(Math.random()*4)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  // Body Care (50 items)
  const bodyTypes = ["Body Lotion", "Body Wash", "Body Scrub", "Body Butter", "Hand Cream"];
  for(let i=0; i<50; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*55+5).toFixed(2);
    data.push({
      sku: `CSP-BDC-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Body Care",
      name: `${brand} ${bodyTypes[Math.floor(Math.random()*bodyTypes.length)]} ${["100ml","200ml","250ml","400ml"][Math.floor(Math.random()*4)]}`,
      size: ["100ml","200ml","250ml","400ml"][Math.floor(Math.random()*4)],
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12,24][Math.floor(Math.random()*4)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  // Men's Grooming (20 items)
  const menTypes = ["Beard Oil", "Shaving Cream", "Face Wash", "Moisturizer", "Body Wash"];
  for(let i=0; i<20; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*64+6).toFixed(2);
    data.push({
      sku: `CSP-MGR-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Men's Grooming",
      name: `${brand} Men ${menTypes[Math.floor(Math.random()*menTypes.length)]}`,
      size: ["50ml","100ml","150ml","200ml"][Math.floor(Math.random()*4)],
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12,24][Math.floor(Math.random()*4)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  // Sun Care (5 items)
  const sunTypes = ["Sunscreen SPF 30", "Sunscreen SPF 50", "After Sun Lotion", "Tanning Oil"];
  for(let i=0; i<5; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*37+8).toFixed(2);
    data.push({
      sku: `CSP-SNC-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Sun Care",
      name: `${brand} ${sunTypes[Math.floor(Math.random()*sunTypes.length)]}`,
      size: ["50ml","100ml","150ml","200ml"][Math.floor(Math.random()*4)],
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12,24][Math.floor(Math.random()*4)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  // Tools & Brushes (3 items)
  const toolTypes = ["Makeup Brush Set", "Beauty Blender", "Eyelash Curler", "Tweezers"];
  for(let i=0; i<3; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*80+5).toFixed(2);
    data.push({
      sku: `CSP-TLS-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Tools & Brushes",
      name: `${brand} ${toolTypes[Math.floor(Math.random()*toolTypes.length)]}`,
      size: "N/A",
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12][Math.floor(Math.random()*3)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  // Sets & Kits (2 items)
  const setTypes = ["Gift Set", "Travel Set", "Discovery Kit", "Luxury Collection"];
  for(let i=0; i<2; i++) {
    const brand = brands[Math.floor(Math.random()*brands.length)];
    const cost = +(Math.random()*275+25).toFixed(2);
    data.push({
      sku: `CSP-SET-${String(i+1).padStart(5,'0')}`,
      brand,
      category: "Sets & Kits",
      name: `${brand} ${setTypes[Math.floor(Math.random()*setTypes.length)]}`,
      size: "Multi",
      cost,
      wholesale: +(cost/0.75).toFixed(2),
      margin: 25,
      stock: stockStatuses[Math.floor(Math.random()*stockStatuses.length)],
      moq: [1,6,12][Math.floor(Math.random()*3)],
      origin: origins[Math.floor(Math.random()*origins.length)],
      gs1: `600${Math.floor(Math.random()*899999999+100000000)}`
    });
  }

  return data;
}

export const allProducts = generateProducts();

export function filterProducts(
  products: Product[],
  search: string,
  selectedCats: string[],
  selectedBrands: string[],
  selectedStock: string[],
  minPrice: number,
  maxPrice: number,
  sort: string
): Product[] {
  let filtered = products.filter(p => {
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.brand.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCats.includes(p.category);
    const matchesBrand = selectedBrands.includes(p.brand);
    const matchesPrice = p.wholesale >= minPrice && p.wholesale <= maxPrice;
    const matchesStock = selectedStock.includes(p.stock);
    return matchesSearch && matchesCat && matchesBrand && matchesPrice && matchesStock;
  });

  if(sort === 'price-low') filtered.sort((a,b) => a.wholesale - b.wholesale);
  else if(sort === 'price-high') filtered.sort((a,b) => b.wholesale - a.wholesale);
  else if(sort === 'brand') filtered.sort((a,b) => a.brand.localeCompare(b.brand));
  else filtered.sort((a,b) => a.name.localeCompare(b.name));

  return filtered;
}
