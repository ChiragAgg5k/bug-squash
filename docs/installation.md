# Installation and Usage

## Table of Contents

-   [Installation and Usage](#Installation-and-Usage)
    -   [Table of Contents](#table-of-contents)
    -   [Installation](#installation)
    -   [Usage](#usage)

## Installation

To install this application, clone the repository and run `npm install` to install the dependencies. Then, create a `.env` file in the root directory and add the following environment variables:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET = "YOUR_GOOGLE_CLIENT_SECRET"
NEXT_PUBLIC_GITHUB_ID = "YOUR_GITHUB_ID"
NEXT_PUBLIC_GITHUB_SECRET = "YOUR_GITHUB_SECRET"
NEXT_PUBLIC_MONGODB_URI = "YOUR_MONGODB_URI"
NEXTAUTH_URL = "YOUR_NEXTAUTH_URL"
NEXTAUTH_SECRET = "YOUR_NEXTAUTH_SECRET"
```

-   **NEXTAUTH_URL** should be `http://localhost:3000` for local development, and `https://yourdomain.com` for production.

-   **NEXTAUTH_SECRET** is used to encrypt the NextAuth.js JWT, and to hash email verification tokens. To create one uou can quickly create a good value on the command line via this openssl command.

```bash
openssl rand -base64 32
```

-   **NEXT_PUBLIC_MONGODB_URI** should be a MongoDB connection string. You can create a free MongoDB Atlas cluster [here](https://www.mongodb.com/cloud/atlas/register).

-   **NEXT_PUBLIC_GOOGLE_CLIENT_ID** and **NEXT_PUBLIC_GOOGLE_CLIENT_SECRET** should be the client ID and secret for your Google OAuth application. You can create a Google OAuth application [here](https://console.cloud.google.com/apis/credentials/oauthclient).

-   **NEXT_PUBLIC_GITHUB_ID** and **NEXT_PUBLIC_GITHUB_SECRET** should be the client ID and secret for your GitHub OAuth application. You can create a GitHub OAuth application [here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

Side note: You can also use other OAuth providers with NextAuth.js. You can find more information about that [here](https://next-auth.js.org/configuration/providers).

## Usage

To run the application, run `npm run dev` in the root directory. The application will be available at `http://localhost:3000`.

To build the application for production, run `npm run build` in the root directory. The application will be built to the `.next` directory. You can then run `npm run start` to start the application in production mode.
