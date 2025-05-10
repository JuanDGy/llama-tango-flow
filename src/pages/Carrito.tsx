
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import { toast } from "@/components/ui/sonner";

const Carrito = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast("Tu carrito está vacío");
      return;
    }
    
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">Tu Carrito</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl text-amber-800 mb-4">Tu carrito está vacío</h2>
            <p className="text-amber-700 mb-6">¡Agrega algunos productos de nuestro catálogo!</p>
            <Button 
              className="bg-amber-700 hover:bg-amber-800"
              onClick={() => navigate("/catalogo")}
            >
              Ver Catálogo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center">
                      <div className="sm:w-20 h-20 mb-4 sm:mb-0 sm:mr-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded" 
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-amber-900">{item.name}</h3>
                        <p className="text-amber-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center mt-4 sm:mt-0">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="bg-amber-200 hover:bg-amber-300 text-amber-800 w-8 h-8 rounded"
                        >
                          -
                        </button>
                        <span className="mx-3 w-8 text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="bg-amber-200 hover:bg-amber-300 text-amber-800 w-8 h-8 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-right">
                  <Button 
                    variant="outline" 
                    className="text-amber-700 border-amber-700 hover:bg-amber-100"
                    onClick={clearCart}
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-800">Resumen de Compra</CardTitle>
                  <CardDescription>
                    {cart.length} producto{cart.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x {item.quantity || 1}</span>
                        <span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-amber-200 pt-2 mt-4">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-amber-700 hover:bg-amber-800"
                    onClick={handleCheckout}
                  >
                    Continuar con la compra
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
