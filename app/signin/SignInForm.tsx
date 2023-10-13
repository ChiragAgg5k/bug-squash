"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm({
	demoSignIn,
}:{
	demoSignIn: boolean
}) {
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	return (
		<>
			<form
				onSubmit={async (event) => {
					event.preventDefault();
					setLoading(true);
					const form = new FormData(event.target as HTMLFormElement);

					const res = await signIn("credentials", {
						redirect: false,
						email: form.get("email") as string,
						password: form.get("password") as string,
						callbackUrl: `${window.location.origin}/dashboard`,
					});

					if (res && res.error) {
						setError(res.error);

						setTimeout(() => {
							setError(undefined);
						}, 3000);

						setLoading(false);
					} else {
						router.push("/dashboard");
					}
				}}
			>
				<div>
					<label className="label">
						<span className="label-text">Email</span>
					</label>
					<input
						type="email"
						name="email"
						value={demoSignIn ? "demo@bug-squash.co" : ""}
						id="email"
						placeholder="Enter your email"
						className="input input-bordered w-full"
					/>
				</div>
				<div>
					<label className="label">
						<span className="label-text">Password</span>
					</label>
					<input
						type="password"
						name="password"
						id="password"
						value={demoSignIn ? "demo123" : ""}
						placeholder="Enter your password"
						className="input input-bordered w-full"
					/>
				</div>
				<button className="btn btn-accent mt-8 w-full" disabled={loading}>
					{loading && <div className="loading loading-dots loading-lg" />}
					Sign In
				</button>
			</form>

			<div
				className="alert alert-error absolute right-0 top-0 mr-8 mt-8 max-w-md"
				style={{ display: error ? "block" : "none" }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="mr-2 inline-block h-6 w-6 shrink-0 stroke-current hover:cursor-pointer"
					fill="none"
					onClick={() => {
						setError(undefined);
					}}
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span className="inline-block">{error + "."}</span>
			</div>
		</>
	);
}
