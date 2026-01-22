import { randomUUID } from "node:crypto";
import { ProductEntity, type IProduct } from "./entity.ts";
import {
  InvalidProductDataError,
  InvalidPriceError,
  InvalidStockError,
} from "./errors.ts";

export function createProduct(props: {
  name: string;
  description: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  minStock: number;
  maxStock?: number;
  cost?: number;
  price: number;
  category: string;
  image?: string;
  notes?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): ProductEntity {
  // Validaciones de dominio
  if (!props.name || props.name.trim().length === 0) {
    throw new InvalidProductDataError("Name cannot be empty");
  }

  if (!props.description || props.description.trim().length === 0) {
    throw new InvalidProductDataError("Description cannot be empty");
  }

  if (props.sku !== undefined && props.sku.trim().length === 0) {
    throw new InvalidProductDataError("SKU cannot be empty");
  }

  if (props.barcode !== undefined && props.barcode.trim().length === 0) {
    throw new InvalidProductDataError("Barcode cannot be empty");
  }

  if (!props.category || props.category.trim().length === 0) {
    throw new InvalidProductDataError("Category cannot be empty");
  }

  // Validaciones de precio
  if (props.price < 0) {
    throw new InvalidPriceError("Price cannot be negative");
  }

  if (props.cost !== undefined && props.cost < 0) {
    throw new InvalidPriceError("Cost cannot be negative");
  }

  if (props.cost !== undefined && props.price < props.cost) {
    throw new InvalidPriceError("Price cannot be lower than cost");
  }

  // Validaciones de stock
  if (props.quantity < 0) {
    throw new InvalidStockError("Quantity cannot be negative");
  }

  if (props.minStock < 0) {
    throw new InvalidStockError("Min stock cannot be negative");
  }

  if (props.maxStock !== undefined && props.maxStock < 0) {
    throw new InvalidStockError("Max stock cannot be negative");
  }

  if (props.maxStock !== undefined && props.minStock > props.maxStock) {
    throw new InvalidStockError("Min stock cannot be greater than max stock");
  }

  return new ProductEntity({
    id: props.id || randomUUID(),
    name: props.name.trim(),
    description: props.description.trim(),
    sku: props.sku?.trim(),
    barcode: props.barcode?.trim(),
    quantity: props.quantity,
    minStock: props.minStock,
    maxStock: props.maxStock,
    cost: props.cost,
    price: props.price,
    category: props.category.trim(),
    image: props.image?.trim(),
    notes: props.notes?.trim(),
    createdAt: props.createdAt || new Date(),
    updatedAt: props.updatedAt || new Date(),
  });
}

export function reconstituteProduct(props: IProduct): ProductEntity {
  // Para reconstruir entidades desde la base de datos sin validaciones
  return new ProductEntity(props);
}
