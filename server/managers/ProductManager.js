import { ProductModel } from "../models/product.model.js";

export class ProductManager {
  // Arma el objeto de respuesta con la info de paginación
  #buildPaginationResult(result, baseUrl, queryParams) {
    const buildLink = (page) => {
      if (!page) return null;
      const params = new URLSearchParams(queryParams);
      params.set("page", page);
      return `${baseUrl}?${params.toString()}`;
    };

    return {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(result.prevPage),
      nextLink: buildLink(result.nextPage),
    };
  }

  async getProducts({ limit = 10, page = 1, sort, query, baseUrl = "/api/products" } = {}) {
    const filter = {};

    if (query) {
      // query puede venir como "categoria:Electronica" o "disponibilidad:true"
      // o simplemente como el valor de una categoría / "available"
      const [key, value] = query.includes(":") ? query.split(":") : [null, query];

      if (key === "category") {
        filter.category = { $regex: new RegExp(value, "i") };
      } else if (key === "availability" || key === "status") {
        filter.status = value === "true" || value === "available";
      } else if (value === "available" || value === "unavailable") {
        filter.status = value === "available";
      } else {
        // búsqueda general: coincide por categoría exacta/parcial
        filter.category = { $regex: new RegExp(value, "i") };
      }
    }

    const sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      lean: true,
      sort: Object.keys(sortOption).length ? sortOption : undefined,
    };

    const result = await ProductModel.paginate(filter, options);

    const queryParams = {};
    if (limit) queryParams.limit = limit;
    if (sort) queryParams.sort = sort;
    if (query) queryParams.query = query;

    return this.#buildPaginationResult(result, baseUrl, queryParams);
  }

  async getProductById(id) {
    return ProductModel.findById(id).lean();
  }

  async addProduct(product) {
    return ProductModel.create(product);
  }

  async updateProduct(id, updates) {
    const { _id, ...fieldsToUpdate } = updates;
    return ProductModel.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
    }).lean();
  }

  async deleteProduct(id) {
    const deleted = await ProductModel.findByIdAndDelete(id);
    return Boolean(deleted);
  }
}
