import express from "express";
import cors from "cors";

import { pgConn } from "./infrastructure/persistence/connection/pg.ts";
import { productRouter } from "./presentation/router/product.ts";
import { userRouter } from "./presentation/router/user.ts";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/user", userRouter);
app.use("/product", productRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

pgConn
  .authenticate()
  .then(() =>
    console.log(
      "PostgreSQL Database connection has been established successfully.",
    ),
  )
  .catch((err) => console.error("Unable to connect to the database:", err));
