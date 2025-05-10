
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está logueado
    const user = localStorage.getItem("cafeUser");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cafeUser");
    setIsLoggedIn(false);
    toast("Sesión cerrada correctamente");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navbar */}
      <header className="bg-amber-900 text-amber-50 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Café Delicioso</h1>
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-amber-200 transition-colors">
              Inicio
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/catalogo" className="hover:text-amber-200 transition-colors">
                  Catálogo
                </Link>
                <Link to="/contacto" className="hover:text-amber-200 transition-colors">
                  Contacto
                </Link>
                <Link to="/carrito" className="hover:text-amber-200 transition-colors">
                  Carrito
                </Link>
                <Button 
                  variant="outline" 
                  className="bg-amber-700 hover:bg-amber-800 text-amber-50 border-amber-50"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="bg-amber-700 hover:bg-amber-800 text-amber-50 border-amber-50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button variant="default" className="bg-amber-600 hover:bg-amber-700 text-amber-50">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-800 to-amber-900 text-center text-amber-50">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-6">Descubre el Mejor Café</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Seleccionamos los mejores granos de café de todo el mundo para ofrecerte una experiencia única en cada taza.
          </p>
          {isLoggedIn ? (
            <Link to="/catalogo">
              <Button className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-6">
                Ver Catálogo
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-6">
                Comenzar Ahora
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-amber-900">Por Qué Elegirnos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-amber-800">Calidad Premium</h3>
              <p className="text-amber-900">
                Seleccionamos cuidadosamente los mejores granos de café de agricultores sostenibles.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-amber-800">Tueste Artesanal</h3>
              <p className="text-amber-900">
                Tostamos nuestros granos en pequeños lotes para garantizar el mejor sabor.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-amber-800">Entrega Rápida</h3>
              <p className="text-amber-900">
                Llevamos nuestros productos a tu puerta en el menor tiempo posible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-50 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Café Delicioso</h2>
              <p className="mt-2">© {new Date().getFullYear()} Todos los derechos reservados</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-200 transition-colors">
                Políticas de Privacidad
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors">
                Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
