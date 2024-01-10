import {isEmpty} from "../tools/validatorTools";
import {FacetsConfig, SharedQuery} from "../../types/models/Shared";

interface AggregateFeaturesFieldMap {
    [key: string]: any[]
}

interface AggregateFeaturesQuery {
    [key: string]: string;
}

const getMatchFilters = (query: AggregateFeaturesQuery, fieldMap: AggregateFeaturesFieldMap) => {
    const filters: any = {};
    Object.keys(query).forEach((key) => {
        const filterField = fieldMap[key];
        if (!isEmpty(query[key]) && query[key]) {
            if (key === 'searchText') {
                filters.$or = filterField.map((field) => ({
                    [field]: {$regex: query[key], $options: 'i'}
                }))
            } else if (key === 'dateFrom' || key === 'dateTo') {
                filterField.forEach((field) => {
                    filters[field] = filters[field] || {};
                    filters[field][`$${key === 'dateFrom' ? 'gte' : 'lte'}`] = new Date(query[key]);
                })
            } else if (key === 'amountTo' || key === 'amountFrom') {
                filterField.forEach((field) => {
                    filters[field] = filters[field] || {};
                    filters[field][`$${key === 'amountFrom' ? 'gte' : 'lte'}`] = parseFloat(query[key])
                })
            }
        }
    })
    return filters;
};

const getFacets = (config: FacetsConfig) => {
    const facets: any = {
        paginatedResults: [
            {
                $project: {
                    ...config.fields
                }
            }
        ],
        totalCount: [
            {$count: 'count'}
        ]
    };
    facets.paginatedResults.unshift({
        $limit: parseInt(config.pageSize)
    })
    facets.paginatedResults.unshift({
        $skip: (parseInt(config.page) - 1) * parseInt(config.pageSize)
    })
    if (config.sortParameter) {
        facets.paginatedResults.unshift(
            {$sort: {[config.sortParameter]: config.sortOrder ? config.sortOrder : -1}}
        );
    }

    return facets;
}

export {
    getMatchFilters,
    getFacets
}