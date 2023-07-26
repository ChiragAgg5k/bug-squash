import NavBar from "@/components/NavBar";

export default function Users() {
	return (
		<>
			<NavBar />
			<div className="mx-8 pt-28">
				<h1 className="mb-4 text-2xl">Manage Users</h1>
				<h3 className="">Here you can manage users, including adding, removing, and editing their roles.</h3>
			</div>
		</>
	);
}
