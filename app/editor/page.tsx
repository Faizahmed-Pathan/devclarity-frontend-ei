"use client"

import { useState } from "react"

export default function CodeEditor() {
  const [isDark, setIsDark] = useState(true)
  const [activeFile, setActiveFile] = useState("app.tsx")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState("errors")
  const [suggestionFilter, setSuggestionFilter] = useState("all")
  const [suggestionSort, setSuggestionSort] = useState("priority")
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFolders, setExpandedFolders] = useState(new Set(["src", "components"]))
  const [openTabs, setOpenTabs] = useState(["app.tsx"])

  const [fileStructure] = useState([
    {
      name: "src",
      type: "folder",
      children: [
        { name: "app.tsx", type: "file", language: "typescript", size: "2.1 KB", modified: "2 min ago" },
        { name: "index.css", type: "file", language: "css", size: "1.2 KB", modified: "1 hour ago" },
        { name: "main.tsx", type: "file", language: "typescript", size: "0.8 KB", modified: "3 hours ago" },
      ],
    },
    {
      name: "components",
      type: "folder",
      children: [
        {
          name: "ui",
          type: "folder",
          children: [
            { name: "button.tsx", type: "file", language: "typescript", size: "3.2 KB", modified: "1 day ago" },
            { name: "card.tsx", type: "file", language: "typescript", size: "2.8 KB", modified: "1 day ago" },
            { name: "input.tsx", type: "file", language: "typescript", size: "2.1 KB", modified: "2 days ago" },
          ],
        },
        { name: "Header.tsx", type: "file", language: "typescript", size: "1.9 KB", modified: "5 hours ago" },
        { name: "Footer.tsx", type: "file", language: "typescript", size: "1.1 KB", modified: "1 day ago" },
      ],
    },
    {
      name: "utils",
      type: "folder",
      children: [
        { name: "helpers.ts", type: "file", language: "typescript", size: "4.2 KB", modified: "3 days ago" },
        { name: "constants.ts", type: "file", language: "typescript", size: "0.9 KB", modified: "1 week ago" },
      ],
    },
    { name: "package.json", type: "file", language: "json", size: "1.8 KB", modified: "1 week ago" },
    { name: "tsconfig.json", type: "file", language: "json", size: "0.7 KB", modified: "2 weeks ago" },
    { name: "README.md", type: "file", language: "markdown", size: "2.3 KB", modified: "1 week ago" },
  ])

  // Sample code content
  const [code, setCode] = useState(`import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';

function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Missing dependency in useEffect
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <div className="w-3 h-3 rounded-full bg-chart-4"></div>
            <div className="w-3 h-3 rounded-full bg-chart-3"></div>
          </div>
          <span className="text-sm font-medium">Dev Clarity Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <GitBranch className="w-4 h-4 mr-2" />
            main
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Enhanced Left Sidebar with File Management */}
        <div
          className={\`${sidebarCollapsed ? "w-12" : "w-64"} bg-sidebar border-r border-sidebar-border transition-all duration-200 flex flex-col\`}
        >
          <div className="p-3 flex-1">
            <div className="flex items-center justify-between mb-4">
              {!sidebarCollapsed && <span className="text-sm font-medium text-sidebar-foreground">Explorer</span>}
              <div className="flex items-center gap-1">
                {!sidebarCollapsed && (
                  <>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Upload className="w-3 h-3" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                  <FolderOpen className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!sidebarCollapsed && (
              <>
                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 h-7 text-xs bg-sidebar-accent/50"
                  />
                </div>

                {/* File Tree */}
                <ScrollArea className="flex-1">
                  <div className="space-y-1 group">
                    {renderFileTree(fileStructure)}
                  </div>
                </ScrollArea>

                {/* File Stats */}
                <div className="mt-4 pt-3 border-t border-sidebar-border">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Files:</span>
                      <span>12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>24.8 KB</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced File Tabs */}
          <div className="h-10 bg-card border-b border-border flex items-center px-4 overflow-x-auto">
            <div className="flex items-center gap-1">
              {openTabs.map((tab) => (
                <div
                  key={tab}
                  className={\`flex items-center gap-2 px-3 py-1 rounded-t cursor-pointer group ${
                    activeFile === tab ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                  }\`}
                  onClick={() => setActiveFile(tab)}
                >
                  {getFileIcon("typescript")}
                  <span className="text-sm">{tab}</span>
                  {openTabs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTab(tab)
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex">
            <div className="flex-1 relative">
              <div className="absolute inset-0 p-4">
                <div className="h-full bg-card rounded border border-border">
                  <div className="flex">
                    {/* Line Numbers */}
                    <div className="w-12 bg-muted p-4 text-right text-sm text-muted-foreground font-mono">
                      {code.split("\n").map((_, i) => (
                        <div key={i} className="leading-6">
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 p-4">
                      <pre className="text-sm font-mono leading-6 text-card-foreground whitespace-pre-wrap">{code}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-96 bg-card border-l border-border flex flex-col">
              {/* Panel Tabs */}
              <div className="h-10 border-b border-border flex">
                <button
                  className={\`flex-1 flex items-center justify-center gap-2 text-sm ${
                    rightPanelTab === "errors" ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                  }\`}
                  onClick={() => setRightPanelTab("errors")}
                >
                  <Bug className="w-4 h-4" />
                  Analysis
                  <Badge variant="destructive" className="ml-1">
                    {errorStats.total}
                  </Badge>
                </button>
                <button
                  className={\`flex-1 flex items-center justify-center gap-2 text-sm ${
                    rightPanelTab === "suggestions" ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                  }\`}
                  onClick={() => setRightPanelTab("suggestions")}
                >
                  <Zap className="w-4 h-4" />
                  AI Suggestions
                  <Badge variant="secondary" className="ml-1">
                    {filteredSuggestions.length}
                  </Badge>
                </button>
              </div>

              {/* Panel Content */}
              <ScrollArea className="flex-1 p-4">
                {rightPanelTab === "errors" && (
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h3 className="font-medium text-card-foreground mb-3">Analysis Overview</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-destructive">{errorStats.critical}</div>
                          <div className="text-xs text-muted-foreground">Critical</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-chart-4">{errorStats.warnings}</div>
                          <div className="text-xs text-muted-foreground">Warnings</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Issues by Category</div>
                        {Object.entries(errorStats.categories).map(([category, count]) => (
                          <div key={category} className="flex justify-between text-xs">
                            <span>{category}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="error">Errors</TabsTrigger>
                        <TabsTrigger value="warning">Warnings</TabsTrigger>
                        <TabsTrigger value="info">Info</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="space-y-3 mt-4">
                        {errors.map((error) => (
                          <Card key={error.id} className="p-3">
                            <div className="flex items-start gap-2">
                              {getErrorIcon(error.severity)}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant={
                                      error.severity === "error"
                                        ? "destructive"
                                        : error.severity === "warning"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {error.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Ln {error.line}:{error.column}
                                  </Badge>
                                  <span className={\`text-xs font-medium ${getImpactColor(error.impact)}\`}>
                                    {error.impact} impact
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-card-foreground mb-1">{error.message}</p>
                                <p className="text-xs text-muted-foreground mb-2">{error.description}</p>
                                <div className="bg-muted p-2 rounded text-xs font-mono mb-2">
                                  <pre className="whitespace-pre-wrap">{error.codeSnippet}</pre>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                    Quick Fix
                                  </Button>
                                  <span className="text-xs text-muted-foreground">{error.rule}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="error" className="space-y-3 mt-4">
                        {errors
                          .filter((e) => e.severity === "error")
                          .map((error) => (
                            <Card key={error.id} className="p-3">
                              <div className="flex items-start gap-2">
                                {getErrorIcon(error.severity)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="destructive">{error.category}</Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Ln {error.line}:{error.column}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-medium text-card-foreground mb-1">{error.message}</p>
                                  <p className="text-xs text-muted-foreground mb-2">{error.description}</p>
                                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                    Quick Fix
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </TabsContent>

                      <TabsContent value="warning" className="space-y-3 mt-4">
                        {errors
                          .filter((e) => e.severity === "warning")
                          .map((error) => (
                            <Card key={error.id} className="p-3">
                              <div className="flex items-start gap-2">
                                {getErrorIcon(error.severity)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">{error.category}</Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Ln {error.line}:{error.column}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-medium text-card-foreground mb-1">{error.message}</p>
                                  <p className="text-xs text-muted-foreground mb-2">{error.description}</p>
                                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </TabsContent>

                      <TabsContent value="info" className="space-y-3 mt-4">
                        {errors
                          .filter((e) => e.severity === "info")
                          .map((error) => (
                            <Card key={error.id} className="p-3">
                              <div className="flex items-start gap-2">
                                {getErrorIcon(error.severity)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{error.category}</Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Ln {error.line}:{error.column}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-medium text-card-foreground mb-1">{error.message}</p>
                                  <p className="text-xs text-muted-foreground mb-2">{error.description}</p>
                                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {rightPanelTab === "suggestions" && (
                  <div className="space-y-4">
                    {/* AI Suggestions Header with Controls */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-card-foreground">AI Suggestions</h3>
                      <Badge variant="secondary" className="text-xs">
                        {filteredSuggestions.length} suggestions
                      </Badge>
                    </div>

                    {/* Filter and Sort Controls */}
                    <Card className="p-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Filter:</span>
                          <select
                            value={suggestionFilter}
                            onChange={(e) => setSuggestionFilter(e.target.value)}
                            className="text-xs bg-background border border-border rounded px-2 py-1"
                          >
                            <option value="all">All Categories</option>
                            <option value="performance">Performance</option>
                            <option value="react hooks">React Hooks</option>
                            <option value="code quality">Code Quality</option>
                            <option value="a11y">Accessibility</option>
                            <option value="security">Security</option>
                            <option value="testing">Testing</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Sort by:</span>
                          <select
                            value={suggestionSort}
                            onChange={(e) => setSuggestionSort(e.target.value)}
                            className="text-xs bg-background border border-border rounded px-2 py-1"
                          >
                            <option value="priority">Priority</option>
                            <option value="confidence">Confidence</option>
                            <option value="time">Time to Fix</option>
                          </select>
                        </div>
                      </div>
                    </Card>

                    {/* Enhanced AI Suggestions List */}
                    <div className="space-y-3">
                      {filteredSuggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="p-3">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              {/* Enhanced Suggestion Header with Metadata */}
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {suggestion.category}
                                </Badge>
                                <Badge
                                  variant={
                                    suggestion.priority === "high"
                                      ? "destructive"
                                      : suggestion.priority === "medium"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {suggestion.priority} priority
                                </Badge>
                                <span className={\`text-xs font-medium ${getConfidenceColor(suggestion.confidence)}\`}>
                                  {suggestion.confidence}% confidence
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ~{suggestion.estimatedTime}
                                </span>
                              </div>

                              <h4 className="font-medium text-sm text-card-foreground mb-1">{suggestion.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>

                              {/* Explanation Section */}
                              <div className="bg-muted/50 p-2 rounded text-xs mb-2">
                                <span className="font-medium">Why this helps: </span>
                                <span className="text-muted-foreground">{suggestion.explanation}</span>
                              </div>

                              {/* Enhanced Code Preview */}
                              <div className="bg-muted p-2 rounded text-xs font-mono mb-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-muted-foreground">Suggested code:</span>
                                  <div className="flex gap-1">
                                    {suggestion.tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <pre className="whitespace-pre-wrap text-card-foreground">{suggestion.code}</pre>
                              </div>

                              {/* Enhanced Action Buttons */}
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleApplySuggestion(suggestion.id)}
                                  disabled={appliedSuggestions.has(suggestion.id)}
                                >
                                  {appliedSuggestions.has(suggestion.id) ? "Applied" : "Apply Suggestion"}
                                </Button>
                                <Button size="sm" variant="outline" className="bg-transparent">
                                  Preview
                                </Button>
                                <Button size="sm" variant="ghost" className="bg-transparent">
                                  Dismiss
                                </Button>
                              </div>

                              {/* Show Related Lines */}
                              {suggestion.relatedLines && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  Affects lines: {suggestion.relatedLines.join(", ")}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Suggestion Stats */}
                    <Card className="p-3">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between mb-1">
                          <span>High Priority:</span>
                          <span>{suggestions.filter(s => s.priority === "high").length}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Applied Today:</span>
                          <span>{appliedSuggestions.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg. Confidence:</span>
                          <span>{Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)}%</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Status Bar */}
        <div className="h-6 bg-muted border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>TypeScript React</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span>{activeFile}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Ln 1, Col 1</span>
            <span>Spaces: 2</span>
            <span>{openTabs.length} files open</span>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-destructive" />
                <span>{errorStats.critical}</span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <AlertTriangle className="w-3 h-3 text-chart-4" />
                <span>{errorStats.warnings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const errors = [
  {
    id: 1,
    type: "warning",
    category: "React Hooks",
    line: 8,
    column: 5,
    message: "React Hook useEffect has a missing dependency: 'fetchUsers'",
    severity: "warning",
    rule: "react-hooks/exhaustive-deps",
    description: "This hook is missing dependencies that could cause stale closures or infinite loops.",
    fixSuggestion: "Add 'fetchUsers' to the dependency array or move it inside useEffect",
    impact: "medium",
    codeSnippet: "useEffect(() => {\n    fetchUsers();\n  }, []);",
  },
  {
    id: 2,
    type: "error",
    category: "Error Handling",
    line: 15,
    column: 25,
    message: "Async function should handle potential errors",
    severity: "error",
    rule: "no-unhandled-promise",
    description:
      "Network requests can fail and should be wrapped in try-catch blocks to prevent unhandled promise rejections.",
    fixSuggestion: "Wrap fetch call in try-catch block",
    impact: "high",
    codeSnippet: "const response = await fetch('/api/users');",
  },
  {
    id: 3,
    type: "info",
    category: "Performance",
    line: 22,
    column: 15,
    message: "Consider using useCallback for event handlers",
    severity: "info",
    rule: "react-hooks/exhaustive-deps",
    description:
      "Event handlers that don't depend on props or state can be memoized to prevent unnecessary re-renders.",
    fixSuggestion: "Wrap handleClick with useCallback",
    impact: "low",
    codeSnippet: "const handleClick = () => {\n    setCount(count + 1);\n  };",
  },
  {
    id: 4,
    type: "warning",
    category: "Accessibility",
    line: 30,
    column: 8,
    message: "Missing alt attribute for better accessibility",
    severity: "warning",
    rule: "jsx-a11y/alt-text",
    description: "Interactive elements should have accessible labels for screen readers.",
    fixSuggestion: "Add aria-label or accessible text content",
    impact: "medium",
    codeSnippet: "<Button onClick={handleClick}>",
  },
]

const errorStats = {
  total: errors.length,
  critical: errors.filter((e) => e.severity === "error").length,
  warnings: errors.filter((e) => e.severity === "warning").length,
  info: errors.filter((e) => e.severity === "info").length,
  categories: {
    "React Hooks": errors.filter((e) => e.category === "React Hooks").length,
    "Error Handling": errors.filter((e) => e.category === "Error Handling").length,
    Performance: errors.filter((e) => e.category === "Performance").length,
    Accessibility: errors.filter((e) => e.category === "Accessibility").length,
  },
}

const suggestions = [
  {
    id: 1,
    type: "optimization",
    category: "Performance",
    priority: "high",
    title: "Add error handling to async function",
    description: "Wrap the fetch call in a try-catch block to handle potential network errors and improve user experience",
    confidence: 95,
    estimatedTime: "2 min",
    code: \`try {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  const data = await response.json();
  setUsers(data);
} catch (error) {
  console.error('Failed to fetch users:', error);
  // Show user-friendly error message
  setError('Failed to load users. Please try again.');
}`,\
    explanation: "This implementation adds proper error handling with HTTP status checking and user feedback.",\
    relatedLines: [15, 16, 17],\
    tags: ["error-handling", "async", "user-experience"],\
}
,
{
  id: 2,\
  type: "dependency",\
  category: "React Hooks",\
  priority: "medium",\
  title: "Fix useEffect dependency array",\
  description: "Move fetchUsers inside useEffect or add it to dependencies to prevent stale closures",\
  confidence: 90,\
  estimatedTime: "1 min",\
  code: `useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
  
  fetchUsers();
}, []); // Now safe with no external dependencies`,\
  explanation: "Moving the function inside useEffect eliminates the dependency warning and prevents potential bugs.",\
  relatedLines: [8, 9, 10],\
  tags: ["react-hooks", "dependencies", "best-practices"],\
}
,
{
  id: 3,\
  type: "refactor",\
  category: "Code Quality",\
  priority: "medium",\
  title: "Extract custom hook for data fetching",\
  description: "Create a reusable custom hook for API calls to improve code organization and reusability",\
  confidence: 85,\
  estimatedTime: "5 min",\
  code: `// Custom hook: useUsers.js
import { useState, useEffect } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};

// Usage in component:
const { users, loading, error } = useUsers()`,\
  explanation: "This custom hook encapsulates the data fetching logic and provides loading/error states.",\
  relatedLines: [5, 8, 15],\
  tags: ["custom-hooks", "reusability", "separation-of-concerns"],\
}
,
{
  id: 4,\
  type: "accessibility", category
  : "A11y",
    priority: "medium",
    title: "Improve button accessibility",
    description: "Add proper ARIA labels and semantic markup for better screen reader support",
    confidence: 88,
    estimatedTime: "2 min",
    code: `<Button
  onClick=
  handleClick
  aria-label = "Increment counter"
  aria-describedby = "count-display" > Increment
  </Button>
<p id="count-display" aria-live="polite">
  Count:
  count
  </p>`,
    explanation: "Adding ARIA attributes makes the component more accessible to users with disabilities.",
    relatedLines: [28, 29, 30],
    tags: ["accessibility", "aria", "screen-readers"],
}
,
{
    id: 5,
    type: "security",
    category: "Security",
    priority: "high",
    title: "Add input validation and sanitization",
    description: "Validate and sanitize user data to prevent XSS attacks and ensure data integrity",
    confidence: 92,
    estimatedTime: "3 min",
    code: `// Add validation utility
const sanitizeUserData = (users) => {
  return users.map(user => ({
    id: Number.parseInt(user.id, 10),
    name: user.name?.replace(/<script[^>]*>.*?<\/script>/gi, '') || 'Unknown',
    email: user.email?.toLowerCase().trim() || ''
  }));
};

// In fetchUsers function:
const data = await response.json();
const sanitizedUsers = sanitizeUserData(data);
setUsers(sanitizedUsers);`,
    explanation: "This prevents potential XSS attacks by sanitizing user-generated content before rendering.",
    relatedLines: [16, 17],
    tags: ["security", "xss-prevention", "data-validation"],
  },
  {
    id: 6,
    type: "testing",
    category: "Testing",
    priority: "low",
    title: "Add unit tests for component",
    description: "Create comprehensive tests to ensure component reliability and catch regressions",
    confidence: 80,
    estimatedTime: "10 min",
    code: `// App.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders welcome message', () => {
    render(<App />);
    expect(screen.getByText('Welcome to Dev Clarity')).toBeInTheDocument();
  });

  test('increments count on button click', () => {
    render(<App />);
    const button = screen.getByText('Increment');
    const countDisplay = screen.getByText('Count: 0');
    
    fireEvent.click(button);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('fetches and displays users', async () => {
    const mockUsers = [{ id: 1, name: 'John Doe' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});`,
    explanation: "These tests cover the main functionality and help prevent regressions during development.",
    relatedLines: [1, 35],
    tags: ["testing", "jest", "react-testing-library"],
  },
]

