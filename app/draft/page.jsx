"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // tu helper de siempre
import FutDraftGame from "@/components/draft/FutDraftGame";

export default function DraftPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUser(data.user);
      const { data: profile } = await supabase
        .from("profiles").select("username").eq("id", data.user.id).single();
      setUsername(profile?.username ?? "Jugador");
    });
  }, []);

  if (!user) return <p>Inicia sesión para jugar.</p>;
  return <FutDraftGame supabase={supabase} userId={user.id} username={username} />;
}
