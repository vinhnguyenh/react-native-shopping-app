import React, { memo, useState } from 'react';
import {
  Image,
  ImageStyle,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import type { Product } from '@/models/product';

interface HomeProductCardProps {
  category: string;
  priceLabel: string;
  product: Product;
}

const HomeProductCardComponent: React.FC<HomeProductCardProps> = ({
  category,
  priceLabel,
  product,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldUseRemoteImage =
    !imageFailed &&
    typeof product.image === 'string' &&
    product.image.trim().length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        {shouldUseRemoteImage ? (
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={[styles.productImage, styles.imageFallback]}>
            <Text style={styles.imageFallbackText}>
              {product.name.trim().charAt(0).toUpperCase() || 'P'}
            </Text>
          </View>
        )}

        <Pressable style={styles.favoriteButton}>
          <MaterialDesignIcons name="heart-outline" size={18} color="#7C8797" />
        </Pressable>
      </View>

      <Text style={styles.productName} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.productCategory}>{category}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.productPrice}>{priceLabel}</Text>
        <Pressable style={styles.addButton}>
          <MaterialDesignIcons name="plus" size={20} color="#083344" />
        </Pressable>
      </View>
    </View>
  );
};

export const HomeProductCard = memo(HomeProductCardComponent);

interface HomeProductCardStyles {
  addButton: ViewStyle;
  card: ViewStyle;
  favoriteButton: ViewStyle;
  imageFallback: ViewStyle;
  imageFallbackText: TextStyle;
  imageWrapper: ViewStyle;
  priceRow: ViewStyle;
  productCategory: TextStyle;
  productImage: ImageStyle;
  productName: TextStyle;
  productPrice: TextStyle;
}

const styles = StyleSheet.create<HomeProductCardStyles>({
  addButton: {
    alignItems: 'center',
    backgroundColor: '#22D3EE',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  card: {
    flex: 1,
    marginBottom: 24,
  },
  favoriteButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 32,
  },
  imageFallback: {
    alignItems: 'center',
    backgroundColor: '#DDEBDD',
    justifyContent: 'center',
  },
  imageFallbackText: {
    color: '#3F6212',
    fontSize: 36,
    fontWeight: '700',
  },
  imageWrapper: {
    marginBottom: 10,
    position: 'relative',
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productCategory: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  productImage: {
    borderRadius: 18,
    height: 180,
    width: '100%',
  },
  productName: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
  },
  productPrice: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
});
