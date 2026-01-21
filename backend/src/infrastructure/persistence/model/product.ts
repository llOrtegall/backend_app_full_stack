import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { pgConn } from "../connection/pg.ts";

export class ProductModel extends Model<
  InferAttributes<ProductModel>,
  InferCreationAttributes<ProductModel>
> {
  declare id: string;
  declare name: string;
  declare description: string;
  declare sku: string;
  declare barcode?: string | undefined;
  declare quantity: number;
  declare minStock: number;
  declare maxStock?: number | undefined;
  declare cost?: number | undefined;
  declare price: number;
  declare category: string;
  declare image?: string | undefined;
  declare notes?: string | undefined;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProductModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    barcode: { type: DataTypes.STRING, allowNull: true, unique: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    minStock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    maxStock: { type: DataTypes.INTEGER, allowNull: true },
    cost: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: pgConn,
    tableName: "products",
  },
);
