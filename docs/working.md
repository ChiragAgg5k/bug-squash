# Working

## Table of Contents

-   [Working](#working)
    -   [Table of Contents](#table-of-contents)
    -   [Authentication](#authentication)

## Authentication

Bug Squash uses [NextAuth.js](https://next-auth.js.org/) for authentication. NextAuth.js supports authentication with Google, GitHub, Facebook, Twitter, Apple, Discord, Slack, and many other providers. You can also use email and password authentication, or create your own custom authentication provider.

Project only uses Google and GitHub authentication. To add authentication with other providers, you can add a new provider in `app/(pages)/api/auth/[...nextauth]/route.ts`. You can find more information about adding providers [here](https://next-auth.js.org/configuration/providers).

Users are stored in a MongoDB database. You can find more information about configuring the database [here](https://next-auth.js.org/configuration/databases). The schema is predefined by NextAuth.js, but custom callbacks can be added to the database configuration to add custom fields to the user object. The schema is:

```typescript
interface User {
	_id: ObjectId;
	name: string;
	email: string;
	image: string;
	emailVerified: string;
}
```

```typescript
interface Account {
	_id: ObjectId;
	provider: string;
	type: string;
	providerAccountId: string;
	accessToken: string;
	token_type: string;
	scope: string;
	userId: ObjectId;
}
```

MongoDB can be used like this seemlessly with next-auth.js using Adaptors. You can find more information about using MongoDB with next-auth.js [here](https://next-auth.js.org/configuration/databases#mongodb-database).

Information about a user's session can be retrieved through NextAuth.js's `getServerSession` function or `useSession` hook. You can find more information about these hooks [here](https://next-auth.js.org/getting-started/client#usesession) as well.

In short, `getServerSession` is used on the server side, and `useSession` is used on the client side. `getServerSession` returns a session object, and `useSession` returns an array containing the session object and a boolean indicating whether the session is loading.

The schema for the session object's user is:

```typescript
interface User {
	name: string;
	email: string;
	image: string;
}
```

By default, the session object only contains the user's name, email, and image. You need to add a custom callback to add more fields to the session object. You can find more information about custom callbacks [here](https://next-auth.js.org/configuration/callbacks).

One of the most important callback is for adding id to the session object. Which can be used to identify the user in the database. The callback is:

```typescript
async function jwt(token: JWT, user: User) {
	// JWT forwards the token to the session
	if (user) {
		token.id = user.id;
	}
	return token;
}

async function session(session: Session, user: User) {
	// Forwarded user.id is added to the session
	session.user.id = user.id;
	return session;
}
```

But even after all this, _for me_ the id was only avaible when fetching session through the `useSession` hook. `getServerSession` returned a session without the id.

## SessionProvider

The `SessionProvider` component is used to wrap the application in a `Provider` component from NextAuth.js. The `Provider` component is used to provide the session object to the application. The `SessionProvider` component is defined in `app/providers/provider.tsx`. It is used in `app/(pages)/layout.tsx` to wrap the application. The `SessionProvider` component is defined as:

Just an addition step for next-auth.js to work with next.js

## Pages

Next auth has predefined pages for authentication. You can find more information about these pages [here](https://next-auth.js.org/configuration/pages). You can also create your own custom pages. You can find more information about custom pages [here](https://next-auth.js.org/configuration/pages#custom-pages). The pages are:

-   `/api/auth/signin`: The sign in page.
-   `/api/auth/signout`: The sign out page.
-   `/api/auth/callback`: The callback page.
-   `/api/auth/error`: Error code passed in query string as ?error=
-   `/api/auth/verifyRequest`: Used to check email verification requests.
-   `/api/auth/newUser`: Users are redirected to this page if they are a new user.

# Environment Variables

Already explained all the environment variables used and why [here](../docs/ReadMe.md#installation). But one thing with them is that when used directly, they flag TypeScript errors for possibly not being defined.

So, to fix that, I used a npm module called zod to define the environment variables. You can find more information about zod [here](https://www.npmjs.com/package/zod).
All it does is verify if the environment variables are non empty, and export a custom env object. Code for it is [here](../env.ts).
