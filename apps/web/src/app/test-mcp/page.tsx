import { ResearchForm } from "@/components/research/ResearchForm"

export default function TestMCPPage() {
  return (
    <main className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">MCP Test Page</h1>
        <p className="text-muted-foreground">
          This page tests the MCP wrapper and research API endpoint. Use the form below to submit research queries
          and verify the end-to-end functionality.
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-muted/10">
        <h2 className="text-sm font-medium mb-2">Debug Information</h2>
        <dl className="text-sm space-y-1">
          <div className="flex gap-2">
            <dt className="font-mono text-muted-foreground">API Endpoint:</dt>
            <dd className="font-mono">/api/research</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-mono text-muted-foreground">MCP Status:</dt>
            <dd className="font-mono">Active</dd>
          </div>
        </dl>
      </div>

      <ResearchForm />
    </main>
  )
} 