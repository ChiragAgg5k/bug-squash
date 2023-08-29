"use client";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
	return (
		<div className="navbar absolute bg-base-100 px-4 py-3">
			<div className="flex-1">
				<Image src="/logo.png" alt="Logo" width={55} height={55} className=" rounded-full" />
			</div>
			<div className="flex flex-none">
				<ul className="flex text-center text-zinc-400 ">
					<li>
						<Link className="mx-3 my-2 transition-all ease-in-out hover:text-zinc-200" href={"/users"}>
							Users
						</Link>
					</li>
					<li>
						<Link className="mx-3 my-2 transition-all ease-in-out hover:text-zinc-200" href={"/projects"}>
							Projects
						</Link>
					</li>
					<li>
						<Link className="mx-3 my-2 transition-all ease-in-out hover:text-zinc-200" href={"/tickets"}>
							Tickets
						</Link>
					</li>
					<li>
						<Link className="mx-3 my-2 transition-all ease-in-out hover:text-zinc-200" href={"/profile"}>
							Profile
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
