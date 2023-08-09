import { deleteUser } from ".";
import { fetchedUser } from "@/app/types";

export default function DeleteUserModal({
	userId,
	userToDelete,
}: {
	userToDelete: fetchedUser | undefined;
	userId: string;
}) {
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!userToDelete) return;

		const res = await deleteUser({
			userId: userId,
			userToDeleteId: userToDelete._id.toString(),
		});

		if (res.acknowledged) {
			window.location.reload();
		}
	};

	return (
		<dialog id="delete_user_modal" className="modal">
			<form
				method="dialog"
				className="modal-box p-10"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit(e);
				}}
			>
				<h3 className="mb-4 text-xl font-bold">Remove User</h3>
				<p className="mb-4 text-lg">
					Are you sure you want to remove the user{" "}
					<strong className="text-teal-500">{userToDelete ? userToDelete.name : "this user"}</strong>?
				</p>
				<button type="submit" className="btn btn-accent w-full">
					Remove User
				</button>
			</form>
			<form method="dialog" className="modal-backdrop bg-transparent">
				<button>close</button>
			</form>
		</dialog>
	);
}
