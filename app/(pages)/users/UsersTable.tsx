"use client";

import { useSession } from "next-auth/react";
import { fetchUsers } from ".";
import { useEffect, useState } from "react";
import { ObjectId } from "mongodb";

interface fetchedUser {
	_id: ObjectId;
	userName: string;
	userEmail: string;
	userRole: string;
	assigneesId: string;
}

export default function UsersTable() {
	const { data: session } = useSession();
	const [users, setUsers] = useState<fetchedUser[]>([]);

	useEffect(() => {
		if (!session) return;

		const data = fetchUsers({
			assigneesId: session.user.id,
		});

		data.then((res) => {
			setUsers(res);
		});
	}, [session]);

	return (
		<>
			{users.map((user, index) => (
				<>
					<p className="mb-3">{user.userName}</p>
					<p className="mb-3">{user.userEmail}</p>
					<p className="mb-3">{user.userRole}</p>
				</>
			))}
		</>
	);
}
