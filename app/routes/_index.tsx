import type { MetaFunction } from "@remix-run/node";
import Home from "~/components/Home.client";

export const meta: MetaFunction = () => {
  return [
    { title: "Revolución Fungi - Fungarium Perú" },
    { name: "description", content: "Revolución Fungi: Documentando y conservando la diversidad fúngica del Perú" },
    { property: "og:title", content: "Revolución Fungi - Fungarium Perú" },
    { property: "og:description", content: "Un movimiento que redefine nuestra relación con los hongos, integrándolos en la vida cotidiana del Perú" },
    { property: "og:image", content: "/hero-mushroom.jpg" },
    { property: "og:image:alt", content: "Hongos del Perú - Revolución Fungi" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Revolución Fungi - Fungarium Perú" },
    { name: "twitter:description", content: "Un movimiento que redefine nuestra relación con los hongos, integrándolos en la vida cotidiana del Perú" },
    { name: "twitter:image", content: "/hero-mushroom.jpg" },
    { name: "twitter:image:alt", content: "Hongos del Perú - Revolución Fungi" },
  ];
};

const IndexRoute: React.FC = () => {
  return <Home />;
};

export default IndexRoute;
