import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface Field {
  name: string;
  value: string;
  rules: ValidationRule[];
  touched: boolean;
  errors: string[];
}

interface FormValidationProps {
  children: React.ReactNode;
  onValidSubmit: (data: Record<string, string>) => void;
  className?: string;
}

const FormValidation: React.FC<FormValidationProps> = ({
  children,
  onValidSubmit,
  className = ''
}) => {
  const [fields, setFields] = useState<Record<string, Field>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((name: string, value: string, rules: ValidationRule[] = []) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        name,
        value,
        rules,
        touched: prev[name]?.touched || false,
        errors: validateField(value, rules)
      }
    }));
  }, []);

  const validateField = (value: string, rules: ValidationRule[]): string[] => {
    return rules.filter(rule => !rule.test(value)).map(rule => rule.message);
  };

  const markFieldTouched = useCallback((name: string) => {
    setFields(prev => ({
      ...prev,
      [name]: prev[name] ? { ...prev[name], touched: true } : prev[name]
    }));
  }, []);

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const updatedFields = { ...fields };

    Object.keys(updatedFields).forEach(name => {
      const field = updatedFields[name];
      const errors = validateField(field.value, field.rules);
      updatedFields[name] = {
        ...field,
        touched: true,
        errors
      };
      if (errors.length > 0) isValid = false;
    });

    setFields(updatedFields);
    return isValid;
  }, [fields]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      // Focus first field with error
      const firstErrorField = Object.values(fields).find(field => field.errors.length > 0);
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField.name}"]`) as HTMLElement;
        element?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = Object.keys(fields).reduce((acc, key) => {
        acc[key] = fields[key].value;
        return acc;
      }, {} as Record<string, string>);
      
      await onValidSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [fields, onValidSubmit, validateAll]);

  const formContext = {
    fields,
    updateField,
    markFieldTouched,
    isSubmitting
  };

  return (
    <form onSubmit={handleSubmit} className={`validated-form ${className}`} noValidate>
      <FormContext.Provider value={formContext}>
        {children}
      </FormContext.Provider>
    </form>
  );
};

// Context for form validation
const FormContext = React.createContext<any>(null);

// Validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value: string) => value.trim().length > 0,
    message
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    test: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters long`
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value: string) => value.length <= max,
    message: message || `Must be no more than ${max} characters long`
  }),
  
  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    test: (value: string) => {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    },
    message
  }),
  
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    test: (value: string) => regex.test(value),
    message
  }),
  
  custom: (testFn: (value: string) => boolean, message: string): ValidationRule => ({
    test: testFn,
    message
  })
};

// Validated Input Component
interface ValidatedInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  rules?: ValidationRule[];
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  'aria-describedby'?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  name,
  type = 'text',
  placeholder,
  rules = [],
  className = '',
  disabled = false,
  autoComplete,
  ...props
}) => {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('ValidatedInput must be used within FormValidation');

  const { fields, updateField, markFieldTouched, isSubmitting } = context;
  const field = fields[name] || { value: '', errors: [], touched: false };
  const hasErrors = field.touched && field.errors.length > 0;
  const isValid = field.touched && field.errors.length === 0 && field.value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(name, e.target.value, rules);
  };

  const handleBlur = () => {
    markFieldTouched(name);
  };

  const errorId = `${name}-error`;
  const helpId = `${name}-help`;

  return (
    <div className="validated-input-group">
      <div className="input-wrapper">
        <input
          name={name}
          type={type}
          value={field.value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`validated-input ${className} ${hasErrors ? 'error' : ''} ${isValid ? 'valid' : ''}`}
          disabled={disabled || isSubmitting}
          autoComplete={autoComplete}
          aria-invalid={hasErrors}
          aria-describedby={hasErrors ? errorId : helpId}
          {...props}
        />
        
        {isValid && (
          <div className="input-icon valid">
            <FaCheck />
          </div>
        )}
        
        {hasErrors && (
          <div className="input-icon error">
            <FaExclamationTriangle />
          </div>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {hasErrors && (
          <motion.div
            id={errorId}
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            aria-live="polite"
          >
            {field.errors.map((error, index) => (
              <div key={index} className="error-text">
                {error}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Validated Textarea Component
interface ValidatedTextareaProps {
  name: string;
  placeholder?: string;
  rules?: ValidationRule[];
  className?: string;
  disabled?: boolean;
  rows?: number;
}

export const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({
  name,
  placeholder,
  rules = [],
  className = '',
  disabled = false,
  rows = 4
}) => {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('ValidatedTextarea must be used within FormValidation');

  const { fields, updateField, markFieldTouched, isSubmitting } = context;
  const field = fields[name] || { value: '', errors: [], touched: false };
  const hasErrors = field.touched && field.errors.length > 0;
  const isValid = field.touched && field.errors.length === 0 && field.value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField(name, e.target.value, rules);
  };

  const handleBlur = () => {
    markFieldTouched(name);
  };

  const errorId = `${name}-error`;

  return (
    <div className="validated-input-group">
      <textarea
        name={name}
        value={field.value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        className={`validated-textarea ${className} ${hasErrors ? 'error' : ''} ${isValid ? 'valid' : ''}`}
        disabled={disabled || isSubmitting}
        aria-invalid={hasErrors}
        aria-describedby={hasErrors ? errorId : undefined}
      />
      
      <AnimatePresence mode="wait">
        {hasErrors && (
          <motion.div
            id={errorId}
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            aria-live="polite"
          >
            {field.errors.map((error, index) => (
              <div key={index} className="error-text">
                {error}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormValidation;