import Navbar from "@/components/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<div className="mx-4 flex min-h-screen flex-col pt-28 sm:mx-8">{children}</div>
		</>
	);
}
