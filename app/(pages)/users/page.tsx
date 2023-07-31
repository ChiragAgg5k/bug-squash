import NavBar from "@/components/NavBar";
import AddUserModal from "./AddUserModal";
import UsersTable from "./UsersTable";

const HEADERS = ["User", "Email", "Role"];

export default async function Users() {
	return (
		<div className="min-h-screen">
			<NavBar />
			<div className="mx-8 pt-28">
				<h1 className="mb-4 text-2xl">Manage Users</h1>
				<h3 className="">Here you can manage users, including adding, removing, and editing their roles.</h3>

				<div className="my-4 grid grid-cols-3 items-center">
					{HEADERS.map((header, index) => (
						<h3 className="mb-3 border-b border-gray-600 pb-2 text-lg font-bold" key={index}>
							{header}
						</h3>
					))}

					<UsersTable />
				</div>
			</div>

			<AddUserModal />
		</div>
	);
}
