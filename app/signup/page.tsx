"use client"

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-foreground/10 bg-white/80 p-8 text-center shadow-lg">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Signed in</div>
          <h1 className="mt-3 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {session?.user?.email ?? "You are signed in."}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button className="rounded-full" onClick={() => signOut()}>
              Sign out
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <a href="/dashboard">Open dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-4">
      <div className="grid w-full gap-8 rounded-[32px] border border-foreground/10 bg-white/80 p-8 shadow-lg md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Sign in</div>
          <h1 className="text-3xl font-semibold">Connect Google to continue</h1>
          <p className="text-sm text-muted-foreground">
            Save your PDFs, keep your history, and share the same workspace
            across devices.
          </p>
          <Button className="mt-2 w-fit rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => signIn("google")}>
            Sign in with Google
          </Button>
        </div>
        <div className="rounded-3xl border border-foreground/10 bg-linear-to-br from-orange-50 via-white to-rose-50 p-6">
          <div className="text-sm font-semibold">What you unlock</div>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            <li>Saved PDF history and quick access.</li>
            <li>Persistent chats with follow-up context.</li>
            <li>Secure access across sessions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
