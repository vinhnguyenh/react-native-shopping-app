import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface IHomeScreenStyles {
  addButton: ViewStyle;
  card: ViewStyle;
  centerState: ViewStyle;
  chip: ViewStyle;
  chipActive: ViewStyle;
  chipRow: ViewStyle;
  chipText: TextStyle;
  chipTextActive: TextStyle;
  columnWrapper: ViewStyle;
  container: ViewStyle;
  emptyState: ViewStyle;
  emptyText: TextStyle;
  emptyTitle: TextStyle;
  errorMessage: TextStyle;
  errorTitle: TextStyle;
  favoriteButton: ViewStyle;
  headerActions: ViewStyle;
  headerBlock: ViewStyle;
  headerIconButton: ViewStyle;
  imageFallback: ViewStyle;
  imageFallbackText: TextStyle;
  imageWrapper: ViewStyle;
  listContent: ViewStyle;
  priceRow: ViewStyle;
  productCategory: TextStyle;
  productImage: ImageStyle;
  productName: TextStyle;
  productPrice: TextStyle;
  resultsText: TextStyle;
  safeArea: ViewStyle;
  searchBox: ViewStyle;
  searchInput: TextStyle;
  stateText: TextStyle;
  title: TextStyle;
  topRow: ViewStyle;
}

export const styles = StyleSheet.create<IHomeScreenStyles>({
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
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    marginRight: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  chipActive: {
    backgroundColor: '#22D3EE',
  },
  chipRow: {
    paddingBottom: 8,
  },
  chipText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#083344',
  },
  columnWrapper: {
    gap: 14,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 32,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  errorMessage: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerBlock: {
    marginBottom: 22,
  },
  headerIconButton: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
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
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 14,
    paddingTop: 10,
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
  resultsText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
  },
  stateText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 12,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
});
