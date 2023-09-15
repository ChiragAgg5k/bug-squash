"use client";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function HelpToast() {
	const [show, setShow] = useState(true);

	return (
		<div
			className={`toast m-4 rounded bg-base-100 transition-all duration-300 ease-in-out ${show ? "" : "hidden"}`}
		>
			<AiOutlineClose className="absolute right-2 top-2 cursor-pointer" onClick={() => setShow(false)} />
			<p className="mr-4 inline-block">Need any help? Mail us at</p>
			<Link href="mailto:admin@bug-squash.co" passHref className="link-accent link inline-block">
				admin@bug-squash.co
			</Link>
		</div>
	);
}
