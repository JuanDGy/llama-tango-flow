
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/utils/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.es) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Intentar obtener el idioma del localStorage o usar español como predeterminado
    const savedLanguage = localStorage.getItem("cafeLanguage") as Language;
    return savedLanguage || "es"; 
  });

  // Guardar el idioma en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("cafeLanguage", language);
  }, [language]);

  // Función para obtener la traducción por clave
  const t = (key: keyof typeof translations.es): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
