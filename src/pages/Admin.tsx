
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/data/products";
import { getOrders, Order, updateOrderStatus } from "@/utils/orderStore";
import { toast } from "@/components/ui/sonner";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("ventas");
  
  // Estado para el panel de ventas
  const [ordenes, setOrdenes] = useState<Order[]>([]);
  
  // Cargar órdenes al iniciar
  useEffect(() => {
    const loadedOrders = getOrders();
    setOrdenes(loadedOrders);
  }, []);
  
  // Estado para el panel de reclamos
  const [reclamos] = useState([
    { id: 1, cliente: "Carlos Rodríguez", asunto: "Producto dañado", descripcion: "El paquete llegó abierto y el café estaba húmedo", fecha: "07/05/2025", estado: "Pendiente" },
    { id: 2, cliente: "Laura Gómez", asunto: "Retraso en entrega", descripcion: "Mi pedido tardó 3 días más de lo indicado", fecha: "05/05/2025", estado: "Resuelto" }
  ]);
  
  // Estado para el panel de stock
  const [inventario, setInventario] = useState(
    products.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 50) + 10 // Stock aleatorio entre 10 y 60 unidades
    }))
  );
  
  // Función para actualizar stock
  const actualizarStock = (id: number, nuevoStock: number) => {
    setInventario(prevState => 
      prevState.map(item => 
        item.id === id ? { ...item, stock: nuevoStock } : item
      )
    );
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Asunto</TableHead>
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
                        <TableCell>{reclamo.cliente}</TableCell>
                        <TableCell>{reclamo.asunto}</TableCell>
                        <TableCell className="max-w-xs truncate">{reclamo.descripcion}</TableCell>
                        <TableCell>{reclamo.fecha}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reclamo.estado === "Resuelto" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {reclamo.estado}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Responder</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                            onClick={() => actualizarStock(item.id, item.stock - 1)}
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
