import {isEmpty} from "../tools/validatorTools";
import {FacetsConfig, SharedQuery} from "../../types/models/Shared";
import mongoose from "mongoose";

interface AggregateFeaturesFieldMap {
    [key: string]: string[] | string;
}

interface AggregateFeaturesQuery {
    [key: string]: string;
}

interface Filters {
    [key: string]: any;
}

const getMatchFilters = (query: AggregateFeaturesQuery, fieldMap: AggregateFeaturesFieldMap) => {
    const filters: Filters = {};

    const setFilterValue = (field: string, operator: string, value: any) => {
        filters[field] = filters[field] || {};
        filters[field][operator] = value;
    };

    console.log(query);

    Object.entries(query).forEach(([key, value]) => {
        const filterField = fieldMap[key];

        if (!isEmpty(value)) {
            if (Array.isArray(filterField)) {
                if (key === 'searchText') {
                    filters.$or = filterField.map((field) => ({
                        [field]: {$regex: value, $options: 'i'}
                    }));
                } else if (['dateFrom', 'dateTo'].includes(key)) {
                    filterField.forEach((field) => {
                        setFilterValue(field, `$${key === 'dateFrom' ? 'gte' : 'lte'}`, new Date(value));
                    });
                } else if (['amountTo', 'amountFrom'].includes(key)) {
                    filterField.forEach((field) => {
                        setFilterValue(field, `$${key === 'amountFrom' ? 'gte' : 'lte'}`, parseFloat(value));
                    });
                } else if (key === 'type') {
                    console.log('XD');
                    filterField.forEach((field) => {
                        setFilterValue(field, '$eq', value);
                    });
                }
            } else if (key === 'categoryId') {
                const categoriesId = value.split(',').map((id) => new mongoose.Types.ObjectId(id));
                filters['categoryId'] = {$in: categoriesId};
            }
        }
    });

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
    if (config.getAll) return facets;
    facets.paginatedResults.unshift({
        $limit: parseInt(config.pageSize)
    })
    facets.paginatedResults.unshift({
        $skip: (parseInt(config.page) - 1) * parseInt(config.pageSize)
    })
    if (config.sortParameter) {
        facets.paginatedResults.unshift(
            {$sort: {[config.sortParameter]: config.sortOrder ? parseInt(config.sortOrder) : -1}}
        );
    }

    return facets;
}

export {
    getMatchFilters,
    getFacets
}