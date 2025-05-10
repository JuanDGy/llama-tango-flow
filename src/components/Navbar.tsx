
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    // Verificar si el usuario está logueado
    const userStr = localStorage.getItem("cafeUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setIsAdmin(user.isAdmin || false);
      setUserName(user.name);
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserName("");
    }
  }, [location.pathname]); // Re-verificar cuando cambia la ruta

  const handleLogout = () => {
    // Remover al usuario del listado de activos
    const userStr = localStorage.getItem("cafeUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.email) {
        const { removeActiveUser } = require("@/utils/orderStore");
        removeActiveUser(user.email);
      }
    }
    
    localStorage.removeItem("cafeUser");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <header className="bg-amber-900 text-amber-50 p-4 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Café Delicioso</Link>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className="px-4 py-2 hover:text-amber-200 transition-colors">
                {t("navHome")}
              </Link>
            </NavigationMenuItem>
            
            {isLoggedIn && (
              <>
                <NavigationMenuItem>
                  <Link to="/catalogo" className="px-4 py-2 hover:text-amber-200 transition-colors">
                    {t("navCatalog")}
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contacto" className="px-4 py-2 hover:text-amber-200 transition-colors">
                    {t("navContact")}
                  </Link>
                </NavigationMenuItem>
                {isAdmin && (
                  <NavigationMenuItem>
                    <Link to="/admin" className="px-4 py-2 hover:text-amber-200 transition-colors">
                      Admin
                    </Link>
                  </NavigationMenuItem>
                )}
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-4">
          {/* Selector de idioma */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-amber-700 hover:bg-amber-800 text-amber-50 border-amber-50">
                {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("es")}>
                Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isLoggedIn ? (
            <>
              <span className="text-sm hidden md:inline-block">
                {t("welcome")}, {userName}
              </span>
              
              {!isAdmin && (
                <Link to="/carrito" className="relative">
                  <Button variant="ghost" className="text-amber-50">
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline" 
                className="bg-amber-700 hover:bg-amber-800 text-amber-50 border-amber-50 flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="bg-amber-700 hover:bg-amber-800 text-amber-50 border-amber-50">
                  {t("login")}
                </Button>
              </Link>
              <Link to="/registro">
                <Button variant="default" className="bg-amber-600 hover:bg-amber-700 text-amber-50">
                  {t("register")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
