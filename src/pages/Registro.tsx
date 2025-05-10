
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!nombre || !email || !password || !confirmPassword) {
      toast("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    // In a real app, this would be an API call
    setTimeout(() => {
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("cafeUsers") || "[]");
      
      // Check if user already exists
      const userExists = existingUsers.some((user: any) => user.email === email);
      
      if (userExists) {
        toast("El email ya está registrado");
        setLoading(false);
        return;
      }

      // Add new user
      const newUser = { nombre, email, password };
      existingUsers.push(newUser);
      
      // Save updated users array
      localStorage.setItem("cafeUsers", JSON.stringify(existingUsers));
      
      toast("Registro exitoso. Ahora puedes iniciar sesión");
      navigate("/login");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-800">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para acceder a nuestros productos exclusivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-amber-900">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-amber-700 hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Registro;
