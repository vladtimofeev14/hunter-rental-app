export type SortBy = "default" | "price" | "distance" | "match";

export type Filters = {
    bedrooms: number | null;
    furnished: boolean | null;
    sortBy: SortBy;
};