import React from "react";

const Button = ({
  title,
  id,
  rightIcon,
  leftIcon,
  containerClass,
  onClick,
  disabled = false,
  type = "button",
  href,
  target,
  download,
}) => {
  // If href is provided, render as a link
  if (href) {
    return (
      <a
        href={href}
        target={target}
        download={download}
        id={id}
        className={`group relative z-10 w-fit cursor-pointer overflow-hidden 
          border-2 border-current px-8 py-3 
          font-medium text-sm uppercase tracking-wider
          transition-all duration-300 ease-in-out
          hover:bg-white hover:text-black hover:border-white
          active:scale-95 inline-flex items-center justify-center gap-2
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${containerClass}`}
      >
        {leftIcon && <span className="relative z-10">{leftIcon}</span>}
        <span className="relative z-10 transition-colors duration-300">
          {title}
        </span>
        {rightIcon && <span className="relative z-10">{rightIcon}</span>}

        {/* Hover background effect */}
        <div
          className="absolute inset-0 bg-white transform scale-x-0 origin-left 
          transition-transform duration-300 ease-in-out group-hover:scale-x-100"
        ></div>
      </a>
    );
  }

  // Render as button
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative z-10 w-fit cursor-pointer overflow-hidden 
        border-2 border-current px-8 py-3 
        font-medium text-sm uppercase tracking-wider
        transition-all duration-300 ease-in-out
        hover:bg-white hover:text-black hover:border-white
        active:scale-95 flex items-center justify-center gap-2
        ${disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-current" : ""}
        ${containerClass}`}
    >
      {leftIcon && <span className="relative z-10">{leftIcon}</span>}
      <span className="relative z-10 transition-colors duration-300">
        {title}
      </span>
      {rightIcon && <span className="relative z-10">{rightIcon}</span>}

      {/* Hover background effect */}
      <div
        className={`absolute inset-0 bg-white transform scale-x-0 origin-left 
        transition-transform duration-300 ease-in-out 
        ${disabled ? "" : "group-hover:scale-x-100"}`}
      ></div>
    </button>
  );
};

export default Button;
