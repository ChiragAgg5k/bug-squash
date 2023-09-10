import { Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import dynamic from "next/dynamic";
import { AssignedUser } from "@/app/types";
import Link from "next/link";

let data: { name: string; value: number }[] = [];
const PieChart = dynamic(() => import("recharts").then((recharts) => recharts.PieChart), { ssr: false });

// colors should be different shades of teal
// DIFFERENT SHADES OF TEAL
const COLORS = ["#00b3b3", "#009a9a", "#008080", "#006767"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	if (percent < 0.05) return null;

	return (
		<text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
			{data[index].name}
		</text>
	);
};

export default function UsersCountChart({ assignedUsers }: { assignedUsers: AssignedUser[] | undefined }) {
	if (assignedUsers === undefined) {
		return <p className="flex h-52 w-full items-center justify-center">Loading...</p>;
	}

	if (assignedUsers.length === 0)
		return <p className="flex h-52 w-full items-center justify-center">No users assigned by you.</p>;

	data = [
		{
			name: "Admins",
			value: assignedUsers.filter((user) => Object.values(user)[0] === "Admin").length,
		},
		{
			name: "Developers",
			value: assignedUsers.filter((user) => Object.values(user)[0] === "Developer").length,
		},
		{
			name: "Testers",
			value: assignedUsers.filter((user) => Object.values(user)[0] === "Tester").length,
		},
		{
			name: "Managers",
			value: assignedUsers.filter((user) => Object.values(user)[0] === "Manager").length,
		},
	];

	return (
		<div>
			<h3 className="mb-4 w-full text-center">Users and their roles</h3>
			<Link href="/users">
				<ResponsiveContainer width="100%" height={300}>
					<PieChart width={400} height={400}>
						<Pie
							data={data}
							labelLine={false}
							label={renderCustomizedLabel}
							outerRadius={100}
							fill="#8884d8"
							dataKey="value"
							cy={135}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</Link>
			<p className="w-full text-center">
				Total users:{" "}
				{data.reduce((acc, curr) => {
					return acc + curr.value;
				}, 0)}
			</p>
		</div>
	);
}
