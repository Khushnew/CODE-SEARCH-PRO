export interface Problem {
  title: string;
  problem_id: string;
  frontend_id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problem_slug: string;
  topics: string[];
  description: string;
  examples: Example[];
  constraints: string[];
  follow_ups: string[];
  hints: string[];
  code_snippets: Record<string, string>;
  solution?: string;
}

export interface Example {
  example_num: number;
  example_text: string;
  images: string[];
}

export interface SearchResult {
  problem: Problem;
  score: number;
  matchedFields: string[];
}
