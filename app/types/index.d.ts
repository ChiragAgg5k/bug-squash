import { ObjectId } from "mongodb";

export interface Project {
	_id: string;
	userID: string;
	name: string;
	description: string;
}

export interface AssignedUser {
	[assignedId: string]: string; // assignedId: role
}

export interface fetchedUser {
	_id: ObjectId;
	name: string;
	email: string;
	image: string | null;
	emailVerified: boolean | null;
	assignedUsers: AssignedUser[];
	role: string;
}

export interface Ticket {
	_id: string;
	userID: string;
	heading: string;
	description: string;
	projectID: string;
	type: "bug" | "feature" | "improvement" | "documentation";
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in-progress" | "closed";
	assignedUsers: AssignedUser[];
	comments: Comment[];
}

interface TicketWithoutID extends Omit<Ticket, "_id"> {}

export interface Comment {
	comment: string;
	userID: string;
	time: string;
}
