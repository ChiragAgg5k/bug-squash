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
