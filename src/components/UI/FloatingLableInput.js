"use client";
import { useState, useId } from "react";   

export default function FloatingLabelInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  helperText,
  required = false,
  maxLength,
  pattern,
  inputMode,
  onKeyDown,
  onPaste,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();                             
  const errorId = `${inputId}-error`;                  
  const helperId = `${inputId}-helper`;                
  const hasValue = value && value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative">
      <div className="relative">
        <input
          id={inputId}                                  
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          maxLength={maxLength}
          pattern={pattern}
          inputMode={inputMode}
          required={required}                           
          aria-invalid={!!error}                        
          aria-describedby={                            
            error ? errorId : helperText ? helperId : undefined
          }
          className={`
            w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent
            bg-[#faf4ea] transition-all duration-200 text-[#2b1b12]
            ${isActive ? "pt-5 pb-1" : "py-3"}
            ${
              error
                ? "border-red-500 focus:ring-red-500 bg-red-50"
                : "border-[#e6ded2] focus:ring-[#c1552c]"
            }
          `}
        />
        <label
          htmlFor={inputId}                             
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${
              isActive
                ? "text-xs top-1 text-[#8a8179]"
                : "text-[#8a8179] top-1/2 transform -translate-y-1/2"
            }
            ${error ? "text-red-500" : ""}
          `}
        >
          {label}
          {required && " *"}
        </label>
      </div>

      {helperText && !error && (
        <p id={helperId} className="text-xs text-[#8a8179] mt-1">  
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 mt-1"> 
          {error}
        </p>
      )}
    </div>
  );
}