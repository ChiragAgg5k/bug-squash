import AddUserModal from "./AddUserModal";
import UsersTable from "./UsersTable";

export default async function Users() {
	return (
		<>
			<h1 className="mb-4 text-2xl">Manage Users</h1>
			<h3 className="">Here you can manage users, including adding, removing, and editing their roles.</h3>

			<UsersTable />

			<AddUserModal />
		</>
	);
}
