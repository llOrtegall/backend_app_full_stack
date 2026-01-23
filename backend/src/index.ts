import express from "express";
import cors from "cors";

import { pgConn } from "./infrastructure/persistence/connection/pg.ts";
import { UserModel } from "./infrastructure/persistence/model/user.ts";
import { ProductModel } from "./infrastructure/persistence/model/product.ts";
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

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

// Initialize database and sync models
async function initializeDatabase() {
  try {
    await pgConn.authenticate();
    console.log(
      "✅ PostgreSQL Database connection has been established successfully.",
    );

    // Sync all models
    await UserModel.sync();
    await ProductModel.sync();
    console.log("✅ Database models synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

// Start server only after database is initialized
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
});
