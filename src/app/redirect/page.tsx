// app/redirect/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RedirectPage() {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      router.push("/");
    }, 300); // Tempo para mostrar a animação
  };

  return (
    <main
      style={{
        height: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={handleClick}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.25rem",
          borderRadius: "8px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          transform: clicked ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.2s ease-in-out",
        }}
      >
        Ir para Home
      </button>
    </main>
  );
}
