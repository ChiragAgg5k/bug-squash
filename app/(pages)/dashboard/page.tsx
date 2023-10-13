"use client";
import { useSession } from "next-auth/react";
import TicketsByPriorityChart from "./TicketsByPriorityChart";
import TicketsByStatusChart from "./TicketsByStatusChart";
import useSWR from "swr";
import { Ticket, fetchedUser } from "@/app/types";
import UsersCountChart from "./UsersCountChart";

export default function DashboardPage() {
	const { data: session } = useSession();

	const { data: tickets } = useSWR<Ticket[] | undefined>(
		session !== undefined ? `/api/tickets?userID=${session?.user.id}` : undefined,
		async (url: string) => {
			const response = await fetch(url);
			const data = await response.json();
			return data;
		}
	);

	const { data: user } = useSWR<fetchedUser | undefined>(
		session !== undefined ? `/api/users/user?userID=${session?.user.id}` : undefined,
		async (url: string) => {
			const response = await fetch(url);
			const data = await response.json();
			return data;
		}
	);

	const assignedUsers = user ? (user.assignedUsers ? user.assignedUsers : []) : undefined;

	return (
		<>
			<h1 className="mb-2 text-2xl">Dashboard</h1>
			<p className="mb-12">
				Welcome to the dashboard! Here you can see some statistics about your projects and tickets.
			</p>
			<div className="mb-12 grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
				<UsersCountChart assignedUsers={assignedUsers} />
				<TicketsByStatusChart tickets={tickets} />
				<TicketsByPriorityChart tickets={tickets} />
			</div>
		</>
	);
}
