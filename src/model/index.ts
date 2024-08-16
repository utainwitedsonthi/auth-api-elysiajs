import { t } from "elysia";

export const signinModel = t.Object({
  username: t.String(),
  password: t.String({ minLength: 10 }),
});

export const signupModel = t.Object({
  name: t.String(),
  email: t.String(),
  username: t.String(),
  password: t.String({ minLength: 10 }),
  fullname: t.String(),
  lastname: t.String(),
});

export const refreshTokenModel = t.Object({
  token: t.String(),
});
