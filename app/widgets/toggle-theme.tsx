"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
      className="bg-primary dark:bg-gray-50 hover:bg-slate-600 dark:hover:bg-gray-300 transition-all duration-100 text-white dark:text-slate-800 px-2 py-2 rounded-lg absolute bottom-2 right-2"
    >
      {theme == "dark" ? <Sun /> : <Moon />}
    </button>
  );
};

export default ThemeToggle;
