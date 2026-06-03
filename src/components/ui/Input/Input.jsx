import React from 'react';

export const Input = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  prefix,
  error,
  className = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs text-muted-foreground mb-1" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`flex items-center rounded-xl border border-border bg-background/40 px-4 py-3 focus-within:border-primary/50 transition-colors ${error ? 'border-destructive' : ''}`}>
        {prefix && (
          <span className="text-xl font-semibold text-muted-foreground select-none pr-1">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-transparent text-foreground outline-none text-base font-medium placeholder:text-muted-foreground ${inputClassName}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default Input;