const filteredSuggestions = suggestions
  .filter((suggestion) => {
    if (suggestionFilter === "all") return true
    return suggestion.category.toLowerCase() === suggestionFilter.toLowerCase()
  })
  .sort((a, b) => {
    if (suggestionSort === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    if (suggestionSort === "confidence") {
      return b.confidence - a.confidence
    }
    if (suggestionSort === "time") {
      return parseInt(a.estimatedTime) - parseInt(b.estimatedTime)
    }
    return 0
  })

const handleApplySuggestion = (suggestionId: number) => {
  setAppliedSuggestions(prev => new Set([...prev, suggestionId]))
  // In a real implementation, this would modify the code
  console.log(`[v0] Applied suggestion $suggestionId`)
}

const getErrorIcon = (severity: string) => {
  switch (severity) {
    case "error":
      return <XCircle className="w-4 h-4 text-destructive" />
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-chart-4" />
    case "info":
      return <Lightbulb className="w-4 h-4 text-chart-2" />
    default:
      return <AlertTriangle className="w-4 h-4 text-muted-foreground" />
  }
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "text-destructive"
    case "medium":
      return "text-chart-4"
    case "low":
      return "text-chart-2"
    default:
      return "text-muted-foreground"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-destructive"
    case "medium":
      return "text-chart-4"
    case "low":
      return "text-chart-2"
    default:
      return "text-muted-foreground"
  }
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return "text-chart-3"
  if (confidence >= 75) return "text-chart-4"
  return "text-chart-2"
}

useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}, [isDark])

const toggleFolder = (folderName: string) => {
  setExpandedFolders(prev => {
    const newSet = new Set(prev)
    if (newSet.has(folderName)) {
      newSet.delete(folderName)
    } else {
      newSet.add(folderName)
    }
    return newSet
  })
}

const openFile = (fileName: string) => {
  setActiveFile(fileName)
  if (!openTabs.includes(fileName)) {
    setOpenTabs(prev => [...prev, fileName])
  }
}

const closeTab = (fileName: string) => {
  setOpenTabs(prev => {
    const newTabs = prev.filter(tab => tab !== fileName)
    if (fileName === activeFile && newTabs.length > 0) {
      setActiveFile(newTabs[newTabs.length - 1])
    }
    return newTabs
  })
}

const getFileIcon = (language: string) => {
  switch (language) {
    case "typescript":
      return <FileText className="w-4 h-4 text-blue-500" />
    case "css":
      return <FileText className="w-4 h-4 text-green-500" />
    case "json":
      return <FileText className="w-4 h-4 text-yellow-500" />
    case "markdown":
      return <FileText className="w-4 h-4 text-purple-500" />
    default:
      return <File className="w-4 h-4 text-muted-foreground" />
  }
}

const renderFileTree = (items: any[], level = 0) => {
  return items
    .filter(item => 
      searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.children && item.children.some((child: any) => 
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    )
    .map((item) => (
      <div key={item.name}>
        {item.type === "folder" ? (
          <div>
            <div
              className="flex items-center gap-2 p-1 rounded hover:bg-sidebar-accent cursor-pointer"
              style={{ paddingLeft: `$level * 12 + 8px` }}
              onClick={() => toggleFolder(item.name)}
            >
              {expandedFolders.has(item.name) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <Folder className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{item.name}</span>
            </div>
            {expandedFolders.has(item.name) && item.children && (
              <div>{renderFileTree(item.children, level + 1)}</div>
            )}
          </div>
        ) : (
          <div
            className={`flex items-center gap-2 p-1 rounded hover:bg-sidebar-accent cursor-pointer $
              activeFile === item.name ? "bg-sidebar-accent" : ""`}
            style={{ paddingLeft: `$level * 12 + 24px` }}
            onClick={() => openFile(item.name)}
          >
            {getFileIcon(item.language)}
            <span className="text-sm flex-1">{item.name}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    ))
}
