import type { MetaFunction } from "@remix-run/node";
import Home from "~/components/Home.client";

export const meta: MetaFunction = () => {
  return [
    { title: "Fungarium Perú" },
    { name: "description", content: "El Fungarium Peruano!" },
  ];
};

const IndexRoute: React.FC = () => {
  return <Home />;
};

export default IndexRoute;
