export class ProductAlreadyExistsError extends Error {
  constructor(sku: string) {
    super(`Product with SKU ${sku} already exists`);
    this.name = "ProductAlreadyExistsError";
  }
}

export class ProductNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Product with identifier ${identifier} not found`);
    this.name = "ProductNotFoundError";
  }
}

export class InvalidProductDataError extends Error {
  constructor(message: string) {
    super(`Invalid product data: ${message}`);
    this.name = "InvalidProductDataError";
  }
}

export class InvalidPriceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPriceError";
  }
}

export class InvalidStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidStockError";
  }
}
