import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const plugin = new Elysia().use(
  jwt({ name: "jwt", secret: Bun.env.JWT_SECRET_KEY as string, exp: "15m" })
);
