"use client";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function ProviderButtons({ providers }: { providers: any }) {
	const [googleLoading, setGoogleLoading] = useState(false);
	const [githubLoading, setGithubLoading] = useState(false);
	// where name is google
	const googleProvider = Object.values(providers).find((provider: any) => provider.name.toLowerCase() === "google");

	const githubProvider = Object.values(providers).find((provider: any) => provider.name.toLowerCase() === "github");

	if (!providers) return null;

	return (
		<>
			{/* @ts-ignore */}
			<div key={googleProvider.name}>
				<button
					className={`btn w-full bg-white text-black hover:bg-gray-200`}
					disabled={googleLoading}
					onClick={() => {
						setGoogleLoading(true);
						signIn(
							// @ts-ignore
							googleProvider.id,
							{ callbackUrl: "/profile" }
						);
					}}
				>
					{googleLoading ? (
						<div className="loading loading-dots loading-lg" />
					) : (
						<FcGoogle className="mr-3 text-2xl" />
					)}
					{/* @ts-ignore */}
					Sign In With {googleProvider.name}
				</button>
			</div>

			{/* @ts-ignore */}
			<div key={githubProvider.name} className="mt-4">
				<button
					className={`btn w-full bg-black text-white`}
					disabled={githubLoading}
					onClick={() => {
						setGithubLoading(true);
						signIn(
							// @ts-ignore
							githubProvider.id,
							{ callbackUrl: "/profile" }
						);
					}}
				>
					{githubLoading ? (
						<div className="loading loading-dots loading-lg" />
					) : (
						<AiFillGithub className="mr-3 text-2xl" />
					)}
					{/* @ts-ignore */}
					Sign In With {githubProvider.name}
				</button>
			</div>
		</>
	);
}
