"use client";

import { Ticket } from "@/app/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

function formatDate(date: string) {
	const now = new Date();
	const then = new Date(date);

	const diff = now.getTime() - then.getTime();

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (days === 0) {
		return "Today";
	}

	if (days === 1) {
		return "Yesterday";
	}

	if (days < 7) {
		return `${days} days ago`;
	}

	if (days < 30) {
		return `${Math.floor(days / 7)} weeks ago`;
	}

	if (days < 365) {
		return `${Math.floor(days / 30)} months ago`;
	}

	return `${Math.floor(days / 365)} years ago`;
}

async function multiFetcher(ticketID: string) {
	const res = await fetch(`/api/tickets/ticket?ticketID=${ticketID}`);
	const ticket: Ticket = await res.json();
	await Promise.all(
		ticket.comments.map(async (comment) => {
			const res = await fetch(`/api/users/user?userID=${comment.userID}`);
			const user = await res.json();
			comment.userName = user.name;
		})
	);

	ticket.comments.reverse();
	return ticket;
}

export default function Comments({ ticketID }: { ticketID: string }) {
	const { data: session } = useSession();
	const [comment, setComment] = useState<string>("");
	const { data: ticket } = useSWR<Ticket | undefined>(ticketID, multiFetcher);

	const handlePostComment = async () => {
		if (!comment || session?.user === undefined || ticket === undefined) {
			return;
		}

		const response = await fetch("/api/tickets/comment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ticketID: ticket._id,
				comment: comment,
				userID: session.user.id,
				time: new Date().toISOString(),
			}),
		});
		const res = await response.json();

		if (res.acknowledged) {
			window.location.reload();
		}
	};

	if (!ticket) {
		return (
			<>
				<h2 className="mb-4 text-xl">Comments:</h2>
				<div className="flex min-h-[20dvh] items-center justify-center">
					<p>loading...</p>
				</div>
			</>
		);
	}

	return (
		<>
			<h2 className="mb-4 text-xl">Comments:</h2>
			<input
				onChange={(e) => {
					setComment(e.target.value);
				}}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						handlePostComment();
					}
				}}
				type="text"
				className="input mb-4 w-full"
				id="user-comment"
				placeholder="Add a comment ..."
			/>

			{ticket.comments.length === 0 && <p className="mb-4">No comments yet.</p>}

			{ticket.comments.map((comment, index) => {
				return (
					<div className="my-4" key={index}>
						<p>
							<span className="font-medium">{comment.userName}</span>
							<span className="text-sm text-gray-500">{" - " + formatDate(comment.time)}</span>
						</p>
						<p>
							<span className="text-gray-500">{comment.comment}</span>
						</p>
					</div>
				);
			})}
		</>
	);
}
