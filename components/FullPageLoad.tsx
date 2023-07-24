import NavBar from "./NavBar";

export default function FullPageLoad() {
	return (
		<>
			<NavBar />
			<div className="flex h-screen items-center justify-center">
				<h1 className="text-xl font-bold">Loading...</h1>
			</div>
		</>
	);
}
