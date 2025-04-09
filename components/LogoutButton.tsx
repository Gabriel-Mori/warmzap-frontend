"use client";

import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useUser();

  const handleLogout = async () => {
    try {
      logout();
      router.push("/");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return <button onClick={handleLogout}>Sair</button>;
};

export default LogoutButton;
