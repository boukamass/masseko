import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface ModernSelectOption {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'red' | 'blue' | 'purple' | 'slate';
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ModernSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: ModernSelectOption[];
  label?: string;
  placeholder?: string;
  themeMode?: 'forest' | 'fixora';
  variant?: 'default' | 'danger' | 'compact' | 'accent';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  id,
  value,
  onChange,
  options,
  label,
  placeholder = 'Sélectionner...',
  themeMode = 'fixora',
  variant = 'default',
  size = 'md',
  icon,
  disabled = false,
  className = '',
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  const isFixora = themeMode === 'fixora';

  // Filtered options based on search query
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.subtitle && opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (opt.badge && opt.badge.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getBadgeStyle = (color?: ModernSelectOption['badgeColor']) => {
    switch (color) {
      case 'red':
        return 'bg-red-600 text-white border-red-700 font-black';
      case 'amber':
        return 'bg-amber-400 text-slate-950 border-amber-500 font-black';
      case 'blue':
        return 'bg-blue-600 text-white border-blue-700 font-black';
      case 'purple':
        return 'bg-purple-600 text-white border-purple-700 font-black';
      case 'emerald':
        return 'bg-emerald-600 text-white border-emerald-700 font-black';
      default:
        return 'bg-slate-300 text-slate-950 border-slate-400 font-black dark:bg-slate-700 dark:text-white dark:border-slate-600';
    }
  };

  // Variant styling for trigger button
  const getTriggerStyles = () => {
    if (variant === 'danger') {
      return `border-red-500 bg-red-50 dark:bg-red-950 text-red-950 dark:text-red-100 hover:border-red-600 shadow-xs ${
        isOpen ? 'ring-2 ring-red-500 border-red-700' : ''
      }`;
    }
    if (variant === 'accent') {
      return `border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-100 hover:border-blue-600 shadow-xs ${
        isOpen ? 'ring-2 ring-blue-500 border-blue-700' : ''
      }`;
    }
    if (isFixora) {
      return `bg-white border-slate-300 hover:border-slate-500 text-slate-950 shadow-xs dark:bg-[#1C1C1E] dark:border-slate-700 dark:text-white ${
        isOpen ? 'ring-2 ring-blue-600 border-blue-600' : ''
      }`;
    }
    return `bg-[#1C1C1E] border-slate-700 hover:border-slate-500 text-white shadow-xs ${
      isOpen ? 'ring-2 ring-sky-400 border-sky-400' : ''
    }`;
  };

  const getDropdownMenuStyles = () => {
    if (isFixora) {
      return 'bg-white dark:bg-[#1C1C1E] border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white shadow-2xl';
    }
    return 'bg-[#1C1C1E] border-slate-700 text-white shadow-2xl';
  };

  return (
    <div className={`relative w-full text-left ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-xs font-black text-slate-950 dark:text-white mb-1.5 tracking-tight whitespace-nowrap">
          {label}
        </label>
      )}

      {/* Main Trigger Button (min 44px for Apple HIG touch targets) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full min-h-[44px] flex items-center justify-between rounded-xl border transition-all duration-150 select-none ${
          size === 'sm' ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5 text-xs sm:text-sm'
        } ${getTriggerStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0 flex-1">
          {icon && <span className="shrink-0 text-slate-800 dark:text-slate-200">{icon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className="font-black text-slate-950 dark:text-white truncate whitespace-nowrap">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0 whitespace-nowrap uppercase tracking-tight shadow-2xs ${getBadgeStyle(
                    selectedOption.badgeColor
                  )}`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-700 dark:text-slate-300 font-semibold italic whitespace-nowrap">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 text-slate-800 dark:text-slate-200 ml-2 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${getDropdownMenuStyles()}`}
          style={{ maxHeight: '280px' }}
        >
          {/* Search bar */}
          {searchable && (
            <div className="p-2 border-b border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-black">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-2.5 text-slate-700 dark:text-slate-300 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un site ou secteur..."
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-1 divide-y-0 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-800 dark:text-slate-200 font-bold">
                Aucun résultat trouvé
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                      isSelected
                        ? isFixora
                          ? 'bg-blue-100 text-blue-950 font-black dark:bg-blue-950 dark:text-white border border-blue-400 shadow-2xs'
                          : 'bg-blue-600 text-white font-black'
                        : isFixora
                        ? 'hover:bg-slate-100 text-slate-950 font-bold'
                        : 'hover:bg-slate-800 text-white font-bold'
                    } ${option.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex flex-col min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {option.icon && <span className="shrink-0">{option.icon}</span>}
                        <span className="truncate whitespace-nowrap font-black">{option.label}</span>
                        {option.badge && (
                          <span
                            className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md border shrink-0 whitespace-nowrap tracking-tight ${getBadgeStyle(
                              option.badgeColor
                            )}`}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.subtitle && (
                        <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold truncate block mt-0.5">
                          {option.subtitle}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 ml-1.5 font-black" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
