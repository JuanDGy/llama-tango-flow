
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { MAX_PRODUCTS_PER_USER } from "@/utils/orderStore";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity?: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const { t } = useLanguage();

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("cafeCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cafeCart", JSON.stringify(cart));
  }, [cart]);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find((item) => item.id === product.id);
      
      // Verificar el límite de productos
      const currentTotal = getTotalItems();
      const newTotal = existingProduct 
        ? currentTotal + quantity 
        : currentTotal + quantity;
        
      if (newTotal > MAX_PRODUCTS_PER_USER) {
        toast(t("maxProductsReached"));
        return currentCart;
      }
      
      if (existingProduct) {
        // Update quantity if product already exists
        toast(`Actualizada la cantidad de ${product.name} en el carrito`);
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        // Add new product
        toast(`${product.name} agregado al carrito`);
        return [...currentCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) => {
      const productToRemove = currentCart.find(item => item.id === productId);
      if (productToRemove) {
        toast(`${productToRemove.name} eliminado del carrito`);
      }
      return currentCart.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((currentCart) => {
      // Verificar el límite de productos
      const productToUpdate = currentCart.find(item => item.id === productId);
      if (!productToUpdate) return currentCart;
      
      const oldQuantity = productToUpdate.quantity || 1;
      const quantityDiff = quantity - oldQuantity;
      const currentTotal = getTotalItems();
      const newTotal = currentTotal + quantityDiff;
      
      if (newTotal > MAX_PRODUCTS_PER_USER) {
        toast(t("maxProductsReached"));
        return currentCart;
      }
      
      return currentCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    toast("Carrito vaciado");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
