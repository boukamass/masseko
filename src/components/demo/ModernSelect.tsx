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
        return 'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800/80';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/80';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/80';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800/80';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  // Variant styling for trigger button
  const getTriggerStyles = () => {
    if (variant === 'danger') {
      return `border-red-300/80 dark:border-red-900/80 bg-red-50/60 dark:bg-red-950/40 text-red-950 dark:text-red-200 hover:border-red-400 dark:hover:border-red-700 shadow-2xs ${
        isOpen ? 'ring-2 ring-red-400/40 border-red-500' : ''
      }`;
    }
    if (variant === 'accent') {
      return `border-[#1BA9C5]/40 bg-[#0A3D62]/10 dark:bg-[#0A3D62]/30 text-[#0A3D62] dark:text-cyan-200 hover:border-[#1BA9C5] shadow-2xs ${
        isOpen ? 'ring-2 ring-[#1BA9C5]/40 border-[#1BA9C5]' : ''
      }`;
    }
    if (isFixora) {
      return `bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 ${
        isOpen ? 'ring-2 ring-sky-500/20 border-sky-600' : ''
      }`;
    }
    return `bg-slate-900 border-slate-700 hover:border-slate-600 text-slate-100 shadow-xs ${
      isOpen ? 'ring-2 ring-sky-400/30 border-sky-400' : ''
    }`;
  };

  const getDropdownMenuStyles = () => {
    if (isFixora) {
      return 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700/90 text-slate-800 dark:text-slate-100 shadow-xl';
    }
    return 'bg-slate-950 border-slate-800 text-slate-100 shadow-xl';
  };

  return (
    <div className={`relative w-full text-left ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 tracking-tight whitespace-nowrap">
          {label}
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between rounded-xl border transition-all duration-150 select-none ${
          size === 'sm' ? 'px-2.5 py-2 text-[11px]' : 'px-3 py-2.5 text-xs'
        } ${getTriggerStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0 flex-1">
          {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-1.5 truncate min-w-0">
              <span className="font-extrabold truncate whitespace-nowrap">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span
                  className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md border shrink-0 whitespace-nowrap uppercase tracking-tight ${getBadgeStyle(
                    selectedOption.badgeColor
                  )}`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 italic whitespace-nowrap">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 text-slate-400 ml-2 ${
            isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
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
            <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un site ou secteur..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 divide-y-0 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400 font-medium">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                      isSelected
                        ? isFixora
                          ? 'bg-sky-50 text-sky-950 font-bold dark:bg-sky-950/70 dark:text-sky-200'
                          : 'bg-[#0A3D62] text-white font-bold'
                        : isFixora
                        ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        : 'hover:bg-slate-800 text-slate-200'
                    } ${option.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex flex-col min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {option.icon && <span className="shrink-0">{option.icon}</span>}
                        <span className="truncate whitespace-nowrap font-bold">{option.label}</span>
                        {option.badge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border shrink-0 whitespace-nowrap tracking-tight ${getBadgeStyle(
                              option.badgeColor
                            )}`}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.subtitle && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 truncate block mt-0.5">
                          {option.subtitle}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1.5" />
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
