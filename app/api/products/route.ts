import { NextResponse } from 'next/server'
import { allProducts, filterProducts } from '@/lib/data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const stock = searchParams.get('stock') || ''
  const minPrice = parseFloat(searchParams.get('minPrice') || '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
  const sort = searchParams.get('sort') || 'name'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  const brands = brand ? [brand] : Array.from(new Set(allProducts.map(p => p.brand)))
  const cats = category ? [category] : Array.from(new Set(allProducts.map(p => p.category)))
  const stocks = stock ? [stock] : ["In Stock", "Low Stock", "On Order"]

  let filtered = filterProducts(allProducts, search, cats, brands, stocks, minPrice, maxPrice, sort)

  const from = (page - 1) * limit
  const to = from + limit
  const paginated = filtered.slice(from, to)

  return NextResponse.json({
    products: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  })
}
