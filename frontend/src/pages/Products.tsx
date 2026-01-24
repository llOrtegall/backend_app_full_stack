import axios from "axios";
import { useEffect, useState } from "react";

export interface Product {
  id: string
  name: string
  description: string
  sku: string | null
  barcode: string | null
  quantity: number
  minStock: number
  maxStock: number
  cost: string
  price: string
  category: string
  image: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Product[]>('/product')
      .then(({ data }) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "Error al cargar los productos");
        setLoading(false);
      });
  }, [])

  const getStockStatus = (product: Product) => {
    if (product.quantity <= product.minStock) {
      return { text: "Stock Bajo", color: "bg-red-100 text-red-700 border-red-200" };
    } else if (product.quantity >= product.maxStock) {
      return { text: "Stock Alto", color: "bg-green-100 text-green-700 border-green-200" };
    }
    return { text: "Stock Normal", color: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl font-bold">✕</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar productos</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Inventario de Productos</h1>
              <p className="text-gray-600 mt-1">
                {products.length} {products.length === 1 ? 'producto' : 'productos'} en total
              </p>
            </div>
            <div className="bg-linear-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold">
              {products.length}
            </div>
          </div>
        </header>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-3xl">📦</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No hay productos</h2>
            <p className="text-gray-600">Agrega productos para comenzar a verlos aquí</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <article 
                  key={product.id} 
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                        <span className="text-gray-400 text-5xl">📦</span>
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${stockStatus.color}`}>
                      {stockStatus.text}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Categoría:</span>
                        <span className="text-gray-800 font-semibold">{product.category}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Cantidad:</span>
                        <span className="text-gray-800 font-semibold">{product.quantity} unidades</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Precio:</span>
                        <span className="text-gray-800 font-bold text-lg">${parseFloat(product.price).toFixed(2)}</span>
                      </div>

                      {product.cost && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 font-medium">Costo:</span>
                          <span className="text-gray-600">${parseFloat(product.cost).toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Stock Range */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span>Min: {product.minStock}</span>
                        <span>Max: {product.maxStock}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            product.quantity <= product.minStock 
                              ? 'bg-red-500' 
                              : product.quantity >= product.maxStock 
                              ? 'bg-green-500' 
                              : 'bg-gray-600'
                          }`}
                          style={{ 
                            width: `${Math.min((product.quantity / product.maxStock) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* SKU and Barcode */}
                    {(product.sku || product.barcode) && (
                      <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
                        {product.sku && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">SKU:</span> {product.sku}
                          </div>
                        )}
                        {product.barcode && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Código:</span> {product.barcode}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}