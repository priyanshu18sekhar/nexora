"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { courseCategories } from "@/src/config";
import { cn } from "@/src/lib/utils";

interface CoursesFilterProps {
  initialQuery?: string;
  initialCategory?: string;
}

export function CoursesFilter({ initialQuery = "", initialCategory = "" }: CoursesFilterProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  const submit = (q: string, cat: string) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (cat) sp.set("category", cat);
    const url = `/courses${sp.toString() ? "?" + sp.toString() : ""}`;
    if (typeof window !== "undefined") window.location.href = url;
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => { e.preventDefault(); submit(query, category); }}
        className="relative max-w-2xl mx-auto"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/40 via-blue-500/40 to-purple-500/40 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity" />
          <div className="relative flex items-center gap-2 h-14 pl-14 pr-2 rounded-2xl bg-card border border-border shadow-md focus-within:border-primary/40 transition-colors">
            <Search className="absolute left-5 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Python, Excel, AI tools, design..."
              className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground/70"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="h-10 px-5 rounded-xl gradient-bg text-white text-sm font-semibold shadow-brand hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="flex overflow-x-auto pb-2 custom-scrollbar gap-2 justify-start sm:justify-center">
        <button
          onClick={() => { setCategory(""); submit(query, ""); }}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0",
            !category
              ? "gradient-bg text-white shadow-brand"
              : "bg-card border border-border text-foreground/70 hover:text-foreground hover:border-primary/30"
          )}
        >
          All
        </button>
        {courseCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategory(cat.id); submit(query, cat.id); }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0",
              category === cat.id
                ? "gradient-bg text-white shadow-brand"
                : "bg-card border border-border text-foreground/70 hover:text-foreground hover:border-primary/30"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
