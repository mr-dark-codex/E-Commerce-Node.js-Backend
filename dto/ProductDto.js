export class CreateProductDto {
  constructor({ name, description, price, category, stock, images }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.images = images || [];
  }
}

export class UpdateProductDto {
  constructor({ name, description, price, category, stock, images, isActive }) {
    if (name !== undefined) this.name = name;
    if (description !== undefined) this.description = description;
    if (price !== undefined) this.price = price;
    if (category !== undefined) this.category = category;
    if (stock !== undefined) this.stock = stock;
    if (images !== undefined) this.images = images;
    if (isActive !== undefined) this.isActive = isActive;
  }
}

export class ProductResponseDto {
  constructor(product) {
    this.id = product._id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.category = product.category;
    this.stock = product.stock;
    this.images = product.images;
    this.isActive = product.isActive;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}