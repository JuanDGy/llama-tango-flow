import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { saveClaim } from "@/utils/orderStore";

const Contacto = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoContacto, setTipoContacto] = useState("consulta");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!nombre || !email || !asunto || !mensaje) {
      toast("Por favor completa todos los campos");
      setIsSubmitting(false);
      return;
    }

    // Save claim to localStorage
    saveClaim({
      clientName: nombre,
      clientEmail: email,
      subject: asunto,
      message: mensaje,
      claimType: tipoContacto
    });
    
    // Show success message
    toast("Mensaje enviado correctamente. Te responderemos a la brevedad.");
    
    // Reset form
    setNombre("");
    setEmail("");
    setAsunto("");
    setMensaje("");
    setTipoContacto("consulta");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">Contacto y Soporte</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-amber-700 text-2xl mb-3">✉️</div>
              <h3 className="text-lg font-medium text-amber-900 mb-1">Email</h3>
              <p className="text-amber-800">contacto@cafedelicioso.com</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-amber-700 text-2xl mb-3">📞</div>
              <h3 className="text-lg font-medium text-amber-900 mb-1">Teléfono</h3>
              <p className="text-amber-800">+123 456 7890</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-amber-700 text-2xl mb-3">🏢</div>
              <h3 className="text-lg font-medium text-amber-900 mb-1">Dirección</h3>
              <p className="text-amber-800">Calle del Café 123, Ciudad</p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-amber-800">Envíanos un Mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="asunto">Asunto</Label>
                  <Input
                    id="asunto"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    placeholder="Asunto de tu mensaje"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipoContacto">Tipo de Contacto</Label>
                  <select
                    id="tipoContacto"
                    value={tipoContacto}
                    onChange={(e) => setTipoContacto(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="consulta">Consulta General</option>
                    <option value="reclamo">Reclamo</option>
                    <option value="sugerencia">Sugerencia</option>
                    <option value="pedido">Problema con Pedido</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <textarea
                    id="mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-amber-700 hover:bg-amber-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
