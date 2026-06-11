export type SortBy = "relevance" | "price" | "distance";

export type Filters = {
  bedrooms: number | null;
  furnished: boolean | null;
  propertyType: string | null;
  leaseLength: string | null;
  sortBy: SortBy;
};