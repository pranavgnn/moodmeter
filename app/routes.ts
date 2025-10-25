import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
    route("forgot-password", "routes/forgot-password.tsx"),
    route("reset-password", "routes/reset-password.tsx"),
    route("auth/confirm", "routes/auth.confirm.tsx"),
    route("prompt", "routes/prompt.tsx"),
    route("result", "routes/result.tsx"),
    route("*", "routes/404.tsx"),
] satisfies RouteConfig;