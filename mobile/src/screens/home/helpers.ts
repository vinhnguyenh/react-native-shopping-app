import type { Product } from '@/models/product';

export const homeFilterChips = [
  'All Items',
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
] as const;

export const inferHomeProductCategory = (product: Product): string => {
  const lookup = `${product.name} ${product.description}`.toLowerCase();

  if (
    lookup.includes('wireless') ||
    lookup.includes('audio') ||
    lookup.includes('speaker') ||
    lookup.includes('clock') ||
    lookup.includes('timepiece')
  ) {
    return 'Electronics';
  }

  if (
    lookup.includes('fashion') ||
    lookup.includes('shirt') ||
    lookup.includes('dress') ||
    lookup.includes('shoe') ||
    lookup.includes('bag')
  ) {
    return 'Fashion';
  }

  if (
    lookup.includes('mug') ||
    lookup.includes('ceramic') ||
    lookup.includes('home') ||
    lookup.includes('decor') ||
    lookup.includes('kitchen')
  ) {
    return 'Home';
  }

  if (
    lookup.includes('beauty') ||
    lookup.includes('glow') ||
    lookup.includes('skin') ||
    lookup.includes('serum') ||
    lookup.includes('lotion')
  ) {
    return 'Beauty';
  }

  return 'All Items';
};

export const formatHomeProductPrice = (product: Product): string => {
  const unitToCurrency: Record<Product['priceUnit'], string> = {
    dollar: 'USD',
    euro: 'EUR',
    inr: 'INR',
  };

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: unitToCurrency[product.priceUnit] ?? 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(product.price);
};
