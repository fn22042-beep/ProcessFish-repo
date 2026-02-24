export interface CartItem {
  productId: string
  name: string
  image: string
  weight: string
  quantity: number
  price: number
}

export function getCartItemKey(item: Pick<CartItem, "productId" | "weight">) {
  return `${item.productId}-${item.weight}`
}
