import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, Activity, User, Building2 } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  name?: string;
  user?: { name: string }; // For doctors
  specialty?: string;
  category?: string;
  address?: string;
  type: 'investigation' | 'doctor' | 'lab';
}

export const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const [invRes, docRes, labRes] = await Promise.all([
          api.get(`/search/investigations?q=${debouncedQuery}&limit=5`),
          api.get(`/search/doctors?q=${debouncedQuery}&limit=5`),
          api.get(`/search/labs?q=${debouncedQuery}&limit=5`),
        ]);

        const combined: SearchResult[] = [
          ...(invRes.data.results || []).map((i: any) => ({ ...i, type: 'investigation' })),
          ...(docRes.data.results || []).map((d: any) => ({ ...d, type: 'doctor' })),
          ...(labRes.data.results || []).map((l: any) => ({ ...l, type: 'lab' })),
        ];

        setResults(combined);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigate based on type
    if (result.type === 'doctor') {
      navigate(`/dashboard/doctor/investigations/issue`); // Example destination
    } else if (result.type === 'investigation') {
      navigate(`/dashboard/admin/investigations`);
    } else {
      navigate(`/dashboard/patient/investigations/redeem`);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={containerRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${loading ? 'text-teal-500 animate-pulse' : 'text-slate-400'}`} />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-200"
          placeholder="Search doctors, labs, or tests..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 2) setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (query.length >= 2) && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[400px] overflow-y-auto py-2">
            {loading && results.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Searching results...</span>
              </div>
            ) : results.length > 0 ? (
              <>
                {results.map((result, idx) => (
                  <button
                    key={`${result.type}-${result.id}-${idx}`}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center px-4 py-3 hover:bg-teal-50 transition-colors group text-left"
                  >
                    <div className="flex-shrink-0 mr-3 p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                      {result.type === 'investigation' && <Activity className="h-4 w-4 text-rose-500" />}
                      {result.type === 'doctor' && <User className="h-4 w-4 text-teal-600" />}
                      {result.type === 'lab' && <Building2 className="h-4 w-4 text-indigo-600" />}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-slate-900">
                        {result.type === 'doctor' ? result.user?.name : result.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {result.type === 'doctor' && result.specialty}
                        {result.type === 'investigation' && result.category}
                        {result.type === 'lab' && result.address}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-teal-500 transition-colors">
                      {result.type}
                    </div>
                  </button>
                ))}
              </>
            ) : !loading && (
              <div className="py-10 px-4 text-center">
                <p className="text-sm text-slate-400 font-medium">No results found for "{query}"</p>
                <p className="text-xs text-slate-400 mt-1">Try a different keyword or specialized term</p>
              </div>
            )}
          </div>
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium">
             <span>Press Esc to close</span>
             <span>Powered by FTS</span>
          </div>
        </div>
      )}
    </div>
  );
};
