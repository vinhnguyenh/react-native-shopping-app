import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { Product } from '../models/product';
import useProducts from '../hooks/use-products';
import { styles } from './styles/home-screen-styles';

const filterChips = ['All Items', 'Electronics', 'Fashion', 'Home', 'Beauty'];

const inferCategory = (product: Product): string => {
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

const formatPrice = (product: Product): string => {
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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const category = inferCategory(product);
  const shouldUseRemoteImage =
    !imageFailed && typeof product.image === 'string' && product.image.trim().length > 0;

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
        <Text style={styles.productPrice}>{formatPrice(product)}</Text>
        <Pressable style={styles.addButton}>
          <MaterialDesignIcons name="plus" size={20} color="#083344" />
        </Pressable>
      </View>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Items');

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      normalizedSearchText.length === 0 ||
      product.name.toLowerCase().includes(normalizedSearchText) ||
      product.description.toLowerCase().includes(normalizedSearchText);

    const productCategory = inferCategory(product);
    const matchesFilter =
      activeFilter === 'All Items' || productCategory === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerIconButton}>
            <MaterialDesignIcons name="bell-outline" size={20} color="#111827" />
          </Pressable>
          <Pressable style={styles.headerIconButton}>
            <MaterialDesignIcons name="cart-outline" size={20} color="#111827" />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBox}>
        <MaterialDesignIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search products, brands..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {filterChips.map(chip => {
          const isActive = chip === activeFilter;

          return (
            <Pressable
              key={chip}
              onPress={() => setActiveFilter(chip)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {chip}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {!loading && !error ? (
        <Text style={styles.resultsText}>
          {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
        </Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#22D3EE" />
            <Text style={styles.stateText}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <MaterialDesignIcons
              name="alert-circle-outline"
              size={32}
              color="#EF4444"
            />
            <Text style={styles.errorTitle}>Unable to load products</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <ProductCard product={item} />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptyText}>
                  Try a different search or choose another filter.
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export { HomeScreen };
