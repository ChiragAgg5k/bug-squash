import Image from "next/image";
import Link from "next/link";
import SignInForm from "./SignInForm";
import { getProviders } from "next-auth/react";
import ProviderButtons from "./ProviderButtons";

export default async function SignInPage({
	searchParams,
}: {
	searchParams: {
		email: string;
		password: string;
	};
}) {
	const providers = await getProviders();

	const email = searchParams.email;
	const password = searchParams.password;
	const demoSignIn = email === "demo@bug-squash.co" && password === "demo123";

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md rounded-lg bg-base-100 p-10 text-white">
				<div className="flex items-center justify-center">
					<Image src="/logo.png" alt="Bug Squash" width={75} height={75} className="mr-4" />
					<h1 className="text-center text-3xl font-bold">{demoSignIn ? "Demo Sign In" : "Bug Squash"}</h1>
				</div>
				<div className="mb-4 mt-8 h-[2px] w-full bg-gray-700"></div>
				<SignInForm demoSignIn={demoSignIn} />
				<div className="my-8 h-[2px] w-full bg-gray-700"></div>
				<ProviderButtons providers={providers} />

				{demoSignIn ? (
					<p className="mt-6 text-center text-sm">
						You are logging in as a demo user. Make sure to <span className="text-accent">not</span> share
						your personal information.
					</p>
				) : (
					<div className="mt-6 flex justify-center text-sm">
						<p className="mr-2">Just want to try the app?</p>
						<Link href={`/signin?email=demo@bug-squash.co&password=demo123`} className="link-accent link">
							Sign in as a demo user
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
