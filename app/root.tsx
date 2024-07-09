import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { UserProvider } from "./contexts/UserContext.client";
import Loader from "~/components/Loader.client";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center justify-center space-x-2 animate-spin">
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
      </div>
    </div>
  );
}
