
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">Nuestro Catálogo de Café</h1>
        
        <div className="max-w-md mx-auto mb-8">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
              </div>
              <CardHeader>
                <CardTitle className="text-amber-800">{product.name}</CardTitle>
                <CardDescription className="text-amber-600 font-bold">
                  ${product.price.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{product.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-amber-700 hover:bg-amber-800"
                  onClick={() => addToCart(product)}
                >
                  Añadir al Carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-amber-900">No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;
