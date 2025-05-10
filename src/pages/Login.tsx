
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { addActiveUser } from "@/utils/orderStore";
import { useLanguage } from "@/context/LanguageContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Administradores predefinidos
  const ADMIN_USERS = [
    { email: "admin1@cafe.com", password: "admin123", name: "Administrador 1" },
    { email: "admin2@cafe.com", password: "admin456", name: "Administrador 2" }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      toast("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    // Verificar si es un administrador
    const adminUser = ADMIN_USERS.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (adminUser) {
      // Es un administrador
      const adminUserData = {
        email: adminUser.email,
        name: adminUser.name,
        isAdmin: true
      };
      
      localStorage.setItem("cafeUser", JSON.stringify(adminUserData));
      toast(t("welcomeAdmin") + " " + adminUser.name);
      navigate("/admin");
      setLoading(false);
      return;
    }

    // Si no es admin, verificar usuarios normales
    setTimeout(() => {
      // Simulate checking stored users
      const users = JSON.parse(localStorage.getItem("cafeUsers") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        // Verificar el límite de usuarios concurrentes
        const canAddUser = addActiveUser(email);
        
        if (!canAddUser) {
          toast(t("maxUsersReached"));
          setLoading(false);
          return;
        }
        
        // Store authenticated user
        const { password, ...userWithoutPassword } = user;
        const userData = {
          ...userWithoutPassword,
          isAdmin: false
        };
        
        localStorage.setItem("cafeUser", JSON.stringify(userData));
        toast(t("welcome") + ", " + user.name);
        navigate("/");
      } else {
        toast("Email o contraseña incorrectos");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-800">{t("login")}</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <Button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : t("login")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-amber-900">
            ¿No tienes una cuenta?{" "}
            <Link to="/registro" className="text-amber-700 hover:underline font-medium">
              {t("register")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
