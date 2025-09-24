import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Edit3, List } from 'lucide-react';

interface FlexibleInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  icon: React.ComponentType<any>;
  required?: boolean;
  errorIndex?: number;
}

export const FlexibleInput: React.FC<FlexibleInputProps> = ({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  icon: Icon,
  required = false,
  errorIndex
}) => {
  const [inputMode, setInputMode] = useState<'dropdown' | 'freetext'>('dropdown');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input - only for dropdown mode
  useEffect(() => {
    if (inputMode === 'dropdown') {
      setFilteredSuggestions(suggestions);
    } else {
      // In free text mode, don't show any suggestions
      setFilteredSuggestions([]);
    }
  }, [value, suggestions, inputMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModeToggle = () => {
    setInputMode(prev => prev === 'dropdown' ? 'freetext' : 'dropdown');
    setIsDropdownOpen(false);
    if (inputMode === 'dropdown') {
      // Focus input when switching to freetext mode
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    // Don't show suggestions in free text mode - let users write whatever they want
  };

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-field" ref={dropdownRef}>
      <div className="flex items-center justify-between mb-2">
        <label className="form-label">
          <Icon className="w-4 h-4 inline mr-2" />
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {/* Mode Toggle Button - prominent chip */}
        <button
          type="button"
          onClick={handleModeToggle}
          className="toggle-chip transition-colors duration-200"
          title={inputMode === 'dropdown' ? 'Switch to free text input' : 'Switch to dropdown'}
        >
          {inputMode === 'dropdown' ? (
            <>
              <Edit3 className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-slate-200">Free Text</span>
            </>
          ) : (
            <>
              <List className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-slate-200">Dropdown</span>
            </>
          )}
        </button>
      </div>

      <div className="relative">
        {inputMode === 'dropdown' ? (
          /* Dropdown Mode */
          <select
            value={value}
            onChange={handleDropdownSelect}
            className="w-full px-4 py-3 h-12 rounded-lg transition-all duration-200 appearance-none dark-card text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-error-index={errorIndex}
          >
            <option value="">{placeholder}</option>
            {suggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion}>
                {suggestion}
              </option>
            ))}
          </select>
        ) : (
          /* Free Text Mode with Suggestions */
          <>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full px-4 py-3 h-12 rounded-lg transition-all duration-200 dark-card text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              data-error-index={errorIndex}
            />
            
            {/* Suggestions Dropdown for Free Text */}
            {isDropdownOpen && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 rounded-lg shadow-2xl max-h-60 overflow-y-auto dark-surface">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-white/10 focus:bg-white/10 focus:outline-none transition-colors duration-150 text-slate-200"
                  >
                    {suggestion}
                  </button>
                ))}
                
                {/* Current value not in suggestions */}
                {value && !filteredSuggestions.some(s => s.toLowerCase() === value.toLowerCase()) && (
                  <div className="px-4 py-2 text-sm text-slate-400 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-3 h-3" />
                      <span>Custom: "{value}"</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Dropdown Arrow for Select */}
        {inputMode === 'dropdown' && (
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        )}
      </div>

      {/* Helper Text */}
      <div className="mt-1 text-xs text-slate-400">
        {inputMode === 'dropdown' 
          ? `Choose from ${suggestions.length} predefined options`
          : 'Type freely or select from suggestions'
        }
      </div>
    </div>
  );
};