import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  transparent?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  type,
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  transparent = false
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-5 py-2 text-sm",
    md: "px-6 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      `${transparent ? "bg-transparent" : "bg-primary-500"} text-white shadow-theme-xs hover:bg-primary-600 disabled:bg-gray-300`,
    outline:
      `${transparent ? "bg-transparent" : "bg-white"} text-primary-500 ring-1 ring-inset ring-primary-500 hover:bg-gray-50 ${transparent ? "dark:bg-transparent" : "dark:bg-gray-800"} dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300`,
  };

  return (
    <button
      type={type}
      className={`relative inline-flex items-center justify-center font-medium gap-2 rounded-3xl transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
