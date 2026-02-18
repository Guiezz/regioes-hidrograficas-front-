import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // A porta onde seu Go/API está rodando
        pathname: "/assets/**", // Permite acessar a pasta assets
      },
      {
        protocol: "https",
        hostname: "regioes-hidrograficas-api.onrender.com",
        port: "8080",
        pathname: "/assets/**",
      },
      // Se for subir para produção depois, adicione o domínio real aqui também
    ],
  },
};

export default nextConfig;
