"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import FutDraftGame from "@/components/draft/FutDraftGame"; // Ojo: Si guardaste el componente en otra carpeta, ajusta esta línea

// Tu conexión a Supabase directa (igual que la tienes en el inicio)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DraftPage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUser(data.user);
      // Buscamos en tu tabla "profiles" la columna "name"
      const { data: profile } = await supabase
        .from("profiles").select("name").eq("id", data.user.id).single();
      setUsername(profile?.name ?? "Jugador");
    });
  }, []);

  if (!user) return (
    <div style={{ background: "#0a1628", color: "#e8f4fd", minHeight: "100vh", padding: "20px", textAlign: "center" }}>
      <p>Inicia sesión en la página principal para jugar al Draft.</p>
    </div>
  );

  return <FutDraftGame supabase={supabase} userId={user.id} username={username} />;
}
