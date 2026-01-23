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

function NewProductPage() {
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
    <section className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      
      <article className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <header className="bg-linear-to-r from-gray-800 to-gray-700 px-8 py-6 border-b border-gray-300">
          <h1 className="text-3xl font-bold text-white tracking-tight">Crear Nuevo Producto</h1>
          <p className="text-gray-300 text-sm mt-1">Complete los campos para agregar un producto al inventario</p>
        </header>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Nombre*</span>
              <input
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                value={form.name}
                onChange={(e) => handleTextChange("name", e.target.value)}
                placeholder="Camiseta clasica"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Categoria*</span>
              <input
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                value={form.category}
                onChange={(e) => handleTextChange("category", e.target.value)}
                placeholder="Ropa"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Cantidad*</span>
              <input
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => handleTextChange("quantity", e.target.value)}
                placeholder="50"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Stock Minimo*</span>
              <input
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                type="number"
                min={0}
                value={form.minStock}
                onChange={(e) => handleTextChange("minStock", e.target.value)}
                placeholder="10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Stock Maximo</span>
              <input
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                type="number"
                min={0}
                value={form.maxStock}
                onChange={(e) => handleTextChange("maxStock", e.target.value)}
                placeholder="150"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Costo</span>
              <input
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                type="number"
                min={0}
                step="0.01"
                value={form.cost}
                onChange={(e) => handleTextChange("cost", e.target.value)}
                placeholder="12.50"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Precio de Venta*</span>
              <input
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => handleTextChange("price", e.target.value)}
                placeholder="20.00"
                required
              />
            </label>

            <label className="flex flex-col gap-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Imagen</span>
                <span className="text-xs text-gray-500">PNG, JPG hasta 5MB</span>
              </div>
              <input
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-700 file:text-white file:cursor-pointer hover:file:bg-gray-600 file:transition-colors cursor-pointer focus:outline-none focus:border-gray-400 transition-all duration-200"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </label>

            <label className="flex flex-col gap-2 lg:col-span-2">
              <span className="text-sm font-semibold text-gray-700">Descripcion*</span>
              <textarea
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                value={form.description}
                onChange={(e) => handleTextChange("description", e.target.value)}
                placeholder="Detalles breves del producto"
                rows={3}
                required
              />
            </label>

            <label className="flex flex-col gap-2 lg:col-span-1">
              <span className="text-sm font-semibold text-gray-700">Notas</span>
              <textarea
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                value={form.notes}
                onChange={(e) => handleTextChange("notes", e.target.value)}
                placeholder="Instrucciones internas, proveedores, etc."
                rows={3}
              />
            </label>
          </div>

          <div className="flex flex-col items-center pt-8 gap-4 border-t border-gray-200 mt-8">
            <button
              className="px-8 py-3.5 bg-linear-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-w-50"
              type="submit"
              disabled={isSubmitDisabled || status.type === "loading"}>
              {status.type === "loading" ? "Guardando..." : "Guardar Producto"}
            </button>
            
            {status.type !== "idle" && (
              <div
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  status.type === "error" 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : status.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-700 border border-gray-200"
                }`}
              >
                {status.type === "loading" && "Enviando datos..."}
                {status.type === "success" && status.message}
                {status.type === "error" && status.message}
              </div>
            )}
          </div>
        </form>
      </article>

    </section>
  );
}

export default NewProductPage;
