import { Pie, Sector, ResponsiveContainer } from "recharts";
import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { Ticket } from "@/app/types";
import Link from "next/link";

const PieChart = dynamic(() => import("recharts").then((recharts) => recharts.PieChart), { ssr: false });

const renderActiveShape = (props: any) => {
	const RADIAN = Math.PI / 180;
	const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? "start" : "end";

	return (
		<g>
			<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
				{payload.name}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

			<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#55AFA6">{`${value} Ticket${
				value > 1 ? "s" : ""
			}`}</text>
		</g>
	);
};

export default function TicketsByStatusChart({ tickets }: { tickets: Ticket[] | undefined }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const onPieEnter = useCallback(
		(_: any, index: number) => {
			setActiveIndex(index);
		},
		[setActiveIndex]
	);

	if (!tickets) {
		return <p className="flex h-52 w-full items-center justify-center">Loading...</p>;
	}

	const ticketCountByStatus = [
		{
			name: "Open",
			value: tickets?.filter((ticket) => ticket.status === "open").length,
		},
		{
			name: "In Progress",
			value: tickets?.filter((ticket) => ticket.status === "in-progress").length,
		},
		{
			name: "Closed",
			value: tickets?.filter((ticket) => ticket.status === "closed").length,
		},
	];

	return (
		<div>
			<h3 className="mb-4 w-full text-center">Count of tickets by status</h3>
			<Link href="/tickets">
				<ResponsiveContainer width="100%" height={300}>
					<PieChart width={400} height={400}>
						<Pie
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							data={ticketCountByStatus}
							cy={135}
							innerRadius={80}
							outerRadius={100}
							fill="#55AFA6"
							dataKey="value"
							onMouseEnter={onPieEnter}
						/>
					</PieChart>
				</ResponsiveContainer>
			</Link>
			<p className="w-full text-center">Total Tickets: {tickets.length}</p>
		</div>
	);
}
