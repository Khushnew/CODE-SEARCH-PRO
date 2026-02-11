/**
 * Home Page - CodeSearch Pro
 * Design Philosophy: Swiss Minimalism meets Apple's Human Interface Guidelines
 * 
 * Core Principles:
 * - Radical simplicity with purposeful hierarchy
 * - Generous whitespace as a primary design element
 * - Precision in typography and spacing
 * - Subtle depth through layering and elevation
 * 
 * Color Philosophy: Monochromatic foundation (white, grays) with electric blue (#0066FF) accent
 * Layout: Asymmetric grid with dominant search zone (upper third of viewport)
 * Typography: System fonts (SF Pro) for UI, JetBrains Mono for code
 * Animations: Subtle fade + upward translation (8px), 150-200ms ease-out
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader2, Code2, Zap, Database } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProblemSearchEngine } from '@/lib/searchEngine';
import { ProblemDetail } from '@/components/ProblemDetail';
import type { Problem, SearchResult } from '@/types/problem';

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Hard: 'bg-red-100 text-red-800 border-red-200',
};

export default function Home() {
  const [searchEngine, setSearchEngine] = useState<ProblemSearchEngine | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [stats, setStats] = useState({ totalProblems: 0, indexSize: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load problems data
  useEffect(() => {
    const loadProblems = async () => {
      try {
        const response = await fetch('/problems-data.json');
        const data = await response.json();
        const engine = new ProblemSearchEngine(data.questions);
        setSearchEngine(engine);
        setStats(engine.getStats());
      } catch (error) {
        console.error('Failed to load problems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProblems();
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchEngine || !query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = searchEngine.search(query, 20);
    setResults(searchResults);
    setShowSuggestions(false);
  }, [searchEngine, query]);

  // Handle input change with autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (searchEngine && value.length >= 2) {
      const autoSuggestions = searchEngine.autocomplete(value, 8);
      setSuggestions(autoSuggestions);
      setShowSuggestions(autoSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();

    if (searchEngine) {
      const searchResults = searchEngine.search(suggestion, 20);
      setResults(searchResults);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading problem database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <div
        className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-16"
        style={{
          backgroundImage: 'url(https://private-us-east-1.manuscdn.com/sessionFile/xqcf23zzt22UiY3f0Df5wT/sandbox/wdGKoRGLYMcZq0pTC0TmeS-img-1_1770798496000_na1fn_aGVyby1iYWNrZ3JvdW5k.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUveHFjZjIzenp0MjJVaVkzZjBEZjV3VC9zYW5kYm94L3dkR0tvUkdMWU1jWnEwcFRDMFRtZVMtaW1nLTFfMTc3MDc5ODQ5NjAwMF9uYTFmbl9hR1Z5YnkxaVlXTnJaM0p2ZFc1ay5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=mroQVF2LaNXJWOVliV0~N89vSxKq69htCvd8-ywJUZCzZEhQDVQGaVjBpcVqzcBcinXNhehlqiBfVr-0KVdRokdTS43BUQT~OnloLQZHqxm84bp9T8OQeB9ffIPGWS4TfKbiFyyt-CCTtDol9uHBccyVxd-gb3RiATR5kVaLusVPNtPKWNSTe1ND20meO9FHS-HvQABisoSeVwHnd~16T52dc9Q5FNa3MYR5QzeIcBIX0QEhp0oiMnHOeX02lKiGRynG8U5UNXRFgSLTb0EW0eJsnjdqZI6Ea9eKSe4Mjg-TPvICVOo8JdLYlvo4Z6tcm2ZPshq1c3kh3nuiyOlqVw__)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-3xl space-y-8 animate-fadeIn">
          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl md:text-6xl font-semibold text-foreground tracking-tight">
              CodeSearch Pro
            </h1>
            <p className="text-lg text-muted-foreground">
              Search {stats.totalProblems.toLocaleString()}+ coding problems instantly
            </p>
          </div>

          {/* Search Box */}
          <div className="relative" ref={suggestionsRef}>
            <div className="relative bg-white rounded-xl shadow-lg border border-border overflow-hidden transition-all duration-200 hover:shadow-xl focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary/20">
              <div className="flex items-center px-6 py-4">
                <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by problem name, topic, or difficulty..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground bg-transparent"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!query.trim()}
                  className="ml-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-border overflow-hidden z-10 animate-slideDown">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-6 py-3 text-left hover:bg-muted transition-colors text-sm text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results or Welcome Section */}
      <div className="container py-12">
        {results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            <div className="grid gap-4">
              {results.map((result, idx) => (
                <button
                  key={result.problem.problem_id}
                  onClick={() => setSelectedProblem(result.problem)}
                  className="bg-white rounded-lg border border-border p-6 text-left hover:shadow-md hover:border-primary/50 transition-all duration-200 group animate-slideUp"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{result.problem.frontend_id}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {result.problem.title}
                      </h3>
                    </div>
                    <Badge className={DIFFICULTY_COLORS[result.problem.difficulty]} variant="outline">
                      {result.problem.difficulty}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {result.problem.topics.slice(0, 5).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {result.problem.topics.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{result.problem.topics.length - 5} more
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-lg text-foreground">No results found for "{query}"</p>
            <p className="text-sm text-muted-foreground">Try different keywords or check your spelling</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Feature 1 */}
              <div className="text-center space-y-4 p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">2,900+ Problems</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Complete LeetCode problem database with solutions in 20+ programming languages
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center space-y-4 p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Live Code Runner</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Test your solutions instantly with our integrated code execution environment
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center space-y-4 p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Instant Search</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lightning-fast search with autocomplete and intelligent ranking algorithms
                </p>
              </div>
            </div>

            {/* Visual Assets */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center">
                <img
                  src="https://private-us-east-1.manuscdn.com/sessionFile/xqcf23zzt22UiY3f0Df5wT/sandbox/wdGKoRGLYMcZq0pTC0TmeS-img-2_1770798500000_na1fn_Y29kZS1pbGx1c3RyYXRpb24.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUveHFjZjIzenp0MjJVaVkzZjBEZjV3VC9zYW5kYm94L3dkR0tvUkdMWU1jWnEwcFRDMFRtZVMtaW1nLTJfMTc3MDc5ODUwMDAwMF9uYTFmbl9ZMjlrWlMxcGJHeDFjM1J5WVhScGIyNC5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=RsvvmKsQiuLoS77MYyZdYjGsNfd9inZYaDyPRPLmNONBVhJsalbac9xblv~dSNWrSDuZjf-H1~~GO2kXu61zjPg8Pkp-1xRibC2XhV38FyrKYtRd2091IQYruZpKXZmzcPLpLiyeSYfsvAdl33NfwJ-EOz1e6byq7BQluFurw~PnWCCdPQm~u6KLxKmLrifdGLMwa5GMrM~QZAy5hm2HKa~91GhkDcMrxXiv0TCL7XYkoYwPictt4NwERjcC7VBX6hj8pIZDBlyLpW12bGnTwM-dtmOfyuy254JlRpsbikfIdPhxZaHlPHc0DzYrBdtftLZ3QuHRej36NseJ5GiW9w__"
                  alt="Code Editor Illustration"
                  className="w-full h-auto max-w-md"
                />
              </div>
              <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center">
                <img
                  src="https://private-us-east-1.manuscdn.com/sessionFile/xqcf23zzt22UiY3f0Df5wT/sandbox/wdGKoRGLYMcZq0pTC0TmeS-img-5_1770798491000_na1fn_ZmVhdHVyZS12aXN1YWwtMg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUveHFjZjIzenp0MjJVaVkzZjBEZjV3VC9zYW5kYm94L3dkR0tvUkdMWU1jWnEwcFRDMFRtZVMtaW1nLTVfMTc3MDc5ODQ5MTAwMF9uYTFmbl9abVZoZEhWeVpTMTJhWE4xWVd3dE1nLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=pAjAA6krX2hi-IduZ0gHNt5ENR0vPiWExXpJKpkiGIt2Il3sSBCIc7TOk2fNiGAEhrEY8kQ28HgIpspxGMOQTXdLNSUm4sR5pxZVhJF0iij5rdkHV6JalX9btHOiZmn-yoKnu~u4fOup3t7CK9tEEMTjxF-JH-1NdENv2cIiE5OV6TYn5H09g~LufFgy9J6rPIZu9Ft0MkIm1hA6MDm~pMFJMewthF60uwD~9WPZt5p4szYfxT8Qk594i2PRGk1oj423RRurgJUVQ1UzzIh4-RcNgXIlmfBNhdvfyNC5gagsHORhGpj18xkKgexmM263eQ1T4ptTuU62CuS0KC1-KQ__"
                  alt="Problem Database"
                  className="w-full h-auto max-w-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Problem Detail Modal */}
      {selectedProblem && (
        <ProblemDetail problem={selectedProblem} onClose={() => setSelectedProblem(null)} />
      )}
    </div>
  );
}
