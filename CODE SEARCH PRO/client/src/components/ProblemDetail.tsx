/**
 * ProblemDetail Component
 * Design Philosophy: Swiss Minimalism with Electric Blue Accent
 * - Asymmetric layout with generous whitespace
 * - Monochromatic palette with electric blue for interactive elements
 * - Subtle animations with ease-out curves (150-200ms)
 */

import { useState } from 'react';
import { X, BookOpen, Lightbulb, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeRunner } from './CodeRunner';
import type { Problem } from '@/types/problem';

interface ProblemDetailProps {
  problem: Problem;
  onClose: () => void;
}

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Hard: 'bg-red-100 text-red-800 border-red-200',
};

export function ProblemDetail({ problem, onClose }: ProblemDetailProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('python3');

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="border-b border-border px-8 py-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-muted-foreground">#{problem.frontend_id}</span>
              <Badge className={DIFFICULTY_COLORS[problem.difficulty]} variant="outline">
                {problem.difficulty}
              </Badge>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">{problem.title}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {problem.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="description" className="w-full">
            <div className="border-b border-border px-8">
              <TabsList className="bg-transparent h-auto p-0 gap-6">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 pb-3"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="solution"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 pb-3"
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  Solution
                </TabsTrigger>
                {problem.hints.length > 0 && (
                  <TabsTrigger
                    value="hints"
                    className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 pb-3"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Hints
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="px-8 py-6">
              <TabsContent value="description" className="mt-0 space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{problem.description}</p>
                </div>

                {problem.examples.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Examples</h3>
                    {problem.examples.map((example) => (
                      <div key={example.example_num} className="bg-muted/50 rounded-lg p-4 border border-border">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Example {example.example_num}
                        </div>
                        <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                          {example.example_text}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">Constraints</h3>
                    <ul className="space-y-2">
                      {problem.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground font-mono">
                          • {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="solution" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Code Editor</h3>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Object.keys(problem.code_snippets).map((lang) => (
                        <option key={lang} value={lang}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <CodeRunner
                    initialCode={problem.code_snippets[selectedLanguage] || problem.code_snippets.python3 || ''}
                    language={selectedLanguage}
                  />
                </div>
              </TabsContent>

              {problem.hints.length > 0 && (
                <TabsContent value="hints" className="mt-0 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Hints</h3>
                  {problem.hints.map((hint, idx) => (
                    <div key={idx} className="bg-muted/50 rounded-lg p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{hint}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
