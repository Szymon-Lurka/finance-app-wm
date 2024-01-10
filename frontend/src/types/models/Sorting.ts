type SortOrder = 'ascending' | 'descending';

interface DefaultSortDetails {
    order: SortOrder;
    parameter: string;
}

export {
    SortOrder,
    DefaultSortDetails
}