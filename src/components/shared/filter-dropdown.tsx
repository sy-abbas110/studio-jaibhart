"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  selectedValue,
  onValueChange,
  className,
}: FilterDropdownProps) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      <Label htmlFor={`filter-${label.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-foreground/80">
        {label}
      </Label>
      <Select value={selectedValue} onValueChange={onValueChange}>
        <SelectTrigger 
          id={`filter-${label.toLowerCase().replace(' ', '-')}`} 
          className="w-full md:w-[200px] bg-input shadow-sm focus:ring-primary focus:border-primary"
          aria-label={`Filter by ${label}`}
        >
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
