"use client";
import { signIn, signOut } from "next-auth/react";

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn("google");
  };

  return <button onClick={handleClick}>Sign in with Google</button>;
}

export function SignOutButton(props: { className?: string }) {
  const handleClick = () => {
    signOut();
  };

  return (
    <button onClick={handleClick} className={props.className ?? ""}>
      Sign out
    </button>
  );
}
