/**
 * CodeRunner Component
 * Design Philosophy: Swiss Minimalism with Electric Blue Accent
 * - Clean, monochromatic interface with electric blue for interactive elements
 * - Generous whitespace and precision typography
 * - Subtle depth through shadows and layering
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface CodeRunnerProps {
  initialCode?: string;
  language?: string;
}

const LANGUAGE_MAP: Record<string, { pistonId: string; version: string }> = {
  javascript: { pistonId: 'javascript', version: '18.15.0' },
  python: { pistonId: 'python', version: '3.10.0' },
  python3: { pistonId: 'python', version: '3.10.0' },
  java: { pistonId: 'java', version: '15.0.2' },
  cpp: { pistonId: 'cpp', version: '10.2.0' },
  c: { pistonId: 'c', version: '10.2.0' },
  typescript: { pistonId: 'typescript', version: '5.0.3' },
  go: { pistonId: 'go', version: '1.16.2' },
  rust: { pistonId: 'rust', version: '1.68.2' },
};

export function CodeRunner({ initialCode = '', language = 'javascript' }: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [selectedLang, setSelectedLang] = useState(language);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const runCode = async () => {
    setIsRunning(true);
    setStatus('idle');
    setOutput('Running...');

    try {
      const langConfig = LANGUAGE_MAP[selectedLang] || LANGUAGE_MAP.javascript;
      
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: langConfig.pistonId,
          version: langConfig.version,
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const result = await response.json();

      if (result.run) {
        const output = result.run.output || result.run.stdout || '';
        const error = result.run.stderr || '';
        
        if (error) {
          setOutput(error);
          setStatus('error');
        } else {
          setOutput(output || 'Code executed successfully (no output)');
          setStatus('success');
        }
      } else {
        setOutput('Error: Unable to execute code');
        setStatus('error');
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between gap-4">
        <Select value={selectedLang} onValueChange={setSelectedLang}>
          <SelectTrigger className="w-48 bg-white border-border">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={runCode}
          disabled={isRunning || !code.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </>
          )}
        </Button>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          className="min-h-[300px] font-mono text-sm bg-white border-border focus:ring-primary resize-none"
          spellCheck={false}
        />
      </div>

      {/* Output Section */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            {status === 'success' && (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Success</span>
              </>
            )}
            {status === 'error' && (
              <>
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-600">Error</span>
              </>
            )}
            {status === 'idle' && <span className="text-muted-foreground">Output</span>}
          </div>
          <pre className="p-4 bg-muted rounded-lg border border-border overflow-x-auto">
            <code className="text-sm font-mono text-foreground">{output}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
