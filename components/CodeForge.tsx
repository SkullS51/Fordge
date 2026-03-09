
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Terminal, Code2, ScrollText, GitBranch, Download, Copy, GitCommit, Rocket, Server, Cloud, Loader2, Wand, Play, Users, Link, XCircle, Globe } from 'lucide-react';
import { generateCode } from '../services/geminiService';
import { CodeForgeOutput } from '../types'; // Import the new interface

// Declare hljs to avoid TypeScript errors since it's loaded globally via script tag
declare const hljs: any;

const CodeForge: React.FC = () => {
  const [prompt, setPrompt] = useState('Create a dependency injection container with a singleton for logging.');
  const [language, setLanguage] = useState('typescript'); // Default language
  const [outputType, setOutputType] = useState<'code' | 'ui'>('code'); // 'code' or 'ui'
  const [generatedCode, setGeneratedCode] = useState('');
  const [technicalExplanation, setTechnicalExplanation] = useState('');
  const [htmlPreview, setHtmlPreview] = useState(''); // For UI output
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false); // New state for formatting
  const [error, setError] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  // Collaboration State
  const [sessionId, setSessionId] = useState<string>('');
  const [activeCollaborators, setActiveCollaborators] = useState<string[]>(['You']);
  const [showCollaborationDisclaimer, setShowCollaborationDisclaimer] = useState(true);

  const [prettierModule, setPrettierModule] = useState<any>(null);
  const [prettierPlugins, setPrettierPlugins] = useState<any[]>([]);

  const codeRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Effect to load Prettier and its plugins dynamically
  useEffect(() => {
    const loadPrettier = async () => {
      try {
        const prettier = await import('https://esm.sh/prettier@^3.2.5');
        const parserTypescript = await import('https://esm.sh/prettier@^3.2.5/plugins/typescript');
        const parserHtml = await import('https://esm.sh/prettier@^3.2.5/plugins/html');
        setPrettierModule(prettier);
        setPrettierPlugins([parserTypescript, parserHtml]);
      } catch (err) {
        console.error("Failed to load Prettier modules:", err);
      }
    };
    loadPrettier();
  }, []); // Run only once on component mount

  // Effect to apply syntax highlighting whenever generatedCode or language changes
  useEffect(() => {
    if (codeRef.current && generatedCode) {
      hljs.highlightElement(codeRef.current);
    }
  }, [generatedCode, language]);

  // Effect to update iframe content for UI preview
  useEffect(() => {
    if (iframeRef.current && htmlPreview) {
      const iframeDoc = iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              /* Minimal base styles for the iframe's internal document */
              body {
                font-family: 'Inter', sans-serif; /* Use the app's default font */
                margin: 0;
                padding: 1rem; /* Provide some default padding around the generated UI */
                background-color: #0f172a; /* Dark background to match the app theme */
                color: #f8fafc; /* Default text color */
                box-sizing: border-box; /* Standard box model */
                min-height: 100vh; /* Ensure body takes full height for vertical alignment if needed */
                display: flex; /* Allow generated content to easily center or fill */
                justify-content: center;
                align-items: flex-start; /* Align content to the top by default */
              }
              /* NO additional element-specific styles here.
                 The generated HTMLPreview should provide its own styling. */
            </style>
          </head>
          <body>
            ${htmlPreview}
          </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [htmlPreview]);

  // Effect for simulating collaboration
  useEffect(() => {
    // Generate a unique session ID on mount
    if (!sessionId) {
      setSessionId(crypto.randomUUID().substring(0, 8)); // Shortened UUID for display
    }

    // Simulate collaborators joining/leaving
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'];
    const updateCollaborators = () => {
      const newCollaborators = ['You'];
      const numToInclude = Math.floor(Math.random() * 3) + 1; // 1 to 3 additional collaborators
      let tempNames = [...names];

      for (let i = 0; i < numToInclude; i++) {
        if (tempNames.length === 0) break;
        const randomIndex = Math.floor(Math.random() * tempNames.length);
        newCollaborators.push(tempNames[randomIndex]);
        tempNames.splice(randomIndex, 1); // Remove name to avoid duplicates
      }
      setActiveCollaborators(newCollaborators.sort());
    };

    const interval = setInterval(updateCollaborators, 15000); // Update every 15 seconds
    updateCollaborators(); // Initial call

    return () => clearInterval(interval);
  }, [sessionId]);

  // Function to format code using Prettier
  const formatCode = useCallback(async (code: string, lang: string) => {
    if (!prettierModule || prettierPlugins.length === 0) {
      setPublishStatus("Formatter not loaded yet. Please try again in a moment.");
      setTimeout(() => setPublishStatus(null), 2000);
      return code;
    }

    setIsFormatting(true);
    setPublishStatus("Formatting code...");

    let parser: string | undefined;
    switch (lang) {
      case 'typescript':
      case 'javascript':
      case 'react': // React code (JSX/TSX) is typically parsed by Babel or TypeScript parser
        parser = 'typescript';
        break;
      case 'html':
        parser = 'html';
        break;
      case 'python':
      case 'go':
      case 'java':
      case 'csharp':
        setPublishStatus(`Formatting not supported for ${lang}.`);
        setTimeout(() => setPublishStatus(null), 2000);
        setIsFormatting(false);
        return code;
      default:
        setPublishStatus(`No formatter available for ${lang}.`);
        setTimeout(() => setPublishStatus(null), 2000);
        setIsFormatting(false);
        return code;
    }

    try {
      const formatted = await prettierModule.format(code, {
        parser,
        plugins: prettierPlugins,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        printWidth: 80,
      });
      setGeneratedCode(formatted);
      setPublishStatus("Code formatted successfully!");
      setTimeout(() => setPublishStatus(null), 2000);
      return formatted;
    } catch (err) {
      console.error("Code formatting failed:", err);
      setPublishStatus(`Formatting failed: ${err instanceof Error ? err.message : String(err)}`);
      setTimeout(() => setPublishStatus(null), 3000);
      return code;
    } finally {
      setIsFormatting(false);
    }
  }, [prettierModule, prettierPlugins]);

  const handleGenerateCode = async () => {
    if (!prompt || !language) {
      setError('Please provide both a prompt and a language.');
      return;
    }
    setError(null); // Clear previous errors
    setIsGenerating(true);
    setGeneratedCode('');
    setTechnicalExplanation('');
    setHtmlPreview(''); // Clear previous preview

    try {
      const result: CodeForgeOutput = await generateCode(prompt, language, outputType);
      let newCode = result.code;

      // Automatically format after generation
      if (prettierModule && prettierPlugins.length > 0) {
        setPublishStatus("Auto-formatting generated code...");
        setIsFormatting(true); // Set formatting state for auto-format
        try {
            let parser: string | undefined;
            switch (language) {
                case 'typescript':
                case 'javascript':
                case 'react':
                    parser = 'typescript';
                    break;
                case 'html':
                    parser = 'html';
                    break;
            }
            if (parser) {
                newCode = await prettierModule.format(result.code, {
                    parser,
                    plugins: prettierPlugins,
                    semi: true,
                    singleQuote: true,
                    tabWidth: 2,
                    printWidth: 80,
                });
                setPublishStatus("Auto-formatting complete.");
            } else {
                setPublishStatus(`Auto-formatting skipped for ${language} (unsupported).`);
            }
        } catch (formatErr) {
            console.warn("Automatic formatting failed:", formatErr);
            setPublishStatus("Automatic formatting failed, showing raw code.");
        } finally {
            setIsFormatting(false);
            setTimeout(() => setPublishStatus(null), 2000);
        }
      } else {
          setPublishStatus("Formatter not loaded, showing raw code.");
          setTimeout(() => setPublishStatus(null), 2000);
      }
      
      setGeneratedCode(newCode);
      setTechnicalExplanation(result.explanation);
      if (outputType === 'ui' && result.htmlPreview) {
        setHtmlPreview(result.htmlPreview);
      }
    } catch (err) {
      console.error("Code generation failed:", err);
      // More specific error message for API communication issues
      setError("Failed to communicate with the AI. Please check your prompt, API key, and network connection, then try again.");
      setGeneratedCode(`// Error: Could not generate code.\n// ${err instanceof Error ? err.message : String(err)}`);
      setTechnicalExplanation("A critical error occurred during code generation. Please check your prompt, API key, and network connection, then try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulatedDeploy = (platform: string) => {
    setDeploymentStatus(`Deploying to ${platform}...`);
    setTimeout(() => {
      setDeploymentStatus(`Successfully deployed to ${platform}!`);
      setTimeout(() => setDeploymentStatus(null), 3000);
    }, 2000);
  };

  const handlePublish = (action: 'download' | 'copy' | 'commit' | 'shareLink') => {
    if (!generatedCode && action !== 'shareLink') {
      setPublishStatus("Nothing to publish!");
      setTimeout(() => setPublishStatus(null), 2000);
      return;
    }

    switch (action) {
      case 'download':
        const blob = new Blob([generatedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-code.${language === 'typescript' || language === 'javascript' || language === 'react' ? 'ts' : language === 'python' ? 'py' : language === 'html' ? 'html' : 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setPublishStatus("Code downloaded!");
        break;
      case 'copy':
        navigator.clipboard.writeText(generatedCode)
          .then(() => setPublishStatus("Code copied to clipboard!"))
          .catch(() => setPublishStatus("Failed to copy code."))
          .finally(() => setTimeout(() => setPublishStatus(null), 2000));
        break;
      case 'commit':
        setPublishStatus("Simulating commit to repository...");
        setTimeout(() => {
          setPublishStatus("Successfully committed to hypothetical repo!");
          setTimeout(() => setPublishStatus(null), 3000);
        }, 2000);
        break;
      case 'shareLink':
        navigator.clipboard.writeText(`Join my CodeForge session: ${window.location.origin}/codeforge?session=${sessionId}`)
          .then(() => setPublishStatus("Collaboration link copied!"))
          .catch(() => setPublishStatus("Failed to copy link."))
          .finally(() => setTimeout(() => setPublishStatus(null), 2000));
        break;
    }
  };

  const programmingLanguages = [
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Go' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'react', label: 'React (JS/TSX)' },
    { value: 'html', label: 'HTML/CSS' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Collaboration Session Header */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-[2rem] shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Globe size={24} className="text-blue-500" />
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block">Live Session ID:</span>
            <p className="font-mono text-lg text-slate-200">{sessionId}</p>
          </div>
          <button
            onClick={() => handlePublish('shareLink')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            title="Copy session link"
            aria-label="Copy session link"
          >
            <Link size={16} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Users size={24} className="text-green-500" />
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block">Active Collaborators:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {activeCollaborators.map((name, index) => (
                <span key={index} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs flex items-center gap-1">
                  {name === 'You' ? <Sparkles size={12} className="text-yellow-400" /> : <Users size={12} className="text-purple-400" />}
                  {name}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setPublishStatus("Simulating invitation send...")}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            title="Invite collaborators"
            aria-label="Invite collaborators"
          >
            <Play size={16} />
          </button>
        </div>
      </div>

      {showCollaborationDisclaimer && (
        <div role="alert" className="relative p-4 bg-yellow-900/20 border border-yellow-700 rounded-xl text-yellow-200 text-sm flex items-start gap-3 shadow-md">
          <XCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Disclaimer:</p>
            <p className="mt-1">This is a frontend simulation of real-time collaboration. True multi-user editing with synchronized updates requires a dedicated backend server for state management and conflict resolution.</p>
          </div>
          <button
            onClick={() => setShowCollaborationDisclaimer(false)}
            className="absolute top-2 right-2 p-1 text-yellow-300 hover:text-white transition-colors"
            aria-label="Dismiss disclaimer"
          >
            <XCircle size={18} />
          </button>
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code-prompt" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Code2 size={14} className="text-purple-500" />
              Code Prompt
            </label>
            <input
              id="code-prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a secure authentication module"
              className="w-full bg-black/40 border border-slate-700 rounded-xl px-5 py-3 text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600"
              aria-label="Code Prompt Input"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="language-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <GitBranch size={14} className="text-purple-500" />
              Language / Framework
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-black/40 border border-slate-700 rounded-xl px-5 py-3 text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
              aria-label="Select Programming Language or Framework"
            >
              {programmingLanguages.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={14} className="text-purple-500" />
              Output Type
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="outputType"
                  value="code"
                  checked={outputType === 'code'}
                  onChange={() => setOutputType('code')}
                  className="form-radio text-purple-600 bg-black/40 border-slate-700 focus:ring-purple-500"
                  aria-checked={outputType === 'code'}
                />
                <span className="ml-2 text-slate-300 text-sm">Code</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="outputType"
                  value="ui"
                  checked={outputType === 'ui'}
                  onChange={() => setOutputType('ui')}
                  className="form-radio text-purple-600 bg-black/40 border-slate-700 focus:ring-purple-500"
                  aria-checked={outputType === 'ui'}
                />
                <span className="ml-2 text-slate-300 text-sm">UI Component</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleGenerateCode}
            disabled={isGenerating}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-purple-900/20 active:scale-[0.98]"
            aria-label={isGenerating ? 'Forging Code...' : 'Forge Code'}
          >
            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
            <span className="uppercase tracking-widest text-xs">{isGenerating ? 'Forging Code...' : 'Forge Code'}</span>
          </button>
          {error && <p className="text-red-400 text-sm text-center mt-2" role="alert">{error}</p>}
        </div>

        <div className="flex flex-col justify-center items-center p-8 border-2 border-dashed border-slate-800 rounded-[1.5rem] bg-black/20 text-center">
          {generatedCode || isGenerating || htmlPreview ? (
            <div className="w-full space-y-4 text-left">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Terminal size={20} className="text-purple-400" /> Generated Code</h3>
                  {generatedCode && (
                    <button
                      onClick={() => formatCode(generatedCode, language)}
                      disabled={isGenerating || isFormatting || !prettierModule}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all flex items-center gap-1 disabled:opacity-50"
                      aria-label={isFormatting ? 'Formatting...' : 'Format Code'}
                    >
                      {isFormatting ? <Loader2 size={14} className="animate-spin" /> : <Wand size={14} />}
                      {isFormatting ? 'Formatting...' : 'Format'}
                    </button>
                  )}
                </div>
                <pre className="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs overflow-x-auto border border-slate-700 max-h-60 min-h-[5rem]">
                  {isGenerating ? (
                    <span className="text-slate-500 animate-pulse">Generating code...</span>
                  ) : (
                    <code ref={codeRef} className={`language-${language.toLowerCase()}`}>
                      {generatedCode}
                    </code>
                  )}
                </pre>
              </div>

              {outputType === 'ui' && (generatedCode || isGenerating || htmlPreview) && (
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Cloud size={20} className="text-blue-400" /> Live Preview
                  </h3>
                  {isGenerating ? (
                    <p className="bg-slate-950 p-4 rounded-lg text-slate-500 font-sans text-sm italic border border-slate-700 min-h-[5rem] flex items-center justify-center">
                      Rendering preview...
                    </p>
                  ) : htmlPreview ? (
                    <div className="relative border border-slate-700 rounded-lg overflow-hidden bg-slate-950 min-h-[15rem]">
                      <iframe
                        ref={iframeRef}
                        title="UI Preview"
                        className="w-full h-full border-none bg-slate-950"
                        sandbox="allow-scripts allow-forms allow-same-origin" // Basic sandboxing
                      />
                      <p className="absolute bottom-2 left-2 text-[8px] text-red-400 italic">
                        Warning: Rendering AI-generated HTML directly can be risky. Use with caution.
                      </p>
                    </div>
                  ) : (
                    <p className="bg-slate-950 p-4 rounded-lg text-slate-500 font-sans text-sm italic border border-slate-700 min-h-[5rem] flex items-center justify-center">
                      No UI preview available or generated for this prompt/language.
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><ScrollText size={20} className="text-purple-400" /> Technical Explanation</h3>
                <p className="bg-slate-950 p-4 rounded-lg text-slate-400 font-sans text-sm italic border border-slate-700 min-h-[5rem]">
                  {isGenerating ? (
                    <span className="text-slate-500 animate-pulse">Analyzing and explaining...</span>
                  ) : (
                    technicalExplanation
                  )}
                </p>
              </div>
              <p className="text-[10px] text-slate-600 mt-4 italic text-right">
                * Note: Powered by Google Gemini acting as the CodeReceiver agent.
              </p>
            </div>
          ) : (
            <>
              <Code2 size={40} className="text-slate-700 mb-4 opacity-30" />
              <p className="text-slate-500 text-sm italic font-light">
                The terminal awaits your command. Enter a prompt and language to summon code.
              </p>
            </>
          )}
        </div>
      </div>

      {(generatedCode || isGenerating || htmlPreview) && (
        <div className="flex flex-col md:flex-row gap-6 justify-center pt-4">
          {/* Deployment Options */}
          <div className="relative group">
            <button
              onClick={() => handleSimulatedDeploy('Web Hosting')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              disabled={isGenerating}
              aria-label="Deploy Application"
            >
              <Rocket size={18} />
              <span className="uppercase tracking-widest text-xs">Deploy App</span>
            </button>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-10 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-t-lg flex items-center gap-2"
                onClick={() => handleSimulatedDeploy('Web Hosting')}
              >
                <Cloud size={16} /> Web Hosting
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                onClick={() => handleSimulatedDeploy('Cloud Function Backend')}
              >
                <Server size={16} /> Cloud Function (Backend)
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                onClick={() => handleSimulatedDeploy('Fullstack Application')}
              >
                <Code2 size={16} /> Fullstack
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-b-lg flex items-center gap-2"
                onClick={() => handleSimulatedDeploy('Google Play Store')}
              >
                <Play size={16} /> Google Play Store
              </button>
            </div>
            {deploymentStatus && (
              <p className="text-slate-400 text-xs text-center mt-2 italic animate-pulse" aria-live="polite">{deploymentStatus}</p>
            )}
          </div>

          {/* Publishing Options */}
          <div className="relative group">
            <button
              onClick={() => handlePublish('copy')} // Default publish action for immediate feedback
              className="flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-[0.98]"
              disabled={isGenerating}
              aria-label="Publish Code"
            >
              <GitCommit size={18} />
              <span className="uppercase tracking-widest text-xs">Publish Code</span>
            </button>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-10 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-t-lg flex items-center gap-2"
                onClick={() => handlePublish('download')}
              >
                <Download size={16} /> Download
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                onClick={() => handlePublish('copy')}
              >
                <Copy size={16} /> Copy to Clipboard
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-b-lg flex items-center gap-2"
                onClick={() => handlePublish('commit')}
              >
                <GitCommit size={16} /> Commit to Repo (Simulated)
              </button>
            </div>
            {publishStatus && (
              <p className="text-slate-400 text-xs text-center mt-2 italic animate-pulse" aria-live="polite">{publishStatus}</p>
            )}
          </div>
        </div>
      )}

      {(generatedCode || isGenerating || htmlPreview) && (
        <div className="text-center pt-8 opacity-40">
          <Terminal size={20} className="mx-auto text-slate-500 mb-2" />
          <p className="text-[9px] uppercase font-bold tracking-[0.5em] text-slate-600 italic">Code Forged & Ready</p>
        </div>
      )}
    </div>
  );
};

export default CodeForge;
    