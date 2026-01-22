import {
  PG_DATABASE,
  PG_HOST,
  PG_PASSWORD,
  PG_PORT,
  PG_SCHEMA,
  PG_USER,
} from "../../configuration/pgSchema.ts";

import { Sequelize } from "sequelize";

export const pgConn = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  schema: PG_SCHEMA,
  dialect: "postgres",
  timezone: "-05:00",
});
