type SortOrder = -1 | 1 | '-1' | '1';

interface DefaultSortDetails {
    order: SortOrder;
    parameter: string;
}

export {
    SortOrder,
    DefaultSortDetails
}