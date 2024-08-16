import { Elysia } from "elysia";
import { plugin } from "./plugin";
import { refreshTokenModel, signinModel, signupModel } from "./model";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Elysia()
  .use(plugin)
  .get("/", () => "Hello Elysia")
  .post(
    "/signin",
    async ({ jwt, body }) => {
      const { username, password } = body;

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }],
        },
      });

      if (!user) return { message: "error" };

      const isMatch = await Bun.password.verify(password, user.password);

      if (!isMatch) return { message: "error" };

      const token = await jwt.sign({ username: username });

      return { data: { token: token } };
    },
    { body: signinModel }
  )
  .post(
    "/signup",
    async ({ body }) => {
      const { name, email, username, password, fullname, lastname } = body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { username: username }],
        },
      });

      if (existingUser) return { message: "error" };

      const uuid = crypto.randomUUID();

      const argonHash = await Bun.password.hash(password, {
        algorithm: "argon2id",
        memoryCost: 4,
        timeCost: 3,
      });

      await prisma.user.create({
        data: {
          uuid: uuid,
          name: name,
          email: email,
          username: username,
          password: argonHash,
          fullname: fullname,
          lastname: lastname,
        },
      });

      return {
        message: "ok",
      };
    },
    { body: signupModel }
  )
  .post(
    "/refreshToken",
    async ({ jwt, body }) => {
      const { token } = body;
      const user = await jwt.verify(token);
      if (!user) return { message: "error" };

      const refreshToken = await jwt.sign({ username: user.username });

      return { data: { refreshToken: refreshToken } };
    },
    {
      body: refreshTokenModel,
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
4;
