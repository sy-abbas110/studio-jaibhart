"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ placeholder = "Search...", onSearchChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-md border shadow-sm focus:ring-primary focus:border-primary w-full"
        aria-label="Search"
      />
    </div>
  );
}
