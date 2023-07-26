"use client";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function NavBar() {
	return (
		<Navbar expand="sm" className="absolute w-full" bg="dark" data-bs-theme="dark">
			<Container fluid className="mx-2">
				<Navbar.Brand href="/">
					<Image
						src="/logo.png"
						alt="Logo"
						width={55}
						height={55}
						className="rounded-full border-2 border-gray-600"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto text-center">
						<Nav.Link href="/dashboard" className="mx-2">
							Dashboard
						</Nav.Link>
						<Nav.Link className="mx-2" href="/users">
							Users
						</Nav.Link>
						<Nav.Link className="mx-2" href="/projects">
							Projects
						</Nav.Link>
						<Nav.Link className="mx-2" href="/tickets">
							Tickets
						</Nav.Link>
						<Nav.Link className="mx-2" href="/profile">
							Profile
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
