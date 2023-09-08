import { Ticket } from "@/app/types";
import dynamic from "next/dynamic";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarChart = dynamic(() => import("recharts").then((recharts) => recharts.BarChart), { ssr: false });

let ticketCountByPriority: { name: string; count: number }[] = [];

const CustomTooltip = ({ active, payload }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="rounded bg-white p-2 shadow">
				<p className="text-sm text-gray-600">
					{payload[0].value} {payload[0].payload.name} Priority Ticket{payload[0].value > 1 ? "s" : ""}
				</p>
			</div>
		);
	}

	return null;
};

export default function TicketsByPriorityChart({ tickets }: { tickets: Ticket[] | undefined }) {
	if (!tickets) {
		return <p className="col-span-2 flex h-52 w-full items-center justify-center">Loading...</p>;
	}

	ticketCountByPriority = [
		{
			name: "Low",
			count: tickets?.filter((ticket) => ticket.priority === "low").length,
		},
		{
			name: "Medium",
			count: tickets?.filter((ticket) => ticket.priority === "medium").length,
		},
		{
			name: "High",
			count: tickets?.filter((ticket) => ticket.priority === "high").length,
		},
		{
			name: "Urgent",
			count: tickets?.filter((ticket) => ticket.priority === "urgent").length,
		},
	];

	return (
		<div className="sm:col-span-2">
			<h3 className="mb-4 w-full text-center">Count of tickets by priority</h3>
			<div className="flex items-center justify-center md:mx-12">
				<ResponsiveContainer height={300} width="100%">
					<BarChart
						width={500}
						title="Count of tickets by priority"
						height={300}
						data={ticketCountByPriority}
						margin={{
							top: 0,
							right: 0,
							left: -22,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis domain={[0, Math.max(...ticketCountByPriority.map((ticket) => ticket.count)) + 1]} />
						<Tooltip content={<CustomTooltip />} />
						<Legend />
						<Bar dataKey="count" fill="#55AFA6" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
