
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/data/products";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("ventas");
  
  // Estado para el panel de ventas
  const [ordenes] = useState([
    { id: 1, cliente: "María López", productos: "Café Colombiano (2)", total: 25.98, fecha: "10/05/2025", estado: "Entregado" },
    { id: 2, cliente: "Juan Pérez", productos: "Café Etíope (1), Café Brasileño (1)", total: 26.98, fecha: "09/05/2025", estado: "En proceso" },
    { id: 3, cliente: "Ana Martínez", productos: "Café Descafeinado (3)", total: 32.97, fecha: "08/05/2025", estado: "Pendiente" }
  ]);
  
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
                        <TableCell>{orden.cliente}</TableCell>
                        <TableCell>{orden.productos}</TableCell>
                        <TableCell>${orden.total.toFixed(2)}</TableCell>
                        <TableCell>{orden.fecha}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            orden.estado === "Entregado" ? "bg-green-100 text-green-800" :
                            orden.estado === "En proceso" ? "bg-blue-100 text-blue-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {orden.estado}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Ver detalles</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
