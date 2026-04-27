export interface Product {
  name: string
  description?: string
  barcode: string
  imageUrl?: string
  price: number
  finalPrice: number
  stock: number
  locationId: number
}
