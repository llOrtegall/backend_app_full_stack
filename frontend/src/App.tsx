import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type ProductFormState = {
  name: string;
  description: string;
  quantity: string;
  minStock: string;
  maxStock: string;
  cost: string;
  price: string;
  category: string;
  notes: string;
  imageFile: File | null;
};

type FormStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const initialState: ProductFormState = {
  name: "",
  description: "",
  quantity: "",
  minStock: "",
  maxStock: "",
  cost: "",
  price: "",
  category: "",
  notes: "",
  imageFile: null,
};

function App() {
  const [form, setForm] = useState<ProductFormState>(initialState);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isSubmitDisabled = useMemo(() => {
    return (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      !form.quantity.trim() ||
      !form.minStock.trim() ||
      !form.price.trim()
    );
  }, [form]);

  const handleTextChange = (
    field: keyof ProductFormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file }));
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "loading" });

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      quantity: Number(form.quantity),
      minStock: Number(form.minStock),
      maxStock: form.maxStock.trim() ? Number(form.maxStock) : undefined,
      cost: form.cost.trim() ? Number(form.cost) : undefined,
      price: Number(form.price),
      category: form.category.trim(),
      image: undefined as string | undefined,
      notes: form.notes.trim() || undefined,
    };

    const invalidNumberField = [
      { label: "Cantidad", value: payload.quantity },
      { label: "Stock minimo", value: payload.minStock },
      { label: "Precio", value: payload.price },
    ].find((field) => Number.isNaN(field.value));

    if (invalidNumberField) {
      setStatus({
        type: "error",
        message: `${invalidNumberField.label} debe ser un numero valido`,
      });
      return;
    }

    if (payload.maxStock !== undefined && Number.isNaN(payload.maxStock)) {
      setStatus({ type: "error", message: "Stock maximo debe ser un numero" });
      return;
    }

    if (payload.cost !== undefined && Number.isNaN(payload.cost)) {
      setStatus({ type: "error", message: "Costo debe ser un numero" });
      return;
    }

    try {
      const hasImage = Boolean(form.imageFile);
      const endpoint = `${API_BASE}/product`;

      const response = hasImage
        ? await (() => {
            const formData = new FormData();
            formData.append("name", payload.name);
            formData.append("description", payload.description);
            formData.append("quantity", String(payload.quantity));
            formData.append("minStock", String(payload.minStock));
            if (payload.maxStock !== undefined) {
              formData.append("maxStock", String(payload.maxStock));
            }
            if (payload.cost !== undefined) {
              formData.append("cost", String(payload.cost));
            }
            formData.append("price", String(payload.price));
            formData.append("category", payload.category);
            if (payload.notes) formData.append("notes", payload.notes);
            if (form.imageFile) formData.append("image", form.imageFile);
            return fetch(endpoint, { method: "POST", body: formData });
          })()
        : await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "No se pudo crear el producto");
      }

      setStatus({
        type: "success",
        message: `Producto ${result.name ?? payload.name} creado correctamente`,
      });
      setForm(initialState);
      setImagePreview(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrio un error inesperado";
      setStatus({ type: "error", message });
    }
  };

  return (
    <div className="page">
      <div className="glass">
        <header className="hero">
          <p className="eyebrow">Inventario</p>
          <h1>Nuevo producto</h1>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label className="field">
              <span>Nombre*</span>
              <input
                value={form.name}
                onChange={(e) => handleTextChange("name", e.target.value)}
                placeholder="Camiseta clasica"
                required
              />
            </label>

            <label className="field">
              <span>Categoria*</span>
              <input
                value={form.category}
                onChange={(e) => handleTextChange("category", e.target.value)}
                placeholder="Ropa"
                required
              />
            </label>

            <label className="field">
              <span>Cantidad*</span>
              <input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => handleTextChange("quantity", e.target.value)}
                placeholder="50"
                required
              />
            </label>

            <label className="field">
              <span>Stock minimo*</span>
              <input
                type="number"
                min={0}
                value={form.minStock}
                onChange={(e) => handleTextChange("minStock", e.target.value)}
                placeholder="10"
                required
              />
            </label>

            <label className="field">
              <span>Stock maximo</span>
              <input
                type="number"
                min={0}
                value={form.maxStock}
                onChange={(e) => handleTextChange("maxStock", e.target.value)}
                placeholder="150"
              />
            </label>

            <label className="field">
              <span>Costo - valor de compra</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.cost}
                onChange={(e) => handleTextChange("cost", e.target.value)}
                placeholder="12.50"
              />
            </label>

            <label className="field">
              <span>Precio* - valor de venta</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => handleTextChange("price", e.target.value)}
                placeholder="20.00"
                required
              />
            </label>

            <label className="field image-picker">
              <div className="image-header">
                <span>Imagen</span>
                <span className="hint">PNG, JPG hasta 5MB</span>
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {imagePreview && (
                <img src={imagePreview} alt="Vista previa" className="preview" />
              )}
            </label>
          </div>

          <label className="field">
            <span>Descripcion*</span>
            <textarea
              value={form.description}
              onChange={(e) => handleTextChange("description", e.target.value)}
              placeholder="Detalles breves del producto"
              rows={3}
              required
            />
          </label>

          <label className="field">
            <span>Notas</span>
            <textarea
              value={form.notes}
              onChange={(e) => handleTextChange("notes", e.target.value)}
              placeholder="Instrucciones internas, proveedores, etc."
              rows={2}
            />
          </label>

          <div className="actions">
            <button type="submit" disabled={isSubmitDisabled || status.type === "loading"}>
              {status.type === "loading" ? "Guardando..." : "Guardar producto"}
            </button>
            {status.type !== "idle" && (
              <span
                className={`status ${status.type === "error" ? "status-error" : "status-ok"}`}
              >
                {status.type === "loading" && "Enviando datos..."}
                {status.type === "success" && status.message}
                {status.type === "error" && status.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
