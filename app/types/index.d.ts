import { ObjectId } from "mongodb";

export interface Project {
	_id: string;
	userID: string;
	name: string;
	description: string;
}

export interface AssignedUser {
	_id: ObjectId;
	userName: string;
	userEmail: string;
	userRole: string;
	assigneesId: string;
	assignedProjects: string[];
}

export interface AssignedUserList extends AssignedUser {
	assigned: boolean;
}
