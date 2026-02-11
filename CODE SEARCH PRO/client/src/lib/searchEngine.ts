import type { Problem, SearchResult } from '@/types/problem';

export class ProblemSearchEngine {
  private problems: Problem[] = [];
  private index: Map<string, Set<number>> = new Map();

  constructor(problems: Problem[]) {
    this.problems = problems;
    this.buildIndex();
  }

  private buildIndex() {
    this.problems.forEach((problem, idx) => {
      // Index title words
      const titleWords = this.tokenize(problem.title);
      titleWords.forEach(word => {
        if (!this.index.has(word)) {
          this.index.set(word, new Set());
        }
        this.index.get(word)!.add(idx);
      });

      // Index topics
      problem.topics.forEach(topic => {
        const topicWords = this.tokenize(topic);
        topicWords.forEach(word => {
          if (!this.index.has(word)) {
            this.index.set(word, new Set());
          }
          this.index.get(word)!.add(idx);
        });
      });

      // Index difficulty
      const diffWord = problem.difficulty.toLowerCase();
      if (!this.index.has(diffWord)) {
        this.index.set(diffWord, new Set());
      }
      this.index.get(diffWord)!.add(idx);

      // Index problem ID
      if (!this.index.has(problem.frontend_id)) {
        this.index.set(problem.frontend_id, new Set());
      }
      this.index.get(problem.frontend_id)!.add(idx);
    });
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  search(query: string, maxResults: number = 20): SearchResult[] {
    if (!query.trim()) return [];

    const queryWords = this.tokenize(query);
    const scores = new Map<number, { score: number; matchedFields: Set<string> }>();

    queryWords.forEach(word => {
      // Exact match
      if (this.index.has(word)) {
        this.index.get(word)!.forEach(idx => {
          if (!scores.has(idx)) {
            scores.set(idx, { score: 0, matchedFields: new Set() });
          }
          const entry = scores.get(idx)!;
          entry.score += 10;
          entry.matchedFields.add('exact');
        });
      }

      // Fuzzy match (prefix)
      this.index.forEach((indices, indexWord) => {
        if (indexWord.startsWith(word) && indexWord !== word) {
          indices.forEach(idx => {
            if (!scores.has(idx)) {
              scores.set(idx, { score: 0, matchedFields: new Set() });
            }
            const entry = scores.get(idx)!;
            entry.score += 5;
            entry.matchedFields.add('prefix');
          });
        }
      });

      // Contains match
      this.index.forEach((indices, indexWord) => {
        if (indexWord.includes(word) && !indexWord.startsWith(word)) {
          indices.forEach(idx => {
            if (!scores.has(idx)) {
              scores.set(idx, { score: 0, matchedFields: new Set() });
            }
            const entry = scores.get(idx)!;
            entry.score += 2;
            entry.matchedFields.add('contains');
          });
        }
      });
    });

    // Convert to results and sort by score
    const results: SearchResult[] = Array.from(scores.entries())
      .map(([idx, { score, matchedFields }]) => ({
        problem: this.problems[idx],
        score,
        matchedFields: Array.from(matchedFields),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    return results;
  }

  autocomplete(query: string, maxSuggestions: number = 8): string[] {
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();
    const suggestions = new Set<string>();

    // Find matching problem titles
    this.problems.forEach(problem => {
      if (problem.title.toLowerCase().includes(queryLower)) {
        suggestions.add(problem.title);
      }
    });

    // Find matching topics
    this.problems.forEach(problem => {
      problem.topics.forEach(topic => {
        if (topic.toLowerCase().includes(queryLower)) {
          suggestions.add(topic);
        }
      });
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }

  getStats() {
    return {
      totalProblems: this.problems.length,
      indexSize: this.index.size,
      difficulties: {
        easy: this.problems.filter(p => p.difficulty === 'Easy').length,
        medium: this.problems.filter(p => p.difficulty === 'Medium').length,
        hard: this.problems.filter(p => p.difficulty === 'Hard').length,
      },
    };
  }
}
