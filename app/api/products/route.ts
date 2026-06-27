import { NextResponse } from 'next/server'
import { allProducts, filterProducts } from '@/lib/data'
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client'

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

  // If Supabase is configured, use it; otherwise fallback to local data
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .gte('wholesale_price', minPrice)
        .lte('wholesale_price', maxPrice)

      if (search) {
        query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,sku.ilike.%${search}%`)
      }
      if (category) query = query.eq('category', category)
      if (brand) query = query.eq('brand', brand)
      if (stock) query = query.eq('stock_status', stock)

      if (sort === 'price-low') query = query.order('wholesale_price', { ascending: true })
      else if (sort === 'price-high') query = query.order('wholesale_price', { ascending: false })
      else if (sort === 'brand') query = query.order('brand', { ascending: true })
      else query = query.order('name', { ascending: true })

      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (!error && data) {
        return NextResponse.json({
          products: data,
          total: count,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        })
      }
    } catch (e) {
      console.log('Supabase error, falling back to local data:', e)
    }
  }

  // Fallback to local data
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
