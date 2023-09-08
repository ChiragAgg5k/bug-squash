"use client";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Image from "next/image";

export const navLinks = [
	{
		id: "dashboard",
		title: "Dashboard",
	},
	{
		id: "users",
		title: "Users",
	},
	{
		id: "projects",
		title: "Projects",
	},
	{
		id: "tickets",
		title: "Tickets",
	},
	{
		id: "profile",
		title: "Profile",
	},
];

const Navbar = () => {
	const [active, setActive] = useState("Home");
	const [toggle, setToggle] = useState(false);

	return (
		<nav className="navbar absolute flex w-full items-center justify-between bg-base-100 px-4 py-3">
			{/* Logo */}
			<Image
				src="/logo.png"
				onClick={() => {
					window.location.reload();
				}}
				alt="Logo"
				width={55}
				height={55}
				className="cursor-pointer rounded-full transition-all ease-in-out hover:scale-105"
			/>

			{/* Desktop Navigation */}
			<ul className="mr-2 hidden flex-1 list-none items-center justify-end sm:flex">
				{navLinks.map((nav, index) => (
					<li
						key={nav.id}
						className={`font-poppins cursor-pointer text-[16px] font-normal ${
							active === nav.title ? "text-white" : "text-dimWhite"
						} ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
						onClick={() => setActive(nav.title)}
					>
						<Link href={`/${nav.id}`} className="group transition duration-300 hover:cursor-pointer">
							{nav.title}
							<span className="block h-[1px] max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
						</Link>
					</li>
				))}
			</ul>

			{/* Mobile Navigation */}
			<div className="flex flex-1 items-center justify-end sm:hidden">
				{toggle ? (
					<AiOutlineClose
						className="h-[28px] w-[28px] object-contain hover:cursor-pointer"
						onClick={() => setToggle(!toggle)}
					/>
				) : (
					<AiOutlineMenu
						className="h-[28px] w-[28px] object-contain hover:cursor-pointer"
						onClick={() => setToggle(!toggle)}
					/>
				)}

				{/* Sidebar */}
				<div
					className={`${
						!toggle ? "hidden" : "flex"
					} sidebar absolute right-0 top-20 mx-4 my-2 min-w-[140px] rounded-xl bg-base-100 p-6`}
				>
					<ul className="flex flex-1 list-none flex-col items-start justify-end">
						{navLinks.map((nav, index) => (
							<li
								key={nav.id}
								className={`font-poppins cursor-pointer text-[16px] font-medium ${
									active === nav.title ? "text-white" : "text-dimWhite"
								} ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
								onClick={() => {
									setActive(nav.title);
									setToggle(!toggle);
								}}
							>
								<Link href={`/${nav.id}`} className="hover:underline">
									{nav.title}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
