
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/data/products";
import { 
  getOrders, 
  Order, 
  updateOrderStatus, 
  getClaims,
  Claim,
  updateClaimStatus,
  getInventory,
  saveInventory
} from "@/utils/orderStore";
import { toast } from "@/components/ui/sonner";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("ventas");
  
  // Estado para el panel de ventas
  const [ordenes, setOrdenes] = useState<Order[]>([]);
  
  // Estado para el panel de reclamos
  const [reclamos, setReclamos] = useState<Claim[]>([]);
  
  // Estado para el panel de stock
  const [inventario, setInventario] = useState(
    products.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 50) + 10 // Stock aleatorio entre 10 y 60 unidades
    }))
  );
  
  // Cargar órdenes, reclamos e inventario al iniciar
  useEffect(() => {
    const loadedOrders = getOrders();
    setOrdenes(loadedOrders);
    
    const loadedClaims = getClaims();
    setReclamos(loadedClaims);
    
    // Cargar inventario si existe, si no, inicializar con valores aleatorios
    const loadedInventory = getInventory();
    if (loadedInventory.length) {
      setInventario(loadedInventory);
    } else {
      // Si no hay inventario guardado, inicializar y guardarlo
      saveInventory(inventario);
    }
  }, []);
  
  // Función para actualizar stock
  const actualizarStock = (id: number, nuevoStock: number) => {
    const updatedInventory = inventario.map(item => 
      item.id === id ? { ...item, stock: nuevoStock } : item
    );
    setInventario(updatedInventory);
    saveInventory(updatedInventory);
    toast(`Stock del producto #${id} actualizado a ${nuevoStock} unidades`);
  };
  
  // Función para cambiar el estado de una orden
  const cambiarEstadoOrden = (id: number, nuevoEstado: Order['status']) => {
    const actualizado = updateOrderStatus(id, nuevoEstado);
    
    if (actualizado) {
      // Actualizar estado local
      setOrdenes(prev => prev.map(orden => 
        orden.id === id ? {...orden, status: nuevoEstado} : orden
      ));
      toast(`Estado de la orden ${id} actualizado a ${nuevoEstado}`);
    } else {
      toast(`Error al actualizar la orden ${id}`, {
        description: "No se encontró la orden especificada"
      });
    }
  };
  
  // Función para cambiar el estado de un reclamo
  const cambiarEstadoReclamo = (id: number, nuevoEstado: Claim['status']) => {
    const actualizado = updateClaimStatus(id, nuevoEstado);
    
    if (actualizado) {
      // Actualizar estado local
      setReclamos(prev => prev.map(reclamo => 
        reclamo.id === id ? {...reclamo, status: nuevoEstado} : reclamo
      ));
      toast(`Estado del reclamo ${id} actualizado a ${nuevoEstado}`);
    } else {
      toast(`Error al actualizar el reclamo ${id}`, {
        description: "No se encontró el reclamo especificado"
      });
    }
  };
  
  // Formatear productos para mostrar en la tabla
  const formatearProductos = (order: Order) => {
    return order.products.map(item => `${item.name} (${item.quantity})`).join(", ");
  };
  
  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-800 mb-8">Panel de Administración</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
            <TabsTrigger value="reclamos">Reclamos</TabsTrigger>
            <TabsTrigger value="stock">Inventario</TabsTrigger>
          </TabsList>
          
          {/* Panel de Ventas */}
          <TabsContent value="ventas">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                {ordenes.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-amber-700">No hay pedidos registrados todavía</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tiempos Estimados</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordenes.map(orden => (
                        <TableRow key={orden.id}>
                          <TableCell>{orden.id}</TableCell>
                          <TableCell>{orden.clientName}</TableCell>
                          <TableCell>{formatearProductos(orden)}</TableCell>
                          <TableCell>${orden.total.toFixed(2)}</TableCell>
                          <TableCell>{orden.date}</TableCell>
                          <TableCell>
                            {orden.estimatedPreparationTime && orden.estimatedDeliveryTime ? (
                              <div className="text-xs">
                                <p>Preparación: {orden.estimatedPreparationTime} min</p>
                                <p>Entrega: {orden.estimatedDeliveryTime} min</p>
                                <p className="font-medium">Total: {orden.estimatedPreparationTime + orden.estimatedDeliveryTime} min</p>
                              </div>
                            ) : (
                              <span className="text-amber-500">No disponible</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              orden.status === "Entregado" ? "bg-green-100 text-green-800" :
                              orden.status === "En proceso" ? "bg-blue-100 text-blue-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {orden.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={orden.status}
                              onValueChange={(value) => cambiarEstadoOrden(orden.id, value as Order['status'])}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Cambiar estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="En proceso">En proceso</SelectItem>
                                <SelectItem value="Entregado">Entregado</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Panel de Reclamos */}
          <TabsContent value="reclamos">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Reclamos</CardTitle>
              </CardHeader>
              <CardContent>
                {reclamos.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-amber-700">No hay reclamos registrados todavía</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Asunto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reclamos.map(reclamo => (
                        <TableRow key={reclamo.id}>
                          <TableCell>{reclamo.id}</TableCell>
                          <TableCell>{reclamo.clientName}</TableCell>
                          <TableCell>{reclamo.subject}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              reclamo.claimType === "reclamo" ? "bg-red-100 text-red-800" : 
                              reclamo.claimType === "sugerencia" ? "bg-blue-100 text-blue-800" :
                              reclamo.claimType === "pedido" ? "bg-purple-100 text-purple-800" :
                              "bg-green-100 text-green-800"
                            }`}>
                              {reclamo.claimType === "consulta" ? "Consulta" :
                              reclamo.claimType === "reclamo" ? "Reclamo" :
                              reclamo.claimType === "sugerencia" ? "Sugerencia" : "Problema de Pedido"}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{reclamo.message}</TableCell>
                          <TableCell>{reclamo.date}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              reclamo.status === "Resuelto" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {reclamo.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={reclamo.status}
                              onValueChange={(value) => cambiarEstadoReclamo(reclamo.id, value as Claim['status'])}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Cambiar estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="Resuelto">Resuelto</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Panel de Stock */}
          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock Actual</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventario.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={item.stock} 
                            onChange={(e) => actualizarStock(item.id, parseInt(e.target.value) || 0)}
                            className="w-20" 
                          />
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => actualizarStock(item.id, Math.max(0, item.stock - 1))}
                            disabled={item.stock <= 0}
                          >
                            -
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => actualizarStock(item.id, item.stock + 1)}
                          >
                            +
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
