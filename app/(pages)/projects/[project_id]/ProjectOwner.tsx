"use client";

import useSWR from "swr";

export default function ProjectOwner({ userID }: { userID: string }) {
	const user = useSWR(`/api/users/user?userID=${userID}`, async (url) => {
		const res = await fetch(url);
		return res.json();
	});

	return <p className="mb-4 inline-block">{user.data ? user.data.name : "Loading..."}</p>;
}
