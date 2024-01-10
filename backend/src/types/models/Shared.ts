interface SharedQuery {
    page?: string;
    pageSize?: string;
    sortOrder?: '-1' | '1';
    sortParameter?: string;
}

interface FacetsConfig extends SharedQuery {
    page: string;
    pageSize: string;
    fields: { [key: string]: 1 | 0 };
}

export {
    SharedQuery,
    FacetsConfig
}