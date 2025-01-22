import { config } from "dotenv";
import { z } from "zod";

config();

const NODE_ENVIRONMENT = z
	.enum(["test", "development", "production"])
	.default("development");

const envSchema = z.object({
	NODE_ENV: NODE_ENVIRONMENT,
	PORT: z.number({ coerce: true }).default(5000),
	MONGODB_URI: z.string(),
	JWT_SECRET: z.string(),
	FRONTEND_ORIGIN: z.string(),
});

export default envSchema.parse(process.env);