import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "../context/CartContext";
import { locations } from "../data/products";
import { toast } from "@/components/ui/sonner";
import { saveOrder, OrderItem } from "@/utils/orderStore";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [locationId, setLocationId] = useState("");
  const [direccion, setDireccion] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState({
    estimatedPreparation: 0,
    estimatedDelivery: 0,
  });

  // Prefill form with user data if available
  useEffect(() => {
    const userData = localStorage.getItem("cafeUser");
    if (userData) {
      const user = JSON.parse(userData);
      setNombre(user.nombre || user.name || "");
      setEmail(user.email || "");
    }
  }, []);
  
  // Calculate delivery time
  useEffect(() => {
    if (locationId && direccion) {
      const selectedLocation = locations.find(loc => loc.id === Number(locationId));
      if (selectedLocation) {
        // Preparation time is fixed
        const preparationMinutes = 20;
        
        // Add a base delivery time based on location
        const deliveryMinutes = selectedLocation.deliveryTime;
        
        setDeliveryInfo({
          estimatedPreparation: preparationMinutes,
          estimatedDelivery: deliveryMinutes,
        });
      }
    }
  }, [locationId, direccion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!nombre || !email || !locationId || !direccion) {
      toast("Por favor completa todos los campos");
      return;
    }
    
    // Crear los items del pedido
    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    }));
    
    // Guardar el pedido
    const newOrder = saveOrder({
      clientName: nombre,
      clientEmail: email,
      products: orderItems,
      total: getTotalPrice(),
      locationId: Number(locationId),
      address: direccion
    });
    
    // Process payment (in a real app, this would be a payment gateway integration)
    setTimeout(() => {
      toast("¡Compra realizada con éxito!");
      toast(`Pedido #${newOrder.id} registrado`, {
        description: "Puedes seguir el estado de tu pedido contactándonos"
      });
      clearCart();
      navigate("/");
    }, 1500);
  };

  if (cart.length === 0) {
    navigate("/carrito");
    return null;
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-800">Información de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Localidad</Label>
                    <select
                      id="location"
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Selecciona una localidad</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección de entrega</Label>
                    <Input
                      id="direccion"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Calle, número, piso, etc."
                      required
                    />
                  </div>
                  
                  {deliveryInfo.estimatedDelivery > 0 && (
                    <div className="mt-6 p-4 bg-amber-100 rounded-md">
                      <h3 className="font-medium text-amber-800 mb-2">Información de Entrega</h3>
                      <p className="text-amber-700">Tiempo estimado de preparación: {deliveryInfo.estimatedPreparation} minutos</p>
                      <p className="text-amber-700">Tiempo estimado de entrega: {deliveryInfo.estimatedDelivery} minutos</p>
                      <p className="font-medium text-amber-900 mt-2">
                        Tiempo total estimado: {deliveryInfo.estimatedPreparation + deliveryInfo.estimatedDelivery} minutos
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-amber-700 hover:bg-amber-800"
                    >
                      Confirmar Pedido
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-800">Resumen del Pedido</CardTitle>
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
                  variant="outline" 
                  className="w-full text-amber-700 border-amber-700 hover:bg-amber-100"
                  onClick={() => navigate("/carrito")}
                >
                  Volver al Carrito
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
