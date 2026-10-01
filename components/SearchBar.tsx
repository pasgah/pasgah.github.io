"use client";

import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  body: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        setFuse(
          new Fuse(data, {
            keys: [
              { name: "title", weight: 3 },
              { name: "tags", weight: 2 },
              { name: "description", weight: 2 },
              { name: "body", weight: 1 },
            ],
            threshold: 0.35,
            includeScore: true,
            ignoreLocation: true,
          })
        );
      })
      .catch(() => {
        /* در حالت dev ممکن است ایندکس ساخته نشده باشد */
      });
  }, []);

  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }
    setResults(fuse.search(query).slice(0, 8).map((r) => r.item));
  }, [query, fuse]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="search-bar" ref={wrapperRef}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="جستجو در دانشنامه..."
        aria-label="جستجو در دانشنامه"
        autoComplete="off"
      />
      {isOpen && results.length > 0 && (
        <ul className="search-results" role="listbox">
          {results.map((r) => (
            <li key={r.slug} role="option" aria-selected="false">
              <a href={`/wiki/${r.slug}/`}>
                <strong>{r.title}</strong>
                <span>{r.description}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
