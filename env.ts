import zod from "zod";

const envSchema = zod.object({
	NEXT_PUBLIC_GOOGLE_CLIENT_ID: zod.string().nonempty(),
	NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: zod.string().nonempty(),
	NEXT_PUBLIC_GITHUB_ID: zod.string().nonempty(),
	NEXT_PUBLIC_GITHUB_SECRET: zod.string().nonempty(),
});

export const env = envSchema.parse(process.env);
