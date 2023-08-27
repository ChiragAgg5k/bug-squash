"use client";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Link from "next/link";

export default function NavBar() {
	return (
		<Navbar expand="sm" className="absolute w-full" bg="dark" data-bs-theme="dark">
			<Container fluid className="mx-2">
				<Navbar.Brand href="/">
					<Image src="/logo.png" alt="Logo" width={55} height={55} className="rounded-full" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto text-center text-zinc-400 ">
						<Link className="mx-3 my-2 transition-all ease-in-out hover:text-zinc-200" href="/users">
							Users
						</Link>
						<Link className="mx-3 my-2 transition-all ease-in-out hover:text-zinc-200" href="/projects">
							Projects
						</Link>
						<Link className="mx-3 my-2 transition-all ease-in-out hover:text-zinc-200" href="/tickets">
							Tickets
						</Link>
						<Link className="mx-3 my-2 transition-all ease-in-out hover:text-zinc-200" href="/profile">
							Profile
						</Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
