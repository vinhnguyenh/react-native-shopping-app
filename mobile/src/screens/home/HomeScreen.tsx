import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import useProducts from '@/hooks/use-products';
import { HomeProductCard } from '@/screens/home/HomeProductCard';
import {
  formatHomeProductPrice,
  homeFilterChips,
  inferHomeProductCategory,
} from '@/screens/home/helpers';
import { styles } from './styles';

const HomeScreen: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Items');

  const filteredProducts = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase();

    return products.filter(product => {
      const matchesSearch =
        normalizedSearchText.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearchText) ||
        product.description.toLowerCase().includes(normalizedSearchText);

      const productCategory = inferHomeProductCategory(product);
      const matchesFilter =
        activeFilter === 'All Items' || productCategory === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, products, searchText]);

  const handleFilterPress = useCallback((chip: string): void => {
    setActiveFilter(chip);
  }, []);

  const keyExtractor = useCallback((item: (typeof filteredProducts)[number]): string => {
    return String(item.id);
  }, []);

  const renderProductCard = useCallback(
    ({ item }: { item: (typeof filteredProducts)[number] }) => (
      <HomeProductCard
        product={item}
        category={inferHomeProductCategory(item)}
        priceLabel={formatHomeProductPrice(item)}
      />
    ),
    [],
  );

  const renderHeader = useMemo(() => (
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
        {homeFilterChips.map(chip => {
          const isActive = chip === activeFilter;

          return (
            <Pressable
              key={chip}
              onPress={() => handleFilterPress(chip)}
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
  ), [activeFilter, error, filteredProducts.length, handleFilterPress, loading, searchText]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading && filteredProducts.length === 0 ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#22D3EE" />
            <Text style={styles.stateText}>Loading products...</Text>
          </View>
        ) : error && filteredProducts.length === 0 ? (
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
            keyExtractor={keyExtractor}
            renderItem={renderProductCard}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={
              loading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator color="#22D3EE" />
                  <Text style={styles.emptyText}>Refreshing products...</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptyText}>
                  Try a different search or choose another filter.
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export { HomeScreen };
