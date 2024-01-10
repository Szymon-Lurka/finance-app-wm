class ApiFeatures<T> {
    constructor(public query: T | any, public queryString: {
        sort?: string;
        sortOrder?: '+' | '-';
        fields?: string;
        page: number;
        limit: number;
    } = {page: 0, limit: 0}) {
    }

    filter() {
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'sortOrder'];
        // @ts-ignore
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const desc = this.queryString.sortOrder === '+';
            const sortBy: { [key: string]: number } = {};
            this.queryString.sort.split(',').forEach((str: string) => {
                sortBy[str] = desc ? -1 : 1;
            })
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort({createdAt: -1});
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page == 1 ? 0 : this.queryString.page * 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = page * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export {
    ApiFeatures
}