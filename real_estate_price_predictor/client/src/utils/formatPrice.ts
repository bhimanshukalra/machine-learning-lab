export function formatPrice(lakhPrice: number) {
  if (lakhPrice >= 100) {
    const crorePrice = Math.trunc((lakhPrice / 100) * 100) / 100
    return `${crorePrice.toFixed(2)} Cr`
  }

  return `${lakhPrice.toFixed(2)} lakh`
}
