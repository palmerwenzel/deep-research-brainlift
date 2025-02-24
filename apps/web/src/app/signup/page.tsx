import { AuthForm } from '@/components/auth/AuthForm'

export default function SignupPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Create Account</h1>
          <p className="text-lg text-muted-foreground">
            Sign up to start saving your research history.
          </p>
        </header>
        
        <div className="grid gap-6">
          <AuthForm type="signup" />
        </div>
      </div>
    </main>
  )
} 