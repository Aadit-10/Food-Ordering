

interface PaginateOptions {
    model: any;  // Mongoose Model
    query?: any;
    page?: number;
    limit?: number;
    sort?: any;
    projection?: any;
    populate?: any;
}

export const paginate = async ({
    model,
    query = {},
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    projection = null,
    populate = null
}: PaginateOptions) => {

    const skip = (page - 1) * limit;

    let mongooseQuery = model.find(query, projection).sort(sort).skip(skip).limit(limit);

    if (populate) {
        mongooseQuery = mongooseQuery.populate(populate);
    }

    const data = await mongooseQuery.exec();
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    return {
        data,
        totalItems,
        totalPages,
        currentPage: page
    };
};

export function getPaginationParams(req: any) {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}