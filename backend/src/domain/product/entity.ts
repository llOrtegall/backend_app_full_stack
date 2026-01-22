export interface IProduct {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  quantity: number;
  minStock: number;
  maxStock?: number;
  cost?: number;
  price: number;
  category: string;
  image?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductEntity implements IProduct {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode?: string | undefined;
  quantity: number;
  minStock: number;
  maxStock?: number | undefined;
  cost?: number | undefined;
  price: number;
  category: string;
  image?: string | undefined;
  notes?: string | undefined;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IProduct) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.sku = props.sku;
    this.barcode = props.barcode;
    this.quantity = props.quantity;
    this.minStock = props.minStock;
    this.maxStock = props.maxStock;
    this.cost = props.cost;
    this.price = props.price;
    this.category = props.category;
    this.image = props.image;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
