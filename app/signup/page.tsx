"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
export default function page() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <div>
      <div>
        <button onClick={()=>signIn("google")}>Sign in with Google</button>
      </div>
    </div>
  )
}
