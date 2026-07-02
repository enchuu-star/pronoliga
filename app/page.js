"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// ⚙️ PARTIDOS — orden cronológico real, local y visitante correctos
// ============================================================
const ALL_MATCHES = [
  // ── JORNADA 1 ──
  { id: "wc26_g001", grp: "A", home: "México",          away: "Sudáfrica",        competition: "Grupo A · Mundial 2026", match_date: "2026-06-11", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g002", grp: "A", home: "Corea del Sur",   away: "Rep. Checa",       competition: "Grupo A · Mundial 2026", match_date: "2026-06-12", match_time: "04:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g003", grp: "B", home: "Canadá",          away: "Bosnia y Herz.",   competition: "Grupo B · Mundial 2026", match_date: "2026-06-12", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g004", grp: "D", home: "Estados Unidos",  away: "Paraguay",         competition: "Grupo D · Mundial 2026", match_date: "2026-06-13", match_time: "03:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g005", grp: "B", home: "Qatar",           away: "Suiza",            competition: "Grupo B · Mundial 2026", match_date: "2026-06-13", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g006", grp: "C", home: "Brasil",          away: "Marruecos",        competition: "Grupo C · Mundial 2026", match_date: "2026-06-14", match_time: "00:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g007", grp: "C", home: "Haití",           away: "Escocia",          competition: "Grupo C · Mundial 2026", match_date: "2026-06-14", match_time: "03:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g008", grp: "D", home: "Australia",       away: "Turquía",          competition: "Grupo D · Mundial 2026", match_date: "2026-06-14", match_time: "06:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g009", grp: "E", home: "Alemania",        away: "Curazao",          competition: "Grupo E · Mundial 2026", match_date: "2026-06-14", match_time: "19:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g010", grp: "F", home: "Países Bajos",    away: "Japón",            competition: "Grupo F · Mundial 2026", match_date: "2026-06-14", match_time: "22:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g011", grp: "E", home: "Costa de Marfil", away: "Ecuador",          competition: "Grupo E · Mundial 2026", match_date: "2026-06-15", match_time: "01:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g012", grp: "F", home: "Suecia",          away: "Túnez",            competition: "Grupo F · Mundial 2026", match_date: "2026-06-15", match_time: "04:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g013", grp: "H", home: "España",          away: "Cabo Verde",       competition: "Grupo H · Mundial 2026", match_date: "2026-06-15", match_time: "18:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g014", grp: "G", home: "Bélgica",         away: "Egipto",           competition: "Grupo G · Mundial 2026", match_date: "2026-06-15", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g015", grp: "H", home: "Arabia Saudí",    away: "Uruguay",          competition: "Grupo H · Mundial 2026", match_date: "2026-06-16", match_time: "00:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g016", grp: "G", home: "Irán",            away: "Nueva Zelanda",    competition: "Grupo G · Mundial 2026", match_date: "2026-06-16", match_time: "03:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g017", grp: "I", home: "Francia",         away: "Senegal",          competition: "Grupo I · Mundial 2026", match_date: "2026-06-16", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g018", grp: "I", home: "Iraq",            away: "Noruega",          competition: "Grupo I · Mundial 2026", match_date: "2026-06-17", match_time: "00:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g019", grp: "J", home: "Argentina",       away: "Argelia",          competition: "Grupo J · Mundial 2026", match_date: "2026-06-17", match_time: "03:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g020", grp: "J", home: "Austria",         away: "Jordania",         competition: "Grupo J · Mundial 2026", match_date: "2026-06-17", match_time: "06:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g021", grp: "K", home: "Portugal",        away: "RD Congo",         competition: "Grupo K · Mundial 2026", match_date: "2026-06-17", match_time: "19:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g022", grp: "L", home: "Inglaterra",      away: "Croacia",          competition: "Grupo L · Mundial 2026", match_date: "2026-06-17", match_time: "22:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g023", grp: "L", home: "Ghana",           away: "Panamá",           competition: "Grupo L · Mundial 2026", match_date: "2026-06-18", match_time: "01:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g024", grp: "K", home: "Uzbekistán",      away: "Colombia",         competition: "Grupo K · Mundial 2026", match_date: "2026-06-18", match_time: "04:00", status: "open", result_home: null, result_away: null },

  // ── JORNADA 2 ──
  { id: "wc26_g025", grp: "A", home: "Rep. Checa",      away: "Sudáfrica",        competition: "Grupo A · Mundial 2026", match_date: "2026-06-18", match_time: "18:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g026", grp: "B", home: "Suiza",           away: "Bosnia y Herz.",   competition: "Grupo B · Mundial 2026", match_date: "2026-06-18", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g027", grp: "B", home: "Canadá",          away: "Qatar",            competition: "Grupo B · Mundial 2026", match_date: "2026-06-19", match_time: "00:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g028", grp: "A", home: "México",          away: "Corea del Sur",    competition: "Grupo A · Mundial 2026", match_date: "2026-06-19", match_time: "03:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g029", grp: "D", home: "Estados Unidos",  away: "Australia",        competition: "Grupo D · Mundial 2026", match_date: "2026-06-19", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g030", grp: "C", home: "Escocia",         away: "Marruecos",        competition: "Grupo C · Mundial 2026", match_date: "2026-06-20", match_time: "00:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g031", grp: "C", home: "Brasil",          away: "Haití",            competition: "Grupo C · Mundial 2026", match_date: "2026-06-20", match_time: "02:30", status: "open", result_home: null, result_away: null },
  { id: "wc26_g032", grp: "D", home: "Turquía",         away: "Paraguay",         competition: "Grupo D · Mundial 2026", match_date: "2026-06-20", match_time: "05:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g033", grp: "F", home: "Países Bajos",    away: "Suecia",           competition: "Grupo F · Mundial 2026", match_date: "2026-06-20", match_time: "19:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g034", grp: "E", home: "Alemania",        away: "Costa de Marfil",  competition: "Grupo E · Mundial 2026", match_date: "2026-06-20", match_time: "22:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g035", grp: "E", home: "Ecuador",         away: "Curazao",          competition: "Grupo E · Mundial 2026", match_date: "2026-06-21", match_time: "02:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g036", grp: "F", home: "Túnez",           away: "Japón",            competition: "Grupo F · Mundial 2026", match_date: "2026-06-21", match_time: "06:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g037", grp: "H", home: "España",          away: "Arabia Saudí",     competition: "Grupo H · Mundial 2026", match_date: "2026-06-21", match_time: "18:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g038", grp: "G", home: "Bélgica",         away: "Irán",             competition: "Grupo G · Mundial 2026", match_date: "2026-06-21", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g039", grp: "H", home: "Uruguay",         away: "Cabo Verde",       competition: "Grupo H · Mundial 2026", match_date: "2026-06-22", match_time: "00:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g040", grp: "G", home: "Nueva Zelanda",   away: "Egipto",           competition: "Grupo G · Mundial 2026", match_date: "2026-06-22", match_time: "03:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g041", grp: "J", home: "Argentina",       away: "Austria",          competition: "Grupo J · Mundial 2026", match_date: "2026-06-22", match_time: "19:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g042", grp: "I", home: "Francia",         away: "Iraq",          competition: "Grupo I · Mundial 2026", match_date: "2026-06-22", match_time: "23:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g043", grp: "I", home: "Noruega",         away: "Senegal",          competition: "Grupo I · Mundial 2026", match_date: "2026-06-23", match_time: "02:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g044", grp: "J", home: "Jordania",        away: "Argelia",          competition: "Grupo J · Mundial 2026", match_date: "2026-06-23", match_time: "05:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g045", grp: "K", home: "Portugal",        away: "Uzbekistán",       competition: "Grupo K · Mundial 2026", match_date: "2026-06-23", match_time: "19:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g046", grp: "L", home: "Inglaterra",      away: "Ghana",            competition: "Grupo L · Mundial 2026", match_date: "2026-06-23", match_time: "22:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g047", grp: "L", home: "Panamá",          away: "Croacia",          competition: "Grupo L · Mundial 2026", match_date: "2026-06-24", match_time: "01:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g048", grp: "K", home: "Colombia",        away: "RD Congo",         competition: "Grupo K · Mundial 2026", match_date: "2026-06-24", match_time: "04:00", status: "open", result_home: null, result_away: null },

  // ── JORNADA 3 ──
  { id: "wc26_g049", grp: "B", home: "Bosnia y Herz.",  away: "Qatar",            competition: "Grupo B · Mundial 2026", match_date: "2026-06-24", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g050", grp: "B", home: "Suiza",           away: "Canadá",           competition: "Grupo B · Mundial 2026", match_date: "2026-06-24", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g051", grp: "C", home: "Marruecos",       away: "Haití",            competition: "Grupo C · Mundial 2026", match_date: "2026-06-25", match_time: "00:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g052", grp: "C", home: "Escocia",         away: "Brasil",           competition: "Grupo C · Mundial 2026", match_date: "2026-06-25", match_time: "00:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g053", grp: "A", home: "Rep. Checa",      away: "México",           competition: "Grupo A · Mundial 2026", match_date: "2026-06-25", match_time: "03:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g054", grp: "A", home: "Sudáfrica",       away: "Corea del Sur",    competition: "Grupo A · Mundial 2026", match_date: "2026-06-25", match_time: "03:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g055", grp: "E", home: "Curazao",         away: "Costa de Marfil",  competition: "Grupo E · Mundial 2026", match_date: "2026-06-25", match_time: "22:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g056", grp: "E", home: "Ecuador",         away: "Alemania",         competition: "Grupo E · Mundial 2026", match_date: "2026-06-25", match_time: "22:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g057", grp: "F", home: "Japón",           away: "Suecia",           competition: "Grupo F · Mundial 2026", match_date: "2026-06-26", match_time: "01:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g058", grp: "F", home: "Túnez",           away: "Países Bajos",     competition: "Grupo F · Mundial 2026", match_date: "2026-06-26", match_time: "01:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g059", grp: "D", home: "Paraguay",        away: "Australia",        competition: "Grupo D · Mundial 2026", match_date: "2026-06-26", match_time: "04:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g060", grp: "D", home: "Turquía",         away: "Estados Unidos",   competition: "Grupo D · Mundial 2026", match_date: "2026-06-26", match_time: "04:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g061", grp: "I", home: "Noruega",         away: "Francia",          competition: "Grupo I · Mundial 2026", match_date: "2026-06-26", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g062", grp: "I", home: "Senegal",         away: "Iraq",             competition: "Grupo I · Mundial 2026", match_date: "2026-06-26", match_time: "21:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g063", grp: "H", home: "Cabo Verde",      away: "Arabia Saudí",     competition: "Grupo H · Mundial 2026", match_date: "2026-06-27", match_time: "02:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g064", grp: "H", home: "Uruguay",         away: "España",           competition: "Grupo H · Mundial 2026", match_date: "2026-06-27", match_time: "02:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g065", grp: "G", home: "Egipto",          away: "Irán",             competition: "Grupo G · Mundial 2026", match_date: "2026-06-27", match_time: "05:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g066", grp: "G", home: "Nueva Zelanda",   away: "Bélgica",          competition: "Grupo G · Mundial 2026", match_date: "2026-06-27", match_time: "05:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g067", grp: "L", home: "Croacia",         away: "Ghana",            competition: "Grupo L · Mundial 2026", match_date: "2026-06-27", match_time: "23:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g068", grp: "L", home: "Panamá",          away: "Inglaterra",       competition: "Grupo L · Mundial 2026", match_date: "2026-06-27", match_time: "23:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g069", grp: "K", home: "Colombia",    away: "Portugal",  competition: "Grupo K · Mundial 2026", match_date: "2026-06-28", match_time: "01:30", status: "open", result_home: null, result_away: null },
  { id: "wc26_g070", grp: "K", home: "RD Congo",    away: "Uzbekistán", competition: "Grupo K · Mundial 2026", match_date: "2026-06-28", match_time: "01:30", status: "open", result_home: null, result_away: null },
  { id: "wc26_g071", grp: "J", home: "Argelia",     away: "Austria",   competition: "Grupo J · Mundial 2026", match_date: "2026-06-28", match_time: "04:00", status: "open", result_home: null, result_away: null },
  { id: "wc26_g072", grp: "J", home: "Jordania",        away: "Argentina",        competition: "Grupo J · Mundial 2026", match_date: "2026-06-28", match_time: "04:00", status: "open", result_home: null, result_away: null },
];
// ============================================================
// ⚙️ GRUPOS — datos oficiales tras playoffs marzo 2026
// ============================================================
const GROUPS = {
  A: [{ name: "México", flag: "🇲🇽" }, { name: "Sudáfrica", flag: "🇿🇦" }, { name: "Corea del Sur", flag: "🇰🇷" }, { name: "Rep. Checa", flag: "🇨🇿" }],
  B: [{ name: "Canadá", flag: "🇨🇦" }, { name: "Bosnia y Herz.", flag: "🇧🇦" }, { name: "Suiza", flag: "🇨🇭" }, { name: "Qatar", flag: "🇶🇦" }],
  C: [{ name: "Brasil", flag: "🇧🇷" }, { name: "Marruecos", flag: "🇲🇦" }, { name: "Escocia", flag: "🇬🇧" }, { name: "Haití", flag: "🇭🇹" }],
  D: [{ name: "Estados Unidos", flag: "🇺🇸" }, { name: "Paraguay", flag: "🇵🇾" }, { name: "Australia", flag: "🇦🇺" }, { name: "Turquía", flag: "🇹🇷" }],
  E: [{ name: "Alemania", flag: "🇩🇪" }, { name: "Curazao", flag: "🇨🇼" }, { name: "Costa de Marfil", flag: "🇨🇮" }, { name: "Ecuador", flag: "🇪🇨" }],
  F: [{ name: "Países Bajos", flag: "🇳🇱" }, { name: "Japón", flag: "🇯🇵" }, { name: "Túnez", flag: "🇹🇳" }, { name: "Suecia", flag: "🇸🇪" }],
  G: [{ name: "Bélgica", flag: "🇧🇪" }, { name: "Egipto", flag: "🇪🇬" }, { name: "Irán", flag: "🇮🇷" }, { name: "Nueva Zelanda", flag: "🇳🇿" }],
  H: [{ name: "España", flag: "🇪🇸" }, { name: "Cabo Verde", flag: "🇨🇻" }, { name: "Arabia Saudí", flag: "🇸🇦" }, { name: "Uruguay", flag: "🇺🇾" }],
  I: [{ name: "Francia", flag: "🇫🇷" }, { name: "Senegal", flag: "🇸🇳" }, { name: "Noruega", flag: "🇳🇴" }, { name: "Iraq", flag: "🇮🇶" }],
  J: [{ name: "Argentina", flag: "🇦🇷" }, { name: "Argelia", flag: "🇩🇿" }, { name: "Austria", flag: "🇦🇹" }, { name: "Jordania", flag: "🇯🇴" }],
  K: [{ name: "Portugal", flag: "🇵🇹" }, { name: "Colombia", flag: "🇨🇴" }, { name: "Uzbekistán", flag: "🇺🇿" }, { name: "RD Congo", flag: "🇨🇩" }],
  L: [{ name: "Inglaterra", flag: "🇬🇧" }, { name: "Croacia", flag: "🇭🇷" }, { name: "Panamá", flag: "🇵🇦" }, { name: "Ghana", flag: "🇬🇭" }],
};

const TOTAL_MATCHES = 72;
const CUOTA = 20; // euros por participante

function getTeam(name) {
  return Object.values(GROUPS).flat().find(t => t.name === name) || { name, flag: "🏳️" };
}

// ============================================================
// CANALES DE TV (España). DAZN emite todos los partidos; La 1 algunos.
// Pega este bloque junto a tus helpers (p. ej. justo debajo de getTeam).
// ============================================================
const TV_BY_MATCH = {
  "Alemania|Costa de Marfil": "DAZN",
  "Alemania|Curazao": "La 1 + DAZN",
  "Alemania|Ecuador": "La 1 + DAZN",
  "Arabia Saudí|Cabo Verde": "DAZN",
  "Arabia Saudí|España": "La 1 + DAZN",
  "Arabia Saudí|Uruguay": "DAZN",
  "Argelia|Argentina": "DAZN",
  "Argelia|Austria": "DAZN",
  "Argelia|Jordania": "DAZN",
  "Argentina|Austria": "La 1 + DAZN",
  "Argentina|Jordania": "DAZN",
  "Australia|Estados Unidos": "La 1 + DAZN",
  "Australia|Paraguay": "DAZN",
  "Australia|Turquía": "DAZN",
  "Austria|Jordania": "DAZN",
  "Bosnia y Herz.|Canadá": "La 1 + DAZN",
  "Bosnia y Herz.|Qatar": "DAZN",
  "Bosnia y Herz.|Suiza": "La 1 + DAZN",
  "Brasil|Escocia": "La 1 + DAZN",
  "Brasil|Haití": "DAZN",
  "Brasil|Marruecos": "La 1 + DAZN",
  "Bélgica|Egipto": "DAZN",
  "Bélgica|Irán": "DAZN",
  "Bélgica|Nueva Zelanda": "DAZN",
  "Cabo Verde|España": "La 1 + DAZN",
  "Cabo Verde|Uruguay": "DAZN",
  "Canadá|Qatar": "DAZN",
  "Canadá|Suiza": "DAZN",
  "Colombia|Portugal": "DAZN",
  "Colombia|RD Congo": "DAZN",
  "Corea del Sur|México": "DAZN",
  "Corea del Sur|Rep. Checa": "DAZN",
  "Corea del Sur|Sudáfrica": "DAZN",
  "Costa de Marfil|Curazao": "DAZN",
  "Costa de Marfil|Ecuador": "DAZN",
  "Croacia|Ghana": "DAZN",
  "Croacia|Inglaterra": "La 1 + DAZN",
  "Croacia|Panamá": "DAZN",
  "Curazao|Ecuador": "DAZN",
  "Egipto|Irán": "DAZN",
  "Egipto|Nueva Zelanda": "DAZN",
  "Escocia|Haití": "DAZN",
  "Escocia|Marruecos": "DAZN",
  "España|Uruguay": "La 1 + DAZN",
  "Estados Unidos|Paraguay": "DAZN",
  "Estados Unidos|Turquía": "DAZN",
  "Francia|Iraq": "DAZN",
  "Francia|Noruega": "DAZN",
  "Francia|Senegal": "La 1 + DAZN",
  "Ghana|Inglaterra": "La 1 + DAZN",
  "Haití|Marruecos": "DAZN",
  "Inglaterra|Panamá": "DAZN",
  "Iraq|Noruega": "DAZN",
  "Iraq|Senegal": "DAZN",
  "Irán|Nueva Zelanda": "DAZN",
  "Japón|Países Bajos": "DAZN",
  "Japón|Suecia": "DAZN",
  "Japón|Túnez": "DAZN",
  "México|Rep. Checa": "DAZN",
  "México|Sudáfrica": "La 1 + DAZN",
  "Noruega|Senegal": "DAZN",
  "Paraguay|Turquía": "DAZN",
  "Países Bajos|Suecia": "La 1 + DAZN",
  "Países Bajos|Túnez": "DAZN",
  "Portugal|RD Congo": "DAZN",
  "Portugal|Uzbekistán": "DAZN",
  "Qatar|Suiza": "DAZN",
  "RD Congo|Uzbekistán": "DAZN",
  "Rep. Checa|Sudáfrica": "DAZN",
  "Suecia|Túnez": "DAZN",
  // ── Eliminatoria · dieciseisavos en La 1 ──
  "Canadá|Sudáfrica": "La 1 + DAZN",        // M73
  "Brasil|Japón": "La 1 + DAZN",            // M76
  "Francia|Suecia": "La 1 + DAZN",          // M77
  "Austria|España": "La 1 + DAZN",          // M84
};
// Devuelve el canal de un partido. Por defecto DAZN (emite todos).
function tvFor(match) {
  const key = [match.home, match.away].sort().join("|");
  return TV_BY_MATCH[key] || "DAZN";
}

function calcPoints(pred, rh, ra) {
  // 5 puntos → marcador exacto
  if (pred.predicted_home === rh && pred.predicted_away === ra) return 5;

  const ps = pred.predicted_home > pred.predicted_away ? "H" : pred.predicted_home < pred.predicted_away ? "A" : "D";
  const rs = rh > ra ? "H" : rh < ra ? "A" : "D";

  // Si falla el signo (1X2) → 0 puntos
  if (ps !== rs) return 0;

  // 3 puntos → acierta ganador + diferencia de goles
  const predDiff = pred.predicted_home - pred.predicted_away;
  const realDiff = rh - ra;
  if (predDiff === realDiff) return 3;

  // 1 punto → solo acierta el resultado (1X2)
  return 1;
}

function randomScore(winner) {
  // winner: "H" (local), "A" (visitante), "D" (empate)
  const r = (max) => Math.floor(Math.random() * (max + 1)); // 0..max

  if (winner === "D") {
    const g = r(3); // 0..3 iguales
    return { home: g, away: g };
  }

  // Para victoria: el ganador mete entre 1 y 3, el perdedor entre 0 y (ganador-1)
  const win = 1 + r(2);        // 1..3
  const lose = Math.floor(Math.random() * win); // 0..win-1

  return winner === "H"
    ? { home: win, away: lose }
    : { home: lose, away: win };
}

function calcPersonalStandings(group, matches, predMap) {
  const teams = GROUPS[group].map(t => ({ ...t, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 }));
  const map = {};
  teams.forEach(t => { map[t.name] = t; });
  matches.filter(m => m.grp === group).forEach(m => {
    const pred = predMap[m.id];
    if (!pred || pred.predicted_home === null || pred.predicted_away === null) return;
    const ph = pred.predicted_home, pa = pred.predicted_away;
    const h = map[m.home], a = map[m.away];
    if (!h || !a) return;
    h.pj++; a.pj++;
    h.gf += ph; h.gc += pa; a.gf += pa; a.gc += ph;
    h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
    if (ph > pa) { h.pg++; h.pts += 3; a.pp++; }
    else if (ph < pa) { a.pg++; a.pts += 3; h.pp++; }
    else { h.pe++; h.pts++; a.pe++; a.pts++; }
  });
  return teams.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

function calcRealStandings(group, matches) {
  const teams = GROUPS[group].map(t => ({ ...t, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 }));
  const map = {};
  teams.forEach(t => { map[t.name] = t; });
  matches.filter(m => m.grp === group && m.result_home !== null).forEach(m => {
    const h = map[m.home], a = map[m.away];
    if (!h || !a) return;
    h.pj++; a.pj++;
    h.gf += m.result_home; h.gc += m.result_away;
    a.gf += m.result_away; a.gc += m.result_home;
    h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
    if (m.result_home > m.result_away) { h.pg++; h.pts += 3; a.pp++; }
    else if (m.result_home < m.result_away) { a.pg++; a.pts += 3; h.pp++; }
    else { h.pe++; h.pts++; a.pe++; a.pts++; }
  });
  return teams.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

// ============================================================
// CLASIFICADOS — 1º, 2º de cada grupo + 8 mejores terceros
// ============================================================
function calcThirdPlaceTable(standingsByGroup) {
  // standingsByGroup: { A: [...ordenado], B: [...], ... }
  const thirds = Object.entries(standingsByGroup)
    .map(([grp, st]) => {
      const t = st[2];
      if (!t) return null;
      return { ...t, grp };
    })
    .filter(Boolean)
    .filter(t => t.pj > 0); // solo grupos con partidos jugados/pronosticados

  thirds.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
  return thirds.map((t, i) => ({ ...t, qualifies: i < 8, rank: i + 1 }));
}

// Devuelve la lista completa de clasificados de un conjunto de standings:
// { firsts: [...], seconds: [...], thirds: [...12 con qualifies] }
function calcAllQualifiers(standingsByGroup) {
  const firsts = [], seconds = [];
  Object.entries(standingsByGroup).forEach(([grp, st]) => {
    if (st[0] && st[0].pj > 0) firsts.push({ ...st[0], grp });
    if (st[1] && st[1].pj > 0) seconds.push({ ...st[1], grp });
  });
  const thirds = calcThirdPlaceTable(standingsByGroup);
  return { firsts, seconds, thirds };
}

// ============================================================
// CUADRO DE DIECISEISAVOS (Round of 32) — Mundial 2026
// ============================================================
// Los 8 partidos que reciben un tercero, con los grupos elegibles
// para esa casilla (combinaciones oficiales FIFA).
const R32_THIRD_SLOTS = [
  { match: "M74", winner: "E", eligible: ["A", "B", "C", "D", "F"] },
  { match: "M79", winner: "A", eligible: ["C", "E", "F", "H", "I"] },
  { match: "M77", winner: "I", eligible: ["C", "D", "F", "G", "H"] },
  { match: "M80", winner: "L", eligible: ["E", "H", "I", "J", "K"] },
  { match: "M81", winner: "D", eligible: ["B", "E", "F", "I", "J"] },
  { match: "M82", winner: "G", eligible: ["A", "E", "H", "I", "J"] },
  { match: "M85", winner: "B", eligible: ["E", "F", "G", "I", "J"] },
  { match: "M87", winner: "K", eligible: ["D", "E", "I", "J", "L"] },
];

// Los 8 partidos restantes: emparejamientos fijos por posición de grupo.
// (g = ganador / r = segundo)
const R32_FIXED = [
  { match: "M73", home: ["g", "C"], away: null }, // se rellena abajo: 1C? No.
];

// Definición completa de los 16 partidos del R32 según FIFA:
//   1X = ganador grupo X · 2X = segundo grupo X · 3X = tercero asignado
const R32_LAYOUT = [
  { match: "M73", home: "2A", away: "2B" },
  { match: "M74", home: "1E", away: "3?" }, // tercero
  { match: "M75", home: "1F", away: "2C" },
  { match: "M76", home: "1C", away: "2F" },
  { match: "M77", home: "1I", away: "3?" }, // tercero
  { match: "M78", home: "2E", away: "2I" },
  { match: "M79", home: "1A", away: "3?" }, // tercero
  { match: "M80", home: "1L", away: "3?" }, // tercero
  { match: "M81", home: "1D", away: "3?" }, // tercero
  { match: "M82", home: "1G", away: "3?" }, // tercero
  { match: "M83", home: "2K", away: "2L" },
  { match: "M84", home: "1H", away: "2J" },
  { match: "M85", home: "1B", away: "3?" }, // tercero
  { match: "M86", home: "1J", away: "2H" },
  { match: "M87", home: "1K", away: "3?" }, // tercero
  { match: "M88", home: "2D", away: "2G" },
];

// Asigna los 8 mejores terceros a las 8 casillas, respetando que
// ningún tercero juegue contra el ganador de su propio grupo.
// Algoritmo greedy determinista (reproduce la tabla FIFA): se procesan
// las casillas en orden y se asigna el tercero elegible disponible
// cuyo grupo tenga MENOS casillas alternativas (más restringido primero).
function assignThirds(qualifiedThirdGroups) {
  // qualifiedThirdGroups: array de letras de grupo de los 8 terceros (ordenado)
  const slots = R32_THIRD_SLOTS.map(s => ({ ...s }));
  const available = [...qualifiedThirdGroups];
  const assignment = {}; // match -> grupo

  // Para cada grupo disponible, contar en cuántos slots es elegible
  const slotsLeft = () => slots.filter(s => !assignment[s.match]);

  while (slotsLeft().length > 0) {
    const open = slotsLeft();
    // Elegir el SLOT con menos candidatos disponibles (más restringido)
    open.forEach(s => {
      s._cands = available.filter(g => s.eligible.includes(g) && g !== s.winner);
    });
    open.sort((a, b) => a._cands.length - b._cands.length);
    const slot = open[0];
    if (!slot._cands || slot._cands.length === 0) {
      // Sin candidato válido: dejar vacío (caso degenerado)
      assignment[slot.match] = null;
      continue;
    }
    // De los candidatos, elegir el grupo que aparezca en menos slots restantes
    const candFreq = slot._cands.map(g => ({
      g,
      freq: open.filter(s2 => s2 !== slot && s2._cands?.includes(g)).length,
    }));
    candFreq.sort((a, b) => a.freq - b.freq || a.g.localeCompare(b.g));
    const chosen = candFreq[0].g;
    assignment[slot.match] = chosen;
    available.splice(available.indexOf(chosen), 1);
  }
  return assignment; // { M74: "A", M79: "C", ... }
}

// ============================================================
// DIECISEISAVOS CONFIRMADOS — emparejamientos reales tras la fase de grupos.
// Ya no se calculan: están fijados a mano.
// ============================================================
const R32_CONFIRMED = [
  { match: "M73", home: "Sudáfrica",       hl: "2A", away: "Canadá",         al: "2B" },
  { match: "M74", home: "Alemania",        hl: "1E", away: "Paraguay",       al: "3D" },
  { match: "M75", home: "Países Bajos",    hl: "1F", away: "Marruecos",      al: "2C" },
  { match: "M76", home: "Brasil",          hl: "1C", away: "Japón",          al: "2F" },
  { match: "M77", home: "Francia",         hl: "1I", away: "Suecia",         al: "3F" },
  { match: "M78", home: "Costa de Marfil", hl: "2E", away: "Noruega",        al: "2I" },
  { match: "M79", home: "México",          hl: "1A", away: "Ecuador",        al: "3E" },
  { match: "M80", home: "Inglaterra",      hl: "1L", away: "RD Congo",       al: "3K" },
  { match: "M81", home: "Estados Unidos",  hl: "1D", away: "Bosnia y Herz.", al: "3B" },
  { match: "M82", home: "Bélgica",         hl: "1G", away: "Senegal",        al: "3I" },
  { match: "M83", home: "Portugal",        hl: "2K", away: "Croacia",        al: "2L" },
  { match: "M84", home: "España",          hl: "1H", away: "Austria",        al: "2J" },
  { match: "M85", home: "Suiza",           hl: "1B", away: "Argelia",        al: "3J" },
  { match: "M86", home: "Argentina",       hl: "1J", away: "Cabo Verde",     al: "2H" },
  { match: "M87", home: "Colombia",        hl: "1K", away: "Ghana",          al: "3L" },
  { match: "M88", home: "Australia",       hl: "2D", away: "Egipto",         al: "2G" },
];

// Devuelve los 16 dieciseisavos ya fijados con equipos reales.
// Ignora los standings: los cruces están confirmados.
function buildRoundOf32() {
  return R32_CONFIRMED.map(m => {
    const h = getTeam(m.home), a = getTeam(m.away);
    return {
      match: m.match,
      home: { name: m.home, flag: h.flag, label: m.hl },
      away: { name: m.away, flag: a.flag, label: m.al },
    };
  });
}

// ============================================================
// CUADRO COMPLETO DE ELIMINATORIAS (R32 → Final) — Mundial 2026
// Parejas oficiales FIFA confirmadas.
// ============================================================
const KO_TREE = {
  // Octavos: cada uno toma el ganador de dos partidos de R32
  R16: [
    { match: "M89", from: ["M74", "M77"] },
    { match: "M90", from: ["M73", "M75"] },
    { match: "M91", from: ["M76", "M78"] },
    { match: "M92", from: ["M79", "M80"] },
    { match: "M93", from: ["M83", "M84"] },
    { match: "M94", from: ["M81", "M82"] },
    { match: "M95", from: ["M86", "M88"] },
    { match: "M96", from: ["M85", "M87"] },
  ],
  QF: [
    { match: "M97",  from: ["M89", "M90"] },
    { match: "M98",  from: ["M93", "M94"] },
    { match: "M99",  from: ["M91", "M92"] },
    { match: "M100", from: ["M95", "M96"] },
  ],
  SF: [
    { match: "M101", from: ["M97", "M98"] },
    { match: "M102", from: ["M99", "M100"] },
  ],
  FINAL: [
    { match: "M104", from: ["M101", "M102"] },
  ],
  THIRD: [
    { match: "M103", from: ["M101", "M102"] }, // perdedores de las semis
  ],
};

const KO_ROUND_LABELS = {
  R32: "Dieciseisavos", R16: "Octavos", QF: "Cuartos", SF: "Semifinales", FINAL: "Final",
};

// Reparto izquierda/derecha del cuadro (orden vertical real para que alineen)
const KO_SIDES = {
  left:  { R32: ["M74","M77","M73","M75","M83","M84","M81","M82"],
           R16: ["M89","M90","M93","M94"], QF: ["M97","M98"], SF: ["M101"] },
  right: { R32: ["M76","M78","M79","M80","M86","M88","M85","M87"],
           R16: ["M91","M92","M95","M96"], QF: ["M99","M100"], SF: ["M102"] },
};

// Abreviaturas de 3 letras para las tarjetas
const KO_ABBR = {
  "México":"MEX","Sudáfrica":"RSA","Corea del Sur":"KOR","Rep. Checa":"CZE",
  "Canadá":"CAN","Bosnia y Herz.":"BIH","Suiza":"SUI","Qatar":"QAT",
  "Brasil":"BRA","Marruecos":"MAR","Escocia":"SCO","Haití":"HAI",
  "Estados Unidos":"USA","Paraguay":"PAR","Australia":"AUS","Turquía":"TUR",
  "Alemania":"GER","Curazao":"CUW","Costa de Marfil":"CIV","Ecuador":"ECU",
  "Países Bajos":"NED","Japón":"JPN","Túnez":"TUN","Suecia":"SWE",
  "Bélgica":"BEL","Egipto":"EGY","Irán":"IRN","Nueva Zelanda":"NZL",
  "España":"ESP","Cabo Verde":"CPV","Arabia Saudí":"KSA","Uruguay":"URU",
  "Francia":"FRA","Senegal":"SEN","Noruega":"NOR","Iraq":"IRQ",
  "Argentina":"ARG","Argelia":"ALG","Austria":"AUT","Jordania":"JOR",
  "Portugal":"POR","Colombia":"COL","Uzbekistán":"UZB","RD Congo":"COD",
  "Inglaterra":"ENG","Croacia":"CRO","Panamá":"PAN","Ghana":"GHA",
};
const koAbbr = (n) => KO_ABBR[n] || (n ? n.slice(0, 3).toUpperCase() : "—");

// Resuelve un partido: con marcador decide ganador/perdedor; si hay empate,
// usa el avance elegido (pick.adv). Devuelve también los goles introducidos.
function koResolve(m, pick) {
  const h = pick?.h ?? null, a = pick?.a ?? null;
  const known = m.home && m.away && !m.home.placeholder && !m.away.placeholder;
  if (!known || h == null || a == null) return { winner: null, loser: null, h, a, adv: pick?.adv ?? null };
  if (h > a) return { winner: m.home, loser: m.away, h, a, adv: null };
  if (a > h) return { winner: m.away, loser: m.home, h, a, adv: null };
  // empate -> decide el avance seleccionado
  const adv = pick?.adv;
  if (adv === m.home.name) return { winner: m.home, loser: m.away, h, a, adv };
  if (adv === m.away.name) return { winner: m.away, loser: m.home, h, a, adv };
  return { winner: null, loser: null, h, a, adv: null }; // empate sin elegir aún
}

function buildKnockoutBracket(standingsByGroup, picks) {
  const r32 = buildRoundOf32(standingsByGroup);
  const byId = {};
  const blank = (label) => ({ name: label, flag: "❔", placeholder: true });

  // R32 (de los clasificados reales)
  r32.forEach(m => { byId[m.match] = { ...m, ...koResolve(m, picks[m.match]) }; });

  const winnerTeam = (code) => byId[code]?.winner || blank("Gan. " + code);
  const loserTeam  = (code) => byId[code]?.loser  || blank("Per. " + code);

  const buildRound = (defs, kind = "winners") => defs.map(d => {
    const home = kind === "losers" ? loserTeam(d.from[0]) : winnerTeam(d.from[0]);
    const away = kind === "losers" ? loserTeam(d.from[1]) : winnerTeam(d.from[1]);
    const base = { match: d.match, home, away, from: d.from };
    const m = { ...base, ...koResolve(base, picks[d.match]) };
    byId[d.match] = m;
    return m;
  });

  const R16   = buildRound(KO_TREE.R16);
  const QF    = buildRound(KO_TREE.QF);
  const SF    = buildRound(KO_TREE.SF);          // antes que FINAL/THIRD
  const FINAL = buildRound(KO_TREE.FINAL);
  const THIRD = buildRound(KO_TREE.THIRD, "losers");

  return {
    byId,
    R32: r32.map(m => byId[m.match]),
    R16, QF, SF, FINAL, THIRD,
    champion: byId["M104"]?.winner?.name || null,
  };
}

// Todos los cruces del cuadro
const KO_ALL_MATCHES = [
  ...KO_SIDES.left.R32, ...KO_SIDES.right.R32,
  "M89","M90","M91","M92","M93","M94","M95","M96",
  "M97","M98","M99","M100","M101","M102","M104","M103",
];

// Convierte filas (knockout_picks o knockout_results) a { M73:{h,a,adv}, ... }
function koPicksMap(rows) {
  const m = {};
  (rows || []).forEach(r => {
    m[r.match_id] = { h: r.home_goals ?? null, a: r.away_goals ?? null, adv: r.winner ?? null };
  });
  return m;
}

// 1/3/5 igual que en grupos
function koScore(uh, ua, rh, ra) {
  if (uh === rh && ua === ra) return 5;
  const us = uh > ua ? "H" : uh < ua ? "A" : "D";
  const rs = rh > ra ? "H" : rh < ra ? "A" : "D";
  if (us !== rs) return 0;
  if (uh - ua === rh - ra) return 3;
  return 1;
}

// Puntos de eliminatoria de un usuario:
//   +5 por acertar quién pasa en cada cruce (·+10 en la final = campeón)
//   +1/+3/+5 por el marcador (solo si los dos equipos coinciden con la realidad)
function calcKnockoutPoints(userPicks, realPicks, standingsByGroup) {
  if (!realPicks || Object.keys(realPicks).length === 0) return 0;
  const userB = buildKnockoutBracket(standingsByGroup, userPicks);
  const realB = buildKnockoutBracket(standingsByGroup, realPicks);
  let pts = 0;
  KO_ALL_MATCHES.forEach(id => {
    const rm = realB.byId[id], um = userB.byId[id];
    if (!rm || !um) return;
    const realW = rm.winner?.name || null;
    if (!realW) return; // cruce real aún sin definir
    const userW = um.winner?.name || null;

    // Acertar quién pasa (la final da +10: campeón)
    if (userW && userW === realW) pts += (id === "M104") ? 10 : 5;

    // Marcador exacto: solo si coinciden los dos equipos del cruce
    const sameTeams = !um.home.placeholder && !um.away.placeholder &&
      um.home.name === rm.home.name && um.away.name === rm.away.name;
    if (sameTeams && um.h != null && um.a != null && rm.h != null && rm.a != null) {
      pts += koScore(um.h, um.a, rm.h, rm.a);
    }
  });
  return pts;
}

// Igual que calcKnockoutPoints pero devuelve el desglose por partido:
// { M73: { adv, marker, total, advanced }, ... }  (solo cruces con ganador real)
function calcKnockoutBreakdownByMatch(userPicks, realPicks, standingsByGroup) {
  const out = {};
  if (!realPicks || Object.keys(realPicks).length === 0) return out;
  const userB = buildKnockoutBracket(standingsByGroup, userPicks);
  const realB = buildKnockoutBracket(standingsByGroup, realPicks);
  KO_ALL_MATCHES.forEach(id => {
    const rm = realB.byId[id], um = userB.byId[id];
    if (!rm || !um) return;
    const realW = rm.winner?.name || null;
    if (!realW) return; // cruce real aún sin definir → todavía sin puntos
    const userW = um.winner?.name || null;
    const advanced = !!(userW && userW === realW);
    let adv = 0, marker = 0;
    if (advanced) adv = (id === "M104") ? 10 : 5;
    const sameTeams = !um.home.placeholder && !um.away.placeholder &&
      um.home.name === rm.home.name && um.away.name === rm.away.name;
    if (sameTeams && um.h != null && um.a != null && rm.h != null && rm.a != null) {
      marker = koScore(um.h, um.a, rm.h, rm.a);
    }
    out[id] = { adv, marker, total: adv + marker, advanced };
  });
  return out;
}

// ============================================================
// FECHAS Y SEDES REALES DE LA ELIMINATORIA (hora España)
// ============================================================
const KO_DATES = {
  // Dieciseisavos
  M73: { d: "2026-06-28", t: "21:00", v: "SoFi Stadium, Los Ángeles" },
  M76: { d: "2026-06-29", t: "19:00", v: "NRG Stadium, Houston" },
  M74: { d: "2026-06-29", t: "22:30", v: "Gillette Stadium, Boston" },
  M75: { d: "2026-06-30", t: "03:00", v: "Estadio BBVA, Monterrey" },
  M78: { d: "2026-06-30", t: "19:00", v: "AT&T Stadium, Arlington" },
  M77: { d: "2026-06-30", t: "23:00", v: "MetLife Stadium, Nueva Jersey" },
  M79: { d: "2026-07-01", t: "03:00", v: "Estadio Azteca, CDMX" },
  M80: { d: "2026-07-01", t: "18:00", v: "Mercedes-Benz Stadium, Atlanta" },
  M82: { d: "2026-07-01", t: "22:00", v: "Lumen Field, Seattle" },
  M83: { d: "2026-07-03", t: "01:00", v: "BMO Field, Toronto" },
  M81: { d: "2026-07-02", t: "02:00", v: "Levi's Stadium, Santa Clara" },
  M85: { d: "2026-07-03", t: "05:00", v: "BC Place, Vancouver" },
  M84: { d: "2026-07-02", t: "21:00", v: "SoFi Stadium, Los Ángeles" },
  M86: { d: "2026-07-04", t: "00:00", v: "Hard Rock Stadium, Miami" },
  M87: { d: "2026-07-04", t: "03:30", v: "Arrowhead Stadium, Kansas City" },
  M88: { d: "2026-07-03", t: "20:00", v: "AT&T Stadium, Arlington" },
  // Octavos
  M90: { d: "2026-07-04", t: "19:00", v: "NRG Stadium, Houston" },
  M89: { d: "2026-07-04", t: "23:00", v: "Lincoln Financial Field, Filadelfia" },
  M91: { d: "2026-07-05", t: "22:00", v: "MetLife Stadium, Nueva Jersey" },
  M92: { d: "2026-07-06", t: "02:00", v: "Estadio Azteca, CDMX" },
  M93: { d: "2026-07-06", t: "21:00", v: "AT&T Stadium, Arlington" },
  M94: { d: "2026-07-07", t: "02:00", v: "Lumen Field, Seattle" },
  M95: { d: "2026-07-07", t: "18:00", v: "Mercedes-Benz Stadium, Atlanta" },
  M96: { d: "2026-07-07", t: "22:00", v: "BC Place, Vancouver" },
  // Cuartos
  M97:  { d: "2026-07-09", t: "22:00", v: "Gillette Stadium, Boston" },
  M98:  { d: "2026-07-10", t: "21:00", v: "SoFi Stadium, Los Ángeles" },
  M99:  { d: "2026-07-11", t: "23:00", v: "Hard Rock Stadium, Miami" },
  M100: { d: "2026-07-11", t: "03:00", v: "Arrowhead Stadium, Kansas City" },
  // Semifinales
  M101: { d: "2026-07-14", t: "21:00", v: "AT&T Stadium, Arlington" },
  M102: { d: "2026-07-15", t: "21:00", v: "Mercedes-Benz Stadium, Atlanta" },
  // Tercer puesto
  M103: { d: "2026-07-18", t: "23:00", v: "Hard Rock Stadium, Miami" },
  // Final
  M104: { d: "2026-07-19", t: "21:00", v: "MetLife Stadium, Nueva Jersey" },
};

const KO_ROUND_OF = (() => {
  const m = {};
  [...KO_SIDES.left.R32, ...KO_SIDES.right.R32].forEach(id => { m[id] = "R32"; });
  KO_TREE.R16.forEach(d => { m[d.match] = "R16"; });
  KO_TREE.QF.forEach(d => { m[d.match] = "QF"; });
  KO_TREE.SF.forEach(d => { m[d.match] = "SF"; });
  KO_TREE.FINAL.forEach(d => { m[d.match] = "FINAL"; });
  KO_TREE.THIRD.forEach(d => { m[d.match] = "THIRD"; });
  return m;
})();

const KO_ROUND_NAME = {
  R32: "Dieciseisavos", R16: "Octavos", QF: "Cuartos",
  SF: "Semifinal", THIRD: "Tercer puesto", FINAL: "Final",
};

// Convierte el cuadro en "partidos" con el mismo shape que los de grupos,
// para mostrarlos por días en Resultados reales y en Todos los pronósticos.
function buildKnockoutFixtures(matches, koResults) {
  const standingsByGroup = {};
  Object.keys(GROUPS).forEach(g => { standingsByGroup[g] = calcRealStandings(g, matches); });
  const realPicks = koPicksMap(koResults || []);
  const bracket = buildKnockoutBracket(standingsByGroup, realPicks);

  return Object.keys(KO_DATES).map(id => {
    const bm = bracket.byId[id];
    const s = KO_DATES[id];
    const r = realPicks[id] || {};
    return {
      id,
      ko: true,
      round: KO_ROUND_OF[id],
      roundLabel: KO_ROUND_NAME[KO_ROUND_OF[id]],
      home: bm ? bm.home.name : "—",
      away: bm ? bm.away.name : "—",
      homeFlag: bm ? bm.home.flag : "❓",
      awayFlag: bm ? bm.away.flag : "❓",
      homePlaceholder: !bm || bm.home.placeholder,
      awayPlaceholder: !bm || bm.away.placeholder,
      grp: null,
      competition: `${KO_ROUND_NAME[KO_ROUND_OF[id]]} · Mundial 2026`,
      venue: s.v,
      match_date: s.d,
      match_time: s.t,
      result_home: r.h != null ? r.h : null,
      result_away: r.a != null ? r.a : null,
      status: (r.h != null && r.a != null) ? "closed" : "open",
    };
  });
}

// +2 por cada equipo que el usuario sitúa como clasificado Y ACIERTA su posición
// (1º de grupo, 2º de grupo o 3º entre los 8 mejores).
// Solo puntúa cuando TODOS los partidos de la fase de grupos están definidos.
function calcQualifierPoints(matches, predMap) {
  const groupMatches = matches.filter(m => m.grp);

  const allPlayed =
    groupMatches.length > 0 &&
    groupMatches.every(m => m.result_home !== null && m.result_away !== null);
  if (!allPlayed) return 0;

  // Posición real de cada clasificado: "1", "2" o "3"
  const realByGroup = {};
  Object.keys(GROUPS).forEach(g => { realByGroup[g] = calcRealStandings(g, matches); });
  const real = calcAllQualifiers(realByGroup);
  const realPos = {};
  real.firsts.forEach(t => { realPos[t.name] = "1"; });
  real.seconds.forEach(t => { realPos[t.name] = "2"; });
  real.thirds.filter(t => t.qualifies).forEach(t => { realPos[t.name] = "3"; });

  // Posición que predijo el usuario
  const userByGroup = {};
  Object.keys(GROUPS).forEach(g => { userByGroup[g] = calcPersonalStandings(g, matches, predMap); });
  const user = calcAllQualifiers(userByGroup);
  const userPos = {};
  user.firsts.forEach(t => { userPos[t.name] = "1"; });
  user.seconds.forEach(t => { userPos[t.name] = "2"; });
  user.thirds.filter(t => t.qualifies).forEach(t => { userPos[t.name] = "3"; });

  // +2 SOLO si el equipo se clasifica en la MISMA posición que predijo
  let pts = 0;
  Object.keys(userPos).forEach(name => {
    if (realPos[name] && realPos[name] === userPos[name]) pts += 2;
  });
  return pts;
}

function formatDate(d) {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${parseInt(day)} ${["", "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][parseInt(m)]}`;
}

// ============================================================
// CUENTA ATRÁS
// ============================================================
const KICKOFF = new Date("2026-06-11T21:00:00+02:00").getTime(); // 21:00h España
function useCountdown() {
  const [time, setTime] = useState(() => Math.max(0, KICKOFF - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setTime(Math.max(0, KICKOFF - Date.now())), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  return { d: Math.floor(time / 86400000), h: pad(Math.floor((time % 86400000) / 3600000)), m: pad(Math.floor((time % 3600000) / 60000)), s: pad(Math.floor((time % 60000) / 1000)), started: time === 0 };
}

// ============================================================
// TEMA — Azul marino profesional
// ============================================================
const GREEN = "#4fc3f7";           // Azul claro brillante (acentos)
const GREEN_DIM = "rgba(79,195,247,0.12)";
const DARK = "#0a1628";            // Fondo principal — azul muy oscuro
const CARD = "rgba(255,255,255,0.06)";  // Tarjetas translúcidas
const BORDER = "rgba(79,195,247,0.2)";
const TEXT = "#e8f4fd";
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0a1628; color:#e8f4fd;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:#0a1628;}
  ::-webkit-scrollbar-thumb{background:#4fc3f7;border-radius:2px;}
  input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{opacity:0;transform:scale(0.85)}60%{transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 18px rgba(79,195,247,0.25)}50%{box-shadow:0 0 42px rgba(79,195,247,0.7)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .tappable{transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;}
  .tappable:hover{transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,0,0,0.35);}
  .tappable:active{transform:translateY(0) scale(0.98);}
  .skeleton{background:linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 37%, rgba(255,255,255,0.04) 63%); background-size:400% 100%; animation:shimmer 1.4s ease infinite; border-radius:8px;}
`;
const inputSt = {
  width: "100%", padding: "12px 14px", marginBottom: "12px",
  border: "1px solid rgba(79,195,247,0.3)", borderRadius: "8px",
  background: "rgba(255,255,255,0.07)", color: "#e8f4fd",
  fontSize: "16px", fontFamily: "'Inter', sans-serif", outline: "none"
};
const smallSt = {
  padding: "8px 4px", border: "1px solid rgba(79,195,247,0.4)",
  borderRadius: "6px", background: "rgba(255,255,255,0.08)",
  color: "#4fc3f7", fontSize: "20px",
  fontFamily: "'Bebas Neue', monospace", outline: "none",
  textAlign: "center", width: "48px"
};
function Stars() {
  const s = Array.from({ length: 40 }, (_, i) => ({ i, sz: Math.random() * 2 + 1, t: Math.random() * 100, l: Math.random() * 100, o: Math.random() * 0.35 + 0.08, dur: Math.random() * 3 + 2, dl: Math.random() * 3 }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {s.map(x => <div key={x.i} style={{ position: "absolute", width: x.sz + "px", height: x.sz + "px", background: "white", borderRadius: "50%", top: x.t + "%", left: x.l + "%", opacity: x.o, animation: `pulse ${x.dur}s ease-in-out infinite`, animationDelay: x.dl + "s" }} />)}
    </div>
  );
}

// ============================================================
// SKELETONS DE CARGA
// ============================================================
function SkeletonRows({ count = 5, height = 56 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: `${height}px`, borderRadius: "10px" }} />
      ))}
    </div>
  );
}

// Skeleton específico para filas de ranking (avatar + texto + puntos)
function SkeletonRanking({ count = 6 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: CARD, border: `1px solid ${BORDER}`,
          borderRadius: "10px", padding: "14px 16px",
        }}>
          <div className="skeleton" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <div className="skeleton" style={{ width: "55%", height: "12px" }} />
            <div className="skeleton" style={{ width: "35%", height: "9px" }} />
          </div>
          <div className="skeleton" style={{ width: "40px", height: "26px", borderRadius: "6px" }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ emoji, title, text }) {
  return (
    <div style={{
      background: CARD, border: `1px dashed ${BORDER}`, borderRadius: "14px",
      padding: "40px 24px", textAlign: "center",
      animation: "fadeIn 0.4s ease",
    }}>
      <div style={{ fontSize: "52px", marginBottom: "12px", animation: "floaty 2.5s ease-in-out infinite" }}>{emoji}</div>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN, letterSpacing: "2px", marginBottom: "8px" }}>{title}</div>
      <p style={{ fontSize: "12px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, maxWidth: "300px", margin: "0 auto" }}>{text}</p>
    </div>
  );
}

// ============================================================
// LOGIN
// ============================================================
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const go = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError("Email o contraseña incorrectos"); return; }
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        onLogin({ ...data.user, name: profile?.name || email, role: profile?.role || "user" });
      } else {
        if (!name || !email || !password) { setError("Rellena todos los campos"); return; }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) { setError(error.message); return; }
        await supabase.from("profiles").insert({ id: data.user.id, name, role: "user" });
        onLogin({ ...data.user, name, role: "user" });
      }
    } finally { setLoading(false); }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: "400px", animation: "fadeIn 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(34px,9vw,52px)", letterSpacing: "4px", color: "#e0eaf8", lineHeight: 1 }}>PORRA <span style={{ color: GREEN }}>VALLAU</span></div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(18px,5vw,26px)", letterSpacing: "6px", color: "#e0eefa", marginTop: "2px" }}>MUNDIAL 2026</div>
          <div style={{ fontSize: "10px", color: "#d0e4f7", letterSpacing: "3px", fontFamily: "'Inter', sans-serif", marginTop: "6px" }}>USA · CANADA · MEXICO</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(79,195,247,0.15)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", marginBottom: "20px", background: "rgba(200,215,235,0.5)", borderRadius: "8px", padding: "3px" }}>
            {["login", "register"].map(m => <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", background: mode === m ? GREEN : "transparent", color: mode === m ? "#0a1628" : "#d0e4f7", fontWeight: 700 }}>{m === "login" ? "Entrar" : "Registro"}</button>)}
          </div>
          {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={inputSt} />}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={inputSt} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" style={inputSt} onKeyDown={e => e.key === "Enter" && go()} />
          {error && <p style={{ color: "#cc2222", fontSize: "13px", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>⚠ {error}</p>}
          <button onClick={go} disabled={loading} style={{
            width: "100%", padding: "14px", border: "none", borderRadius: "8px",
            cursor: loading ? "default" : "pointer",
            background: loading ? "rgba(79,195,247,0.15)" : `linear-gradient(135deg,${GREEN},#0077cc)`,
            color: loading ? GREEN : "#0a1628", fontWeight: 800, fontSize: "13px",
            letterSpacing: "3px", fontFamily: "monospace", textTransform: "uppercase",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            {loading ? (
              <>
                <span style={{
                  width: "14px", height: "14px", borderRadius: "50%",
                  border: "2px solid rgba(79,195,247,0.3)", borderTopColor: GREEN,
                  display: "inline-block", animation: "spin 0.7s linear infinite",
                }} />
                {mode === "login" ? "ENTRANDO..." : "CREANDO CUENTA..."}
              </>
            ) : (mode === "login" ? "⚡ ENTRAR" : "🚀 REGISTRARME")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COUNTDOWN BANNER
// ============================================================
function CountdownBanner() {
  const { d, h, m, s, started } = useCountdown();

  if (started) {
    return (
      <div style={{
        background: `linear-gradient(135deg, rgba(79,195,247,0.18), rgba(0,119,204,0.12))`,
        border: `1px solid ${GREEN}`, borderRadius: "14px",
        padding: "16px", marginBottom: "20px", textAlign: "center",
        animation: "glowPulse 2.5s ease-in-out infinite",
      }}>
        <span style={{ fontSize: "26px", display: "block", marginBottom: "4px", animation: "floaty 2s ease-in-out infinite" }}>⚽🔥</span>
        <span style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive", fontSize: "22px", letterSpacing: "3px" }}>
          ¡EL MUNDIAL HA COMENZADO!
        </span>
      </div>
    );
  }

  const blocks = [{ v: d, l: "DÍAS" }, { v: h, l: "HORAS" }, { v: m, l: "MIN" }, { v: s, l: "SEG" }];

  return (
    <div style={{
      position: "relative",
      background: `radial-gradient(120% 120% at 50% 0%, rgba(79,195,247,0.12), rgba(10,22,40,0) 70%), rgba(255,255,255,0.03)`,
      border: `1px solid ${BORDER}`, borderRadius: "16px",
      padding: "18px 14px 16px", marginBottom: "20px", overflow: "hidden",
    }}>
      {/* Brillo superior decorativo */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "2px",
        background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`,
        opacity: 0.7,
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{ animation: "pulse 2s ease-in-out infinite" }}>⏱️</span>
        <span style={{ color: "#cce0f5", fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "3px" }}>
          11 JUN 2026 · 21:00H
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "4px" }}>
        {blocks.map(({ v, l }, i) => (
          <div key={l} style={{ display: "flex", alignItems: "flex-start", gap: "4px" }}>
            <div style={{ textAlign: "center", flex: 1, maxWidth: "74px" }}>
              <div style={{
                position: "relative",
                background: `linear-gradient(160deg, rgba(79,195,247,0.16), rgba(0,0,0,0.4))`,
                border: `1px solid rgba(79,195,247,0.3)`,
                borderRadius: "12px", padding: "12px 6px 10px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 14px rgba(0,0,0,0.35)",
                overflow: "hidden",
              }}>
                <span style={{
                  position: "relative",
                  fontFamily: "'Bebas Neue', monospace",
                  fontSize: "clamp(28px,9vw,40px)", lineHeight: 1, display: "block",
                  color: GREEN,
                  textShadow: `0 0 14px rgba(79,195,247,0.55)`,
                  ...(l === "SEG" ? {
                    background: `linear-gradient(90deg, ${GREEN} 0%, #e8f4fd 50%, ${GREEN} 100%)`,
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmer 2.5s linear infinite",
                  } : {}),
                }}>{v}</span>
              </div>
              <span style={{ fontSize: "8px", color: "#9cc4e6", fontFamily: "'Inter', sans-serif", letterSpacing: "1px", marginTop: "6px", display: "block" }}>{l}</span>
            </div>

            {/* Separador — una sola vez por hueco */}
            {i < blocks.length - 1 && (
              <div style={{
                display: "flex", flexDirection: "column", gap: "5px", paddingTop: "16px",
                animation:
                  i === 2 ? "blink 1s steps(1) infinite"
                  : i === 1 && s === "00" ? "blink 1s steps(1) infinite"
                  : i === 0 && m === "00" && s === "00" ? "blink 1s steps(1) infinite"
                  : "none",
              }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: GREEN, display: "block" }} />
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: GREEN, display: "block" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
// ============================================================
// BARRA DE PROGRESO
// ============================================================
function ProgressBar({ predictions, matches }) {
  const open = matches.filter(m => m.status === "open").length;
  const sent = predictions.length;
  const pct = Math.round((sent / TOTAL_MATCHES) * 100);   // ✅ corregido
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#cce0f5", letterSpacing: "2px" }}>TUS PRONÓSTICOS</span>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: sent === TOTAL_MATCHES ? GREEN : "#7ab8e0" }}>{sent}/{TOTAL_MATCHES}</span>
      </div>
      <div style={{ background: "rgba(79,195,247,0.08)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: `linear-gradient(90deg,${GREEN},#005599)`, borderRadius: "4px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
        <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>{pct}% completado</span>
        {open > 0 && <span style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif" }}>{TOTAL_MATCHES - sent} por enviar</span>}
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function NavBar({ user, view, setView, onLogout }) {
  // 4 tabs principales + perfil en header
  const tabs = [
    { id: "home", icon: "🏠", label: "Inicio" },
    { id: "groups", icon: "⚽", label: "Mis pronóst." },
    { id: "community", icon: "👥", label: "Todos" },
    { id: "ranking", icon: "🏆", label: "Ranking" },
  ];

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,22,40,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 14px", display: "flex", alignItems: "center", height: "50px" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", letterSpacing: "2px", color: "#e0eaf8", flex: 1 }}>PORRA <span style={{ color: GREEN }}>VALLAU</span></span>
          {/* Avatar / perfil en header */}
          <button onClick={() => setView("profile")} style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: view === "profile" ? GREEN : GREEN_DIM,
            border: `1px solid ${view === "profile" ? GREEN : "rgba(79,195,247,0.3)"}`,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            marginRight: "10px", flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color: view === "profile" ? "#0a1628" : GREEN }}>
              {user.emoji || user.name?.charAt(0).toUpperCase()}
            </span>
          </button>
          <button onClick={onLogout} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontSize: "11px", fontFamily: "'Inter', sans-serif" }}>salir</button>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,22,40,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ flex: 1, padding: "11px 2px 9px", border: "none", cursor: "pointer", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", borderTop: view === t.id ? `2px solid ${GREEN}` : "2px solid transparent" }}>
              <span style={{ fontSize: "17px", lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: "7px", fontFamily: "'Inter', sans-serif", color: view === t.id ? GREEN : "#7ab8e0", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ============================================================
// TABLA CLASIFICACIÓN
// ============================================================
function StandingTable({ standings }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 28px 28px 36px", gap: "1px", padding: "3px 8px 4px" }}>
        {["EQUIPO", "PJ", "GF", "GC", "PTS"].map(c => <span key={c} style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "1px", textAlign: c === "EQUIPO" ? "left" : "center" }}>{c}</span>)}
      </div>
      {standings.map((t, i) => (
        <div key={t.name} style={{ display: "grid", gridTemplateColumns: "1fr 28px 28px 28px 36px", gap: "1px", padding: "8px", borderRadius: "7px", marginBottom: "3px", background: i < 2 ? GREEN_DIM : CARD, border: i < 2 ? "1px solid rgba(79,195,247,0.18)" : `1px solid ${BORDER}`, borderLeft: i < 2 ? `3px solid ${GREEN}` : "3px solid transparent" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
            <span style={{ fontSize: "15px" }}>{t.flag}</span>
            <span style={{ fontSize: "11px", color: i < 2 ? "#e0eaf8" : "#a8d4f0", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
          </span>
          {[t.pj, t.gf, t.gc].map((v, vi) => <span key={vi} style={{ fontSize: "11px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>{v}</span>)}
          <span style={{ fontSize: "14px", fontWeight: 700, color: GREEN, fontFamily: "'Bebas Neue', monospace", textAlign: "center" }}>{t.pts}</span>
        </div>
      ))}
      <p style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", margin: "5px 0 0" }}>🟢 Los 2 primeros pasan a octavos</p>
    </div>
  );
}
// ============================================================
// TABLA DE CLASIFICADOS (1º, 2º y mejores terceros)
// ============================================================
function QualifiersTable({ standingsByGroup }) {
  const { firsts, seconds, thirds } = calcAllQualifiers(standingsByGroup);
  const anyData = firsts.length > 0 || seconds.length > 0 || thirds.length > 0;

  if (!anyData) {
    return (
      <p style={{ fontSize: "10px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>
        Introduce pronósticos en los grupos para ver los clasificados
      </p>
    );
  }

  const teamRow = (t, badge, badgeColor) => (
    <div key={`${t.grp}-${t.name}`} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "7px", marginBottom: "3px", background: GREEN_DIM, border: "1px solid rgba(79,195,247,0.18)", borderLeft: `3px solid ${GREEN}` }}>
      <span style={{ fontSize: "9px", color: badgeColor, fontFamily: "'Inter', sans-serif", minWidth: "32px" }}>{badge}</span>
      <span style={{ fontSize: "16px" }}>{t.flag}</span>
      <span style={{ flex: 1, fontSize: "11px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {t.name} <span style={{ color: "#7ab8e0" }}>({t.grp})</span>
      </span>
      <span style={{ fontSize: "14px", fontWeight: 700, color: GREEN, fontFamily: "'Bebas Neue', monospace" }}>{t.pts}</span>
    </div>
  );

  return (
    <div>
      {/* Primeros */}
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px" }}>
        🥇 PRIMEROS DE GRUPO
      </p>
      {firsts.sort((a, b) => a.grp.localeCompare(b.grp)).map(t => teamRow(t, `1º · ${t.grp}`, GREEN))}

      {/* Segundos */}
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", margin: "16px 0 8px" }}>
        🥈 SEGUNDOS DE GRUPO
      </p>
      {seconds.sort((a, b) => a.grp.localeCompare(b.grp)).map(t => teamRow(t, `2º · ${t.grp}`, "#7ab8e0"))}

      {/* Mejores terceros */}
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", margin: "16px 0 8px" }}>
        🥉 MEJORES TERCEROS (TABLA GENERAL)
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 28px 28px 28px 36px", gap: "1px", padding: "3px 8px 4px" }}>
        {["#", "EQUIPO (GR)", "PJ", "DG", "GF", "PTS"].map(c => (
          <span key={c} style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "1px", textAlign: c.startsWith("EQUIPO") ? "left" : "center" }}>{c}</span>
        ))}
      </div>
      {thirds.map(t => (
        <div key={t.name} style={{ display: "grid", gridTemplateColumns: "24px 1fr 28px 28px 28px 36px", gap: "1px", padding: "8px", borderRadius: "7px", marginBottom: "3px", background: t.qualifies ? GREEN_DIM : CARD, border: t.qualifies ? "1px solid rgba(79,195,247,0.18)" : `1px solid ${BORDER}`, borderLeft: t.qualifies ? `3px solid ${GREEN}` : "3px solid transparent" }}>
          <span style={{ fontSize: "11px", color: t.qualifies ? GREEN : "#7ab8e0", fontFamily: "'Bebas Neue', monospace", textAlign: "center" }}>{t.rank}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
            <span style={{ fontSize: "15px" }}>{t.flag}</span>
            <span style={{ fontSize: "11px", color: t.qualifies ? "#e0eaf8" : "#a8d4f0", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name} <span style={{ color: "#7ab8e0" }}>({t.grp})</span></span>
          </span>
          {[t.pj, t.dg, t.gf].map((v, vi) => <span key={vi} style={{ fontSize: "11px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>{v}</span>)}
          <span style={{ fontSize: "14px", fontWeight: 700, color: GREEN, fontFamily: "'Bebas Neue', monospace", textAlign: "center" }}>{t.pts}</span>
        </div>
      ))}
      <p style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", margin: "8px 0 0" }}>
        🟢 Pasan a dieciseisavos: 2 primeros de cada grupo + 8 mejores terceros · +2 pts si aciertas el clasificado EN SU POSICIÓN (1º, 2º o 3º)
      </p>
    </div>
  );
}

// ============================================================
// CUADRO VISUAL DE DIECISEISAVOS
// ============================================================
function BracketR32({ standingsByGroup }) {
  // Solo construir si TODOS los grupos tienen sus 3 partidos pronosticados
  const allGroupsComplete = Object.keys(GROUPS).every(g => {
    const st = standingsByGroup[g];
    return st && st.every(t => t.pj === 3);
  });

  if (!allGroupsComplete) {
    return (
      <div style={{ marginTop: "24px", padding: "16px", background: CARD, border: `1px dashed ${BORDER}`, borderRadius: "10px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
          🔒 Completa los <b>3 partidos de los 12 grupos</b> para ver tu cuadro de dieciseisavos
        </p>
      </div>
    );
  }

  const r32 = buildRoundOf32(standingsByGroup);

  const teamPill = (t, isHome) => (
    <div style={{
      display: "flex", alignItems: "center", gap: "6px",
      padding: "5px 8px", borderRadius: "6px",
      background: t.placeholder ? "rgba(255,255,255,0.03)" : GREEN_DIM,
      border: `1px solid ${t.placeholder ? BORDER : "rgba(79,195,247,0.2)"}`,
      opacity: t.placeholder ? 0.55 : 1,
    }}>
      <span style={{ fontSize: "8px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", minWidth: "26px" }}>{t.label}</span>
      <span style={{ fontSize: "14px" }}>{t.flag}</span>
      <span style={{ fontSize: "10px", color: t.placeholder ? "#7ab8e0" : "#e0eaf8", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
    </div>
  );

  return (
    <div style={{ marginTop: "24px" }}>
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "12px" }}>
        🏟️ TU CUADRO DE DIECISEISAVOS
      </p>

      {/* LISTA DE ENFRENTAMIENTOS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {r32.map(m => (
          <div key={m.match} style={{ display: "flex", alignItems: "center", gap: "6px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "8px" }}>
            <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Bebas Neue', monospace", minWidth: "30px" }}>{m.match}</span>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
              {teamPill(m.home, true)}
              {teamPill(m.away, false)}
            </div>
          </div>
        ))}
      </div>

      {/* CUADRO VISUAL CON SCROLL HORIZONTAL */}
      <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px" }}>
        VISTA CUADRO (desliza →)
      </p>
      <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "320px" }}>
          {r32.map(m => (
            <div key={m.match} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, padding: "6px 8px", borderRadius: "6px", background: m.home.placeholder ? CARD : GREEN_DIM, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GREEN}`, display: "flex", alignItems: "center", gap: "5px", opacity: m.home.placeholder ? 0.5 : 1 }}>
                <span style={{ fontSize: "13px" }}>{m.home.flag}</span>
                <span style={{ fontSize: "9px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.home.name}</span>
              </div>
              <span style={{ fontSize: "8px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>vs</span>
              <div style={{ flex: 1, padding: "6px 8px", borderRadius: "6px", background: m.away.placeholder ? CARD : GREEN_DIM, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GREEN}`, display: "flex", alignItems: "center", gap: "5px", opacity: m.away.placeholder ? 0.5 : 1 }}>
                <span style={{ fontSize: "13px" }}>{m.away.flag}</span>
                <span style={{ fontSize: "9px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.away.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", margin: "10px 0 0", lineHeight: 1.5 }}>
        ℹ️ Los terceros se asignan con la lógica oficial FIFA (ningún equipo se cruza con el ganador de su propio grupo).
      </p>
    </div>
  );
}

// ============================================================
// PRONÓSTICO CLASIFICADOS POR GRUPO
// ============================================================
function QualifierPicker({ group, userId, locked, matches, predMap }) {
  const teams = GROUPS[group];
  const [picks, setPicks] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tieExists, setTieExists] = useState(false);

  const standings = calcPersonalStandings(group, matches, predMap);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("qualifier_picks").select("*").eq("user_id", userId).eq("grp", group).single();
      if (data) setPicks([data.pick1, data.pick2].filter(Boolean));
      setLoading(false);
    })();
  }, [group, userId]);

  useEffect(() => {
    if (loading) return;

    const top = standings[0];
    const second = standings[1];
    const third = standings[2];

    if (!top || !second) return;

    // Comprobar si hay empate entre 2º y 3º
    const isTie = second && third &&
      second.pts === third.pts &&
      second.dg === third.dg &&
      second.gf === third.gf;

    setTieExists(isTie);

    // Si no hay empate, guardar automáticamente 1º y 2º
    if (!isTie) {
      const auto = [top.name, second.name];
      if (JSON.stringify(auto) !== JSON.stringify(picks)) {
        setPicks(auto);
        supabase.from("qualifier_picks").upsert(
          { user_id: userId, grp: group, pick1: auto[0], pick2: auto[1] },
          { onConflict: "user_id,grp" }
        );
      }
    }
  }, [standings.map(s => s.pts + s.dg + s.gf).join(","), loading]);

  const toggle = async (name) => {
    if (locked || !tieExists) return;
    let next;
    if (picks.includes(name)) next = picks.filter(p => p !== name);
    else if (picks.length < 2) next = [...picks, name];
    else next = [picks[1], name];
    setPicks(next);
    setSaved(false);
    const { error } = await supabase.from("qualifier_picks").upsert(
      { user_id: userId, grp: group, pick1: next[0] || null, pick2: next[1] || null },
      { onConflict: "user_id,grp" }
    );
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  if (loading) return null;

  // Si no hay ningún pronóstico introducido aún, no mostrar nada
  const hasAnyPred = matches.filter(m => m.grp === group).some(m => predMap[m.id]);
  if (!hasAnyPred) return (
    <div style={{ marginTop: "16px" }}>
      <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>
        CLASIFICADOS (+2 PTS c/u) · Introduce pronósticos para calcular automáticamente
      </p>
    </div>
  );

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>
          CLASIFICADOS (+2 PTS c/u) · {tieExists ? "⚠️ Empate — selecciona manualmente" : ""}
        </p>
        {saved && <span style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif" }}>✓</span>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {teams.map(t => {
          const sel = picks.includes(t.name);
          const pos = standings.findIndex(s => s.name === t.name);
          const isAuto = !tieExists && (pos === 0 || pos === 1);

          return (
            <button
              key={t.name}
              onClick={() => toggle(t.name)}
              disabled={locked || !tieExists}
              style={{
                padding: "7px 10px",
                border: `1px solid ${sel ? GREEN : BORDER}`,
                borderRadius: "8px",
                background: sel ? GREEN_DIM : CARD,
                cursor: locked || !tieExists ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: "5px",
                opacity: locked && !sel ? 0.4 : 1,
              }}>
              <span style={{ fontSize: "16px" }}>{t.flag}</span>
              <span style={{ fontSize: "11px", color: sel ? GREEN : "#a8d4f0", fontFamily: "'Inter', sans-serif" }}>{t.name}</span>
              {isAuto && <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>#{pos + 1}</span>}
              {sel && tieExists && <span style={{ fontSize: "10px", color: GREEN }}>✓</span>}
            </button>
          );
        })}
      </div>

      {tieExists && !locked && (
        <p style={{ fontSize: "9px", color: "#ff6b4a", fontFamily: "'Inter', sans-serif", marginTop: "6px" }}>
          ⚠️ Hay empate entre 2º y 3º — selecciona quién pasa · {picks.length}/2
        </p>
      )}
      {locked && (
        <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", marginTop: "6px" }}>
          🔒 Pronósticos cerrados
        </p>
      )}
    </div>
  );
}

// ============================================================
// MATCH CHAT — con realtime robusto + contador no leídos
// ============================================================
function MatchChat({ match, user }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const channelRef = useRef(null);
  const lastSeenRef = useRef(0); // timestamp del último mensaje visto

  const loadComments = async () => {
    const { data } = await supabase
      .from("match_comments")
      .select("*")
      .eq("match_id", match.id)
      .order("created_at", { ascending: true });
    setComments(data || []);
    setLoading(false);
    // Al cargar con el chat abierto, marcar todo como leído
    if (open) {
      lastSeenRef.current = Date.now();
      setUnread(0);
    }
  };

  // Suscripción realtime — se monta una sola vez por match
  useEffect(() => {
    // Cargar mensajes iniciales (aunque el chat esté cerrado, para saber si hay no leídos)
    (async () => {
      const { data } = await supabase
        .from("match_comments")
        .select("*")
        .eq("match_id", match.id)
        .order("created_at", { ascending: true });
      setComments(data || []);
      setLoading(false);
    })();

    // Canal realtime
    channelRef.current = supabase
      .channel(`match_chat_${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_comments",
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          setComments(prev => {
            // Evitar duplicados (mensaje propio ya insertado optimistamente)
            if (prev.find(c => c.id === payload.new.id)) return prev;
            // Si el chat está cerrado y el mensaje es de otro usuario → sumar no leído
            if (payload.new.user_id !== user.id) {
              setUnread(u => u + 1);
            }
            return [...prev, payload.new];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "match_comments",
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          setComments(prev => prev.filter(c => c.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [match.id]); // solo se remonta si cambia el partido

  // Al abrir el chat → marcar como leído
  useEffect(() => {
    if (open) {
      setUnread(0);
      lastSeenRef.current = Date.now();
      // Scroll al fondo
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [open]);

  // Scroll al fondo cuando llegan mensajes nuevos con el chat abierto
  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, open]);

  const send = async () => {
    if (!message.trim() || sending) return;
    setSending(true);

    const optimistic = {
      id: `temp_${Date.now()}`,
      match_id: match.id,
      user_id: user.id,
      user_name: user.name,
      message: message.trim(),
      created_at: new Date().toISOString(),
    };
    setComments(prev => [...prev, optimistic]);
    setMessage("");

    const { data, error } = await supabase
      .from("match_comments")
      .insert({
        match_id: match.id,
        user_id: user.id,
        user_name: user.name,
        message: optimistic.message,
      })
      .select()
      .single();

    if (error) {
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
    } else {
      setComments(prev => prev.map(c => c.id === optimistic.id ? data : c));
    }
    setSending(false);
  };

  const sendReaction = async (emoji) => {
    const optimistic = {
      id: `temp_${Date.now()}`,
      match_id: match.id,
      user_id: user.id,
      user_name: user.name,
      message: emoji,
      created_at: new Date().toISOString(),
    };
    setComments(prev => [...prev, optimistic]);

    const { data, error } = await supabase
      .from("match_comments")
      .insert({
        match_id: match.id,
        user_id: user.id,
        user_name: user.name,
        message: emoji,
      })
      .select()
      .single();

    if (error) {
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
    } else {
      setComments(prev => prev.map(c => c.id === optimistic.id ? data : c));
    }
  };

  const deleteComment = async (id) => {
    await supabase.from("match_comments").delete().eq("id", id);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const REACTIONS = ["⚽", "🔥", "😱", "💀", "🎉", "👏", "😅", "🤞"];

  return (
    <div style={{ marginTop: "10px" }}>
      {/* ✉️ Indicador de no leídos en la esquina de la tarjeta del partido */}
      {!open && unread > 0 && (
        <div style={{
          position: "absolute", top: "8px", right: "8px", zIndex: 6,
          display: "flex", alignItems: "center", gap: "4px",
          background: "#cc2222", color: "white",
          borderRadius: "12px", padding: "3px 9px",
          fontSize: "11px", fontFamily: "'Inter', sans-serif", fontWeight: 700,
          boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
          animation: "popIn 0.3s ease",
        }}>
          <span style={{ fontSize: "12px" }}>✉️</span>
          +{unread > 99 ? "99" : unread}
        </div>
      )}
      {/* Botón toggle con badge de no leídos */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "8px",
          border: `1px solid ${open ? GREEN : BORDER}`,
          borderRadius: "8px",
          background: open ? GREEN_DIM : "transparent",
          color: open ? GREEN : "#d0e4f7",
          fontFamily: "'Inter', sans-serif", fontSize: "10px",
          cursor: "pointer", letterSpacing: "1px",
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: "6px",
          position: "relative",
        }}>
        💬
        {open ? "CERRAR CHAT" : `CHAT DEL PARTIDO`}
        {/* Badge de no leídos */}
        {!open && unread > 0 && (
          <span style={{
            background: "#cc2222",
            color: "white",
            borderRadius: "10px",
            fontSize: "10px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            padding: "1px 7px",
            minWidth: "20px",
            textAlign: "center",
            lineHeight: "18px",
          }}>
            {unread > 99 ? "99+" : unread}
          </span>
        )}
        {/* Punto verde si hay mensajes aunque no haya no leídos */}
        {!open && unread === 0 && comments.length > 0 && (
          <span style={{
            fontSize: "9px", color: "#c0d8f0",
            fontFamily: "'Inter', sans-serif",
          }}>
            ({comments.length})
          </span>
        )}
      </button>

      {open && (
        <div style={{
            marginTop: "8px",
            border: `1px solid ${BORDER}`,
            borderRadius: "10px",
            background: "rgba(10,22,40,0.95)",
            overflow: "hidden",
          }}>
          {/* Mensajes */}
          <div style={{
            maxHeight: "220px", overflowY: "auto",
            padding: "10px", display: "flex",
            flexDirection: "column", gap: "6px",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}>
            {loading && (
              <p style={{ color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "11px", textAlign: "center" }}>
                Cargando...
              </p>
            )}
            {!loading && comments.length === 0 && (
              <p style={{ color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "11px", textAlign: "center", padding: "12px 0" }}>
                Sé el primero en comentar ⚽
              </p>
            )}
            {comments.map(c => {
              const isMe = c.user_id === user.id;
              const isAdmin = user.role === "admin";
              const isReaction = ["⚽", "🔥", "😱", "💀", "🎉", "👏", "😅", "🤞"].includes(c.message);
              return (
                <div key={c.id} style={{
                  display: "flex", flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                  animation: "fadeIn 0.2s ease",
                }}>
                  {!isMe && (
                    <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginBottom: "2px", marginLeft: "4px" }}>
                      {c.user_name}
                    </span>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {(isMe || isAdmin) && (
                      <button onClick={() => deleteComment(c.id)} style={{
                        padding: "0 4px", border: "none", background: "transparent",
                        color: "#cc2222", cursor: "pointer", fontSize: "10px", opacity: 0.5,
                      }}>✕</button>
                    )}
                    <div style={{
                      maxWidth: "80%",
                      padding: isReaction ? "4px 8px" : "8px 12px",
                      borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: isMe ? GREEN : "rgba(255,255,255,0.12)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      fontSize: isReaction ? "22px" : "12px",
                      color: "#e0eaf8",
                      fontFamily: "'Inter', sans-serif", lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}>
                      {c.message}
                    </div>
                  </div>
                  <span style={{ fontSize: "8px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginTop: "2px", marginLeft: "4px", marginRight: "4px" }}>
                    {formatTime(c.created_at)}
                  </span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Reacciones rápidas */}
          <div style={{
            display: "flex", gap: "4px", padding: "6px 10px",
            borderTop: `1px solid ${BORDER}`, flexWrap: "wrap",
            background: "rgba(26,58,107,0.02)",
          }}>
            {REACTIONS.map(emoji => (
              <button key={emoji} onClick={() => sendReaction(emoji)} style={{
                padding: "4px 8px",
                border: `1px solid ${BORDER}`,
                borderRadius: "20px", background: "white",
                cursor: "pointer", fontSize: "16px", lineHeight: 1,
              }}>{emoji}</button>
            ))}
          </div>

          {/* Input mensaje */}
          <div style={{
            display: "flex", gap: "6px", padding: "8px 10px",
            borderTop: `1px solid ${BORDER}`,
            background: "rgba(26,58,107,0.02)",
          }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Escribe algo..."
              maxLength={200}
              style={{
                flex: 1, padding: "8px 12px",
                border: `1px solid ${BORDER}`, borderRadius: "20px",
                background: "rgba(255,255,255,0.12)", color: "#e0eaf8",
                fontFamily: "'Inter', sans-serif", fontSize: "12px", outline: "none",
              }}
            />
            <button
              onClick={send}
              disabled={!message.trim() || sending}
              style={{
                padding: "8px 14px", border: "none", borderRadius: "20px",
                background: message.trim() ? GREEN : "rgba(26,58,107,0.1)",
                color: message.trim() ? "white" : "#c0d8f0",
                fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700,
                cursor: message.trim() ? "pointer" : "default",
              }}>
              {sending ? "..." : "→"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// ============================================================
// TOAST NOTIFICATION
// ============================================================
function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: "80px", left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(10,22,40,0.95)",
      border: `1px solid ${GREEN}`,
      borderRadius: "20px", padding: "10px 20px",
      display: "flex", alignItems: "center", gap: "8px",
      zIndex: 999, animation: "fadeIn 0.2s ease",
      boxShadow: "0 4px 20px rgba(79,195,247,0.2)",
      pointerEvents: "none",
    }}>
      <span style={{ fontSize: "14px" }}>✓</span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#e0eaf8", whiteSpace: "nowrap" }}>
        {message}
      </span>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState({ visible: false, message: "" });
  const show = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2000);
  };
  return { toast, show };
}

function MatchRow({ match, userPred, user, onSaved, allClosed }) {
  const ht = getTeam(match.home), at = getTeam(match.away);
  const [ph, setPh] = useState(userPred?.predicted_home ?? "");
  const [pa, setPa] = useState(userPred?.predicted_away ?? "");
  const [status, setStatus] = useState(userPred ? "saved" : "idle");
  const timerRef = useRef(null);
  const { toast, show } = useToast();
  const isOpen = !allClosed && match.status === "open";
  const hasResult = match.result_home !== null && match.result_away !== null;
  const predPoints = userPred && hasResult ? calcPoints(userPred, match.result_home, match.result_away) : null;

  const save = useCallback(async (newPh, newPa) => {
    if (newPh === "" || newPa === "") return;
    setStatus("saving");
    const { error } = await supabase.from("predictions").upsert(
      { user_id: user.id, match_id: match.id, predicted_home: parseInt(newPh), predicted_away: parseInt(newPa), points: null },
      { onConflict: "user_id,match_id" }
    );
    if (error) { setStatus("error"); return; }
    setStatus("saved");
    show(`${match.home} ${newPh} - ${newPa} ${match.away} guardado`);
    onSaved();
  }, [user.id, match.id, onSaved]);

  const handleChange = (field, val) => {
    const newPh = field === "h" ? val : ph, newPa = field === "a" ? val : pa;
    field === "h" ? setPh(val) : setPa(val);
    setStatus("typing");
    if (timerRef.current) clearTimeout(timerRef.current);
    if (newPh !== "" && newPa !== "") timerRef.current = setTimeout(() => save(newPh, newPa), 800);
  };

  // ⚡ Rellenar resultado aleatorio según ganador elegido
  const handleRandom = (winner) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const { home, away } = randomScore(winner);
    setPh(String(home));
    setPa(String(away));
    save(home, away);
  };

  const statusColor = status === "saved" ? GREEN : status === "saving" ? "#a8d4f0" : status === "error" ? "#cc2222" : "#7ab8e0";
  const statusText = status === "saved" ? "✓" : status === "saving" ? "···" : status === "error" ? "✗" : "";

  const randomBtnSt = {
    width: "46px", height: "40px",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    background: "rgba(255,255,255,0.04)",
    color: "#a8d4f0",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s ease",
    flexShrink: 0,
  };

  const scoreInputSt = {
    width: "46px", height: "52px",
    border: `1px solid rgba(79,195,247,0.35)`, borderRadius: "10px",
    background: "linear-gradient(160deg, rgba(79,195,247,0.12), rgba(0,0,0,0.3))",
    color: GREEN, fontSize: "30px",
    fontFamily: "'Bebas Neue', cursive", outline: "none",
    textAlign: "center", padding: 0,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  };

  return (
    <>
      <Toast message={toast.message} visible={toast.visible} />
      <div style={{ padding: "12px", borderRadius: "10px", marginBottom: "6px", background: CARD, border: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>📅 {formatDate(match.match_date)} · ⏰ {match.match_time || "??:??"}h</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "#c0d8f0", textAlign: "right", fontFamily: "'Inter', sans-serif" }}>{match.home}</span>
            <span style={{ fontSize: "28px" }}>{ht.flag}</span>
          </div>
          {hasResult ? (
            <div style={{ minWidth: "64px", textAlign: "center" }}>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN }}>{match.result_home}</span>
              <span style={{ color: "#b8d4ee", fontSize: "16px", margin: "0 3px" }}>-</span>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN }}>{match.result_away}</span>
            </div>
          ) : (
            <div style={{ minWidth: "44px", textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: "#b8d4ee", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>VS</span>
            </div>
          )}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "22px" }}>{at.flag}</span>
            <span style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{match.away}</span>
          </div>
        </div>
        {user.role !== "admin" && (
          <>
            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {isOpen ? (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  padding: "8px 14px", borderRadius: "12px",
                  background: "rgba(0,0,0,0.3)", border: `1px solid ${BORDER}`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}>
                  <input value={ph} onChange={e => handleChange("h", e.target.value)} type="number" min="0" max="20" style={scoreInputSt} placeholder="–" />
                  <span style={{ color: "#7ab8e0", fontSize: "22px", fontFamily: "'Bebas Neue', cursive" }}>:</span>
                  <input value={pa} onChange={e => handleChange("a", e.target.value)} type="number" min="0" max="20" style={scoreInputSt} placeholder="–" />
                  <span style={{ fontSize: "14px", fontFamily: "'Inter', sans-serif", color: statusColor, minWidth: "18px", textAlign: "center" }}>{statusText}</span>
                </div>
              ) : userPred ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#e0eefa", fontFamily: "'Inter', sans-serif" }}>{userPred.predicted_home}-{userPred.predicted_away}</span>
                  {predPoints !== null && (
                    <span style={{
                      padding: "3px 10px", borderRadius: "12px", fontSize: "12px",
                      fontFamily: "'Inter', sans-serif", fontWeight: 700,
                      background: predPoints === 5 ? GREEN_DIM : predPoints === 3 ? "rgba(79,195,247,0.08)" : predPoints === 1 ? "rgba(255,193,7,0.1)" : "rgba(255,82,82,0.08)",
                      color: predPoints === 5 ? GREEN : predPoints === 3 ? "#4fc3f7" : predPoints === 1 ? "#ffd54f" : "#cc2222",
                    }}>
                      {predPoints === 5 ? "🎯 +5" : predPoints === 3 ? "📏 +3" : predPoints === 1 ? "✓ +1" : "✗ +0"}
                    </span>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>cerrado · sin pronóstico</span>
              )}
            </div>

            {/* 🎲 Botones de relleno aleatorio por ganador */}
            {isOpen && (
              <div style={{ marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>🎲 azar:</span>
                <button onClick={() => handleRandom("H")} className="tappable" style={randomBtnSt} title={`Gana ${match.home}`}>
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>{ht.flag}</span>
                </button>
                <button onClick={() => handleRandom("D")} className="tappable" style={randomBtnSt} title="Empate">
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>🤝</span>
                </button>
                <button onClick={() => handleRandom("A")} className="tappable" style={randomBtnSt} title={`Gana ${match.away}`}>
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>{at.flag}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
// ============================================================
// VISTA GRUPOS
// ============================================================
function GroupsView({ user, matches, predictions, onDataChange, allClosed }) {
  const [tab, setTab] = useState("groups");
  const [g, setG] = useState("A");
  const [showPending, setShowPending] = useState(false);
  const predMap = {};
  predictions.forEach(p => { predMap[p.match_id] = p; });
  const personalStandings = calcPersonalStandings(g, matches, predMap);
  const hasAnyPred = matches.filter(m => m.grp === g).some(m => predMap[m.id]);

  const pendingMatches = matches.filter(m =>
    m.status === "open" && !allClosed && !predMap[m.id]
  );
  const pendingByGroup = {};
  pendingMatches.forEach(m => {
    if (!pendingByGroup[m.grp]) pendingByGroup[m.grp] = [];
    pendingByGroup[m.grp].push(m);
  });

  const groupRows = [
    ["A", "B", "C", "D"],
    ["E", "F", "G", "H"],
    ["I", "J", "K", "L"],
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <ProgressBar predictions={predictions} matches={matches} />

      {/* TABS PRINCIPALES */}
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "3px" }}>
        {[
          { id: "groups", label: "⚽ Grupos" },
          { id: "qualified", label: "✅ Clasificados" },
          { id: "special", label: "🏅 Especiales" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "10px", border: "none", borderRadius: "8px",
            cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px",
            letterSpacing: "2px", fontWeight: 700, textTransform: "uppercase",
            background: tab === t.id ? GREEN : "transparent",
            color: tab === t.id ? "#0a1628" : "#d0e4f7",
          }}>{t.label}</button>
        ))}
      </div>

      {/* TAB ESPECIALES */}
      {tab === "special" && (
        <SpecialPredictions userId={user.id} locked={allClosed} />
      )}

      {/* TAB CLASIFICADOS */}
        {tab === "qualified" && (() => {
          const standingsByGroup = {};
          Object.keys(GROUPS).forEach(gr => {
            standingsByGroup[gr] = calcPersonalStandings(gr, matches, predMap);
          });
          return (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px" }}>
              <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "6px" }}>
                TUS CLASIFICADOS
              </p>
              <p style={{ fontSize: "10px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginBottom: "14px", lineHeight: 1.5 }}>
                Según tus pronósticos de la fase de grupos, estos son los equipos que clasificarías a dieciseisavos.
              </p>
              <QualifiersTable standingsByGroup={standingsByGroup} />
              <BracketR32 standingsByGroup={standingsByGroup} />
            </div>
          );
        })()}

      {/* TAB GRUPOS */}
      {tab === "groups" && (
        <>
          {/* Botón filtro pendientes */}
          <button
            onClick={() => setShowPending(v => !v)}
            style={{
              width: "100%", marginBottom: "16px",
              padding: "12px 16px",
              border: `1px solid ${showPending ? "#ff6b4a" : BORDER}`,
              borderRadius: "10px",
              background: showPending ? "rgba(255,107,74,0.1)" : CARD,
              color: showPending ? "#ff6b4a" : "#d0e4f7",
              fontFamily: "'Inter', sans-serif", fontSize: "11px",
              cursor: "pointer", letterSpacing: "2px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
            }}>
            <span>⚠️ VER SOLO SIN RELLENAR</span>
            <span style={{
              background: pendingMatches.length > 0 ? "#ff6b4a" : "#007a3a",
              color: "white", borderRadius: "10px",
              fontSize: "10px", fontFamily: "'Inter', sans-serif",
              fontWeight: 700, padding: "2px 10px",
            }}>
              {pendingMatches.length > 0 ? `${pendingMatches.length} pendientes` : "✓ Todo rellenado"}
            </span>
          </button>

          {showPending ? (
            <div>
              {pendingMatches.length === 0 ? (
                <div style={{
                  background: "rgba(0,122,58,0.1)", border: "1px solid rgba(0,122,58,0.3)",
                  borderRadius: "12px", padding: "28px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "36px", marginBottom: "10px" }}>🎉</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: GREEN }}>
                    ¡Has rellenado todos los pronósticos abiertos!
                  </p>
                </div>
              ) : (
                Object.entries(pendingByGroup).map(([grp, ms]) => (
                  <div key={grp} style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "6px",
                        background: GREEN_DIM, border: `1px solid ${BORDER}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: GREEN }}>{grp}</span>
                      </div>
                      <span style={{ fontSize: "9px", color: "#ff6b4a", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>
                        GRUPO {grp} · {ms.length} sin rellenar
                      </span>
                    </div>
                    {ms.map(m => (
                      <MatchRow key={m.id} match={m} userPred={predMap[m.id]}
                        user={user} onSaved={onDataChange} allClosed={allClosed} />
                    ))}
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>SELECCIONA GRUPO</p>

              {/* GRUPOS EN 3 FILAS DE 4 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
                {groupRows.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: "6px" }}>
                    {row.map(gr => {
                      const pending = matches.filter(m =>
                        m.grp === gr && m.status === "open" && !allClosed && !predMap[m.id]
                      ).length;
                      return (
                        <button key={gr} onClick={() => setG(gr)} style={{
                          flex: 1, height: "40px",
                          border: `1px solid ${g === gr ? GREEN : BORDER}`,
                          borderRadius: "8px", cursor: "pointer",
                          fontFamily: "'Bebas Neue', cursive", fontSize: "18px",
                          background: g === gr ? GREEN_DIM : CARD,
                          color: g === gr ? GREEN : "#e0eefa",
                          position: "relative",
                        }}>
                          {gr}
                          {pending > 0 && (
                            <span style={{
                              position: "absolute", top: "2px", right: "2px",
                              width: "7px", height: "7px",
                              borderRadius: "50%", background: "#ff6b4a",
                            }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "7px",
                    background: GREEN_DIM, border: `1px solid ${BORDER}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{g}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "17px", color: "#e0eaf8" }}>GRUPO {g}</div>
                    <div style={{ display: "flex", gap: "5px", marginTop: "3px" }}>
                      {GROUPS[g].map(t => <span key={t.name} style={{ fontSize: "15px" }} title={t.name}>{t.flag}</span>)}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "6px" }}>TU CLASIFICACIÓN</p>
                {!hasAnyPred && <p style={{ fontSize: "10px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginBottom: "8px" }}>Introduce pronósticos abajo para ver tu clasificación</p>}
                <StandingTable standings={personalStandings} />
                <QualifierPicker group={g} userId={user.id} locked={allClosed} matches={matches} predMap={predMap} />
                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "10px" }}>PARTIDOS</p>
                  {matches.filter(m => m.grp === g).map(m => (
                    <MatchRow key={m.id} match={m} userPred={predMap[m.id]}
                      user={user} onSaved={onDataChange} allClosed={allClosed} />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// MARCADOR TIPO ESTADIO (banderas grandes + resultado central)
// ============================================================
function StadiumScore({ match, played, compact }) {
  const ht = match.homeFlag ? { name: match.home, flag: match.homeFlag } : getTeam(match.home);
  const at = match.awayFlag ? { name: match.away, flag: match.awayFlag } : getTeam(match.away);
  const hasResult = match.result_home !== null && match.result_away !== null;
  const homeWin = hasResult && match.result_home > match.result_away;
  const awayWin = hasResult && match.result_away > match.result_home;

  // Tamaños (compacto para "Todos los pronósticos")
  const flagSz    = compact ? "30px" : "40px";
  const nameSz     = compact ? "11px" : "13px";
  const scoreSz    = compact ? "28px" : "38px";
  const colonSz    = compact ? "15px" : "20px";
  const vsSz       = compact ? "18px" : "22px";
  const centerMin  = compact ? "76px" : "92px";
  const padCont    = compact ? "10px 8px" : "14px 10px";
  const scorePad   = compact ? "5px 11px" : "6px 14px";

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
      padding: padCont,
      background: "radial-gradient(120% 140% at 50% 0%, rgba(79,195,247,0.10), rgba(10,22,40,0) 70%)",
    }}>
      {/* Local */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", opacity: hasResult && !homeWin && !awayWin ? 0.85 : 1 }}>
        <span style={{ fontSize: flagSz, lineHeight: 1, filter: awayWin ? "grayscale(0.5)" : "none" }}>{ht.flag}</span>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: nameSz, letterSpacing: "1px", color: homeWin ? GREEN : "#c0d8f0", textAlign: "center", lineHeight: 1.1 }}>{match.home}</span>
      </div>

      {/* Marcador central */}
      <div style={{ flexShrink: 0, textAlign: "center", minWidth: centerMin }}>
        {hasResult ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: scorePad, borderRadius: "10px",
            background: "rgba(0,0,0,0.35)", border: `1px solid ${BORDER}`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 14px rgba(0,0,0,0.3)",
          }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: scoreSz, lineHeight: 1, color: homeWin ? GREEN : "#e0eaf8" }}>{match.result_home}</span>
            <span style={{ color: "#7ab8e0", fontSize: colonSz }}>:</span>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: scoreSz, lineHeight: 1, color: awayWin ? GREEN : "#e0eaf8" }}>{match.result_away}</span>
          </div>
        ) : (
          <div style={{
            display: "inline-block", padding: scorePad, borderRadius: "10px",
            background: "rgba(0,0,0,0.25)", border: `1px solid ${BORDER}`,
          }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: vsSz, letterSpacing: "3px", color: "#7ab8e0" }}>VS</span>
          </div>
        )}
        <div style={{ fontSize: "8px", color: "#9cc4e6", fontFamily: "'Inter', sans-serif", marginTop: "5px", letterSpacing: "1px" }}>
          {formatDate(match.match_date)}{match.match_time ? ` · ${match.match_time}h` : ""}
        </div>
        <div style={{ fontSize: "8px", color: GREEN, fontFamily: "'Inter', sans-serif", marginTop: "3px", letterSpacing: "1px" }}>
          📺 {tvFor(match)}
        </div>
      </div>

      {/* Visitante */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", opacity: hasResult && !homeWin && !awayWin ? 0.85 : 1 }}>
        <span style={{ fontSize: flagSz, lineHeight: 1, filter: homeWin ? "grayscale(0.5)" : "none" }}>{at.flag}</span>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: nameSz, letterSpacing: "1px", color: awayWin ? GREEN : "#c0d8f0", textAlign: "center", lineHeight: 1.1 }}>{match.away}</span>
      </div>
    </div>
  );
}

// ============================================================
// RESULTADOS REALES
// ============================================================
function ResultsView({ matches }) {
  const [viewMode, setViewMode] = useState("day"); // "day" | "group"
  const [g, setG] = useState("A");
  const activeDayRef = useRef(null);

  // Resultados de eliminatoria (para mostrar el cuadro por días)
  const [koResults, setKoResults] = useState([]);
  const loadKo = async () => {
    const { data } = await supabase.from("knockout_results").select("*");
    setKoResults(data || []);
  };
  useEffect(() => {
    loadKo();
    const ch = supabase.channel("ko_results_results_view")
      .on("postgres_changes", { event: "*", schema: "public", table: "knockout_results" }, loadKo)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  // Grupos + eliminatoria juntos para la vista por días
  const koFixtures = buildKnockoutFixtures(matches, koResults);
  const allMatches = [...matches, ...koFixtures];

  // Días disponibles (ordenados)
  const days = [...new Set(allMatches.map(m => m.match_date))].sort();

  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultDay = days.includes(todayStr)
    ? todayStr
    : (days.find(d => d >= todayStr) || days[days.length - 1] || null);

  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const currentDay = selectedDay || defaultDay;
  // ⬇️ Centra automáticamente el día seleccionado en la barra horizontal
  useEffect(() => {
    if (viewMode === "day" && activeDayRef.current) {
      activeDayRef.current.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    }
  }, [currentDay, viewMode]);

  const dayMatches = allMatches
    .filter(m => m.match_date === currentDay)
    .sort((a, b) => (a.match_time || "").localeCompare(b.match_time || ""));

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RESULTADOS REALES</p>

      {/* Selector modo */}
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(0,0,0,0.35)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "day", label: "📅 Por día" }, { id: "group", label: "⚽ Por grupo" }].map(opt => (
          <button key={opt.id} onClick={() => setViewMode(opt.id)} style={{
            flex: 1, padding: "9px", border: "none", borderRadius: "6px", cursor: "pointer",
            fontSize: "11px", letterSpacing: "2px", fontFamily: "'Inter', sans-serif", textTransform: "uppercase",
            background: viewMode === opt.id ? GREEN : "transparent",
            color: viewMode === opt.id ? "#0a1628" : "#e0eefa", fontWeight: 700,
          }}>{opt.label}</button>
        ))}
      </div>

      {/* ===== POR DÍA ===== */}
      {viewMode === "day" && (
        <>
          {/* Selector de días */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
            {days.map(day => {
              const isToday = day === todayStr;
              const sel = currentDay === day;
              return (
                <button key={day} ref={sel ? activeDayRef : null} onClick={() => setSelectedDay(day)} style={{
                  padding: "7px 12px",
                  border: `1px solid ${sel ? GREEN : BORDER}`,
                  borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap",
                  background: sel ? GREEN_DIM : CARD,
                  color: sel ? GREEN : "#a8d4f0",
                  fontFamily: "'Inter', sans-serif", fontSize: "11px", flexShrink: 0,
                  position: "relative",
                }}>
                  {formatDate(day)}
                  {isToday && (
                    <span style={{
                      position: "absolute", top: "-4px", right: "-4px",
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: GREEN, border: "1px solid #0a1628",
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Partidos del día */}
          {dayMatches.length === 0 ? (
            <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "20px 0" }}>
              No hay partidos este día
            </p>
          ) : (
            dayMatches.map(m => (
              <div key={m.id} style={{ background: CARD, border: `1px solid ${m.ko ? "rgba(255,213,79,0.3)" : BORDER}`, borderRadius: "10px", marginBottom: "6px", overflow: "hidden", opacity: m.result_home !== null ? 1 : 0.6 }}>
                {m.ko && (
                  <div style={{ fontSize: "8px", color: "#ffd54f", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", textAlign: "center", padding: "6px 0 0" }}>
                    🏆 {m.roundLabel?.toUpperCase()} · {m.id}
                  </div>
                )}
                <StadiumScore match={m} />
              </div>
            ))
          )}
        </>
      )}

      {/* ===== POR GRUPO ===== */}
      {viewMode === "group" && (() => {
        const played = matches.filter(m => m.grp === g && m.result_home !== null);
        const pending = matches.filter(m => m.grp === g && m.result_home === null);
        return (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {Object.keys(GROUPS).map(gr => <button key={gr} onClick={() => setG(gr)} style={{ width: "40px", height: "40px", border: `1px solid ${g === gr ? GREEN : BORDER}`, borderRadius: "8px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "18px", background: g === gr ? GREEN_DIM : CARD, color: g === gr ? GREEN : "#e0eefa" }}>{gr}</button>)}
            </div>
            <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.1)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "7px", background: GREEN_DIM, border: "1px solid rgba(79,195,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{g}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "17px", color: "#e0eaf8" }}>GRUPO {g} — REAL</div>
                  <div style={{ display: "flex", gap: "5px", marginTop: "3px" }}>{GROUPS[g].map(t => <span key={t.name} style={{ fontSize: "15px" }} title={t.name}>{t.flag}</span>)}</div>
                </div>
              </div>
              <StandingTable standings={calcRealStandings(g, matches)} />
              {played.length > 0 && (
                <div style={{ marginTop: "18px" }}>
                  <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "8px" }}>JUGADOS</p>
                  {played.map(m => (
                    <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", marginBottom: "6px", overflow: "hidden" }}>
                      <StadiumScore match={m} />
                    </div>
                  ))}
                </div>
              )}
              {pending.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "8px" }}>PENDIENTES</p>
                  {pending.map(m => (
                    <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", marginBottom: "6px", overflow: "hidden", opacity: 0.6 }}>
                      <StadiumScore match={m} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      })()}
    </div>
  );
}
// ============================================================
// COMUNIDAD
// ============================================================
function SpecialPredictionsTableCollapsible({ currentUserId }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "16px" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "10px 14px",
          border: `1px solid ${open ? GREEN : BORDER}`,
          borderRadius: open ? "10px 10px 0 0" : "10px",
          background: open ? GREEN_DIM : CARD,
          color: open ? GREEN : "#d0e4f7",
          fontFamily: "'Inter', sans-serif", fontSize: "10px",
          cursor: "pointer", letterSpacing: "2px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
        <span>🏅 PRONÓSTICOS ESPECIALES</span>
        <span style={{ fontSize: "12px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          border: `1px solid ${GREEN}`,
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
        }}>
          <SpecialPredictionsTable currentUserId={currentUserId} />
        </div>
      )}
    </div>
  );
}

function CommunityQualifiers({ matches, currentUserId }) {
  const [open, setOpen] = useState(false);
  const [allPreds, setAllPreds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!open || allPreds.length > 0) return;
    (async () => {
      const { data: preds } = await supabase.from("predictions").select("*").range(0, 99999);
      const { data: profs } = await supabase.from("profiles").select("*").eq("role", "user");
      setAllPreds(preds || []);
      setProfiles((profs || []).sort((a, b) => (a.name || "").localeCompare(b.name || "")));
      setSelectedUser(currentUserId);
      setLoading(false);
    })();
  }, [open]);

  const standingsByGroup = (uid) => {
    const predMap = {};
    allPreds.filter(p => p.user_id === uid).forEach(p => { predMap[p.match_id] = p; });
    const sb = {};
    Object.keys(GROUPS).forEach(g => { sb[g] = calcPersonalStandings(g, matches, predMap); });
    return sb;
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "10px 14px",
          border: `1px solid ${open ? GREEN : BORDER}`,
          borderRadius: open ? "10px 10px 0 0" : "10px",
          background: open ? GREEN_DIM : CARD,
          color: open ? GREEN : "#d0e4f7",
          fontFamily: "'Inter', sans-serif", fontSize: "10px",
          cursor: "pointer", letterSpacing: "2px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
        <span>✅ CLASIFICADOS DE TODOS</span>
        <span style={{ fontSize: "12px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          border: `1px solid ${GREEN}`, borderTop: "none",
          borderRadius: "0 0 10px 10px", padding: "14px", background: CARD,
        }}>
          {loading ? (
            <SkeletonRows count={3} height={40} />
          ) : (
            <>
              <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginBottom: "10px", lineHeight: 1.5 }}>
                Elige un participante para ver a quién clasifica según sus pronósticos.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                {profiles.map(p => {
                  const sel = selectedUser === p.id;
                  return (
                    <button key={p.id} onClick={() => setSelectedUser(p.id)} style={{
                      padding: "7px 12px",
                      border: `1px solid ${sel ? GREEN : BORDER}`,
                      borderRadius: "8px",
                      background: sel ? GREEN_DIM : "rgba(255,255,255,0.02)",
                      color: sel ? GREEN : "#a8d4f0",
                      fontFamily: "'Inter', sans-serif", fontSize: "11px", cursor: "pointer",
                    }}>
                      {p.id === currentUserId ? `${p.name} (tú)` : p.name}
                    </button>
                  );
                })}
              </div>
              {selectedUser && <QualifiersTable standingsByGroup={standingsByGroup(selectedUser)} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CommunityView({ matches, user }) {
  const [viewMode, setViewMode] = useState("day");
  const [selectedDay, setSelectedDay] = useState(null);
  const activeDayRef = useRef(null);
  const [allPreds, setAllPreds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [koResults, setKoResults] = useState([]);
  const [koPicks, setKoPicks] = useState([]);
  const [koLocks, setKoLocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: preds } = await supabase.from("predictions").select("*").range(0, 99999);
      const { data: profs } = await supabase.from("profiles").select("*");
      const { data: kr } = await supabase.from("knockout_results").select("*");
      const { data: kp } = await supabase.from("knockout_picks").select("*").range(0, 99999);
      const { data: kl } = await supabase.from("knockout_locks").select("*");
      setAllPreds(preds || []); setProfiles(profs || []);
      setKoResults(kr || []); setKoPicks(kp || []); setKoLocks(kl || []);
      setLoading(false);
    })();
  }, []);

  const getName = id => profiles.find(p => p.id === id)?.name || "Usuario";
  const koFixtures = buildKnockoutFixtures(matches, koResults);
  // Puntos de eliminatoria por usuario y por partido (mismo cálculo que el ranking)
  const koByGroup = {};
  Object.keys(GROUPS).forEach(g => { koByGroup[g] = calcRealStandings(g, matches); });
  const koReal = koPicksMap(koResults);
  const koBreakdownByUser = {};
  (profiles || []).forEach(p => {
    const up = koPicksMap(koPicks.filter(x => x.user_id === p.id));
    koBreakdownByUser[p.id] = calcKnockoutBreakdownByMatch(up, koReal, koByGroup);
  });
  const koLockMap = {};
  (koLocks || []).forEach(l => { koLockMap[l.id] = l.locked; });
  // Un cruce se muestra cuando el admin lo ha CERRADO o ya tiene resultado real.
  const koShown = koFixtures.filter(f => koLockMap[f.id] || f.result_home !== null);
  const closedMatches = [
    ...matches.filter(m => m.status === "closed" || m.result_home !== null),
    ...koShown,
  ];
  // Solo días que tienen al menos un partido cerrado (con pronósticos visibles)
  const days = [...new Set(closedMatches.map(m => m.match_date))].sort();

  // Día por defecto: hoy si tiene partidos cerrados; si no, el más cercano hacia
  // adelante; y si todo es pasado, el último.
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultDay = days.includes(todayStr)
    ? todayStr
    : (days.find(d => d >= todayStr) || days[days.length - 1] || null);

  const currentDay = selectedDay || defaultDay;
  const matchesByDay = day => closedMatches.filter(m => m.match_date === day);
  // ⬇️ Centra automáticamente el día seleccionado en la barra horizontal
  useEffect(() => {
    if (viewMode === "day" && activeDayRef.current) {
      activeDayRef.current.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    }
  }, [currentDay, viewMode, loading]);

  const renderKnockoutPreds = m => {
    const mPicks = koPicks.filter(p => p.match_id === m.id);
    const sortByName = (a, b) => getName(a.user_id).localeCompare(getName(b.user_id));

    // Cada usuario puede tener un cruce distinto en su cuadro: agrupamos por
    // el equipo que cree que pasa (guardado en p.winner).
    const groups = {};
    mPicks.forEach(p => {
      const adv = p.winner
        || (p.home_goals > p.away_goals ? m.home : p.away_goals > p.home_goals ? m.away : "—");
      (groups[adv] = groups[adv] || []).push(p);
    });

    const ptsBadge = (bd) => {
      if (!bd) return null; // cruce real aún sin resultado
      const advLabel = m.id === "M104" ? "🏆 +10" : "✅ +5";
      const markerLabel = bd.marker === 5 ? "🎯 +5" : bd.marker === 3 ? "📏 +3" : bd.marker === 1 ? "✓ +1" : null;
      const chip = (txt, bg, col) => (
        <span style={{ padding: "2px 7px", borderRadius: "10px", fontSize: "10px", fontFamily: "'Inter', sans-serif", fontWeight: 700, background: bg, color: col, whiteSpace: "nowrap" }}>{txt}</span>
      );
      return (
        <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {bd.advanced && chip(advLabel, "rgba(52,211,153,0.14)", "#34d399")}
          {markerLabel && chip(markerLabel,
            bd.marker === 5 ? GREEN_DIM : bd.marker === 3 ? "rgba(79,195,247,0.08)" : "rgba(255,193,7,0.1)",
            bd.marker === 5 ? GREEN : bd.marker === 3 ? "#4fc3f7" : "#ffd54f")}
          {!bd.advanced && bd.marker === 0 && chip("✗ +0", "rgba(255,82,82,0.08)", "#cc2222")}
        </span>
      );
    };

    const predRow = (pred) => {
      const isMe = pred.user_id === user.id;
      const bd = koBreakdownByUser[pred.user_id]?.[m.id];
      return (
        <div key={pred.id ?? (pred.match_id + pred.user_id)} style={{
          display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px",
          background: isMe ? GREEN_DIM : "rgba(255,255,255,0.02)",
          border: isMe ? "1px solid rgba(79,195,247,0.3)" : "1px solid transparent",
          borderLeft: isMe ? `3px solid ${GREEN}` : "3px solid transparent",
          borderRadius: "6px", marginBottom: "3px",
        }}>
          <span style={{ fontSize: "12px", color: isMe ? GREEN : "#c0d8f0", fontFamily: "'Inter', sans-serif", flex: 1, fontWeight: isMe ? 700 : 400, display: "flex", alignItems: "center", gap: "4px" }}>
            {isMe && <span style={{ fontSize: "9px", color: GREEN }}>▶</span>}
            {getName(pred.user_id)}
          </span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#e0eefa" }}>
            {pred.home_goals}-{pred.away_goals}
          </span>
          {ptsBadge(bd)}
        </div>
      );
    };

    const bloque = (teamName, lista, accent) => {
      if (!lista.length) return null;
      const t = getTeam(teamName);
      return (
        <div key={teamName} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
            <span style={{ fontSize: "15px" }}>{teamName === "—" ? "🤝" : t.flag}</span>
            <span style={{ fontSize: "9px", color: accent, fontFamily: "'Inter', sans-serif", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase" }}>
              {teamName === "—" ? "Sin definir" : `Pasa ${teamName}`}
            </span>
            <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>· {lista.length}</span>
            <div style={{ flex: 1, height: "1px", background: accent, opacity: 0.3 }} />
          </div>
          {lista.sort(sortByName).map(predRow)}
        </div>
      );
    };

    const ordered = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
    const palette = [GREEN, "#4fc3f7", "#34d399", "#ffd54f", "#ff8a5b", "#c084fc"];

    return (
      <div key={m.id} style={{ position: "relative", background: CARD, border: `1px solid rgba(255,213,79,0.3)`, borderRadius: "10px", padding: "12px", marginBottom: "8px" }}>
        <div style={{ margin: "-12px -12px 0", borderBottom: `1px solid ${BORDER}` }}>
          <StadiumScore match={m} compact />
        </div>
        <div style={{ fontSize: "8px", color: "#ffd54f", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", textAlign: "center", padding: "6px 0 8px" }}>
          🏆 {m.roundLabel?.toUpperCase()} · {m.id}
        </div>
        {mPicks.length === 0 ? (
          <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>Nadie ha pronosticado</p>
        ) : (
          ordered.map(([name, list], i) => bloque(name, list, palette[i % palette.length]))
        )}
        <MatchChat match={m} user={user} />
      </div>
    );
  };


  const renderMatchPreds = m => {
  if (m.ko) return renderKnockoutPreds(m);
  const matchPreds = allPreds.filter(p => p.match_id === m.id);
  const ht = getTeam(m.home), at = getTeam(m.away);
  
  // Agrupar por signo del pronóstico
  const local = [], empate = [], visitante = [];
  matchPreds.forEach(p => {
    if (p.predicted_home > p.predicted_away) local.push(p);
    else if (p.predicted_home < p.predicted_away) visitante.push(p);
    else empate.push(p);
  });

  // --- LÓGICA DE ORDENACIÓN ALFABÉTICA ---
  const sortByName = (a, b) => getName(a.user_id).localeCompare(getName(b.user_id));
  
  local.sort(sortByName);
  empate.sort(sortByName);
  visitante.sort(sortByName);
  // ---------------------------------------

  const predRow = (pred) => {
    const isMe = pred.user_id === user.id;
    return (
      <div key={pred.id} style={{
        display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px",
        background: isMe ? GREEN_DIM : "rgba(255,255,255,0.02)",
        border: isMe ? "1px solid rgba(79,195,247,0.3)" : "1px solid transparent",
        borderLeft: isMe ? `3px solid ${GREEN}` : "3px solid transparent",
        borderRadius: "6px", marginBottom: "3px",
      }}>
        <span style={{ fontSize: "12px", color: isMe ? GREEN : "#c0d8f0", fontFamily: "'Inter', sans-serif", flex: 1, fontWeight: isMe ? 700 : 400, display: "flex", alignItems: "center", gap: "4px" }}>
          {isMe && <span style={{ fontSize: "9px", color: GREEN }}>▶</span>}
          {getName(pred.user_id)}
        </span>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#e0eefa" }}>
          {pred.predicted_home}-{pred.predicted_away}
        </span>
        {pred.points !== null && pred.points !== undefined && (
          <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontFamily: "'Inter', sans-serif", fontWeight: 700, background: pred.points === 5 ? GREEN_DIM : pred.points === 3 ? "rgba(79,195,247,0.08)" : pred.points === 1 ? "rgba(255,193,7,0.1)" : "rgba(255,82,82,0.08)", color: pred.points === 5 ? GREEN : pred.points === 3 ? "#4fc3f7" : pred.points === 1 ? "#ffd54f" : "#cc2222" }}>
            {pred.points === 5 ? "🎯 +5" : pred.points === 3 ? "📏 +3" : pred.points === 1 ? "✓ +1" : "✗ +0"}
          </span>
        )}
      </div>
    );
  };

  const bloque = (icono, titulo, lista, accent) => {
    if (lista.length === 0) return null;
    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
          <span style={{ fontSize: "15px" }}>{icono}</span>
          <span style={{ fontSize: "9px", color: accent, fontFamily: "'Inter', sans-serif", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase" }}>{titulo}</span>
          <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>· {lista.length}</span>
          <div style={{ flex: 1, height: "1px", background: accent, opacity: 0.3 }} />
        </div>
        {lista.map(predRow)}
      </div>
    );
  };

  return (
    <div key={m.id} style={{ position: "relative", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px", marginBottom: "8px" }}>
      <div style={{ margin: "-12px -12px 8px", borderBottom: `1px solid ${BORDER}` }}>
        <StadiumScore match={m} compact />
      </div>
      {matchPreds.length === 0 ? (
        <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>Nadie ha enviado pronóstico</p>
      ) : (
        <>
          {bloque(ht.flag, `Gana ${m.home}`, local, GREEN)}
          {bloque("🤝", "Empate", empate, "#ffd54f")}
          {bloque(at.flag, `Gana ${m.away}`, visitante, "#4fc3f7")}
        </>
      )}
      <MatchChat match={m} user={user} />
    </div>
  );
};

  if (loading) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SkeletonRows count={4} height={90} />
    </div>
  );
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
    <SpecialPredictionsTableCollapsible currentUserId={user.id} />
    <CommunityQualifiers matches={matches} currentUserId={user.id} />
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>PRONÓSTICOS DE TODOS</p>
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(0,0,0,0.35)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "day", label: "Por día" }, { id: "all", label: "Todos" }].map(opt => <button key={opt.id} onClick={() => setViewMode(opt.id)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", background: viewMode === opt.id ? GREEN : "transparent", color: viewMode === opt.id ? "#0a1628" : "#e0eefa", fontWeight: 700 }}>{opt.label}</button>)}
      </div>
      {viewMode === "day" && (
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
          {days.map(day => {
            const hasClosed = closedMatches.some(m => m.match_date === day);
            return <button key={day} ref={currentDay === day ? activeDayRef : null} onClick={() => setSelectedDay(day)} disabled={!hasClosed} style={{ padding: "7px 12px", border: `1px solid ${currentDay === day ? GREEN : BORDER}`, borderRadius: "8px", cursor: hasClosed ? "pointer" : "default", whiteSpace: "nowrap", background: currentDay === day ? GREEN_DIM : CARD, color: currentDay === day ? GREEN : hasClosed ? "#a8d4f0" : "#7ab8e0", fontFamily: "'Inter', sans-serif", fontSize: "11px", flexShrink: 0, opacity: hasClosed ? 1 : 0.4 }}>{formatDate(day)}</button>;
          })}
        </div>
      )}
      {viewMode === "day"
        ? matchesByDay(currentDay).length === 0 ? <EmptyState emoji="⚽" title="TODAVÍA NADA QUE VER" text="Aquí aparecerán los pronósticos de todos los participantes en cuanto empiece el Mundial." /> : matchesByDay(currentDay).map(m => renderMatchPreds(m))
        : closedMatches.length === 0 ? <EmptyState emoji="⚽" title="TODAVÍA NADA QUE VER" text="Aquí aparecerán los pronósticos de todos los participantes en cuanto empiece el Mundial." /> : days.map(day => { const dm = matchesByDay(day); if (!dm.length) return null; return <div key={day} style={{ marginBottom: "20px" }}><p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "10px" }}>📅 {formatDate(day)}</p>{dm.map(m => renderMatchPreds(m))}</div>; })
      }
    </div>
  );
}

// ============================================================
// GRÁFICAS SVG (sin librerías)
// ============================================================
function DonutChart({ data, size = 150, thickness = 24 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {total === 0 ? (
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />
        ) : data.map((d, i) => {
          if (d.value === 0) return null;
          const len = (d.value / total) * circ;
          const seg = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={d.color} strokeWidth={thickness} strokeLinecap="butt"
              strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} />
          );
          offset += len;
          return seg;
        })}
      </g>
    </svg>
  );
}

function MiniAreaChart({ points, width = 320, height = 130, color = GREEN }) {
  if (!points || points.length < 2) {
    return <p style={{ fontSize: "10px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "20px 0" }}>Necesitas al menos 2 partidos evaluados para ver tu evolución</p>;
  }
  const pad = 6;
  const maxY = Math.max(...points.map(p => p.y), 1);
  const stepX = (width - pad * 2) / (points.length - 1);
  const coords = points.map((p, i) => ({
    x: pad + i * stepX,
    y: height - pad - (p.y / maxY) * (height - pad * 2),
  }));
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${height - pad} L ${coords[0].x.toFixed(1)} ${height - pad} Z`;
  const last = coords[coords.length - 1];
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="3.5" fill={color} />
    </svg>
  );
}

// ============================================================
// PERFIL DE USUARIO
// ============================================================
function ProfileView({ user, matches, viewProfileId, onClearProfile }) {
  const [myPreds, setMyPreds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [allPreds, setAllPreds] = useState([]);
  const [compareWith, setCompareWith] = useState(null);
  const [tab, setTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [emoji, setEmoji] = useState(user.emoji || "⚽");
  const [editingEmoji, setEditingEmoji] = useState(false);
  const [emojiInput, setEmojiInput] = useState(user.emoji || "⚽");
  const [savingEmoji, setSavingEmoji] = useState(false);
  const targetId = viewProfileId || user.id;
  const isOwnProfile = targetId === user.id;
  const [special, setSpecial] = useState(null);
  const [koPicks, setKoPicks] = useState([]);
  const [koResults, setKoResults] = useState([]);
  
  const saveEmoji = async () => {
    setSavingEmoji(true);
    const newEmoji = emojiInput.trim().slice(0, 2) || "⚽"; // max 1 emoji
    await supabase.from("profiles").update({ emoji: newEmoji }).eq("id", user.id);
    setEmoji(newEmoji);
    setEditingEmoji(false);
    setSavingEmoji(false);
  };

  useEffect(() => {
    (async () => {
      const { data: mp } = await supabase.from("predictions").select("*").range(0, 99999).eq("user_id", targetId);
      const { data: profs } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: ap } = await supabase.from("predictions").select("*").range(0, 99999);
      const { data: sp } = await supabase.from("special_predictions").select("*").eq("user_id", targetId).single();
      const { data: kp } = await supabase.from("knockout_picks").select("*").range(0, 99999).eq("user_id", targetId);
      const { data: kr } = await supabase.from("knockout_results").select("*");
      setMyPreds(mp || []); setProfiles(profs || []); setAllPreds(ap || []);
      setSpecial(sp || null); setKoPicks(kp || []); setKoResults(kr || []);
      setLoading(false);
    })();
  }, [targetId]);

  if (loading) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div className="skeleton" style={{ width: "56px", height: "56px", borderRadius: "50%" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className="skeleton" style={{ width: "50%", height: "16px" }} />
          <div className="skeleton" style={{ width: "70%", height: "10px" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "78px", borderRadius: "10px" }} />)}
      </div>
      <SkeletonRows count={2} height={120} />
    </div>
  );

  const targetProfile = isOwnProfile ? user : (profiles.find(p => p.id === targetId) || user);
  const evaluated = myPreds.filter(p => p.points !== null);
  const total = evaluated.reduce((s, p) => s + p.points, 0);
  const exactos = evaluated.filter(p => p.points === 5).length;
  const difGoles = evaluated.filter(p => p.points === 3).length;
  const parciales = evaluated.filter(p => p.points === 1).length;
  const fallos = evaluated.filter(p => p.points === 0).length;
  const pctExactos = evaluated.length ? Math.round((exactos / evaluated.length) * 100) : 0;

  // Mejor grupo
  const byGroup = {};
  Object.keys(GROUPS).forEach(g => { byGroup[g] = { pts: 0, count: 0 }; });
  evaluated.forEach(p => {
    const m = matches.find(x => x.id === p.match_id);
    if (m) { byGroup[m.grp].pts += p.points; byGroup[m.grp].count++; }
  });
  const bestGroup = Object.entries(byGroup).filter(([, v]) => v.count > 0).sort((a, b) => b[1].pts - a[1].pts)[0];
  // Desglose de puntos (mismo cálculo que el ranking)
  const predMapTarget = {};
  myPreds.forEach(p => { predMapTarget[p.match_id] = p; });
  const groupPts = total; // suma de la fase de grupos (predicciones evaluadas)
  const qualPts = calcQualifierPoints(matches, predMapTarget);
  const specialPts = special ? (special.top_scorer_points || 0) + (special.best_player_points || 0) : 0;
  const koByGroupTarget = {};
  Object.keys(GROUPS).forEach(g => { koByGroupTarget[g] = calcRealStandings(g, matches); });
  const koPts = calcKnockoutPoints(koPicksMap(koPicks), koPicksMap(koResults), koByGroupTarget);
  const grandTotal = groupPts + qualPts + specialPts + koPts;

  // Comparativa
  const otherPreds = compareWith ? allPreds.filter(p => p.user_id === compareWith) : [];
  const otherEval = otherPreds.filter(p => p.points !== null);
  const otherTotal = otherEval.reduce((s, p) => s + p.points, 0);

  const commonMatches = matches.filter(m => {
    const mine = myPreds.find(p => p.match_id === m.id && p.points !== null);
    const theirs = otherPreds.find(p => p.match_id === m.id && p.points !== null);
    return mine && theirs;
  });

  const statCard = (label, value, sub, color = GREEN) => (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px 10px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", marginTop: "3px", letterSpacing: "1px" }}>{label}</div>
      {sub && <div style={{ fontSize: "8px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginTop: "2px" }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
    {!isOwnProfile && (
        <button onClick={onClearProfile} style={{ marginBottom: "16px", padding: "6px 12px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#c0d8f0", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
          ← Volver
        </button>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
  <div style={{ position: "relative" }}>
    <div style={{
      width: "56px", height: "56px", borderRadius: "50%",
      background: GREEN_DIM, border: `1px solid rgba(79,195,247,0.3)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "28px", cursor: "pointer",
    }} onClick={() => { if (isOwnProfile) { setEditingEmoji(true); setEmojiInput(emoji); } }}>
      {isOwnProfile ? emoji : (targetProfile.emoji || "⚽")}
    </div>
    {isOwnProfile && (
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: "18px", height: "18px", borderRadius: "50%",
        background: GREEN, border: "2px solid #0a1628",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "9px", cursor: "pointer",
      }} onClick={() => { setEditingEmoji(true); setEmojiInput(emoji); }}>
        ✏️
      </div>
    )}
  </div>
  <div>
    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#e0eaf8", letterSpacing: "1px" }}>{targetProfile.name}</div>
    <div style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif" }}>{myPreds.length} pronósticos enviados · {evaluated.length} evaluados</div>
  </div>
</div>

{/* Modal editar emoji */}
{editingEmoji && (
  <div style={{
    position: "fixed", inset: 0, zIndex: 300,
    background: "rgba(0,0,0,0.7)", display: "flex",
    alignItems: "center", justifyContent: "center", padding: "20px",
  }} onClick={() => setEditingEmoji(false)}>
    <div style={{
      background: "#0f1c2e", border: `1px solid ${GREEN}`,
      borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "320px",
    }} onClick={e => e.stopPropagation()}>
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "14px" }}>
        TU EMOJI
      </p>
      <div style={{ textAlign: "center", fontSize: "64px", marginBottom: "16px", lineHeight: 1 }}>
        {emojiInput || "⚽"}
      </div>
      <input
        value={emojiInput}
        onChange={e => setEmojiInput(e.target.value)}
        placeholder="Escribe un emoji..."
        maxLength={4}
        style={{
          ...inputSt,
          fontSize: "28px", textAlign: "center",
          letterSpacing: "6px", marginBottom: "16px",
        }}
        autoFocus
      />
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px", justifyContent: "center" }}>
        {["⚽","🏆","🥅","🔥","💀","🎯","😎","🦁","🐉","🤙","💪","🧠","👑","🌟","🚀","❤️","🍺","🎉","🤞","⚡"].map(e => (
          <button key={e} onClick={() => setEmojiInput(e)} style={{
            fontSize: "22px", padding: "6px 8px",
            border: `1px solid ${emojiInput === e ? GREEN : BORDER}`,
            borderRadius: "8px",
            background: emojiInput === e ? GREEN_DIM : "transparent",
            cursor: "pointer",
          }}>{e}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => setEditingEmoji(false)} style={{
          flex: 1, padding: "11px", border: `1px solid ${BORDER}`,
          borderRadius: "8px", background: "transparent",
          color: "#d0e4f7", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer",
        }}>Cancelar</button>
        <button onClick={saveEmoji} disabled={savingEmoji} style={{
          flex: 2, padding: "11px", border: "none",
          borderRadius: "8px", background: GREEN,
          color: "#0a1628", fontFamily: "'Inter', sans-serif",
          fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "2px",
        }}>{savingEmoji ? "..." : "GUARDAR"}</button>
      </div>
    </div>
  </div>
)}

      {/* DESGLOSE DE PUNTOS — siempre visible */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "12px" }}>
          DESGLOSE DE PUNTOS {isOwnProfile ? "· TUYOS" : ""}
        </p>
        {[
          { label: "⚽ Fase de grupos", value: groupPts, color: GREEN },
          { label: "✅ Países clasificados", value: qualPts, color: "#34d399" },
          { label: "🏟️ Eliminatorias", value: koPts, color: "#4fc3f7" },
          { label: "🏅 Especiales", value: specialPts, color: "#ffd54f" },
        ].map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: "12px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{r.label}</span>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: r.value > 0 ? r.color : "#7ab8e0" }}>{r.value > 0 ? `+${r.value}` : "0"}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0" }}>
          <span style={{ fontSize: "13px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: "1px" }}>TOTAL</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "34px", color: GREEN, lineHeight: 1 }}>{grandTotal}</span>
        </div>
      </div>

      <div style={{ display: "flex", marginBottom: "20px", background: "rgba(0,0,0,0.35)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "stats", label: "Estadísticas" }, { id: "preds", label: "Pronósticos" }, { id: "compare", label: "Comparar" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", background: tab === t.id ? GREEN : "transparent", color: tab === t.id ? "#0a1628" : "#e0eefa", fontWeight: 700 }}>{t.label}</button>
        ))}
      </div>

      {tab === "stats" && (() => {
        // Reparto de aciertos para el donut
        const distData = [
          { label: "Exactos", value: exactos, color: "#34d399" },
          { label: "Diferencia", value: difGoles, color: "#4fc3f7" },
          { label: "Signo", value: parciales, color: "#ffd54f" },
          { label: "Fallos", value: fallos, color: "#ff6b4a" },
        ];
      
        // Evolución de puntos acumulados (orden cronológico)
        const cumulative = (() => {
          const withDate = evaluated.map(p => {
            const m = matches.find(x => x.id === p.match_id);
            return { k: (m?.match_date || "") + (m?.match_time || ""), pts: p.points };
          }).filter(x => x.k).sort((a, b) => a.k.localeCompare(b.k));
          let acc = 0;
          return withDate.map((x, i) => ({ x: i, y: (acc += x.pts) }));
        })();
      
        // Mejor racha de aciertos (puntos > 0 seguidos)
        const bestStreak = (() => {
          const chrono = evaluated.map(p => {
            const m = matches.find(x => x.id === p.match_id);
            return { k: (m?.match_date || "") + (m?.match_time || ""), hit: p.points > 0 };
          }).filter(x => x.k).sort((a, b) => a.k.localeCompare(b.k));
          let best = 0, cur = 0;
          chrono.forEach(x => { if (x.hit) { cur++; best = Math.max(best, cur); } else cur = 0; });
          return best;
        })();
      
        const avg = evaluated.length ? (total / evaluated.length).toFixed(1) : "0";
      
        return (
          <>
            {/* Tarjetas principales */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {statCard("PUNTOS", total)}
              {statCard("EXACTOS 🎯", exactos, `${pctExactos}% de éxito`)}
              {statCard("DIFERENCIA 📏", difGoles, null, "#4fc3f7")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {statCard("MEDIA/PARTIDO", avg, "puntos", "#34d399")}
              {statCard("MEJOR RACHA 🔥", bestStreak, "aciertos seguidos", "#ffd54f")}
              {bestGroup ? statCard("MEJOR GRUPO", `Grupo ${bestGroup[0]}`, `${bestGroup[1].pts} pts`) : statCard("MEJOR GRUPO", "-")}
            </div>
      
            {/* Donut: reparto de resultados */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "14px" }}>REPARTO DE TUS PRONÓSTICOS</p>
              {evaluated.length === 0 ? (
                <p style={{ fontSize: "11px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "16px 0" }}>Aún no tienes pronósticos evaluados</p>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <DonutChart data={distData} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "30px", color: "#e0eaf8", lineHeight: 1 }}>{evaluated.length}</span>
                      <span style={{ fontSize: "8px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", letterSpacing: "1px" }}>EVALUADOS</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {distData.map(d => (
                      <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: d.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{d.label}</span>
                        <span style={{ fontSize: "13px", color: "#e0eaf8", fontFamily: "'Bebas Neue', cursive" }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
      
            {/* Evolución de puntos */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>EVOLUCIÓN DE PUNTOS</p>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: GREEN }}>{total} pts</span>
              </div>
              <MiniAreaChart points={cumulative} />
            </div>
      
            {/* Desglose por grupo */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
              <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "12px" }}>DESGLOSE POR GRUPO</p>
              {Object.keys(GROUPS).map(grp => {
                const g = byGroup[grp];
                if (!g.count) return null;
                return (
                  <div key={grp} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: GREEN, minWidth: "20px" }}>{grp}</span>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "3px", height: "5px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, (g.pts / (g.count * 5)) * 100)}%`, background: GREEN, borderRadius: "3px" }} />
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#c0d8f0", minWidth: "40px", textAlign: "right" }}>{g.pts} pts</span>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

        {tab === "preds" && (() => {
        const targetStandings = {};
        Object.keys(GROUPS).forEach(g => { targetStandings[g] = calcPersonalStandings(g, matches, predMapTarget); });

        const ptsBadge = (pts) => {
          const cfg = pts === 5 ? ["🎯 +5", GREEN, GREEN_DIM]
            : pts === 3 ? ["📏 +3", "#4fc3f7", "rgba(79,195,247,0.08)"]
            : pts === 1 ? ["✓ +1", "#ffd54f", "rgba(255,193,7,0.1)"]
            : ["✗ +0", "#cc2222", "rgba(255,82,82,0.08)"];
          return <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontFamily: "'Inter', sans-serif", fontWeight: 700, background: cfg[2], color: cfg[1] }}>{cfg[0]}</span>;
        };

        return (
          <>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "4px" }}>
                {isOwnProfile ? "TUS" : "SUS"} CLASIFICADOS · +{qualPts} PTS
              </p>
              <p style={{ fontSize: "10px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginBottom: "12px", lineHeight: 1.5 }}>
                Equipos que clasifica según sus pronósticos. +2 pts por cada clasificado acertado en su posición.
              </p>
              <QualifiersTable standingsByGroup={targetStandings} />
            </div>

            <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>
              {isOwnProfile ? "TUS" : "SUS"} PREDICCIONES · FASE DE GRUPOS
            </p>
            {Object.keys(GROUPS).map(g => {
              const gms = matches.filter(m => m.grp === g);
              if (!gms.some(m => predMapTarget[m.id])) return null;
              const gPts = gms.reduce((s, m) => {
                const pr = predMapTarget[m.id];
                if (pr && m.result_home !== null) return s + calcPoints(pr, m.result_home, m.result_away);
                return s;
              }, 0);
              return (
                <div key={g} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: GREEN_DIM, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color: GREEN }}>{g}</span>
                    </div>
                    <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", flex: 1 }}>GRUPO {g}</span>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: GREEN }}>{gPts} pts</span>
                  </div>
                  {gms.map(m => {
                    const pred = predMapTarget[m.id];
                    const ht = getTeam(m.home), at = getTeam(m.away);
                    const hasResult = m.result_home !== null && m.result_away !== null;
                    const pts = pred && hasResult ? calcPoints(pred, m.result_home, m.result_away) : null;
                    return (
                      <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", marginBottom: "5px" }}>
                        <span style={{ fontSize: "15px" }}>{ht.flag}</span>
                        <span style={{ flex: 1, fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {m.home} {hasResult && <b style={{ color: "#e0eaf8" }}>{m.result_home}-{m.result_away}</b>} {m.away}
                        </span>
                        <span style={{ fontSize: "15px" }}>{at.flag}</span>
                        <span style={{ fontSize: "11px", color: pred ? "#7ab8e0" : "#506070", fontFamily: "'Inter', sans-serif", minWidth: "30px", textAlign: "center" }}>
                          {pred ? `${pred.predicted_home}-${pred.predicted_away}` : "—"}
                        </span>
                        {pts !== null && ptsBadge(pts)}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        );
      })()}

      {tab === "compare" && (
        <>
          <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "10px" }}>COMPARA CON OTRO JUGADOR</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {profiles.filter(p => p.id !== user.id).map(p => (
              <button key={p.id} onClick={() => setCompareWith(compareWith === p.id ? null : p.id)} style={{ padding: "7px 12px", border: `1px solid ${compareWith === p.id ? GREEN : BORDER}`, borderRadius: "8px", background: compareWith === p.id ? GREEN_DIM : CARD, color: compareWith === p.id ? GREEN : "#a8d4f0", fontFamily: "'Inter', sans-serif", fontSize: "11px", cursor: "pointer" }}>{p.name}</button>
            ))}
          </div>

          {compareWith && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                <div style={{ background: GREEN_DIM, border: "1px solid rgba(79,195,247,0.2)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: GREEN }}>{total}</div>
                  <div style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "'Inter', sans-serif" }}>{user.name?.split(" ")[0]}</div>
                </div>
                <div style={{ textAlign: "center", fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7" }}>VS</div>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eefa" }}>{otherTotal}</div>
                  <div style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "'Inter', sans-serif" }}>{profiles.find(p => p.id === compareWith)?.name?.split(" ")[0]}</div>
                </div>
              </div>

              {commonMatches.length === 0
                ? <p style={{ color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Aún no hay partidos evaluados en común</p>
                : commonMatches.slice(0, 20).map(m => {
                  const mine = myPreds.find(p => p.match_id === m.id);
                  const theirs = otherPreds.find(p => p.match_id === m.id);
                  const ht = getTeam(m.home), at = getTeam(m.away);
                  return (
                    <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "10px 12px", marginBottom: "5px" }}>
                      <div style={{ fontSize: "10px", color: "#cce0f5", fontFamily: "'Inter', sans-serif", textAlign: "center", marginBottom: "6px" }}>{ht.flag} {m.home} vs {at.flag} {m.away} · <span style={{ color: GREEN }}>{m.result_home}-{m.result_away}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ textAlign: "left" }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eefa" }}>{mine?.predicted_home}-{mine?.predicted_away}</span>
                          {mine?.points !== null && <span style={{ marginLeft: "6px", fontSize: "11px", color: mine?.points === 5 ? GREEN : mine?.points === 3 ? "#4fc3f7" : mine?.points === 1 ? "#ffd54f" : "#cc2222" }}>{mine?.points === 5 ? "🎯+5" : mine?.points === 3 ? "📏+3" : mine?.points === 1 ? "✓+1" : "✗+0"}</span>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {theirs?.points !== null && <span style={{ marginRight: "6px", fontSize: "11px", color: theirs?.points === 5 ? GREEN : theirs?.points === 3 ? "#4fc3f7" : theirs?.points === 1 ? "#ffd54f" : "#cc2222" }}>{theirs?.points === 5 ? "🎯+5" : theirs?.points === 3 ? "📏+3" : theirs?.points === 1 ? "✓+1" : "✗+0"}</span>}
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eefa" }}>{theirs?.predicted_home}-{theirs?.predicted_away}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </>
      )}
    </div>
  );
}

// Calcula el ranking actual y guarda una foto de las posiciones
async function saveRankingSnapshot(matches) {
  const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
  const { data: preds } = await supabase.from("predictions").select("*").range(0, 99999);
  const { data: specialPreds } = await supabase.from("special_predictions").select("*");
  const r = (profiles || []).map(p => {
    const myPreds = (preds || []).filter(x => x.user_id === p.id && x.points !== null);
    const predMap = {};
    (preds || []).filter(x => x.user_id === p.id).forEach(x => { predMap[x.match_id] = x; });
    const qualPts = calcQualifierPoints(matches, predMap);
    const mySpecial = (specialPreds || []).find(x => x.user_id === p.id);
    const specialPts = mySpecial ? (mySpecial.top_scorer_points || 0) + (mySpecial.best_player_points || 0) : 0;
    return { id: p.id, total: myPreds.reduce((s, x) => s + (x.points || 0), 0) + qualPts + specialPts };
  }).sort((a, b) => b.total - a.total);
  const at = new Date().toISOString();
  const rows = r.map((u, i) => ({ user_id: u.id, position: i + 1, total: u.total, snapshot_at: at }));
  const { error } = await supabase.from("ranking_history").insert(rows);
  if (error) throw error;
  return rows.length;
}

// Flecha de movimiento
function MoveIndicator({ move, size = 10 }) {
  if (move == null) return <span style={{ fontSize: `${size}px`, color: "#7ab8e0" }}>•</span>;
  if (move === 0) return <span style={{ fontSize: `${size}px`, color: "#7ab8e0" }}>=</span>;
  const up = move > 0;
  return (
    <span style={{ fontSize: `${size}px`, color: up ? "#34d399" : "#ff6b4a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "1px", fontFamily: "'Inter', sans-serif" }}>
      {up ? "▲" : "▼"}{Math.abs(move)}
    </span>
  );
}

// ============================================================
// HISTÓRICO DE POSICIONES (Top 5 + tú) — una línea por jugador,
// un punto por cada foto del ranking (antes de cada partido)
// ============================================================
function RankingHistory({ ranking, user, matches }) {
  const [allPreds, setAllPreds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPreds = async () => {
    const { data } = await supabase.from("predictions").select("*").range(0, 99999);
    setAllPreds(data || []);
    setLoading(false);
  };

  // Recarga al montar y cada vez que cambian los partidos (nuevos resultados)
  useEffect(() => { loadPreds(); }, [matches]);

  // Realtime: recalcula al actualizarse los puntos de las predicciones
  useEffect(() => {
    const ch = supabase
      .channel("ranking_history_realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "predictions" }, loadPreds)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "predictions" }, loadPreds)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  if (loading) {
    return (
      <div style={{ marginTop: "20px" }}>
        <div className="skeleton" style={{ width: "40%", height: "10px", marginBottom: "12px" }} />
        <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "12px" }} />
      </div>
    );
  }

  // ── Fotos del ranking calculadas SOLAS desde los resultados ──
  // 1) Partidos terminados, agrupados por franja horaria, en orden cronológico
  const finished = (matches || []).filter(m => m.result_home !== null && m.result_away !== null);
  const bySlot = {};
  finished.forEach(m => {
    const key = (m.match_date || "") + " " + (m.match_time || "");
    (bySlot[key] = bySlot[key] || []).push(m);
  });
  const slotKeys = Object.keys(bySlot).sort();

  // 2) Acumular puntos partido a partido y fotografiar las posiciones
  const ids = ranking.map(u => u.id);
  const cum = {};
  ids.forEach(id => { cum[id] = 0; });

  const snapshots = slotKeys.map(key => {
    bySlot[key].forEach(m => {
      allPreds.filter(p => p.match_id === m.id).forEach(p => {
        if (cum[p.user_id] != null && p.points != null) cum[p.user_id] += p.points;
      });
    });
    const order = [...ids].sort((a, b) => cum[b] - cum[a]);
    const positions = {};
    order.forEach((id, i) => { positions[id] = i + 1; });
    return { positions };
  });

  // La última foto = ranking en vivo (incluye clasificados y especiales)
  if (snapshots.length) {
    const livePos = {};
    ranking.forEach((u, i) => { livePos[u.id] = i + 1; });
    snapshots[snapshots.length - 1] = { positions: livePos };
  }

  const n = snapshots.length;

  // Jugadores a seguir: Top 5 actual + tú
  const top5 = ranking.slice(0, 5).map(u => u.id);
  const trackedIds = [...new Set([...top5, user.id])];

  const meta = {};
  ranking.forEach((u, i) => { meta[u.id] = { name: u.name, emoji: u.emoji || "⚽", curPos: i + 1 }; });

  if (n < 2) {
    return (
      <div style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>
          EVOLUCIÓN DEL RANKING
        </p>
        <div style={{ background: CARD, border: `1px dashed ${BORDER}`, borderRadius: "12px", padding: "28px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📈</div>
          <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
            La evolución aparecerá cuando haya al menos<br/>dos franjas de partidos terminadas.
          </p>
        </div>
      </div>
    );
  }

  // Máxima posición observada (para escalar el eje Y)
  let maxPos = ranking.length || 1;
  snapshots.forEach(s => Object.values(s.positions).forEach(p => { if (p > maxPos) maxPos = p; }));

  // Paleta para las líneas
  const COLORS = ["#4fc3f7", "#34d399", "#ffd54f", "#ff6b4a", "#c084fc", "#f472b6", "#60a5fa", "#fb923c"];
  const colorFor = (id) => {
    if (id === user.id) return GREEN;
    const idx = trackedIds.filter(t => t !== user.id).indexOf(id);
    return COLORS[idx % COLORS.length];
  };

  // Geometría SVG
  const W = 340, H = 200;
  const pad = { l: 26, r: 12, t: 12, b: 22 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const x = (i) => pad.l + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (pos) => pad.t + (maxPos === 1 ? plotH / 2 : ((pos - 1) / (maxPos - 1)) * plotH);

  // Series por jugador (solo snapshots donde tiene posición)
  const series = trackedIds.map(id => {
    const pts = [];
    snapshots.forEach((s, i) => {
      if (s.positions[id] != null) pts.push({ x: x(i), y: y(s.positions[id]), pos: s.positions[id] });
    });
    return { id, pts, color: colorFor(id), isMe: id === user.id };
  }).filter(s => s.pts.length > 0);

  // Etiquetas eje Y (posiciones)
  const yTicks = [];
  for (let p = 1; p <= maxPos; p++) yTicks.push(p);

  return (
    <div style={{ marginTop: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>
        EVOLUCIÓN DEL RANKING · TOP 5 + TÚ
      </p>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "14px 10px 10px" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
          {/* Gridlines + números de posición */}
          {yTicks.map(p => (
            <g key={p}>
              <line x1={pad.l} y1={y(p)} x2={W - pad.r} y2={y(p)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={pad.l - 6} y={y(p) + 3} textAnchor="end" fontSize="8" fill="#7ab8e0" fontFamily="monospace">{p}</text>
            </g>
          ))}

          {/* Líneas por jugador */}
          {series.map(s => (
            <g key={s.id}>
              <polyline
                points={s.pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
                fill="none" stroke={s.color}
                strokeWidth={s.isMe ? 3 : 1.6}
                strokeLinejoin="round" strokeLinecap="round"
                opacity={s.isMe ? 1 : 0.85}
              />
              {s.pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={s.isMe ? 3 : 2.2} fill={s.color} />
              ))}
            </g>
          ))}
        </svg>

        {/* Leyenda */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${BORDER}` }}>
          {series
            .slice()
            .sort((a, b) => (meta[a.id]?.curPos || 99) - (meta[b.id]?.curPos || 99))
            .map(s => {
              const m = meta[s.id] || {};
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "12px", height: "3px", borderRadius: "2px", background: s.color, display: "inline-block" }} />
                  <span style={{ fontSize: "11px" }}>{m.emoji}</span>
                  <span style={{ fontSize: "11px", color: s.isMe ? GREEN : "#c0d8f0", fontFamily: "'Inter', sans-serif", fontWeight: s.isMe ? 700 : 400 }}>
                    {m.name?.split(" ")[0]}
                  </span>
                  <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Bebas Neue', monospace" }}>#{m.curPos}</span>
                </div>
              );
            })}
        </div>

        <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", marginTop: "8px", textAlign: "center" }}>
          Cada punto es una franja de partidos · arriba = mejor posición
        </p>
      </div>
    </div>
  );
}

// ============================================================
// RANKING
// ============================================================
function RankingView({ matches, user, setView, setViewProfileId }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadRanking = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
    const { data: preds } = await supabase.from("predictions").select("*").range(0, 99999);
    const { data: qpicks } = await supabase.from("qualifier_picks").select("*");
    const { data: specialPreds } = await supabase.from("special_predictions").select("*");
    const { data: koPicks } = await supabase.from("knockout_picks").select("*").range(0, 99999);
    const { data: koResults } = await supabase.from("knockout_results").select("*");
    const koReal = koPicksMap(koResults || []);
    const koByGroup = {};
    Object.keys(GROUPS).forEach(g => { koByGroup[g] = calcRealStandings(g, matches); });
    const r = (profiles || []).map(p => {
      const myPreds = (preds || []).filter(x => x.user_id === p.id && x.points !== null);
      // Clasificados (1º, 2º y mejores terceros) automáticos desde sus pronósticos
      const predMap = {};
      (preds || []).filter(x => x.user_id === p.id).forEach(x => { predMap[x.match_id] = x; });
      const qualPts = calcQualifierPoints(matches, predMap);
      const mySpecial = (specialPreds || []).find(x => x.user_id === p.id);
      const koPts = calcKnockoutPoints(koPicksMap((koPicks || []).filter(x => x.user_id === p.id)), koReal, koByGroup);
      const specialPts = mySpecial
        ? (mySpecial.top_scorer_points || 0) + (mySpecial.best_player_points || 0)
        : 0;
      return {
        ...p,
        total: myPreds.reduce((s, x) => s + (x.points || 0), 0) + qualPts + specialPts + koPts,
        exactos: myPreds.filter(x => x.points === 5).length,
        difGoles: myPreds.filter(x => x.points === 3).length,
        parciales: myPreds.filter(x => x.points === 1).length,
        count: myPreds.length,
        qualPts, specialPts, koPts,
      };
    }).sort((a, b) => b.total - a.total);

    // Posiciones de la última foto guardada
    const { data: snap } = await supabase
      .from("ranking_history")
      .select("user_id, position, snapshot_at")
      .order("snapshot_at", { ascending: false });
    let prevPos = {};
    if (snap && snap.length) {
      const stamps = [...new Set(snap.map(s => s.snapshot_at))];
      const curPos = {};
      r.forEach((u, i) => { curPos[u.id] = i + 1; });
      let chosen = null;
      for (const st of stamps) {
        const snapPos = {};
        snap.filter(s => s.snapshot_at === st).forEach(s => { snapPos[s.user_id] = s.position; });
        const differs = r.some(u => snapPos[u.id] != null && snapPos[u.id] !== curPos[u.id]);
        if (differs) { chosen = snapPos; break; }
      }
      if (chosen) prevPos = chosen;
    }
    const rWithMove = r.map((u, i) => {
      const prev = prevPos[u.id];
      return { ...u, move: prev == null ? null : prev - (i + 1) };
    });

    setRanking(rWithMove);
    setLoading(false);
    setLastUpdated(new Date());
    if (showRefresh) setRefreshing(false);
  };

  useEffect(() => {
    loadRanking();
    const channel = supabase
      .channel("ranking_realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "predictions" }, () => loadRanking())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "predictions" }, () => loadRanking())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "qualifier_picks" }, () => loadRanking())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "special_predictions" }, () => loadRanking())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, () => loadRanking())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ranking_history" }, () => loadRanking())
      .on("postgres_changes", { event: "*", schema: "public", table: "knockout_results" }, () => loadRanking())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const medals = ["🥇", "🥈", "🥉"];
  const formatTime = d => d
    ? `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`
    : "";
  const goToProfile = (id) => {
    setViewProfileId(id === user.id ? null : id);
    setView("profile");
  };

  if (loading) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div className="skeleton" style={{ width: "40%", height: "10px", marginBottom: "20px" }} />
      <SkeletonRanking count={6} />
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>
          RANKING GENERAL
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {lastUpdated && (
            <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>
              🟢 {formatTime(lastUpdated)}
            </span>
          )}
          <button
            onClick={() => loadRanking(true)}
            disabled={refreshing}
            style={{
              padding: "5px 10px", border: `1px solid ${BORDER}`,
              borderRadius: "6px", background: "transparent",
              color: refreshing ? "#7ab8e0" : GREEN,
              fontFamily: "'Inter', sans-serif", fontSize: "10px",
              cursor: refreshing ? "default" : "pointer",
              animation: refreshing ? "pulse 1s infinite" : "none",
            }}>
            {refreshing ? "···" : "↻ Actualizar"}
          </button>
        </div>
      </div>

      {/* ===== PODIO TOP 3 ===== */}
      {ranking.length >= 1 && (() => {
        const PODIUM = [
          { idx: 1, h: 70, color: "#cfd8e3", glow: "rgba(207,216,227,0.4)" },  // plata (izq)
          { idx: 0, h: 96, color: "#ffd54f", glow: "rgba(255,213,79,0.55)" },  // oro (centro)
          { idx: 2, h: 52, color: "#d99a6c", glow: "rgba(217,154,108,0.4)" },  // bronce (der)
        ].filter(p => ranking[p.idx]);
      
        return (
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            gap: "8px", marginBottom: "24px", padding: "8px 0",
          }}>
            {PODIUM.map(({ idx, h, color, glow }) => {
              const u = ranking[idx];
              const isFirst = idx === 0;
              const isMe = user && u.id === user.id;
              return (
                <div key={u.id} onClick={() => goToProfile(u.id)} className="tappable" style={{ flex: 1, maxWidth: "120px", textAlign: "center", cursor: "pointer" }}>
                  {/* Medalla */}
                  <div style={{ fontSize: isFirst ? "30px" : "24px", marginBottom: "4px" }}>
                    {medals[idx]}
                  </div>
                  {/* Avatar emoji */}
                  <div style={{
                    width: isFirst ? "52px" : "44px", height: isFirst ? "52px" : "44px",
                    borderRadius: "50%", margin: "0 auto 6px",
                    background: GREEN_DIM,
                    border: `2px solid ${isMe ? GREEN : color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isFirst ? "26px" : "22px",
                    boxShadow: isMe ? `0 0 18px ${GREEN}` : `0 0 16px ${glow}`,
                  }}>
                    {u.emoji || "⚽"}
                  </div>
                  {/* Nombre */}
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: "11px",
                    color: isMe ? GREEN : "#e0eaf8",
                    fontWeight: isMe ? 700 : 400,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    marginBottom: "6px",
                  }}>
                    {u.name?.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: "8px", color: "#9cc4e6", fontFamily: "'Inter', sans-serif", marginBottom: "6px" }}>
                    🎯{u.exactos} 📏{u.difGoles} ✓{u.parciales}
                  </div>

                  {/* 👇 Movimiento (sube/baja) */}
                  <div style={{ marginBottom: "6px" }}>
                    <MoveIndicator move={u.move} size={10} />
                  </div>

                  {/* Pedestal */}
                  <div style={{
                    height: `${h}px`,
                    background: `linear-gradient(180deg, ${color}22, ${color}08)`,
                    border: `1px solid ${color}55`,
                    borderBottom: "none",
                    borderRadius: "10px 10px 0 0",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    boxShadow: isFirst ? `0 0 22px ${glow}` : "none",
                  }}>
                    <span style={{
                      fontFamily: "'Bebas Neue', cursive",
                      fontSize: isFirst ? "40px" : "30px",
                      color, lineHeight: 1,
                    }}>{u.total}</span>
                    <span style={{ fontSize: "8px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", letterSpacing: "1px" }}>PTS</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
      
      {/* ===== RESTO DE LA TABLA (desde el 4º) ===== */}
      {ranking.slice(3).map((u, i) => {
        const realIdx = i + 3;
        const isMe = user && u.id === user.id;
        return (
          <div key={u.id} onClick={() => goToProfile(u.id)} className="tappable" style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: isMe ? GREEN_DIM : CARD,
            border: `1px solid ${isMe ? GREEN : BORDER}`,
            boxShadow: isMe ? `0 0 14px rgba(79,195,247,0.35)` : "none",
            borderRadius: "10px", padding: "14px 16px", marginBottom: "6px", cursor: "pointer",
          }}>
            <div style={{ minWidth: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <span style={{ fontSize: "16px", fontFamily: "'Bebas Neue', monospace", color: "#7ab8e0" }}>#{realIdx + 1}</span>
              <MoveIndicator move={u.move} size={10} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "18px" }}>{u.emoji || "⚽"}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: isMe ? GREEN : "#e0eaf8", fontWeight: isMe ? 700 : 400 }}>
                  {u.name}
                </span>
              </div>
              <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginTop: "2px" }}>
                🎯 {u.exactos} · 📏 {u.difGoles} · ✓ {u.parciales} · {u.count} total.
                {u.qualPts > 0 ? ` · +${u.qualPts} clas.` : ""}
                {u.specialPts > 0 ? ` · +${u.specialPts} esp.` : ""}
                {u.koPts > 0 ? ` · +${u.koPts} elim.` : ""}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", lineHeight: 1 }}>{u.total}</div>
              <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>PTS</div>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: "16px", padding: "12px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
        <p style={{ color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "10px", lineHeight: 2 }}>
          <span style={{ color: GREEN }}>+5</span> exacto · <span style={{ color: "#4fc3f7" }}>+3</span> ganador + diferencia · <span style={{ color: "#ffd54f" }}>+1</span> signo · <span style={{ color: "#ff6b4a" }}>+0</span> fallo · <span style={{ color: GREEN }}>+2</span> clasificado en su posición
        </p>
      </div>
      <RankingHistory ranking={ranking} user={user} matches={matches} />
    </div>
  );
}

// ============================================================
// PROGRESO DE PARTICIPANTES (nuevo componente)
// ============================================================
function ParticipantProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: preds } = await supabase
        .from("predictions")
        .select("user_id")
        .range(0, 99999);
      const result = (profiles || []).map(p => {
        const count = (preds || []).filter(x => x.user_id === p.id).length;
        const pct = Math.round((count / TOTAL_MATCHES) * 100);
        return { name: p.name, count, pct };
      }).sort((a, b) => b.count - a.count);
      setProgress(result);
      setLoading(false);
    })();
  }, []);

  if (loading) return <SkeletonRows count={5} height={40} />;

  return (
    <div>
      {progress.map((p, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#e0eaf8" }}>{p.name}</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: p.count === TOTAL_MATCHES ? GREEN : "#e0eefa" }}>
              {p.count}/{TOTAL_MATCHES} · {p.pct}%
            </span>
          </div>
          <div style={{ background: "rgba(79,195,247,0.08)", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: p.pct + "%",
              background: p.count === TOTAL_MATCHES
                ? `linear-gradient(90deg,${GREEN},#007a3a)`
                : `linear-gradient(90deg,${GREEN},#005599)`,
              borderRadius: "4px",
              transition: "width 0.5s ease"
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// COMPONENTE: ESTADÍSTICAS DE USO
// ============================================================
function UsageStats() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: usage } = await supabase.from("usage_daily").select("*");
      
      // CORRECCIÓN: Quitamos el .eq("role", "user") para que tú (como admin) 
      // también te puedas ver en la tabla al hacer pruebas.
      const { data: profiles } = await supabase.from("profiles").select("id, name"); 
      
      const byUser = {};
      (usage || []).forEach(u => {
        if (!byUser[u.user_id]) byUser[u.user_id] = { today: 0, total: 0, days: 0 };
        byUser[u.user_id].total += u.seconds;
        byUser[u.user_id].days += 1;
        if (u.day === today) byUser[u.user_id].today += u.seconds;
      });

      const r = (profiles || []).map(p => {
        const u = byUser[p.id] || { today: 0, total: 0, days: 0 };
        return {
          name: p.name,
          today: u.today,
          avg: u.days ? Math.round(u.total / u.days) : 0,
          total: u.total,
        };
      }).sort((a, b) => b.total - a.total);

      setRows(r);
      setLoading(false);
    })();
  }, []);

  const fmt = (s) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60), sec = s % 60;
    if (m < 60) return `${m}m ${sec}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  };

  if (loading) return <SkeletonRows count={5} height={40} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", gap: "6px", padding: "0 12px 4px" }}>
        {["JUGADOR", "HOY", "MEDIA/DÍA", "TOTAL"].map(h => (
          <span key={h} style={{ fontSize: "8px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", letterSpacing: "1px", textAlign: h === "JUGADOR" ? "left" : "right" }}>{h}</span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", gap: "6px", padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{r.name}</span>
          <span style={{ fontSize: "11px", color: GREEN, fontFamily: "'Inter', sans-serif", textAlign: "right" }}>{fmt(r.today)}</span>
          <span style={{ fontSize: "11px", color: "#a8d4f0", fontFamily: "'Inter', sans-serif", textAlign: "right" }}>{fmt(r.avg)}</span>
          <span style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", textAlign: "right" }}>{fmt(r.total)}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ÚLTIMA CONEXIÓN DE USUARIOS
// ============================================================
function UserActivityLog() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatLastSeen = (dateString) => {
    if (!dateString) return "Nunca";
    const d = new Date(dateString);
    // Extraemos si fue hoy para que se lea mejor
    const isToday = new Date().toDateString() === d.toDateString();
    
    const time = d.toLocaleString("es-ES", { hour: "2-digit", minute: "2-digit" }) + "h";
    if (isToday) return `Hoy, ${time}`;
    
    return d.toLocaleString("es-ES", { day: "2-digit", month: "short" }) + `, ${time}`;
  };

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("name, last_seen").eq("role", "user");
      
      // Ordenamos para que los que se conectaron más recientemente salgan arriba
      const sorted = (profiles || []).sort((a, b) => {
        if (!a.last_seen) return 1;
        if (!b.last_seen) return -1;
        return new Date(b.last_seen) - new Date(a.last_seen);
      });
      
      setUsers(sorted);
      setLoading(false);
    })();
  }, []);

  if (loading) return <SkeletonRows count={5} height={40} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {users.map((u, i) => (
        <div key={i} style={{ 
          display: "flex", justifyContent: "space-between", alignItems: "center", 
          padding: "10px 12px", background: "rgba(255,255,255,0.02)", 
          borderRadius: "8px", border: `1px solid ${BORDER}` 
        }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#e0eaf8", fontWeight: 700 }}>
            {u.name}
          </span>
          <span style={{ 
            fontFamily: "'Inter', sans-serif", fontSize: "10px", 
            color: u.last_seen ? GREEN : "#7ab8e0",
            background: u.last_seen ? GREEN_DIM : "transparent",
            padding: "3px 8px", borderRadius: "10px"
          }}>
            {formatLastSeen(u.last_seen)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ADMIN
// ============================================================
function AdminView({ matches, onDataChange }) {
  const [g, setG] = useState("A");
  const [sel, setSel] = useState(null);
  const [hr, setHr] = useState(""); const [ar, setAr] = useState("");
  const [saved, setSaved] = useState(false);
  const [closingAll, setClosingAll] = useState(false);
  const [allClosed, setAllClosed] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [syncingMatches, setSyncingMatches] = useState(false);
  const [confirmSync, setConfirmSync] = useState(false);

  useEffect(() => {
    setAllClosed(matches.length > 0 && matches.every(m => m.status === "closed"));
  }, [matches]);

  const closeAll = async () => {
    setClosingAll(true);
    const ids = matches.filter(m => m.status === "open").map(m => m.id);
    for (const id of ids) await supabase.from("matches").update({ status: "closed" }).eq("id", id);
    setClosingAll(false); setConfirmClose(false);
    onDataChange();
  };

  const syncMatchData = async () => {
    setSyncingMatches(true);
    const { data: dbMatches } = await supabase.from("matches").select("*");
    if (dbMatches) {
      const updates = [];
      for (const m of dbMatches) {
        const local = ALL_MATCHES.find(x => x.id === m.id);
        if (local) {
          updates.push(
            supabase.from("matches").update({
              home: local.home,
              away: local.away,
              match_date: local.match_date,
              match_time: local.match_time,
              grp: local.grp,
              competition: local.competition,
            }).eq("id", m.id)
          );
        }
      }
      await Promise.all(updates);
    }
    setSyncingMatches(false);
    setConfirmSync(false);
    onDataChange();
  };

  
const handleResult = async () => {
    if (hr === "" || ar === "") return;
    const rh = parseInt(hr), ra = parseInt(ar);

    // 📌 Foto del ranking ANTES de recalcular (para las flechas sube/baja)
    try { await saveRankingSnapshot(matches); } catch (e) { console.error("snapshot error", e); }

    await supabase.from("matches").update({
      result_home: rh,
      result_away: ra,
      status: "closed",
      result_source: "manual",
      manual_override: true,
      result_updated_at: new Date().toISOString(),
    }).eq("id", sel);

    // Recalcula los puntos de TODAS las predicciones de este partido en el servidor
    // (salta RLS y no puede deduplicar por marcador).
    const { error } = await supabase.rpc("recalc_match_points", {
      p_match_id: sel, p_rh: rh, p_ra: ra,
    });
    if (error) console.error("recalc error", error);

    setSaved(true); setSel(null); setHr(""); setAr(""); onDataChange();
    setTimeout(() => setSaved(false), 3000);
  };
  const toggleStatus = async m => {
    await supabase.from("matches").update({ status: m.status === "open" ? "closed" : "open" }).eq("id", m.id);
    onDataChange();
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "16px" }}>PANEL DE ADMINISTRACIÓN</p>

      {/* Ultima conexion */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>REGISTRO DE ACTIVIDAD</p>
        <UserActivityLog />
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>⏱️ TIEMPO DE USO</p>
        <UsageStats />
      </div>

      {/* BOTÓN CERRAR TODO */}
      <div style={{ background: CARD, border: "1px solid rgba(255,82,82,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>
          🔒 Cierra todos los pronósticos de golpe al inicio del torneo. Una vez cerrado, los usuarios no podrán modificar sus pronósticos.
        </p>
        {allClosed
          ? <div style={{ padding: "10px", background: "rgba(255,82,82,0.08)", borderRadius: "7px", textAlign: "center" }}><span style={{ color: "#cc4422", fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>🔒 TODOS LOS PRONÓSTICOS ESTÁN CERRADOS</span></div>
          : confirmClose
            ? <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={closeAll} disabled={closingAll} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "7px", background: "#cc2222", color: "white", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>{closingAll ? "Cerrando..." : "⚠️ SÍ, CERRAR TODO"}</button>
              <button onClick={() => setConfirmClose(false)} style={{ padding: "12px 16px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#cce0f5", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer" }}>Cancelar</button>
            </div>
            : <button onClick={() => setConfirmClose(true)} style={{ width: "100%", padding: "12px", border: "1px solid rgba(255,82,82,0.3)", borderRadius: "7px", background: "rgba(255,82,82,0.08)", color: "#cc2222", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer", fontWeight: 700, letterSpacing: "2px" }}>🔒 CERRAR TODOS LOS PRONÓSTICOS</button>
        }
      </div>

      {/* SINCRONIZAR PARTIDOS */}
      <div style={{ background: CARD, border: "1px solid rgba(0,176,255,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>
          🔄 Sincroniza equipos, fechas y horas desde el código sin borrar resultados ni predicciones.
        </p>
        {confirmSync
          ? <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={syncMatchData} disabled={syncingMatches} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "7px", background: "#005599", color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>
                {syncingMatches ? "Sincronizando..." : "✓ SÍ, SINCRONIZAR"}
              </button>
              <button onClick={() => setConfirmSync(false)} style={{ padding: "12px 16px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#cce0f5", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          : <button onClick={() => setConfirmSync(true)} style={{ width: "100%", padding: "12px", border: "1px solid rgba(0,176,255,0.3)", borderRadius: "7px", background: "rgba(0,176,255,0.06)", color: "#005599", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer", fontWeight: 700, letterSpacing: "2px" }}>
              🔄 SINCRONIZAR PARTIDOS (SIN BORRAR RESULTADOS)
            </button>
        }
      </div>

      {/* ADJUDICAR PRONÓSTICOS ESPECIALES */}
      <SpecialLocksAdmin />
      <KnockoutLocksAdmin matches={matches} />
      <SpecialAwardsAdmin />
      <SyncResultsAdmin onDataChange={onDataChange} />
      <SaveRankingSnapshotAdmin matches={matches} />
        
      {saved && <div style={{ padding: "10px 14px", background: GREEN_DIM, border: "1px solid rgba(79,195,247,0.3)", borderRadius: "8px", color: GREEN, fontFamily: "'Inter', sans-serif", fontSize: "12px", marginBottom: "14px" }}>✓ Resultado guardado y puntos calculados</div>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {Object.keys(GROUPS).map(gr => <button key={gr} onClick={() => setG(gr)} style={{ width: "38px", height: "38px", border: `1px solid ${g === gr ? GREEN : BORDER}`, borderRadius: "7px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "17px", background: g === gr ? GREEN_DIM : CARD, color: g === gr ? GREEN : "#e0eefa" }}>{gr}</button>)}
      </div>
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "10px" }}>GRUPO {g}</p>

      {matches.filter(m => m.grp === g).map(m => {
        const ht = getTeam(m.home), at = getTeam(m.away);
        return (
          <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px", marginBottom: "6px" }}>
            <div style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginBottom: "6px" }}>📅 {formatDate(m.match_date)} · ⏰ {m.match_time}h</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ flex: 1, fontSize: "12px", color: "#a8d4f0", fontFamily: "'Inter', sans-serif", minWidth: "150px" }}>{ht.flag} {m.home} vs {at.flag} {m.away}</span>
              <span style={{ fontSize: "9px", fontFamily: "'Inter', sans-serif", padding: "2px 7px", borderRadius: "8px", background: m.status === "open" ? "rgba(0,200,100,0.08)" : "rgba(255,100,50,0.08)", color: m.status === "open" ? "#007a3a" : "#cc4422" }}>{m.status === "open" ? "ABIERTO" : "CERRADO"}</span>
              {m.result_home !== null && <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{m.result_home}-{m.result_away}</span>}
              <button onClick={() => toggleStatus(m)} style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: "5px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontSize: "9px", fontFamily: "'Inter', sans-serif" }}>{m.status === "open" ? "Cerrar" : "Reabrir"}</button>
              {m.manual_override && (
                <button
                  onClick={async () => {
                    await supabase.from("matches").update({ manual_override: false }).eq("id", m.id);
                    onDataChange();
                  }}
                  style={{ padding: "4px 10px", border: "1px solid rgba(0,176,255,0.3)", borderRadius: "5px", background: "rgba(0,176,255,0.06)", color: "#005599", cursor: "pointer", fontSize: "9px", fontFamily: "'Inter', sans-serif" }}
                  title="Volver a permitir actualización automática">
                  🔓 auto
                </button>
              )}
              {m.result_source && (
                <span style={{ fontSize: "8px", fontFamily: "'Inter', sans-serif", padding: "2px 6px", borderRadius: "6px",
                  background: m.result_source === "manual" ? "rgba(79,195,247,0.1)" : "rgba(0,176,255,0.08)",
                  color: m.result_source === "manual" ? GREEN : "#4fc3f7" }}>
                  {m.result_source === "manual" ? "✏️ manual" : "🤖 auto"}
                </span>
              )}
              {sel === m.id
                ? <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                  <input value={hr} onChange={e => setHr(e.target.value)} type="number" min="0" style={{ ...smallSt, width: "44px" }} placeholder="0" />
                  <span style={{ color: "#b8d4ee" }}>-</span>
                  <input value={ar} onChange={e => setAr(e.target.value)} type="number" min="0" style={{ ...smallSt, width: "44px" }} placeholder="0" />
                  <button onClick={handleResult} style={{ padding: "6px 14px", border: "none", borderRadius: "6px", background: GREEN, color: "#0a1628", cursor: "pointer", fontSize: "11px", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>OK</button>
                  <button onClick={() => setSel(null)} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "6px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontSize: "11px", fontFamily: "'Inter', sans-serif" }}>✕</button>
                </div>
                : <button onClick={() => { setSel(m.id); setHr(""); setAr(""); }} style={{ padding: "5px 12px", border: "1px solid rgba(79,195,247,0.2)", borderRadius: "5px", background: GREEN_DIM, color: GREEN, cursor: "pointer", fontSize: "9px", fontFamily: "'Inter', sans-serif" }}>Resultado</button>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SyncResultsAdmin({ onDataChange }) {
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState("");

  // ⚠️ Pon aquí la URL de tu Edge Function y tu anon key (la anon SÍ
  // puede ir en el cliente; la service_role NUNCA).
  const FN_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-results`;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const syncNow = async () => {
    setSyncing(true); setMsg("");
    try {
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ANON_KEY}`,
        },
      });
      const data = await res.json();
      if (data.ok) {
        setMsg(`✓ ${data.updated} actualizados · ${data.skipped} respetados (manuales)`);
        onDataChange();
      } else {
        setMsg(`✗ Error: ${data.error || "desconocido"}`);
      }
    } catch (e) {
      setMsg(`✗ Error de red: ${String(e)}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setMsg(""), 6000);
    }
  };

  return (
    <div style={{ background: CARD, border: "1px solid rgba(0,200,100,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
      <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>
        🔄 Los resultados se actualizan solos cada pocos minutos. Pulsa aquí para forzar una actualización ahora. Los resultados que hayas editado a mano se respetan y NO se sobrescriben.
      </p>
      {msg && (
        <p style={{ fontSize: "11px", color: msg.startsWith("✓") ? "#007a3a" : "#cc2222", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>
          {msg}
        </p>
      )}
      <button onClick={syncNow} disabled={syncing}
        style={{
          width: "100%", padding: "12px", borderRadius: "7px",
          background: "rgba(0,200,100,0.12)", color: "#007a3a",
          fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700,
          cursor: syncing ? "default" : "pointer", letterSpacing: "2px",
          border: "1px solid rgba(0,200,100,0.3)",
          animation: syncing ? "pulse 1s infinite" : "none",
        }}>
        {syncing ? "⏳ SINCRONIZANDO..." : "🔄 ACTUALIZAR RESULTADOS AHORA"}
      </button>
    </div>
  );
}

function SaveRankingSnapshotAdmin({ matches }) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const go = async () => {
    setSaving(true); setMsg("");
    try {
      const n = await saveRankingSnapshot(matches);
      setMsg(`✓ Posiciones fijadas (${n} jugadores). Las flechas se calcularán desde aquí.`);
    } catch (e) {
      setMsg("✗ Error: " + (e.message || String(e)));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 6000);
    }
  };
  return (
    <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
      <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>
        📌 Fija las posiciones actuales como referencia. Después de cargar los resultados del siguiente partido, las flechas mostrarán quién sube y quién baja respecto a esta foto.
      </p>
      {msg && <p style={{ fontSize: "11px", color: msg.startsWith("✓") ? "#34d399" : "#cc2222", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>{msg}</p>}
      <button onClick={go} disabled={saving} style={{
        width: "100%", padding: "12px", borderRadius: "7px",
        background: GREEN_DIM, color: GREEN, fontFamily: "'Inter', sans-serif",
        fontSize: "12px", fontWeight: 700, cursor: saving ? "default" : "pointer",
        letterSpacing: "2px", border: `1px solid ${BORDER}`,
        animation: saving ? "pulse 1s infinite" : "none",
      }}>
        {saving ? "Guardando..." : "📌 FIJAR POSICIONES ACTUALES"}
      </button>
    </div>
  );
}

function SpecialPredictions({ userId, locked }) {
  const [topScorer, setTopScorer] = useState(null);
  const [bestPlayer, setBestPlayer] = useState(null);
  const [saved, setSaved] = useState({ scorer: false, player: false });
  const [loading, setLoading] = useState(true);
  const [inputScorer, setInputScorer] = useState("");
  const [inputPlayer, setInputPlayer] = useState("");
  const [activeTab, setActiveTab] = useState("scorer");
  const [locks, setLocks] = useState({ top_scorer: false, best_player: false });  // ⬅️ nuevo

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("special_predictions")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (data) {
        setTopScorer(data.top_scorer || null);
        setBestPlayer(data.best_player || null);
        setInputScorer(data.top_scorer || "");
        setInputPlayer(data.best_player || "");
      }
      // cargar bloqueos individuales
      const { data: lk } = await supabase.from("special_locks").select("*");   // ⬅️ nuevo
      const map = { top_scorer: false, best_player: false };
      (lk || []).forEach(r => { map[r.id] = r.locked; });
      setLocks(map);
      setLoading(false);
    })();
  }, [userId]);

  const savePick = async (field, value) => {
    if (locked || locks[field] || !value.trim()) return;
    const { error } = await supabase
      .from("special_predictions")
      .upsert({ user_id: userId, [field]: value.trim() }, { onConflict: "user_id" });
    if (!error) {
      const key = field === "top_scorer" ? "scorer" : "player";
      if (field === "top_scorer") setTopScorer(value.trim());
      else setBestPlayer(value.trim());
      setSaved(s => ({ ...s, [key]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2000);
    }
  };

  const clearPick = async (field) => {
    if (locked) return;
    await supabase
      .from("special_predictions")
      .upsert({ user_id: userId, [field]: null }, { onConflict: "user_id" });
    if (field === "top_scorer") { setTopScorer(null); setInputScorer(""); }
    else { setBestPlayer(null); setInputPlayer(""); }
  };

  if (loading) return null;

  const renderTab = (field) => {
    const isScorer = field === "top_scorer";
    const fieldLocked = locked || locks[field];
    const current = isScorer ? topScorer : bestPlayer;
    const input = isScorer ? inputScorer : inputPlayer;
    const setInput = isScorer ? setInputScorer : setInputPlayer;
    const savedKey = isScorer ? "scorer" : "player";
    const icon = isScorer ? "⚽" : "🏅";
    const label = isScorer ? "máximo goleador" : "mejor jugador";

    return (
      <div>
        {/* Selección guardada */}
        {current ? (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "12px",
            background: GREEN_DIM, border: `1px solid ${BORDER}`,
            borderRadius: "10px", marginBottom: "14px"
          }}>
            <span style={{ fontSize: "26px" }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "17px", color: GREEN }}>
                {current}
              </div>
              <div style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>
                Tu pronóstico de {label}
              </div>
            </div>
            {saved[savedKey] && (
              <span style={{ color: GREEN, fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>✓ guardado</span>
            )}
            {!fieldLocked && (
              <button onClick={() => clearPick(field)}
                style={{ padding: "4px 8px", border: `1px solid rgba(204,34,34,0.3)`, borderRadius: "6px", background: "rgba(204,34,34,0.06)", color: "#cc2222", cursor: "pointer", fontSize: "10px", fontFamily: "'Inter', sans-serif" }}>
                ✕
              </button>
            )}
          </div>
        ) : (
          <div style={{
            padding: "12px", background: "rgba(26,58,107,0.04)",
            border: `1px dashed ${BORDER}`, borderRadius: "10px",
            marginBottom: "14px", textAlign: "center"
          }}>
            <span style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>
              {fieldLocked ? `No enviaste pronóstico de ${label}` : `Escribe el nombre del ${label}`}
            </span>
          </div>
        )}

        {/* Input libre */}
        {!fieldLocked && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && savePick(field, input)}
                placeholder={`Ej: Kylian Mbappé, Erling Haaland...`}
                style={{ ...inputSt, marginBottom: "4px" }}
              />
              <p style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>
                Escribe el nombre y pulsa Guardar o Enter
              </p>
            </div>
            <button
              onClick={() => savePick(field, input)}
              disabled={!input.trim() || input.trim() === current}
              style={{
                padding: "12px 16px", border: "none", borderRadius: "8px",
                background: input.trim() && input.trim() !== current ? GREEN : "rgba(26,58,107,0.1)",
                color: input.trim() && input.trim() !== current ? "white" : "#c0d8f0",
                fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700,
                cursor: input.trim() && input.trim() !== current ? "pointer" : "default",
                whiteSpace: "nowrap", letterSpacing: "1px",
              }}>
              GUARDAR
            </button>
          </div>
        )}

        {fieldLocked && current && (
          <p style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", textAlign: "center", marginTop: "8px" }}>
            🔒 Pronóstico cerrado
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "14px" }}>
        PRONÓSTICOS ESPECIALES · +10 PTS c/u
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(26,58,107,0.06)", borderRadius: "8px", padding: "3px" }}>
        {[
          { id: "scorer", icon: "⚽", label: "Máx. Goleador" },
          { id: "player", icon: "🏅", label: "Mejor Jugador" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: "9px 4px", border: "none", borderRadius: "6px", cursor: "pointer",
            background: activeTab === t.id ? GREEN : "transparent",
            color: activeTab === t.id ? "white" : "#e0eefa",
            fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "1px",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === "scorer" && renderTab("top_scorer")}
      {activeTab === "player" && renderTab("best_player")}
    </div>
  );
}

// ============================================================
// TABLA PRONÓSTICOS ESPECIALES DE TODOS
// ============================================================
function SpecialPredictionsTable({ currentUserId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("scorer");

  useEffect(() => {
    (async () => {
      const { data: specials } = await supabase.from("special_predictions").select("*");
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
      const merged = (profiles || []).map(p => {
        const sp = (specials || []).find(x => x.user_id === p.id);
        return {
          name: p.name,
          isMe: p.id === currentUserId,
          top_scorer: sp?.top_scorer || null,
          best_player: sp?.best_player || null,
        };
      }).sort((a, b) => a.name.localeCompare(b.name));
      setData(merged);
      setLoading(false);
    })();
  }, [currentUserId]);

  if (loading) return null;

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "14px" }}>
        PRONÓSTICOS ESPECIALES · TODOS
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "14px", background: "rgba(26,58,107,0.06)", borderRadius: "8px", padding: "3px" }}>
        {[
          { id: "scorer", icon: "⚽", label: "Máx. Goleador" },
          { id: "player", icon: "🏅", label: "Mejor Jugador" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "9px 4px", border: "none", borderRadius: "6px", cursor: "pointer",
            background: tab === t.id ? GREEN : "transparent",
            color: tab === t.id ? "white" : "#e0eefa",
            fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "1px",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {/* Cabecera */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "4px 10px" }}>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "1px" }}>JUGADOR</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "1px" }}>
            {tab === "scorer" ? "MÁXIMO GOLEADOR" : "MEJOR JUGADOR"}
          </span>
        </div>

        {data.map((u, i) => {
          const value = tab === "scorer" ? u.top_scorer : u.best_player;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px",
              padding: "10px", borderRadius: "8px",
              background: u.isMe ? GREEN_DIM : CARD,
              border: u.isMe ? `1px solid rgba(79,195,247,0.3)` : `1px solid ${BORDER}`,
              borderLeft: u.isMe ? `3px solid ${GREEN}` : "3px solid transparent",
            }}>
              <span style={{
                fontSize: "12px", fontFamily: "'Inter', sans-serif",
                color: u.isMe ? GREEN : "#e0eaf8",
                fontWeight: u.isMe ? 700 : 400,
                display: "flex", alignItems: "center", gap: "4px",
              }}>
                {u.isMe && <span style={{ fontSize: "9px", color: GREEN }}>▶</span>}
                {u.name}
              </span>
              <span style={{
                fontSize: "12px", fontFamily: "'Inter', sans-serif",
                color: value ? "#e0eaf8" : "#6aacda",
                fontStyle: value ? "normal" : "italic",
              }}>
                {value || "Sin pronóstico"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

                function KnockoutLocksAdmin({ matches }) {
  const ROUNDS = [
    { key: "R32", label: "Dieciseisavos", ids: [...KO_SIDES.left.R32, ...KO_SIDES.right.R32] },
    { key: "R16", label: "Octavos",       ids: KO_TREE.R16.map(d => d.match) },
    { key: "QF",  label: "Cuartos",       ids: KO_TREE.QF.map(d => d.match) },
    { key: "SF",  label: "Semifinales",   ids: KO_TREE.SF.map(d => d.match) },
    { key: "THIRD", label: "Tercer puesto", ids: KO_TREE.THIRD.map(d => d.match) },
    { key: "FINAL", label: "Final",       ids: KO_TREE.FINAL.map(d => d.match) },
  ];
  const ALL_IDS = ROUNDS.flatMap(r => r.ids);

  const [locks, setLocks] = useState({});
  const [koResults, setKoResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [openRound, setOpenRound] = useState("R32");

  const load = async () => {
    const { data } = await supabase.from("knockout_locks").select("*");
    const m = {};
    (data || []).forEach(r => { m[r.id] = r.locked; });
    setLocks(m);
    const { data: kr } = await supabase.from("knockout_results").select("*");
    setKoResults(kr || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const teamsById = {};
  buildKnockoutFixtures(matches, koResults).forEach(f => { teamsById[f.id] = f; });

  const setMany = async (ids, locked) => {
    setBusy(true);
    setLocks(prev => { const n = { ...prev }; ids.forEach(id => { n[id] = locked; }); return n; });
    await supabase.from("knockout_locks").upsert(ids.map(id => ({ id, locked })), { onConflict: "id" });
    setBusy(false);
  };

  if (loading) return null;
  const lockedCount = ALL_IDS.filter(id => locks[id]).length;

  const teamLabel = (f, side) => {
    if (!f) return "—";
    const ph = side === "home" ? f.homePlaceholder : f.awayPlaceholder;
    const flag = side === "home" ? f.homeFlag : f.awayFlag;
    const name = side === "home" ? f.home : f.away;
    return `${flag} ${ph ? name : koAbbr(name)}`;
  };

  return (
    <div style={{ background: CARD, border: "1px solid rgba(255,213,79,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "10px" }}>
        🔐 ABRIR / CERRAR PRONÓSTICOS DE ELIMINATORIA
      </p>
      <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginBottom: "12px", lineHeight: 1.5 }}>
        Al cerrar un cruce, los usuarios ya no lo pueden editar y su pronóstico aparece en «Todos». {lockedCount}/{ALL_IDS.length} cerrados.
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        <button onClick={() => setMany(ALL_IDS, true)} disabled={busy} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "1px solid rgba(255,107,74,0.3)", background: "rgba(255,107,74,0.08)", color: "#ff6b4a", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, cursor: "pointer", letterSpacing: "1px" }}>🔒 CERRAR TODOS</button>
        <button onClick={() => setMany(ALL_IDS, false)} disabled={busy} style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "1px solid rgba(0,200,100,0.3)", background: "rgba(0,200,100,0.1)", color: "#007a3a", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, cursor: "pointer", letterSpacing: "1px" }}>🔓 ABRIR TODOS</button>
      </div>

      {ROUNDS.map(r => {
        const rLocked = r.ids.filter(id => locks[id]).length;
        const isOpen = openRound === r.key;
        return (
          <div key={r.key} style={{ marginBottom: "8px", border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
              <button onClick={() => setOpenRound(isOpen ? null : r.key)} style={{ flex: 1, textAlign: "left", border: "none", background: "transparent", color: "#e0eaf8", fontFamily: "'Bebas Neue', cursive", fontSize: "15px", letterSpacing: "1px", cursor: "pointer" }}>
                {isOpen ? "▾" : "▸"} {r.label} <span style={{ fontSize: "10px", color: rLocked === r.ids.length ? "#ff6b4a" : "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>({rLocked}/{r.ids.length} 🔒)</span>
              </button>
              <button onClick={() => setMany(r.ids, true)} disabled={busy} style={{ padding: "5px 9px", borderRadius: "6px", border: "1px solid rgba(255,107,74,0.3)", background: "rgba(255,107,74,0.08)", color: "#ff6b4a", fontSize: "9px", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}>Cerrar</button>
              <button onClick={() => setMany(r.ids, false)} disabled={busy} style={{ padding: "5px 9px", borderRadius: "6px", border: "1px solid rgba(0,200,100,0.3)", background: "rgba(0,200,100,0.1)", color: "#007a3a", fontSize: "9px", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}>Abrir</button>
            </div>
            {isOpen && (
              <div style={{ padding: "6px 10px 10px" }}>
                {r.ids.map(id => {
                  const f = teamsById[id];
                  const locked = !!locks[id];
                  return (
                    <div key={id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 4px", borderTop: `1px solid ${BORDER}` }}>
                      <span style={{ fontFamily: "'Bebas Neue', monospace", fontSize: "11px", color: "#7ab8e0", minWidth: "32px" }}>{id}</span>
                      <span style={{ flex: 1, fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {teamLabel(f, "home")} vs {teamLabel(f, "away")}
                      </span>
                      <span style={{ fontSize: "9px", fontFamily: "'Inter', sans-serif", color: locked ? "#ff6b4a" : "#34d399" }}>{locked ? "🔒" : "🔓"}</span>
                      <button onClick={() => setMany([id], !locked)} disabled={busy} style={{ padding: "5px 10px", borderRadius: "6px", whiteSpace: "nowrap", border: `1px solid ${locked ? "rgba(0,200,100,0.3)" : "rgba(255,107,74,0.3)"}`, background: locked ? "rgba(0,200,100,0.1)" : "rgba(255,107,74,0.08)", color: locked ? "#007a3a" : "#ff6b4a", fontSize: "9px", fontFamily: "'Inter', sans-serif", fontWeight: 700, cursor: "pointer" }}>
                        {locked ? "Abrir" : "Cerrar"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SpecialLocksAdmin() {
  const [locks, setLocks] = useState({ top_scorer: false, best_player: false });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("special_locks").select("*");
    const map = { top_scorer: false, best_player: false };
    (data || []).forEach(r => { map[r.id] = r.locked; });
    setLocks(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    const next = !locks[id];
    setLocks(l => ({ ...l, [id]: next }));
    await supabase.from("special_locks").upsert({ id, locked: next }, { onConflict: "id" });
  };

  if (loading) return null;

  const row = (id, icon, label) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#e0eaf8" }}>{label}</span>
      <span style={{ fontSize: "10px", fontFamily: "'Inter', sans-serif", color: locks[id] ? "#ff6b4a" : "#34d399" }}>
        {locks[id] ? "🔒 Cerrado" : "🔓 Abierto"}
      </span>
      <button onClick={() => toggle(id)} style={{
        padding: "6px 12px", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap",
        border: `1px solid ${locks[id] ? "rgba(0,200,100,0.3)" : "rgba(255,107,74,0.3)"}`,
        background: locks[id] ? "rgba(0,200,100,0.1)" : "rgba(255,107,74,0.08)",
        color: locks[id] ? "#007a3a" : "#ff6b4a",
        fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700,
      }}>
        {locks[id] ? "Abrir" : "Cerrar"}
      </button>
    </div>
  );

  return (
    <div style={{ background: CARD, border: "1px solid rgba(255,193,7,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>
        🔐 ABRIR / CERRAR PRONÓSTICOS ESPECIALES
      </p>
      {row("top_scorer", "⚽", "Máximo goleador")}
      {row("best_player", "🏅", "Mejor jugador")}
    </div>
  );
}
                
function SpecialAwardsAdmin() {
  const [topScorer, setTopScorer] = useState("");
  const [bestPlayer, setBestPlayer] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const award = async () => {
    if (!topScorer && !bestPlayer) return;
    setSaving(true);
    const { data: preds } = await supabase.from("special_predictions").select("*");
    for (const u of (preds || [])) {
      await supabase.from("special_predictions").update({
        top_scorer_points: topScorer && u.top_scorer?.toLowerCase().trim() === topScorer.toLowerCase().trim() ? 10 : u.top_scorer_points,
        best_player_points: bestPlayer && u.best_player?.toLowerCase().trim() === bestPlayer.toLowerCase().trim() ? 10 : u.best_player_points,
      }).eq("id", u.id);
    }
    setSaving(false); setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div style={{ background: CARD, border: "1px solid rgba(0,200,100,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>
        🏅 ADJUDICAR PRONÓSTICOS ESPECIALES
      </p>
      <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginBottom: "12px" }}>
        Escribe el nombre exacto del ganador. Se compara sin distinguir mayúsculas.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
        <div>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginBottom: "4px" }}>⚽ MÁXIMO GOLEADOR</p>
          <input
            value={topScorer}
            onChange={e => setTopScorer(e.target.value)}
            placeholder="Ej: Kylian Mbappé"
            style={{ ...inputSt, marginBottom: 0 }}
          />
        </div>
        <div>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", marginBottom: "4px" }}>🏅 MEJOR JUGADOR</p>
          <input
            value={bestPlayer}
            onChange={e => setBestPlayer(e.target.value)}
            placeholder="Ej: Lamine Yamal"
            style={{ ...inputSt, marginBottom: 0 }}
          />
        </div>
      </div>
      {done && (
        <p style={{ color: "#007a3a", fontFamily: "'Inter', sans-serif", fontSize: "11px", marginBottom: "8px" }}>
          ✓ Puntos adjudicados correctamente
        </p>
      )}
      <button onClick={award} disabled={saving || (!topScorer && !bestPlayer)}
        style={{
          width: "100%", padding: "11px", borderRadius: "7px",
          background: "rgba(0,200,100,0.12)", color: "#007a3a",
          fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700,
          cursor: "pointer", letterSpacing: "2px",
          border: "1px solid rgba(0,200,100,0.3)"
        }}>
        {saving ? "Guardando..." : "✓ ADJUDICAR PUNTOS"}
      </button>
    </div>
  );
}

// ============================================================
// EXPORTAR RANKING Y PRONÓSTICOS (solo admin)
// ============================================================
function ExportView({ matches, onBack }) {
  const [ranking, setRanking] = useState([]);
  const [allPreds, setAllPreds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState("ranking");
  const rankingRef = useRef(null);
  const predsRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data: profs } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: preds } = await supabase.from("predictions").select("*").range(0, 99999);
      const { data: qpicks } = await supabase.from("qualifier_picks").select("*");
      const { data: special } = await supabase.from("special_predictions").select("*");
      setProfiles(profs || []);
      setAllPreds(preds || []);
      const r = (profs || []).map(p => {
        const myPreds = (preds || []).filter(x => x.user_id === p.id && x.points !== null);
        const qualPts = (qpicks || []).filter(x => x.user_id === p.id).reduce((s, pick) => s + (pick.points || 0), 0);
        const mySpecial = (special || []).find(x => x.user_id === p.id);
        const specialPts = mySpecial ? (mySpecial.top_scorer_points || 0) + (mySpecial.best_player_points || 0) : 0;
        return {
          ...p,
          total: myPreds.reduce((s, x) => s + (x.points || 0), 0) + qualPts + specialPts,
          exactos: myPreds.filter(x => x.points === 5).length,
          difGoles: myPreds.filter(x => x.points === 3).length,
          parciales: myPreds.filter(x => x.points === 1).length,
          fallos: myPreds.filter(x => x.points === 0).length,
          count: myPreds.length,
          qualPts, specialPts,
        };
      }).sort((a, b) => b.total - a.total);
      setRanking(r);
      setLoading(false);
    })();
  }, []);

  const loadHtml2Canvas = () => new Promise(resolve => {
    if (window.html2canvas) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });

  const exportImage = async (ref, filename) => {
    setExporting(true);
    try {
      await loadHtml2Canvas();
      const canvas = await window.html2canvas(ref.current, {
        backgroundColor: "#f0f4f8",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setExporting(false);
    }
  };

  const medals = ["🥇", "🥈", "🥉"];
  const playedMatches = matches.filter(m => m.result_home !== null);
  const getName = id => profiles.find(p => p.id === id)?.name || "?";
  const today = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  if (loading) return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <p style={{ color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>Cargando datos...</p>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>EXPORTAR IMÁGENES</p>
      </div>

      {/* Selector tipo */}
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(26,58,107,0.06)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "ranking", label: "🏆 Ranking" }, { id: "preds", label: "⚽ Pronósticos" }].map(t => (
          <button key={t.id} onClick={() => setExportType(t.id)} style={{
            flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer",
            background: exportType === t.id ? GREEN : "transparent",
            color: exportType === t.id ? "white" : "#e0eefa",
            fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Botón exportar */}
      <button
        onClick={() => exportType === "ranking"
          ? exportImage(rankingRef, `ranking-porra-vallau-${today}.png`)
          : exportImage(predsRef, `pronosticos-porra-vallau-${today}.png`)
        }
        disabled={exporting}
        style={{
          width: "100%", padding: "14px", border: "none", borderRadius: "10px", marginBottom: "24px",
          background: exporting ? "rgba(26,58,107,0.1)" : `linear-gradient(135deg,${GREEN},#2a5aab)`,
          color: exporting ? "#c0d8f0" : "white",
          fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800,
          cursor: exporting ? "default" : "pointer", letterSpacing: "2px",
        }}>
        {exporting ? "⏳ GENERANDO IMAGEN..." : "📸 DESCARGAR IMAGEN PNG"}
      </button>

      {/* Botón exportar JSON backup */}
<button
  onClick={() => {
    const backup = {
      fecha: new Date().toISOString(),
      ranking: ranking.map(u => ({
        nombre: u.name,
        puntos_totales: u.total,
        exactos: u.exactos,
        parciales: u.parciales,
        fallos: u.fallos,
        partidos_evaluados: u.count,
        puntos_clasificados: u.qualPts,
        puntos_especiales: u.specialPts,
      })),
      pronosticos: profiles.map(u => ({
        jugador: u.name,
        predicciones: allPreds
          .filter(p => p.user_id === u.id)
          .map(p => {
            const m = matches.find(x => x.id === p.match_id);
            return {
              partido: m ? `${m.home} vs ${m.away}` : p.match_id,
              grupo: m?.grp || "-",
              fecha: m?.match_date || "-",
              pronostico: `${p.predicted_home}-${p.predicted_away}`,
              resultado: m?.result_home !== null ? `${m.result_home}-${m.result_away}` : "pendiente",
              puntos: p.points ?? "sin evaluar",
            };
          }),
      })),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.download = `backup-porra-vallau-${new Date().toLocaleDateString("es-ES").replace(/\//g, "-")}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }}
  style={{
    width: "100%", padding: "14px", border: `1px solid rgba(0,122,58,0.3)`,
    borderRadius: "10px", marginBottom: "24px",
    background: "rgba(0,122,58,0.08)",
    color: "#007a3a",
    fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800,
    cursor: "pointer", letterSpacing: "2px",
  }}>
  💾 DESCARGAR BACKUP JSON
</button>

      {/* ===== PREVIEW RANKING ===== */}
      {exportType === "ranking" && (
        <div ref={rankingRef} style={{
          background: "#f0f4f8", padding: "28px", borderRadius: "16px",
          fontFamily: "'Inter', sans-serif", maxWidth: "600px", margin: "0 auto",
          border: "1px solid rgba(26,58,107,0.1)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px", paddingBottom: "18px", borderBottom: "2px solid rgba(26,58,107,0.12)" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "40px", color: GREEN, letterSpacing: "4px", lineHeight: 1 }}>PORRA VALLAU</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#3a5a7a", letterSpacing: "6px", marginTop: "2px" }}>MUNDIAL 2026</div>
            <div style={{ fontSize: "10px", color: "#5a6a7a", marginTop: "6px", letterSpacing: "2px" }}>🏆 RANKING GENERAL · {today.toUpperCase()}</div>
          </div>

          {/* Podio top 3 */}
          {ranking.length >= 3 && (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
              {[{ i: 1, h: 80, fs: 28, emoji: "🥈" }, { i: 0, h: 100, fs: 36, emoji: "🥇" }, { i: 2, h: 64, fs: 22, emoji: "🥉" }].map(({ i, h, fs, emoji }) => (
                <div key={i} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: i === 0 ? "38px" : "28px", marginBottom: "4px" }}>{emoji}</div>
                  <div style={{
                    background: i === 0 ? GREEN : "white",
                    borderRadius: "10px 10px 0 0", padding: "10px 6px",
                    height: `${h}px`, display: "flex", flexDirection: "column",
                    justifyContent: "center", alignItems: "center",
                    boxShadow: i === 0 ? "0 4px 16px rgba(26,58,107,0.2)" : "0 2px 8px rgba(26,58,107,0.08)",
                  }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: `${fs}px`, color: i === 0 ? "white" : GREEN, lineHeight: 1 }}>{ranking[i].total}</div>
                    <div style={{ fontSize: "10px", color: i === 0 ? "rgba(255,255,255,0.95)" : "#2a3a4a", fontWeight: 700, marginTop: "3px" }}>{ranking[i].name?.split(" ")[0]}</div>
                    <div style={{ fontSize: "8px", color: i === 0 ? "rgba(255,255,255,0.7)" : "#6a7a8a", marginTop: "1px" }}>PTS</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tabla completa */}
          <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(26,58,107,0.08)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 40px 40px 40px 48px", padding: "8px 12px", background: GREEN, gap: "4px", alignItems: "center" }}>
              {["#", "JUGADOR", "🎯", "📏", "✓", "✗", "PTS"].map(h => (
                <span key={h} style={{ fontSize: "9px", color: "rgba(255,255,255,0.95)", fontFamily: "'Inter', sans-serif", letterSpacing: "1px", textAlign: h === "JUGADOR" ? "left" : "center" }}>{h}</span>
              ))}
            </div>
            {ranking.map((u, i) => (
              <div key={u.id} style={{
                display: "grid", gridTemplateColumns: "28px 1fr 40px 40px 40px 48px",
                padding: "10px 12px", gap: "4px", alignItems: "center",
                background: i % 2 === 0 ? "white" : "rgba(26,58,107,0.03)",
                borderBottom: "1px solid rgba(26,58,107,0.06)",
              }}>
                <span style={{ fontSize: "14px", textAlign: "center", color: "#1a2a3a" }}>{medals[i] || `#${i + 1}`}</span>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "12px", color: "#1a2a3a", fontWeight: i < 3 ? 700 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                  <div style={{ fontSize: "8px", color: "#6a7a8a", whiteSpace: "nowrap" }}>{u.count} eval.</div>
                </div>
                <span style={{ fontSize: "11px", color: "#007a3a", textAlign: "center", fontWeight: 700 }}>{u.exactos}</span>
                <span style={{ fontSize: "11px", color: "#0077cc", textAlign: "center" }}>{u.difGoles}</span>
                <span style={{ fontSize: "11px", color: "#ffd54f", textAlign: "center" }}>{u.parciales}</span>
                <span style={{ fontSize: "11px", color: "#cc2222", textAlign: "center" }}>{u.fallos}</span>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: i === 0 ? GREEN : "#1a2a3a", textAlign: "center", overflow: "visible" }}>{u.total}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(26,58,107,0.1)" }}>
            <span style={{ fontSize: "9px", color: "#5a6a7a", letterSpacing: "2px" }}>
              🎯 EXACTO +5 · 📏 DIF +3 · ✓ SIGNO +1 · ✗ FALLO +0
            </span>
          </div>
        </div>
      )}

      {/* ===== PREVIEW PRONÓSTICOS ===== */}
      {exportType === "preds" && (
        <div ref={predsRef} style={{
          background: "#f0f4f8", padding: "28px", borderRadius: "16px",
          fontFamily: "'Inter', sans-serif", maxWidth: "700px", margin: "0 auto",
          border: "1px solid rgba(26,58,107,0.1)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "2px solid rgba(26,58,107,0.12)" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: GREEN, letterSpacing: "4px", lineHeight: 1 }}>PORRA VALLAU</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#e0eefa", letterSpacing: "6px", marginTop: "2px" }}>PRONÓSTICOS · MUNDIAL 2026</div>
            <div style={{ fontSize: "10px", color: "#c0d8f0", marginTop: "6px", letterSpacing: "2px" }}>⚽ {playedMatches.length} PARTIDOS JUGADOS · {today.toUpperCase()}</div>
          </div>

          {/* Cabecera de jugadores */}
          <div style={{ display: "grid", gap: "2px", marginBottom: "8px", gridTemplateColumns: `180px repeat(${ranking.length}, 1fr)` }}>
            <div></div>
            {ranking.map(u => (
              <div key={u.id} style={{ textAlign: "center", padding: "6px 2px" }}>
                <div style={{ fontSize: "10px", color: GREEN, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name?.split(" ")[0]}</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: "#e0eefa" }}>{u.total}</div>
              </div>
            ))}
          </div>

          {/* Partidos jugados */}
          {playedMatches.slice(0, 30).map((m, mi) => {
            const ht = getTeam(m.home), at = getTeam(m.away);
            return (
              <div key={m.id} style={{
                display: "grid", gap: "2px", alignItems: "center", padding: "6px 0",
                gridTemplateColumns: `180px repeat(${ranking.length}, 1fr)`,
                borderBottom: "1px solid rgba(26,58,107,0.07)",
                background: mi % 2 === 0 ? "transparent" : "rgba(26,58,107,0.02)",
                borderRadius: "4px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "13px" }}>{ht.flag}</span>
                  <span style={{ fontSize: "9px", color: "#e0eaf8", fontWeight: 700 }}>{m.result_home}-{m.result_away}</span>
                  <span style={{ fontSize: "13px" }}>{at.flag}</span>
                </div>
                {ranking.map(u => {
                  const pred = allPreds.find(p => p.match_id === m.id && p.user_id === u.id);
                  const pts = pred?.points;
                  return (
                    <div key={u.id} style={{ textAlign: "center" }}>
                      {pred ? (
                        <span style={{
                          fontSize: "10px", fontFamily: "'Inter', sans-serif", fontWeight: 700,
                          color: pts === 5 ? "#007a3a" : pts === 3 ? "#0077cc" : pts === 1 ? "#ffd54f" : "#cc2222",
                          background: pts === 5 ? "rgba(0,122,58,0.1)" : pts === 3 ? "rgba(0,119,204,0.1)" : pts === 1 ? "rgba(184,134,11,0.1)" : "rgba(204,34,34,0.08)",
                          padding: "1px 4px", borderRadius: "4px",
                        }}>
                          {pred.predicted_home}-{pred.predicted_away}
                        </span>
                      ) : (
                        <span style={{ fontSize: "10px", color: "#c0cfe0" }}>—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Fila totales */}
          <div style={{
            display: "grid", gap: "2px", alignItems: "center", padding: "10px 0 0",
            gridTemplateColumns: `180px repeat(${ranking.length}, 1fr)`,
            borderTop: "2px solid rgba(26,58,107,0.15)", marginTop: "8px",
          }}>
            <div style={{ fontSize: "10px", color: "#e0eefa", fontWeight: 700, letterSpacing: "1px" }}>TOTAL PTS</div>
            {ranking.map(u => (
              <div key={u.id} style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: GREEN }}>{u.total}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(26,58,107,0.1)" }}>
            <span style={{ fontSize: "9px", color: "#c0d8f0", letterSpacing: "2px" }}>
              🟢 EXACTO · 🟡 SIGNO · 🔴 FALLO
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EL BOTE / PAGOS
// ============================================================
function useCountUp(target, dur = 1300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start = null;
    const step = ts => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return val;
}

function MoneyBag({ ratio = 0, pot = 0, paid = 0, total = 0 }) {
  const [fill, setFill] = useState(0);
  const shownPot = useCountUp(pot, 2600); // antes 1300 (por defecto)
  useEffect(() => {
    const t = setTimeout(() => setFill(Math.max(0, Math.min(1, ratio))), 250);
    return () => clearTimeout(t);
  }, [ratio]);

  const top = 74, bottom = 196;
  const h = (bottom - top) * fill;
  const y = bottom - h;
  const bag = "M 80 70 C 56 84, 42 122, 47 156 C 51 186, 80 197, 100 197 C 120 197, 149 186, 153 156 C 158 122, 144 84, 120 70 Z";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox="0 0 200 210" width="190" height="200" style={{ animation: "floaty 3s ease-in-out infinite", overflow: "visible" }}>
        <defs>
          <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe79a" />
            <stop offset="45%" stopColor="#ffd54f" />
            <stop offset="100%" stopColor="#e6a100" />
          </linearGradient>
          <clipPath id="bagClip"><path d={bag} /></clipPath>
        </defs>

        <ellipse cx="100" cy="203" rx="46" ry="7" fill="rgba(0,0,0,0.35)" />
        <path d={bag} fill="rgba(255,255,255,0.05)" stroke="rgba(255,213,79,0.5)" strokeWidth="2" />

        <g clipPath="url(#bagClip)">
          <rect x="30" y={y} width="140" height={h} fill="url(#goldFill)"
            style={{ transition: "y 1.4s cubic-bezier(.22,1,.36,1), height 1.4s cubic-bezier(.22,1,.36,1)" }} />
          <rect x="30" y={y} width="140" height={Math.min(7, h)} fill="rgba(255,255,255,0.4)"
            style={{ transition: "y 2.8s cubic-bezier(.22,1,.36,1), height 2.8s cubic-bezier(.22,1,.36,1)" }} />
        </g>

        <path d={bag} fill="none" stroke="rgba(255,213,79,0.85)" strokeWidth="2.5" />
        <path d="M 78 70 Q 100 60 122 70 L 118 56 Q 100 48 82 56 Z" fill="#e6a100" stroke="rgba(255,213,79,0.9)" strokeWidth="1.5" />
        <path d="M 82 56 Q 100 40 118 56" fill="none" stroke="rgba(255,213,79,0.9)" strokeWidth="3" strokeLinecap="round" />

        <text x="100" y="152" textAnchor="middle" fontSize="56"
          fill="rgba(255,255,255,0.82)" style={{ fontFamily: "'Bebas Neue', monospace" }}>€</text>

        {fill > 0.12 && [0, 1, 2].map(i => (
          <circle key={i} cx={70 + i * 30} cy={y - 5} r="5"
            fill="#ffd54f" stroke="#e6a100" strokeWidth="1"
            style={{ animation: `pulse ${1.6 + i * 0.3}s ease-in-out infinite` }} />
        ))}
      </svg>

      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "46px", color: "#ffd54f", lineHeight: 1, textShadow: "0 0 18px rgba(255,213,79,0.4)" }}>
        {shownPot}€
      </div>
      <div style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", letterSpacing: "1px", marginTop: "4px" }}>
        BOTE ACTUAL · {paid}/{total} pagados
      </div>
    </div>
  );
}

function PaymentsView({ user }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [barW, setBarW] = useState(0);

  const load = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("role", "user");
    const sorted = (data || []).sort((a, b) =>
      (b.has_paid ? 1 : 0) - (a.has_paid ? 1 : 0) || (a.name || "").localeCompare(b.name || "")
    );
    setProfiles(sorted);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("payments_rt")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, () => load())
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);
  
  const togglePaid = async (p) => {
    if (user.role !== "admin") return;
    setSavingId(p.id);
    await supabase.from("profiles").update({ has_paid: !p.has_paid }).eq("id", p.id);
    await load();
    setSavingId(null);
  };

  const paid = profiles.filter(p => p.has_paid);
  const unpaid = profiles.filter(p => !p.has_paid);
  const pot = paid.length * CUOTA;
  const ratio = profiles.length ? paid.length / profiles.length : 0;

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setBarW(Math.round(ratio * 100)), 250);
    return () => clearTimeout(t);
  }, [loading, ratio]);

  if (loading) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div className="skeleton" style={{ width: "100%", height: "260px", borderRadius: "16px", marginBottom: "20px" }} />
      <SkeletonRows count={6} height={48} />
    </div>
  );

  const row = (p) => (
    <div key={p.id} style={{
      display: "flex", alignItems: "center", gap: "12px",
      background: p.has_paid ? "rgba(0,200,100,0.07)" : "rgba(255,107,74,0.06)",
      border: `1px solid ${p.has_paid ? "rgba(0,200,100,0.25)" : "rgba(255,107,74,0.25)"}`,
      borderLeft: `3px solid ${p.has_paid ? "#34d399" : "#ff6b4a"}`,
      borderRadius: "10px", padding: "12px 14px", marginBottom: "6px",
    }}>
      <span style={{ fontSize: "22px" }}>{p.emoji || "⚽"}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8", fontWeight: 700 }}>
          {p.name}{p.id === user.id ? " (tú)" : ""}
        </div>
        <div style={{ fontSize: "9px", color: p.has_paid ? "#34d399" : "#ff6b4a", fontFamily: "'Inter', sans-serif" }}>
          {p.has_paid ? `✓ Ha pagado · ${CUOTA}€` : "⏳ Pendiente de pago"}
        </div>
      </div>
      {user.role === "admin" ? (
        <button onClick={() => togglePaid(p)} disabled={savingId === p.id} style={{
          padding: "7px 12px", borderRadius: "8px", cursor: "pointer",
          border: `1px solid ${p.has_paid ? "rgba(255,107,74,0.3)" : "rgba(0,200,100,0.3)"}`,
          background: p.has_paid ? "rgba(255,107,74,0.08)" : "rgba(0,200,100,0.1)",
          color: p.has_paid ? "#ff6b4a" : "#007a3a",
          fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap",
        }}>
          {savingId === p.id ? "···" : p.has_paid ? "Marcar moroso" : "✓ Pagado"}
        </button>
      ) : (
        <span style={{ fontSize: "18px" }}>{p.has_paid ? "✅" : "❌"}</span>
      )}
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "16px" }}>BOTE</p>

      <div style={{
        background: "radial-gradient(120% 120% at 50% 0%, rgba(255,213,79,0.12), rgba(10,22,40,0) 70%), rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,213,79,0.25)", borderRadius: "16px",
        padding: "24px 16px 20px", marginBottom: "20px",
      }}>
        <MoneyBag ratio={ratio} pot={pot} paid={paid.length} total={profiles.length} />
        <div style={{ marginTop: "16px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", height: "8px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${barW}%`, background: "linear-gradient(90deg,#ffd54f,#e6a100)", borderRadius: "8px", transition: "width 2.8s ease" }} />
        </div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", textAlign: "center", marginTop: "10px" }}>
          {unpaid.length === 0
            ? "🎉 ¡Todos han pagado! Bote completo."
            : `Faltan ${unpaid.length} por pagar · ${unpaid.length * CUOTA}€ pendientes`}
        </p>
      </div>

      {paid.length > 0 && (
        <>
          <p style={{ fontSize: "9px", color: "#34d399", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "10px" }}>
            ✅ HAN PAGADO ({paid.length})
          </p>
          {paid.map(row)}
        </>
      )}

      {unpaid.length > 0 && (
        <>
          <p style={{ fontSize: "9px", color: "#ff6b4a", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", margin: "18px 0 10px" }}>
            ⚠️ MOROSOS ({unpaid.length})
          </p>
          {unpaid.map(row)}
        </>
      )}

      {user.role === "admin" && (
        <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", marginTop: "14px", lineHeight: 1.5, textAlign: "center" }}>
          Como admin, pulsa el botón de cada jugador para marcar si ha pagado.
        </p>
      )}
    </div>
  );
}

// ============================================================
// RESUMEN DIARIO (aparece al entrar, a partir de las 08:00)
// ============================================================
function DailySummary({ user, matches }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef(null);

  // Ventana del resumen: desde las 08:00 de AYER hasta ahora (hora España).
  // Trabajamos con el instante real de cada partido (fecha+hora locales).
  const matchInstant = (m) => new Date(`${m.match_date}T${(m.match_time || "00:00")}:00+02:00`).getTime();

  useEffect(() => {
    (async () => {
      const now = new Date();
      // "Hoy a las 08:00" en hora España. Si aún no son las 8, no mostramos nada.
      const today8 = new Date(now); today8.setHours(8, 0, 0, 0);
      if (now.getTime() < today8.getTime()) { setLoading(false); return; }

      // Ventana: desde las 08:00 de ayer hasta ahora
      const from = today8.getTime() - 24 * 3600 * 1000;
      const to = now.getTime();

     // Todos los partidos de la ventana (tengan o no resultado todavía)
      const windowMatches = (matches || []).filter(m => {
        const t = matchInstant(m);
        return t >= from && t <= to;
      });

      if (windowMatches.length === 0) { setLoading(false); return; }

      // Si algún partido de la ventana aún no tiene resultado, esperamos a que
      // se registre: el resumen no se crea hasta que TODOS estén cerrados.
      const allHaveResults = windowMatches.every(
        m => m.result_home !== null && m.result_away !== null
      );
      if (!allHaveResults) { setLoading(false); return; }

      const dayMatches = windowMatches.sort((a, b) => matchInstant(a) - matchInstant(b));

      const ids = dayMatches.map(m => m.id);

      // Mis predicciones de esos partidos
      const { data: mine } = await supabase
        .from("predictions").select("*")
        .eq("user_id", user.id).in("match_id", ids);
      const myMap = {};
      (mine || []).forEach(p => { myMap[p.match_id] = p; });

      // Solo seguimos si al menos un partido mío está puntuado
      const anyScored = (mine || []).some(p => p.points != null);

      // Datos del grupo: todas las predicciones de esos partidos + perfiles
      const { data: allPreds } = await supabase
        .from("predictions").select("user_id, match_id, points").in("match_id", ids);
      const { data: profiles } = await supabase
        .from("profiles").select("id, name, emoji").eq("role", "user");
      const nameOf = (id) => profiles?.find(p => p.id === id)?.name || "Usuario";

      // Mis filas partido a partido
      const rows = dayMatches.map(m => {
        const p = myMap[m.id];
        const pts = p && p.points != null ? p.points : (p ? null : 0);
        return {
          id: m.id, home: m.home, away: m.away,
          rh: m.result_home, ra: m.result_away,
          pred: p ? `${p.predicted_home}-${p.predicted_away}` : "—",
          pts, hasPred: !!p,
        };
      });
      const myDayTotal = rows.reduce((s, r) => s + (r.pts || 0), 0);

      // Resumen del grupo: puntos del día por usuario
      const byUser = {};
      (allPreds || []).forEach(p => {
        if (p.points == null) return;
        byUser[p.user_id] = (byUser[p.user_id] || 0) + p.points;
      });
      const ranked = Object.entries(byUser)
        .map(([id, pts]) => ({ id, name: nameOf(id), emoji: profiles?.find(x => x.id === id)?.emoji || "⚽", pts }))
        .sort((a, b) => b.pts - a.pts);


      // Plenos del día (alguien con marcador exacto en algún partido)
      const exactScorers = (allPreds || [])
        .filter(p => p.points === 5)
        .map(p => nameOf(p.user_id));
      const plenos = [...new Set(exactScorers)];

      // Mejor y peor del día (entre quienes puntuaron hoy)
      const bestDay = ranked[0] || null;
      const worstDay = ranked.length > 1 ? ranked[ranked.length - 1] : null;

      // Mi posición actual en el ranking GENERAL + movimiento desde la última foto
      const { data: allPredsFull } = await supabase
        .from("predictions").select("user_id, points").range(0, 99999);
      const { data: specials } = await supabase.from("special_predictions").select("*");
      const totals = (profiles || []).map(pr => {
        const base = (allPredsFull || [])
          .filter(x => x.user_id === pr.id && x.points != null)
          .reduce((s, x) => s + (x.points || 0), 0);
        const sp = (specials || []).find(x => x.user_id === pr.id);
        const spPts = sp ? (sp.top_scorer_points || 0) + (sp.best_player_points || 0) : 0;
        return { id: pr.id, total: base + spPts };
      }).sort((a, b) => b.total - a.total);

      const myPos = totals.findIndex(t => t.id === user.id) + 1; // 0 si no aparece

      // Movimiento: comparar contra la penúltima foto del ranking_history
      let myMove = null;
      const { data: snaps } = await supabase
        .from("ranking_history")
        .select("user_id, position, snapshot_at")
        .order("snapshot_at", { ascending: false });
      if (snaps && snaps.length) {
        const stamps = [...new Set(snaps.map(s => s.snapshot_at))];
        // la foto más reciente es el "antes" de la tanda de hoy
        const refStamp = stamps[0];
        const prev = snaps.find(s => s.snapshot_at === refStamp && s.user_id === user.id);
        if (prev && myPos > 0) myMove = prev.position - myPos; // + sube, - baja
      }
      
      setData({
        dateLabel: new Date(now).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }),
        rows, myDayTotal, bestDay, worstDay, plenos, anyScored,
        matchCount: dayMatches.length,
        myPos, myMove,
      });
      setLoading(false);

      // Mostrar automáticamente una vez al día
      const key = `dailySummary_${new Date().toISOString().slice(0, 10)}`;
      try { if (!localStorage.getItem(key)) setOpen(true); } catch { setOpen(true); }
    })();
  }, [matches, user.id]);

  const dismiss = () => {
    setOpen(false);
    const key = `dailySummary_${new Date().toISOString().slice(0, 10)}`;
    try { localStorage.setItem(key, "1"); } catch {}
  };

  // ── Compartir como imagen (share nativo → WhatsApp, etc.) ──
  const loadHtml2Canvas = () => new Promise(resolve => {
    if (window.html2canvas) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });

  const share = async () => {
    setSharing(true);
    try {
      await loadHtml2Canvas();
      const canvas = await window.html2canvas(cardRef.current, { backgroundColor: "#0a1628", scale: 2, useCORS: true, logging: false });
      const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
      const file = new File([blob], "resumen-porra-vallau.png", { type: "image/png" });
      const text = `📊 Mi resumen de hoy en la Porra Vallau · ${data.myDayTotal} pts`;
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text });
      } else {
        // Fallback: descargar la imagen
        const link = document.createElement("a");
        link.download = "resumen-porra-vallau.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (e) {
      console.error("share error", e);
    } finally {
      setSharing(false);
    }
  };

  if (loading || !data) return null;

  // Botón pequeño para reabrir el resumen si ya lo cerró
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="tappable" style={{
        width: "100%", display: "flex", alignItems: "center", gap: "10px",
        padding: "11px 14px", marginBottom: "16px", cursor: "pointer",
        background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: "12px",
      }}>
        <span style={{ fontSize: "22px" }}>📊</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: "#e0eaf8", letterSpacing: "1px" }}>RESUMEN DE HOY</div>
          <div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>Sacaste {data.myDayTotal} pts · toca para ver</div>
        </div>
        <span style={{ fontSize: "16px", color: GREEN }}>→</span>
      </button>
    );
  }

  const ptsBadge = (pts) => {
    if (pts == null) return <span style={{ fontSize: "10px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>pendiente</span>;
    const cfg = pts === 5 ? ["🎯 +5", GREEN, GREEN_DIM]
      : pts === 3 ? ["📏 +3", "#4fc3f7", "rgba(79,195,247,0.08)"]
      : pts === 1 ? ["✓ +1", "#ffd54f", "rgba(255,193,7,0.1)"]
      : ["✗ +0", "#cc2222", "rgba(255,82,82,0.08)"];
    return <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontFamily: "'Inter', sans-serif", fontWeight: 700, background: cfg[2], color: cfg[1] }}>{cfg[0]}</span>;
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 280, background: "rgba(5,12,24,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
      animation: "fadeIn 0.25s ease",
    }} onClick={dismiss}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "420px", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Tarjeta que se exporta como imagen */}
        <div ref={cardRef} style={{
          background: "linear-gradient(160deg,#102339,#0a1628)",
          border: `2px solid ${GREEN}`, borderRadius: "16px", padding: "20px",
        }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eaf8", letterSpacing: "3px", lineHeight: 1 }}>
              PORRA <span style={{ color: GREEN }}>VALLAU</span>
            </div>
            <div style={{ fontSize: "10px", color: "#9cc4e6", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginTop: "4px", textTransform: "uppercase" }}>
              📊 Resumen · {data.dateLabel}
            </div>
          </div>

          {/* Mi total del día */}
          <div style={{
            textAlign: "center", padding: "14px", marginBottom: "16px",
            background: "rgba(79,195,247,0.10)", border: `1px solid ${GREEN}`, borderRadius: "12px",
          }}>
            <div style={{ fontSize: "9px", color: "#9cc4e6", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>TUS PUNTOS DE HOY</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "46px", color: GREEN, lineHeight: 1 }}>{data.myDayTotal}</div>
            <div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{data.matchCount} {data.matchCount === 1 ? "partido" : "partidos"}</div>
          </div>

          {/* Mi posición actual + movimiento */}
          {data.myPos > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 14px", marginBottom: "16px",
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px",
            }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "8px", color: "#9cc4e6", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>VAS</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", color: GREEN, lineHeight: 1 }}>
                  {data.myPos}<span style={{ fontSize: "15px" }}>º</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {data.myMove == null ? (
                  <span style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>Tu posición en el ranking general</span>
                ) : data.myMove === 0 ? (
                  <span style={{ fontSize: "11px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>= Mantienes tu posición</span>
                ) : data.myMove > 0 ? (
                  <span style={{ fontSize: "12px", color: "#34d399", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                    ▲ Has subido {data.myMove} {data.myMove === 1 ? "puesto" : "puestos"}
                  </span>
                ) : (
                  <span style={{ fontSize: "12px", color: "#ff6b4a", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                    ▼ Has bajado {Math.abs(data.myMove)} {Math.abs(data.myMove) === 1 ? "puesto" : "puestos"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Partido a partido */}
          <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px" }}>TUS PRONÓSTICOS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "16px" }}>
            {data.rows.map(r => {
              const ht = getTeam(r.home), at = getTeam(r.away);
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
                  <span style={{ fontSize: "15px" }}>{ht.flag}</span>
                  <span style={{ flex: 1, fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.home} <b style={{ color: "#e0eaf8" }}>{r.rh}-{r.ra}</b> {r.away}
                  </span>
                  <span style={{ fontSize: "15px" }}>{at.flag}</span>
                  <span style={{ fontSize: "10px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", minWidth: "30px", textAlign: "center" }}>{r.pred}</span>
                  {ptsBadge(r.pts)}
                </div>
              );
            })}
          </div>

          {/* Resumen del grupo */}
          <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px" }}>EN EL GRUPO HOY</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {data.bestDay && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: GREEN_DIM, border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
                <span style={{ fontSize: "20px" }}>🔥</span>
                <span style={{ flex: 1, fontSize: "11px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif" }}>
                  Mejor del día: <b>{data.bestDay.emoji} {data.bestDay.name}</b>
                </span>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{data.bestDay.pts}</span>
              </div>
            )}
            {data.worstDay && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "rgba(255,107,74,0.06)", border: "1px solid rgba(255,107,74,0.2)", borderRadius: "8px" }}>
                <span style={{ fontSize: "20px" }}>🥶</span>
                <span style={{ flex: 1, fontSize: "11px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif" }}>
                  Peor del día: <b>{data.worstDay.emoji} {data.worstDay.name}</b>
                </span>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#ff6b4a" }}>{data.worstDay.pts}</span>
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "12px", borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", letterSpacing: "1px" }}>⚽ porra vallau · mundial 2026</span>
          </div>
        </div>

        {/* Botones (fuera de la imagen) */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <button onClick={dismiss} style={{
            flex: 1, padding: "13px", border: `1px solid ${BORDER}`, borderRadius: "10px",
            background: "transparent", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer",
          }}>Cerrar</button>
          <button onClick={share} disabled={sharing} style={{
            flex: 2, padding: "13px", border: "none", borderRadius: "10px",
            background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628",
            fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "1px",
          }}>{sharing ? "GENERANDO..." : "📲 COMPARTIR"}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EN VIVO — marcador, goleadores, alineaciones y puntos provisionales
// ============================================================
function LiveMatches({ user, matches }) {
  const [rows, setRows] = useState([]);
  const [myPreds, setMyPreds] = useState({});
  const [myKoPicks, setMyKoPicks] = useState({});
  const [openLineup, setOpenLineup] = useState(null);

  const load = async () => {
    const { data } = await supabase.from("live_matches").select("*")
      .in("status", ["1H", "HT", "2H", "ET", "BT", "P"]);
    setRows(data || []);
  };

  useEffect(() => {
    load();
    (async () => {
      const { data: p } = await supabase.from("predictions").select("*").eq("user_id", user.id).range(0, 99999);
      const pm = {}; (p || []).forEach(x => { pm[x.match_id] = x; }); setMyPreds(pm);
      const { data: kp } = await supabase.from("knockout_picks").select("*").eq("user_id", user.id);
      const km = {}; (kp || []).forEach(x => { km[x.match_id] = x; }); setMyKoPicks(km);
    })();
    const ch = supabase.channel("live_matches_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_matches" }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [user.id]);

  if (rows.length === 0) return null;

  const teamsOf = (r) => {
    if (r.match_id.startsWith("wc26_")) {
      const m = matches.find(x => x.id === r.match_id);
      return m ? { home: m.home, away: m.away } : null;
    }
    const rc = R32_CONFIRMED.find(x => x.match === r.match_id);
    if (rc) return { home: rc.home, away: rc.away };
    // KO posterior: sacamos los equipos de los eventos o mostramos genérico
    const ev = (r.events || []).find(e => e.team);
    return ev ? null : null;
  };

  const provisional = (r) => {
    const isKO = !r.match_id.startsWith("wc26_");
    // En KO puntúa el marcador de 90': si hay prórroga usamos el congelado
    const h = isKO && r.reg_home != null ? r.reg_home : r.home_goals;
    const a = isKO && r.reg_away != null ? r.reg_away : r.away_goals;
    if (isKO) {
      const pk = myKoPicks[r.match_id];
      if (!pk || pk.home_goals == null) return null;
      return { pts: koScore(pk.home_goals, pk.away_goals, h, a), pred: `${pk.home_goals}-${pk.away_goals}`, extra: true };
    }
    const p = myPreds[r.match_id];
    if (!p) return null;
    return { pts: calcPoints(p, h, a), pred: `${p.predicted_home}-${p.predicted_away}` };
  };

  const stLabel = (s, min) =>
    s === "HT" ? "DESCANSO" : s === "BT" ? "DESC. PRÓRROGA"
    : s === "ET" ? `PRÓRROGA ${min || ""}'` : s === "P" ? "PENALTIS" : `${min || 0}'`;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff4444", boxShadow: "0 0 8px #ff4444", animation: "pulse 1s infinite" }} />
        <p style={{ fontSize: "9px", color: "#ff6b4a", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>EN VIVO</p>
      </div>

      {rows.map(r => {
        const t = teamsOf(r);
        const ht = t ? getTeam(t.home) : { flag: "⚽" };
        const at = t ? getTeam(t.away) : { flag: "⚽" };
        const goals = (r.events || []).filter(e => e.type === "Goal" && e.detail !== "Missed Penalty");
        const prov = provisional(r);
        const isET = ["ET", "BT", "P"].includes(r.status);
        return (
          <div key={r.match_id} style={{ background: CARD, border: "1px solid rgba(255,68,68,0.35)", borderRadius: "12px", padding: "12px", marginBottom: "8px", animation: "fadeIn 0.3s ease" }}>
            {/* Marcador */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, textAlign: "right" }}>
                <span style={{ fontSize: "22px" }}>{ht.flag}</span>
                <div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{t?.home}</div>
              </div>
              <div style={{ textAlign: "center", minWidth: "80px" }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", color: "#e0eaf8", lineHeight: 1 }}>
                  {r.home_goals}<span style={{ color: "#7ab8e0", margin: "0 3px" }}>-</span>{r.away_goals}
                </div>
                <div style={{ fontSize: "9px", color: "#ff6b4a", fontFamily: "'Inter', sans-serif", fontWeight: 700, animation: "pulse 1.5s infinite" }}>
                  🔴 {stLabel(r.status, r.minute)}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "22px" }}>{at.flag}</span>
                <div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{t?.away}</div>
              </div>
            </div>

            {/* Aviso prórroga: para puntos cuenta el 90' */}
            {isET && r.reg_home != null && (
              <p style={{ fontSize: "9px", color: "#ffd54f", fontFamily: "'Inter', sans-serif", textAlign: "center", marginTop: "6px" }}>
                ⏱ A los 90': {r.reg_home}-{r.reg_away} (es el que puntúa)
              </p>
            )}

            {/* Goleadores */}
            {goals.length > 0 && (
              <div style={{ marginTop: "8px", padding: "8px 10px", background: "rgba(0,0,0,0.25)", borderRadius: "8px" }}>
                {goals.map((g, i) => (
                  <div key={i} style={{ fontSize: "10px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
                    ⚽ <b>{g.minLabel}'</b> {g.player}
                    {g.detail === "Penalty" ? " (pen.)" : g.detail === "Own Goal" ? " (p.p.)" : ""}
                    {g.assist ? <span style={{ color: "#7ab8e0" }}> · asist. {g.assist}</span> : ""}
                    <span style={{ color: "#7ab8e0" }}> — {g.team}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Puntos provisionales */}
            {prov && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px", padding: "7px", background: GREEN_DIM, borderRadius: "8px", border: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>Tu pronóstico {prov.pred} · si acaba así:</span>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: prov.pts > 0 ? GREEN : "#ff6b4a" }}>
                  {prov.pts > 0 ? `+${prov.pts}` : "+0"}
                </span>
              </div>
            )}

            {/* Alineaciones */}
            {r.lineups && (
              <button onClick={() => setOpenLineup(openLineup === r.match_id ? null : r.match_id)} style={{ width: "100%", marginTop: "8px", padding: "7px", border: `1px solid ${BORDER}`, borderRadius: "8px", background: "transparent", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", fontSize: "10px", cursor: "pointer", letterSpacing: "1px" }}>
                📋 {openLineup === r.match_id ? "OCULTAR ALINEACIONES" : "VER ALINEACIONES"}
              </button>
            )}
            {openLineup === r.match_id && r.lineups && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                {r.lineups.map((l, i) => (
                  <div key={i} style={{ background: "rgba(0,0,0,0.25)", borderRadius: "8px", padding: "8px" }}>
                    <div style={{ fontSize: "10px", color: GREEN, fontFamily: "'Inter', sans-serif", fontWeight: 700, marginBottom: "4px" }}>
                      {l.team} · {l.formation}
                    </div>
                    {l.startXI.map((p, j) => (
                      <div key={j} style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
                        <span style={{ color: "#7ab8e0" }}>{p.number}</span> {p.name}
                      </div>
                    ))}
                    {l.coach && <div style={{ fontSize: "8px", color: "#7ab8e0", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>DT: {l.coach}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// PANTALLA DE INICIO
// ============================================================
function HomeView({ user, matches, predictions, setView, loadingData }) {
  const sent = predictions.length;
  const pct = Math.round((sent / TOTAL_MATCHES) * 100);
  // Partidos de hoy (solo cuando el Mundial ya ha arrancado)
  const todayStr = new Date().toISOString().slice(0, 10);
  const mundialStarted = todayStr >= "2026-06-11";

  // 🆕 Resultados de eliminatoria para incluir los cruces del día
  const [koResults, setKoResults] = useState([]);
  useEffect(() => {
    const loadKo = async () => {
      const { data } = await supabase.from("knockout_results").select("*");
      setKoResults(data || []);
    };
    loadKo();
    const ch = supabase.channel("ko_results_home")
      .on("postgres_changes", { event: "*", schema: "public", table: "knockout_results" }, loadKo)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  // Grupos + eliminatoria juntos para "partidos de hoy"
  const koFixtures = buildKnockoutFixtures(matches, koResults);
  const todayMatches = [...matches, ...koFixtures]
    .filter(m => m.match_date === todayStr)
    .sort((a, b) => (a.match_time || "").localeCompare(b.match_time || ""));

  const [myRank, setMyRank] = useState(null);

  const [payInfo, setPayInfo] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("has_paid").eq("role", "user");
      const total = (data || []).length;
      const paidCount = (data || []).filter(p => p.has_paid).length;
      setPayInfo({ paid: paidCount, total, pot: paidCount * CUOTA });
    })();
  }, []);
  
  useEffect(() => {
    if (!mundialStarted) return;
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: preds } = await supabase.from("predictions").select("*").range(0, 99999);
      const { data: specialPreds } = await supabase.from("special_predictions").select("*");
      const r = (profiles || []).map(p => {
        const myPreds = (preds || []).filter(x => x.user_id === p.id && x.points !== null);
        const predMap = {};
        (preds || []).filter(x => x.user_id === p.id).forEach(x => { predMap[x.match_id] = x; });
        const qualPts = calcQualifierPoints(matches, predMap);
        const mySpecial = (specialPreds || []).find(x => x.user_id === p.id);
        const specialPts = mySpecial ? (mySpecial.top_scorer_points || 0) + (mySpecial.best_player_points || 0) : 0;
        return { id: p.id, total: myPreds.reduce((s, x) => s + (x.points || 0), 0) + qualPts + specialPts };
      }).sort((a, b) => b.total - a.total);

      const pos = r.findIndex(u => u.id === user.id);
      if (pos === -1) { setMyRank(null); return; }
      const me = r[pos];
      const ahead = pos > 0 ? r[pos - 1] : null; // el que va justo por delante
      setMyRank({
        position: pos + 1,
        total: me.total,
        toNext: ahead ? ahead.total - me.total : null,
        nextIsTie: ahead ? ahead.total === me.total : false,
      });
    })();
  }, [mundialStarted, matches, user.id]);
  
  const navCard = (icon, label, sub, color, border, bg, target) => (
    <button onClick={() => setView(target)} className="tappable" style={{
      padding: "18px 12px", border: `1px solid ${border}`, borderRadius: "14px",
      background: bg, cursor: "pointer", textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
    }}>
      <span style={{ fontSize: "30px", lineHeight: 1 }}>{icon}</span>
      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: "#e0eaf8", letterSpacing: "2px" }}>{label}</span>
      {sub && <span style={{ fontSize: "9px", color, fontFamily: "'Inter', sans-serif" }}>{sub}</span>}
    </button>
  );

  const boteCard = payInfo ? (
  <button onClick={() => setView("payments")} className="tappable" style={{
    width: "100%", display: "flex", alignItems: "center", gap: "14px",
    padding: "14px 16px", marginBottom: "20px", cursor: "pointer",
    background: "linear-gradient(135deg, rgba(255,213,79,0.14), rgba(230,161,0,0.05))",
    border: "1px solid rgba(255,213,79,0.4)", borderRadius: "14px",
  }}>
    <span style={{ fontSize: "32px", lineHeight: 1 }}>💰</span>
    <div style={{ flex: 1, textAlign: "left" }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#ffd54f", letterSpacing: "1px", lineHeight: 1 }}>
        BOTE · {payInfo.pot}€
      </div>
      <div style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginTop: "3px" }}>
        {payInfo.paid}/{payInfo.total} han pagado{payInfo.total - payInfo.paid > 0 ? ` · ${payInfo.total - payInfo.paid} morosos` : " · ¡completo! 🎉"}
      </div>
    </div>
    <span style={{ fontSize: "20px", color: "#ffd54f" }}>→</span>
  </button>
) : null;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <DailySummary user={user} matches={matches} />
      {mundialStarted && <LiveMatches user={user} matches={matches} />}
      {/* Cuenta atrás (solo antes de empezar) */}
      {!mundialStarted && <CountdownBanner />}
      {!mundialStarted && boteCard}
      {/* Partidos de hoy */}
      {mundialStarted && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: GREEN, boxShadow: `0 0 8px ${GREEN}`, animation: "pulse 1.5s infinite" }} />
            <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>PARTIDOS DE HOY</p>
          </div>
          {loadingData ? (
            <SkeletonRows count={2} height={60} />
          ) : todayMatches.length > 0 ? (
            todayMatches.map(m => {
              const ht = m.homeFlag ? { name: m.home, flag: m.homeFlag } : getTeam(m.home);
              const at = m.awayFlag ? { name: m.away, flag: m.awayFlag } : getTeam(m.away);
              const hasResult = m.result_home !== null && m.result_away !== null;
              const homeWin = hasResult && m.result_home > m.result_away;
              const awayWin = hasResult && m.result_away > m.result_home;
              return (
                <button key={m.id} onClick={() => setView("results")} className="tappable" style={{
                  display: "flex", alignItems: "center", gap: "10px", width: "100%",
                  padding: "11px 14px", marginBottom: "6px",
                  background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px",
                  cursor: "pointer", opacity: hasResult ? 1 : 0.85,
                }}>
                  {/* Local */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "7px", overflow: "hidden" }}>
                    <span style={{ fontSize: "13px", color: homeWin ? GREEN : "#c0d8f0", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.home}</span>
                    <span style={{ fontSize: "26px", lineHeight: 1, flexShrink: 0 }}>{ht.flag}</span>
                  </div>
                  {/* Centro: resultado o hora */}
                  <div style={{ flexShrink: 0, minWidth: "62px", textAlign: "center" }}>
                    {hasResult ? (
                      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eaf8", letterSpacing: "1px" }}>
                        <span style={{ color: homeWin ? GREEN : "#e0eaf8" }}>{m.result_home}</span>
                        <span style={{ color: "#7ab8e0", margin: "0 2px" }}>-</span>
                        <span style={{ color: awayWin ? GREEN : "#e0eaf8" }}>{m.result_away}</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>{m.match_time || "--:--"}h</span>
                    )}
                    <div style={{ fontSize: "8px", color: GREEN, fontFamily: "'Inter', sans-serif", marginTop: "3px", whiteSpace: "nowrap" }}>📺 {tvFor(m)}</div>
                  </div>
                  {/* Visitante */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "7px", overflow: "hidden" }}>
                    <span style={{ fontSize: "26px", lineHeight: 1, flexShrink: 0 }}>{at.flag}</span>
                    <span style={{ fontSize: "13px", color: awayWin ? GREEN : "#c0d8f0", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.away}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div style={{
              background: CARD, border: `1px dashed ${BORDER}`, borderRadius: "12px",
              padding: "28px 20px", textAlign: "center",
            }}>
              <div style={{ fontSize: "38px", marginBottom: "8px" }}>😴</div>
              <p style={{ fontSize: "12px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                Hoy no hay partidos.<br/>¡Vuelve mañana!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tu posición */}
      {mundialStarted && myRank && (
        <button onClick={() => setView("ranking")} className="tappable" style={{
          width: "100%", display: "flex", alignItems: "center", gap: "12px",
          padding: "12px 14px", marginBottom: "16px", cursor: "pointer",
          background: `linear-gradient(135deg, rgba(79,195,247,0.14), rgba(0,119,204,0.06))`,
          border: `1px solid ${GREEN}`, borderRadius: "12px",
        }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "8px", color: "#9cc4e6", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>VAS</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", color: GREEN, lineHeight: 1 }}>
              {myRank.position}<span style={{ fontSize: "15px" }}>º</span>
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#e0eaf8", lineHeight: 1 }}>{myRank.total}</span>
              <span style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>puntos</span>
            </div>
            <div style={{ fontSize: "10px", color: "#a8d4f0", fontFamily: "'Inter', sans-serif", marginTop: "3px", lineHeight: 1.4 }}>
              {myRank.position === 1
                ? "🥇 ¡Lideras la porra!"
                : myRank.toNext === 0
                  ? `Empatado con el ${myRank.position - 1}º`
                  : `Te faltan ${myRank.toNext} pts para el ${myRank.position - 1}º`}
            </div>
          </div>
          <span style={{ fontSize: "16px", color: GREEN, flexShrink: 0 }}>→</span>
        </button>
      )}

      {/* Grid de accesos */}
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>ACCESO RÁPIDO</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {navCard("⚽", "MIS PRONÓSTICOS", `${sent}/${TOTAL_MATCHES} enviados`, GREEN, "rgba(79,195,247,0.2)", "rgba(79,195,247,0.05)", "groups")}
        {navCard("👥", "TODOS", "ver todos los pronósticos", "#005599", "rgba(0,176,255,0.2)", "rgba(0,176,255,0.05)", "community")}
        {navCard("🏆", "RANKING", "clasificación general", "#ffd700", "rgba(255,215,0,0.2)", "rgba(255,215,0,0.05)", "ranking")}
        {navCard("📊", "RESULTADOS", "marcadores reales", GREEN, "rgba(79,195,247,0.2)", "rgba(79,195,247,0.05)", "results")}
        {navCard("🎮", "JUEGOS", "trivial · flappy · banderas", GREEN, "rgba(79,195,247,0.15)", "rgba(79,195,247,0.04)", "games")}
        {navCard("👤", "MI PERFIL", "estadísticas y comparativas", "#e0eefa", "rgba(79,195,247,0.15)", "rgba(255,255,255,0.03)", "profile")}
        {navCard("🏟️", "ELIMINATORIAS", "tu cuadro · pronósticos", "#34d399", "rgba(52,211,153,0.2)", "rgba(52,211,153,0.05)", "knockout")}
        {user.role === "admin" && navCard("⚙️", "ADMIN", "gestión de partidos", "#cc2222", "rgba(255,82,82,0.2)", "rgba(255,82,82,0.05)", "admin")}
        {user.role === "admin" && navCard("📸", "EXPORTAR", "ranking e imágenes", "#007a3a", "rgba(0,122,58,0.2)", "rgba(0,122,58,0.05)", "export")}
        {user.role === "admin" && navCard("⚙️", "RESULTADOS ELIM.", "cuadro real · admin", "#ffd54f", "rgba(255,213,79,0.2)", "rgba(255,213,79,0.05)", "knockout_results")}
      </div>

      {/* Antes del Mundial: progreso. Al empezar: el bote ocupa su sitio */}
      {mundialStarted ? boteCard : (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>PROGRESO DE PARTICIPANTES</p>
          <ParticipantProgress />
        </div>
      )}
    </div>
  );
}

const TRIVIA_QUESTIONS = [
  // — HISTORIA DE LOS MUNDIALES —
  { q: "¿En qué año se celebró el primer Mundial de fútbol?", opts: ["1928","1930","1934","1926"], a: 1 },
  { q: "¿Dónde se jugó el primer Mundial de fútbol?", opts: ["Brasil","Italia","Uruguay","Argentina"], a: 2 },
  { q: "¿Qué selección ganó el primer Mundial en 1930?", opts: ["Argentina","Uruguay","Brasil","USA"], a: 1 },
  { q: "¿Cuántos equipos participaron en el primer Mundial de 1930?", opts: ["13","16","12","8"], a: 0 },
  { q: "¿Qué país organizó el Mundial de 1934?", opts: ["Francia","Alemania","Italia","España"], a: 2 },
  { q: "¿Qué país ganó los Mundiales de 1934 y 1938?", opts: ["Brasil","Alemania","Italia","Argentina"], a: 2 },
  { q: "¿Cuántos Mundiales ha ganado Brasil?", opts: ["4","5","6","3"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado Alemania?", opts: ["3","4","5","2"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado Italia?", opts: ["3","4","5","2"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado Argentina?", opts: ["1","2","3","4"], a: 2 },
  { q: "¿Cuántos Mundiales ha ganado Francia?", opts: ["1","2","3","0"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado España?", opts: ["0","1","2","3"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado Inglaterra?", opts: ["0","1","2","3"], a: 1 },
  { q: "¿Qué país ha organizado el Mundial más veces?", opts: ["Italia","Francia","México","Brasil"], a: 2 },
  { q: "¿Qué países coorganizaron el Mundial 2002?", opts: ["Japón y China","Corea del Sur y Japón","China y Corea del Sur","Japón y Australia"], a: 1 },
  { q: "¿Qué país fue anfitrión del Mundial 2010?", opts: ["Nigeria","Kenia","Sudáfrica","Egipto"], a: 2 },
  { q: "¿Qué país fue anfitrión del Mundial 2014?", opts: ["Argentina","Chile","Colombia","Brasil"], a: 3 },
  { q: "¿Qué país fue anfitrión del Mundial 2018?", opts: ["Rusia","Ucrania","Polonia","Turquía"], a: 0 },
  { q: "¿Qué país fue anfitrión del Mundial 2022?", opts: ["Emiratos Árabes","Arabia Saudí","Qatar","Bahréin"], a: 2 },
  { q: "¿Qué selección ganó el Mundial 2010?", opts: ["Brasil","Alemania","España","Argentina"], a: 2 },
  { q: "¿Qué selección ganó el Mundial 2014?", opts: ["Argentina","Alemania","Brasil","Francia"], a: 1 },
  { q: "¿Qué selección ganó el Mundial 2018?", opts: ["Francia","Croacia","Bélgica","Argentina"], a: 0 },
  { q: "¿Qué selección ganó el Mundial 2022?", opts: ["Francia","Brasil","Argentina","Croacia"], a: 2 },
  { q: "¿Cuántos equipos europeos han ganado el Mundial fuera de Europa?", opts: ["0","1","2","3"], a: 0 },
  { q: "¿Qué año se disputó el Mundial en México por primera vez?", opts: ["1966","1970","1974","1978"], a: 1 },

  // — MUNDIAL 2026 —
  { q: "¿Cuántos equipos participan en el Mundial 2026?", opts: ["32","36","48","40"], a: 2 },
  { q: "¿En qué países se celebra el Mundial 2026?", opts: ["USA y México","USA, Canadá y México","USA, Canadá y Brasil","Canadá y México"], a: 1 },
  { q: "¿Cuántos grupos hay en la fase de grupos del Mundial 2026?", opts: ["8","10","12","16"], a: 2 },
  { q: "¿Cuántos equipos pasan de cada grupo en el Mundial 2026?", opts: ["1","2","3","4"], a: 1 },
  { q: "¿Cuántos partidos se jugarán en total en el Mundial 2026?", opts: ["64","80","96","104"], a: 2 },
  { q: "¿En qué estadio se jugará la final del Mundial 2026?", opts: ["Rose Bowl","Azteca","MetLife Stadium","AT&T Stadium"], a: 2 },
  { q: "¿En qué ciudad está el MetLife Stadium, sede de la final 2026?", opts: ["Nueva York","Los Ángeles","Dallas","Chicago"], a: 0 },
  { q: "¿Qué grupo compartirán España y Uruguay en el Mundial 2026?", opts: ["Grupo F","Grupo G","Grupo H","Grupo I"], a: 2 },
  { q: "¿Qué selección defiende el título en el Mundial 2026?", opts: ["Francia","Brasil","Argentina","Alemania"], a: 2 },
  { q: "¿En qué fecha comienza el Mundial 2026?", opts: ["11 de junio","1 de junio","15 de junio","20 de junio"], a: 0 },
  { q: "¿Cuántas sedes americanas tendrá el Mundial 2026 en total?", opts: ["12","14","16","20"], a: 2 },
  { q: "¿Qué selección de África debutará en el Mundial 2026?", opts: ["Etiopía","Tanzania","Cabo Verde","Ruanda"], a: 2 },
  { q: "¿Qué grupo tienen Argentina y Panamá en el Mundial 2026?", opts: ["Grupo I","Grupo J","Grupo K","Grupo L"], a: 1 },
  { q: "¿Cuál es el mascota oficial del Mundial 2026?", opts: ["Zakumi","Fuleco","Ola","Tezcat"], a: 3 },
  { q: "¿Cuántos equipos de CONMEBOL clasifican al Mundial 2026?", opts: ["4","5","6","7"], a: 2 },
  { q: "¿Qué selección va en el Grupo C junto a Brasil en el Mundial 2026?", opts: ["Portugal","Marruecos","Argentina","España"], a: 1 },
  { q: "¿Qué continente tiene más plazas en el Mundial 2026?", opts: ["América","Europa","África","Asia"], a: 1 },
  { q: "¿Cuántas plazas tiene UEFA en el Mundial 2026?", opts: ["13","14","16","17"], a: 2 },

  // — RÉCORDS Y ESTADÍSTICAS —
  { q: "¿Quién es el máximo goleador de la historia de los Mundiales?", opts: ["Ronaldo","Miroslav Klose","Pelé","Gerd Müller"], a: 1 },
  { q: "¿Cuántos goles marcó Miroslav Klose en Mundiales?", opts: ["14","16","15","13"], a: 1 },
  { q: "¿Cuántos goles marcó Pelé a lo largo de su carrera mundialista?", opts: ["10","12","15","8"], a: 1 },
  { q: "¿Cuántos goles marcó Mbappé en el Mundial 2022?", opts: ["6","7","8","5"], a: 2 },
  { q: "¿Cuál es el resultado más goleador en la historia del Mundial?", opts: ["10-1","11-0","12-0","9-0"], a: 2 },
  { q: "¿Entre qué selecciones se jugó el partido con el marcador 12-0?", opts: ["Alemania vs Brasil","Australia vs Samoa Americana","Brasil vs Bolivia","Hungría vs El Salvador"], a: 1 },
  { q: "¿Cuántos goles marcó Alemania a Brasil en las semis del 2014?", opts: ["6","7","8","5"], a: 1 },
  { q: "¿Quién marcó el primer hat-trick en la historia de los Mundiales?", opts: ["Bert Patenaude","Guillermo Stábile","Ademir","Sándor Kocsis"], a: 0 },
  { q: "¿Qué portero es conocido como 'La Araña Negra'?", opts: ["Oliver Kahn","Buffon","Lev Yashin","Casillas"], a: 2 },
  { q: "¿Quién marcó hat-trick en la final del Mundial 1966?", opts: ["Charlton","Hurst","Moore","Peters"], a: 1 },
  { q: "¿Cuál es el récord de goles en una sola edición del Mundial?", opts: ["171 (USA 1994)","171 (Francia 1998)","171 (Corea 2002)","147 (España 2010)"], a: 1 },
  { q: "¿Qué selección ha perdido más finales mundiales?", opts: ["Brasil","Argentina","Alemania","Italia"], a: 2 },
  { q: "¿Cuántas finales ha perdido Alemania en Mundiales?", opts: ["2","3","4","5"], a: 2 },
  { q: "¿Quién es el jugador más joven en marcar en un Mundial?", opts: ["Pelé","Mbappe","Cesc Fàbregas","Owen"], a: 0 },
  { q: "¿Con cuántos años marcó Pelé en el Mundial 1958?", opts: ["16","17","18","15"], a: 1 },
  { q: "¿Qué selección tiene la mayor racha de partidos invictos en Mundiales?", opts: ["Brasil","Italia","Alemania","España"], a: 2 },
  { q: "¿Cuántos goles lleva Cristiano Ronaldo en Mundiales?", opts: ["5","7","8","4"], a: 1 },
  { q: "¿Cuántos goles lleva Messi en Mundiales?", opts: ["10","12","13","9"], a: 2 },
  { q: "¿Quién tiene el récord de más Mundiales jugados (5)?", opts: ["Maldini","Cafu","Antonio Carbajal / Lothar Matthäus","Buffon"], a: 2 },
  { q: "¿Qué jugador fue expulsado más veces en la historia de los Mundiales?", opts: ["Zidane","Camoranesi","Rigobert Song","Leonardo"], a: 2 },

  // — SELECCIONES Y JUGADORES —
  { q: "¿Qué jugador ganó el Balón de Oro en el Mundial 2018?", opts: ["Modric","Mbappé","Griezmann","Hazard"], a: 0 },
  { q: "¿Quién ganó el Balón de Oro del Mundial 2022?", opts: ["Mbappé","Messi","Modric","Benzema"], a: 1 },
  { q: "¿Quién ganó la Bota de Oro del Mundial 2022?", opts: ["Messi","Benzema","Mbappé","Giroud"], a: 2 },
  { q: "¿Quién marcó el gol de la 'Mano de Dios'?", opts: ["Pelé","Ronaldo","Maradona","Zidane"], a: 2 },
  { q: "¿En qué Mundial debutó Pelé con solo 17 años?", opts: ["1954","1958","1962","1966"], a: 1 },
  { q: "¿Qué jugador fue expulsado en la final del Mundial 2006?", opts: ["Buffon","Maldini","Zidane","Trezeguet"], a: 2 },
  { q: "¿Cuántos Mundiales disputó Diego Maradona?", opts: ["2","3","4","5"], a: 2 },
  { q: "¿Qué selección eliminó a España en cuartos del Mundial 2018?", opts: ["Rusia","Francia","Croacia","Uruguay"], a: 0 },
  { q: "¿Qué selección eliminó a Brasil en cuartos del Mundial 2022?", opts: ["Argentina","Croacia","Francia","Holanda"], a: 1 },
  { q: "¿Qué selección llegó por primera vez a una final en el Mundial 2018?", opts: ["Bélgica","Dinamarca","Croacia","Suecia"], a: 2 },
  { q: "¿Qué arquero atajó el penal decisivo en la final del Mundial 2022?", opts: ["Lloris","Alisson","Martínez","Oblak"], a: 2 },
  { q: "¿Qué selección derrotó a Alemania en la fase de grupos del Mundial 2018?", opts: ["Suecia","México","Corea del Sur","Brasil"], a: 2 },
  { q: "¿Qué selección derrotó a Brasil en el 'Maracanazo' de 1950?", opts: ["Argentina","Paraguay","Uruguay","Colombia"], a: 2 },
  { q: "¿Cuántos jugadores tiene una selección en el torneo 2026?", opts: ["23","25","26","28"], a: 2 },
  { q: "¿Quién es el seleccionador de España para el Mundial 2026?", opts: ["Luis Enrique","Julen Lopetegui","Luis de la Fuente","Míchel"], a: 2 },
  { q: "¿Qué jugador argentino ganó su primer Mundial en 2022?", opts: ["Di María","Agüero","Messi","Dybala"], a: 2 },
  { q: "¿Qué portero ganó el guante de oro del Mundial 2022?", opts: ["Lloris","Courtois","Martínez","Szczesny"], a: 2 },
  { q: "¿Cuál es el nombre real del estadio 'Azteca' de México?", opts: ["Estadio Olímpico","Estadio Azteca","Estadio Ciudad de México","Estadio Nacional"], a: 1 },
  { q: "¿Qué selección ganó tres Mundiales consecutivos?", opts: ["Brasil","Alemania","Italia","Argentina"], a: 0 },
  { q: "¿Qué año ganó Brasil su primer Mundial?", opts: ["1950","1954","1958","1962"], a: 2 },
  { q: "¿Quién fue el goleador del Mundial 2014?", opts: ["Messi","James Rodríguez","Müller","Neymar"], a: 2 },
  { q: "¿Cuántos goles marcó el goleador del Mundial 2014?", opts: ["5","6","7","8"], a: 2 },

  // — MOMENTOS HISTÓRICOS —
  { q: "¿Cómo se llama el gol de cabeza de Zidane en la final del Mundial 2006?", opts: ["Cabezazo de Berlín","Golpe de Berlín","El golazo","El cabezazo dorado"], a: 0 },
  { q: "¿Qué portero paró el penal de Baggio en la final del Mundial 1994?", opts: ["Schmeichel","Taffarel","Kahn","Barthez"], a: 1 },
  { q: "¿Cómo se conoce la derrota de Brasil 7-1 ante Alemania en 2014?", opts: ["La vergüenza de Belo Horizonte","El Mineirazo","La goleada del siglo","El humillazo"], a: 1 },
  { q: "¿En qué estadio se disputó el Mineirazo en 2014?", opts: ["Maracaná","Castelão","Estádio Mineirão","Arena Corinthians"], a: 2 },
  { q: "¿Qué selección fue eliminada por Senegal en el Mundial 2002?", opts: ["Brasil","Argentina","Francia","España"], a: 2 },
  { q: "¿Qué árbitro pitó la final del Mundial 2006 siendo muy cuestionado?", opts: ["Howard Webb","Horacio Elizondo","Valentin Ivanov","Pierluigi Collina"], a: 1 },
  { q: "¿Cuántos penaltis fallaron en la final del Mundial 1994?", opts: ["1","2","3","4"], a: 1 },
  { q: "¿Qué jugador falló el penal decisivo en la final del Mundial 1994?", opts: ["Romario","Bebeto","Roberto Baggio","Maldini"], a: 2 },
  { q: "¿En qué Mundial ocurrió la 'Batalla de Santiago'?", opts: ["1954","1958","1962","1966"], a: 2 },
  { q: "¿Qué selección protagonizó el 'Milagro de Berna' en 1954?", opts: ["Brasil","Hungría","Alemania Occidental","Uruguay"], a: 2 },
  { q: "¿En qué año Alemania del Oeste venció a Hungría en la final de Suiza?", opts: ["1950","1954","1958","1962"], a: 1 },
  { q: "¿Qué árbitro anuló un gol a Maradona legítimamente en 1986?", opts: ["El de la mano de Dios","El gol del siglo","Todos sus goles","Ninguno"], a: 0 },
  { q: "¿En qué ciudad se jugó la polémica final del Mundial 1966?", opts: ["Manchester","Londres","Birmingham","Glasgow"], a: 1 },
  { q: "¿Qué jugador marcó en la final de 1966 para el 4-2 definitivo?", opts: ["Charlton","Moore","Hurst","Peters"], a: 2 },
  { q: "¿Cómo se llama el famoso gol de 60 metros de Maradona en 1986?", opts: ["El gol del milenio","El gol del siglo","El golazo de Azteca","La joya"], a: 1 },
];

// ============================================================
// JUEGO TRIVIAL
// ============================================================
function TriviaGame({ user, onBack }) {
  const [phase, setPhase] = useState("menu");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);
  const timerRef = useRef(null);

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const startGame = () => {
    const qs = shuffle(TRIVIA_QUESTIONS).slice(0, 10);
    setQuestions(qs); setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setTimeLeft(15);
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    if (answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, current, answered]);

  const handleAnswer = (idx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].a;
    const pts = correct ? (timeLeft >= 10 ? 3 : timeLeft >= 5 ? 2 : 1) : 0;
    setScore(s => s + pts);
  };

  const next = () => {
    if (current + 1 >= questions.length) { finishGame(); }
    else { setCurrent(c => c + 1); setSelected(null); setAnswered(false); setTimeLeft(15); }
  };

  const finishGame = async () => {
    const finalScore = score;
    setPhase("result");
    await supabase.from("trivia_scores").insert({ user_id: user.id, score: finalScore });
    loadRankings();
  };

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("trivia_scores").select("*").order("score", { ascending: false }).limit(20);
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser).map(([uid, sc]) => ({ name: profiles.find(p => p.id === uid)?.name || "Usuario", score: sc })).sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };

  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);

  const q = questions[current];
  const medals = ["🥇", "🥈", "🥉"];

  if (phase === "menu") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>TRIVIAL MUNDIAL</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.15)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🧠</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>TRIVIAL MUNDIAL 2026</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: "20px" }}>10 preguntas · 15 segundos por pregunta<br/><span style={{ color: GREEN }}>+3</span> rápido · <span style={{ color: "#ffd54f" }}>+2</span> normal · <span style={{ color: "#ff8a00" }}>+1</span> lento · <span style={{ color: "#cc2222" }}>+0</span> fallo</p>
        <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚡ JUGAR</button>
      </div>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING TRIVIAL</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>PTS</span>
        </div>
      ))}
    </div>
  );

  if (phase === "playing" && q) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
    {/* BOTÓN SALIR */}
    <button onClick={() => setPhase("menu")}
      style={{ marginBottom: "12px", padding: "6px 12px", border: `1px solid ${BORDER}`,
        borderRadius: "7px", background: "transparent", color: "#c0d8f0",
        cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
      ← Salir
    </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#d0e4f7" }}>Pregunta {current + 1}/10</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{score} PTS</span>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: `3px solid ${timeLeft > 8 ? GREEN : timeLeft > 4 ? "#ffd54f" : "#cc2222"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: timeLeft > 8 ? GREEN : timeLeft > 4 ? "#ffd54f" : "#cc2222" }}>{timeLeft}</span>
          </div>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(79,195,247,0.12)", borderRadius: "14px", padding: "20px", marginBottom: "14px" }}>
        <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", marginBottom: "16px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(current / 10) * 100}%`, background: GREEN, borderRadius: "3px" }} />
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#e0eaf8", lineHeight: 1.6, textAlign: "center" }}>{q.q}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {q.opts.map((opt, i) => {
          let bg = CARD, border = BORDER, color = "#a8d4f0";
          if (answered) {
            if (i === q.a) { bg = GREEN_DIM; border = "rgba(79,195,247,0.5)"; color = GREEN; }
            else if (i === selected) { bg = "rgba(255,82,82,0.1)"; border = "rgba(255,82,82,0.4)"; color = "#cc2222"; }
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} disabled={answered} style={{ padding: "14px 10px", border: `1px solid ${border}`, borderRadius: "10px", background: bg, color, fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: answered ? "default" : "pointer", textAlign: "left", lineHeight: 1.4 }}>
              <span style={{ color: "#cce0f5", marginRight: "6px" }}>{["A", "B", "C", "D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ marginTop: "14px", textAlign: "center" }}>
          {selected === q.a ? <p style={{ color: GREEN, fontFamily: "'Inter', sans-serif", fontSize: "13px", marginBottom: "12px" }}>✓ ¡Correcto! +{timeLeft >= 10 ? 3 : timeLeft >= 5 ? 2 : 1} pts</p> : <p style={{ color: "#cc2222", fontFamily: "'Inter', sans-serif", fontSize: "13px", marginBottom: "12px" }}>✗ Era: {q.opts[q.a]}</p>}
          <button onClick={next} style={{ padding: "12px 32px", border: "none", borderRadius: "9px", background: GREEN, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "2px" }}>{current + 1 >= questions.length ? "VER RESULTADO" : "SIGUIENTE →"}</button>
        </div>
      )}
    </div>
  );

  if (phase === "result") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
      <button onClick={() => setPhase("menu")} style={{ marginBottom: "20px", padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
      <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.15)", borderRadius: "14px", padding: "28px", marginBottom: "20px" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>{score >= 25 ? "🏆" : score >= 15 ? "⚽" : "😅"}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7", letterSpacing: "3px" }}>TU PUNTUACIÓN</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "64px", color: GREEN, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#c0d8f0", marginTop: "4px" }}>de 30 posibles</div>
        <p style={{ marginTop: "14px", fontSize: "12px", color: "#e0eefa", fontFamily: "'Inter', sans-serif" }}>{score >= 25 ? "¡Crack del balón! 🔥" : score >= 15 ? "Buen nivel futbolero ⚽" : "A repasar el mundial 😅"}</p>
      </div>
      <button onClick={startGame} style={{ padding: "13px 36px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "20px" }}>🔄 REPETIR</button>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING TRIVIAL</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>PTS</span>
        </div>
      ))}
    </div>
  );
  return null;
}

// ============================================================
// FLAPPY BALÓN
// ============================================================
function FlappyGame({ user, onBack }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const [phase, setPhase] = useState("menu");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);

  const W = 360, H = 500;
  const BALL_X = 80, GRAVITY = 0.35, JUMP = -6, PIPE_W = 52, GAP = 150, PIPE_SPEED = 2.2;
  const FLAGS = ["🇧🇷","🇩🇪","🇪🇸","🇫🇷","🇦🇷","🇵🇹","🇳🇱","🇧🇪","🇮🇹","🇲🇽","🇦🇺","🇯🇵","🇰🇷","🇺🇸","🇨🇦","🇳🇴","🇸🇳","🇨🇴","🇺🇾","🇭🇷"];

  const initState = () => ({
    ballY: H / 2, ballVY: 0, pipes: [], powerups: [],
    frame: 0, score: 0, alive: true,
  });

  const jump = () => { if (stateRef.current?.alive) stateRef.current.ballVY = JUMP; };
  const startGame = () => { stateRef.current = initState(); setScore(0); setPhase("playing"); };

  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const s = stateRef.current;
      if (!s) return;

      // Física
      s.ballVY += GRAVITY; s.ballY += s.ballVY; s.frame++;

      // Generar tubos
      if (s.frame % 115 === 0) {
        const gapY = 100 + Math.random() * (H - GAP - 180);
        s.pipes.push({ x: W + 10, gapY, flag: FLAGS[Math.floor(Math.random() * FLAGS.length)], scored: false });
      }

      // Generar bonificación ⭐ cada ~200 frames
      if (s.frame % 200 === 0) {
        s.powerups.push({ x: W + 10, y: 100 + Math.random() * (H - 220) });
      }

      // Mover tubos y puntuar
      s.pipes = s.pipes.filter(p => p.x > -PIPE_W - 10);
      s.pipes.forEach(p => {
        p.x -= PIPE_SPEED;
        if (!p.scored && p.x + PIPE_W < BALL_X) {
          p.scored = true;
          s.score += 1;
          setScore(s.score);
        }
      });

      // Mover bonificaciones
      s.powerups = s.powerups.filter(p => p.x > -20);
      s.powerups.forEach(p => { p.x -= PIPE_SPEED * 0.8; });

      // Colisión límites
      const br = 16;
      if (s.ballY - br < 0 || s.ballY + br > H) { endGame(); return; }

      // Colisión tubos
      for (const p of s.pipes) {
        if (BALL_X + br > p.x && BALL_X - br < p.x + PIPE_W) {
          if (s.ballY - br < p.gapY || s.ballY + br > p.gapY + GAP) {
            endGame(); return;
          }
        }
      }

      // Colisión bonificaciones → +5 puntos
      s.powerups = s.powerups.filter(p => {
        const hit = Math.abs(p.x - BALL_X) < 22 && Math.abs(p.y - s.ballY) < 22;
        if (hit) {
          s.score += 5;
          setScore(s.score);
        }
        return !hit;
      });

      // ── DIBUJO ──────────────────────────────────

      ctx.clearRect(0, 0, W, H);

      // Fondo
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#0a0a1a"); bgGrad.addColorStop(1, "#0a1a0a");
      ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

      // Estrellas
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137 + s.frame * 0.3) % W);
        const sy = (i * 53) % H;
        ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2); ctx.fill();
      }

      // Suelo
      ctx.fillStyle = "#1a3a1a"; ctx.fillRect(0, H - 20, W, 20);
      ctx.fillStyle = "#f59e0b"; ctx.fillRect(0, H - 22, W, 3);

      // Tubos
      s.pipes.forEach(p => {
        const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
        grad.addColorStop(0, "#1a4a1a"); grad.addColorStop(0.5, "#2a6a2a"); grad.addColorStop(1, "#1a4a1a");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(p.x, 0, PIPE_W, p.gapY - 6, [0, 0, 8, 8]); ctx.fill();
        ctx.fillStyle = "#f59e0b"; ctx.fillRect(p.x - 4, p.gapY - 18, PIPE_W + 8, 12);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(p.x, p.gapY + GAP + 6, PIPE_W, H - (p.gapY + GAP + 6), [8, 8, 0, 0]); ctx.fill();
        ctx.fillStyle = "#f59e0b"; ctx.fillRect(p.x - 4, p.gapY + GAP + 6, PIPE_W + 8, 12);
        ctx.font = "20px serif"; ctx.textAlign = "center"; ctx.fillText(p.flag, p.x + PIPE_W / 2, p.gapY + GAP / 2 + 7);
      });

      // Bonificaciones ⭐ con halo pulsante
      s.powerups.forEach(p => {
        const pulse = 0.5 + 0.5 * Math.sin(s.frame * 0.18);
        ctx.save();
        ctx.globalAlpha = pulse * 0.4;
        ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.font = "22px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("⭐", p.x, p.y);
        // Etiqueta +5
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("+5", p.x, p.y + 18);
        ctx.restore();
      });

      // Balón
      ctx.save();
      ctx.translate(BALL_X, s.ballY);
      ctx.rotate(s.frame * 0.08);
      ctx.font = "32px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("⚽", 0, 0);
      ctx.restore();

      // Marcador
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath(); ctx.roundRect(W / 2 - 36, 14, 72, 32, 8); ctx.fill();
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 20px 'Courier New'"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(s.score, W / 2, 30);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const endGame = async () => {
    const finalScore = stateRef.current?.score || 0;
    cancelAnimationFrame(rafRef.current);
    setScore(finalScore); setBestScore(b => Math.max(b, finalScore));
    stateRef.current = null; setPhase("dead");
    await supabase.from("flappy_scores").insert({ user_id: user.id, score: finalScore });
    loadRankings();
  };

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("flappy_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser).map(([uid, sc]) => ({ name: profiles.find(p => p.id === uid)?.name || "Usuario", score: sc })).sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };

  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);
  const medals = ["🥇", "🥈", "🥉"];
  const handleTap = () => { if (phase === "playing") jump(); else if (phase === "dead") startGame(); };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>FLAPPY BALÓN</p>
      </div>

      {phase === "menu" && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.15)", borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
            <div style={{ fontSize: "52px", marginBottom: "10px" }}>⚽</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>FLAPPY BALÓN</div>
            <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: "6px" }}>Esquiva las porterías · Toca para saltar</p>
            <p style={{ fontSize: "10px", color: "#f59e0b", fontFamily: "'Inter', sans-serif", marginBottom: "20px" }}>⭐ Recoge la estrella para +5 puntos</p>
            <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚡ JUGAR</button>
          </div>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING FLAPPY</p>
          {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
              <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
              <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
            </div>
          ))}
        </div>
      )}

      {(phase === "playing" || phase === "dead") && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <button onClick={() => { cancelAnimationFrame(rafRef.current); setPhase("menu"); }}
              style={{ padding: "6px 12px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#c0d8f0", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
              ← Salir
            </button>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: GREEN }}>{score}</span>
          </div>
          <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", border: `1px solid ${BORDER}`, cursor: "pointer", userSelect: "none" }}
            onClick={handleTap} onTouchStart={e => { e.preventDefault(); handleTap(); }}>
            <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", maxWidth: "100%" }} />
            {phase === "dead" && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <div style={{ fontSize: "40px" }}>💥</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#e0eaf8", letterSpacing: "3px" }}>GAME OVER</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: GREEN, lineHeight: 1 }}>{score}</div>
                <div style={{ padding: "12px 28px", background: GREEN, color: "#0a1628", borderRadius: "9px", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800 }}>TOCA PARA REPETIR</div>
              </div>
            )}
          </div>
          {phase === "playing" && (
            <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginTop: "10px" }}>
              Toca la pantalla o haz clic para saltar
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADIVINA LA BANDERA
// ============================================================
const FLAG_COUNTRIES = [
  { name: "México", flag: "🇲🇽" }, { name: "Corea del Sur", flag: "🇰🇷" }, { name: "Sudáfrica", flag: "🇿🇦" },
  { name: "Canadá", flag: "🇨🇦" }, { name: "Suiza", flag: "🇨🇭" }, { name: "Qatar", flag: "🇶🇦" },
  { name: "Brasil", flag: "🇧🇷" }, { name: "Marruecos", flag: "🇲🇦" }, { name: "Haití", flag: "🇭🇹" },
  { name: "Estados Unidos", flag: "🇺🇸" }, { name: "Paraguay", flag: "🇵🇾" }, { name: "Australia", flag: "🇦🇺" },
  { name: "Alemania", flag: "🇩🇪" }, { name: "Ecuador", flag: "🇪🇨" }, { name: "Costa de Marfil", flag: "🇨🇮" }, { name: "Curazao", flag: "🇨🇼" },
  { name: "Países Bajos", flag: "🇳🇱" }, { name: "Japón", flag: "🇯🇵" }, { name: "Túnez", flag: "🇹🇳" },
  { name: "Bélgica", flag: "🇧🇪" }, { name: "Egipto", flag: "🇪🇬" }, { name: "Irán", flag: "🇮🇷" }, { name: "Nueva Zelanda", flag: "🇳🇿" },
  { name: "España", flag: "🇪🇸" }, { name: "Cabo Verde", flag: "🇨🇻" }, { name: "Arabia Saudí", flag: "🇸🇦" }, { name: "Uruguay", flag: "🇺🇾" },
  { name: "Francia", flag: "🇫🇷" }, { name: "Senegal", flag: "🇸🇳" }, { name: "Noruega", flag: "🇳🇴" },
  { name: "Argentina", flag: "🇦🇷" }, { name: "Panamá", flag: "🇵🇦" }, { name: "Argelia", flag: "🇩🇿" },
  { name: "Inglaterra", flag: "🇬🇧" }, { name: "Colombia", flag: "🇨🇴" }, { name: "Uzbekistán", flag: "🇺🇿" }, { name: "Jordania", flag: "🇯🇴" },
  { name: "Portugal", flag: "🇵🇹" }, { name: "Croacia", flag: "🇭🇷" }, { name: "Ghana", flag: "🇬🇭" }, { name: "Austria", flag: "🇦🇹" },
];

function FlagsGame({ user, onBack }) {
  const [phase, setPhase] = useState("menu");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const buildQuestions = () => {
    const pool = shuffle([...FLAG_COUNTRIES]);
    return pool.slice(0, 10).map(correct => {
      const wrong = shuffle(FLAG_COUNTRIES.filter(c => c.name !== correct.name)).slice(0, 3);
      return { correct, opts: shuffle([correct, ...wrong]) };
    });
  };

  const startGame = () => {
    setQuestions(buildQuestions());
    setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setStreak(0);
    setPhase("playing");
  };

  const handleAnswer = (name) => {
    if (answered) return;
    setSelected(name);
    setAnswered(true);
    const isCorrect = name === questions[current].correct.name;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(s => s + (newStreak >= 3 ? 2 : 1));
    } else {
      setStreak(0);
    }
  };

  const next = async () => {
    if (current + 1 >= questions.length) {
      setPhase("result");
      await supabase.from("flags_scores").insert({ user_id: user.id, score });
      loadRankings();
    } else {
      setCurrent(c => c + 1); setSelected(null); setAnswered(false);
    }
  };

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("flags_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser).map(([uid, sc]) => ({ name: profiles.find(p => p.id === uid)?.name || "Usuario", score: sc })).sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };

  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);
  const medals = ["🥇", "🥈", "🥉"];
  const q = questions[current];

  if (phase === "menu") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>ADIVINA LA BANDERA</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(255,193,7,0.2)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌍</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>ADIVINA LA BANDERA</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: "20px" }}>10 banderas del Mundial 2026<br/><span style={{ color: GREEN }}>+1</span> acierto · <span style={{ color: "#ffd54f" }}>+2</span> con racha de 3 seguidas 🔥</p>
        <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg,#ffd54f,#ff8a00)", color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚡ JUGAR</button>
      </div>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING BANDERAS</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? "rgba(255,193,7,0.1)" : CARD, border: i === 0 ? "1px solid rgba(255,193,7,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? "#ffd54f" : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>PTS</span>
        </div>
      ))}
    </div>
  );

  if (phase === "playing" && q) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
    {/* BOTÓN SALIR */}
    <button onClick={() => setPhase("menu")}
      style={{ marginBottom: "12px", padding: "6px 12px", border: `1px solid ${BORDER}`,
        borderRadius: "7px", background: "transparent", color: "#c0d8f0",
        cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>
      ← Salir
    </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#d0e4f7" }}>{current + 1}/10</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {streak >= 2 && <span style={{ fontSize: "10px", fontFamily: "'Inter', sans-serif", color: "#ffd54f" }}>🔥 ×{streak}</span>}
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#ffd54f" }}>{score} PTS</span>
        </div>
      </div>
      <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(current / 10) * 100}%`, background: "#ffd54f", borderRadius: "3px" }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "96px", lineHeight: 1, marginBottom: "12px" }}>{q.correct.flag}</div>
        <p style={{ fontSize: "12px", color: "#a8d4f0", fontFamily: "'Inter', sans-serif" }}>¿De qué país es esta bandera?</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {q.opts.map(opt => {
          let bg = CARD, border = BORDER, color = "#a8d4f0";
          if (answered) {
            if (opt.name === q.correct.name) { bg = GREEN_DIM; border = "rgba(79,195,247,0.5)"; color = GREEN; }
            else if (opt.name === selected) { bg = "rgba(255,82,82,0.1)"; border = "rgba(255,82,82,0.4)"; color = "#cc2222"; }
          }
          return (
            <button key={opt.name} onClick={() => handleAnswer(opt.name)} disabled={answered}
              style={{ padding: "14px 10px", border: `1px solid ${border}`, borderRadius: "10px", background: bg, color, fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: answered ? "default" : "pointer", textAlign: "center" }}>
              {opt.name}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ marginTop: "14px", textAlign: "center" }}>
          {selected === q.correct.name
            ? <p style={{ color: GREEN, fontFamily: "'Inter', sans-serif", fontSize: "13px", marginBottom: "12px" }}>✓ ¡Correcto! {streak >= 3 ? "+2 🔥 RACHA!" : "+1"}</p>
            : <p style={{ color: "#cc2222", fontFamily: "'Inter', sans-serif", fontSize: "13px", marginBottom: "12px" }}>✗ Era {q.correct.name}</p>}
          <button onClick={next} style={{ padding: "12px 32px", border: "none", borderRadius: "9px", background: "#ffd54f", color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "2px" }}>{current + 1 >= questions.length ? "VER RESULTADO" : "SIGUIENTE →"}</button>
        </div>
      )}
    </div>
  );

  if (phase === "result") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
      <button onClick={() => setPhase("menu")} style={{ marginBottom: "20px", padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
      <div style={{ background: CARD, border: "1px solid rgba(255,193,7,0.2)", borderRadius: "14px", padding: "28px", marginBottom: "20px" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>{score >= 14 ? "🏆" : score >= 8 ? "🌍" : "😅"}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7", letterSpacing: "3px" }}>TU PUNTUACIÓN</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "64px", color: "#ffd54f", lineHeight: 1 }}>{score}</div>
        <p style={{ marginTop: "10px", fontSize: "12px", color: "#e0eefa", fontFamily: "'Inter', sans-serif" }}>{score >= 14 ? "¡Experto en geografía! 🌍" : score >= 8 ? "Buen conocimiento ⚽" : "A practicar geografía 😅"}</p>
      </div>
      <button onClick={startGame} style={{ padding: "13px 36px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg,#ffd54f,#ff8a00)", color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "20px" }}>🔄 REPETIR</button>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING BANDERAS</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? "rgba(255,193,7,0.1)" : CARD, border: i === 0 ? "1px solid rgba(255,193,7,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? "#ffd54f" : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>PTS</span>
        </div>
      ))}
    </div>
  );
  return null;
}

// ============================================================
// JUEGO TRAGAPERRAS
// ============================================================

function SlotGame({ user, onBack }) {
  const SYMBOLS = [
    { s: "⚽", w: 30 }, { s: "🏆", w: 35 }, { s: "🥅", w: 40 }, { s: "🌟", w: 45 }, { s: "🥇", w: 50 },
    { s: "🇪🇸", w: 6 }, { s: "🇧🇷", w: 6 }, { s: "🇫🇷", w: 6 }, { s: "🇦🇷", w: 6 }, { s: "🇩🇪", w: 6 },
    { s: "🇵🇹", w: 6 }, { s: "🇳🇱", w: 6 }, { s: "🇧🇪", w: 6 }, { s: "🇯🇵", w: 6 }, { s: "🇲🇽", w: 6 },
  ];
  const FLAGS = ["🇪🇸","🇧🇷","🇫🇷","🇦🇷","🇩🇪","🇵🇹","🇳🇱","🇧🇪","🇯🇵","🇲🇽"];
  const POOL = [];
  SYMBOLS.forEach(({ s, w }) => { for (let i = 0; i < w; i++) POOL.push(s); });

  const [credits, setCredits] = useState(100);
  const [bet, setBet] = useState(5);
  const [spinning, setSpinning] = useState(false);
  const [display, setDisplay] = useState(["⚽", "⚽", "⚽"]);
  const [msg, setMsg] = useState({ text: "Elige apuesta y gira", type: "" });
  const [showPaytable, setShowPaytable] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);
  const intervalsRef = useRef([]);

  const weightedRand = () => POOL[Math.floor(Math.random() * POOL.length)];

  const evalResult = ([a, b, c]) => {
    if (a === b && b === c) {
      if (a === "⚽") return { mult: 50, label: "🎰 JACKPOT — Tres balones!", type: "jackpot" };
      if (a === "🏆") return { mult: 30, label: "🏆 Tres trofeos!", type: "jackpot" };
      if (a === "🥅") return { mult: 20, label: "🥅 Tres porterías!", type: "big" };
      if (a === "🌟") return { mult: 15, label: "🌟 Tres estrellas!", type: "big" };
      if (a === "🥇") return { mult: 10, label: "🥇 Tres medallas!", type: "win" };
      if (FLAGS.includes(a)) return { mult: 8, label: "Tres banderas iguales!", type: "win" };
    }
    if ([a, b, c].every(x => FLAGS.includes(x))) return { mult: 5, label: "Tres banderas distintas!", type: "win" };
    if ([a, b, c].filter(x => FLAGS.includes(x)).length === 2) return { mult: 2, label: "Dos banderas!", type: "win" };
    return { mult: 0, label: "Sin premio. Suerte la próxima!", type: "lose" };
  };

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("slot_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser).map(([uid, sc]) => ({
        name: profiles.find(p => p.id === uid)?.name || "Usuario", score: sc
      })).sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };

  useEffect(() => {
    loadRankings();
    (async () => {
      const { data } = await supabase
        .from("slot_credits")
        .select("credits")
        .eq("user_id", user.id)
        .single();
      if (data) setCredits(data.credits);
    })();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("slot_credits").upsert(
      { user_id: user.id, credits },
      { onConflict: "user_id" }
    );
  }, [credits]);

  const spin = async () => {
    if (spinning || credits < bet) return;
    setSpinning(true);
    setCredits(c => c - bet);
    setMsg({ text: "Girando...", type: "" });

    const finals = [weightedRand(), weightedRand(), weightedRand()];

    intervalsRef.current.forEach(clearInterval);
    const newIntervals = finals.map((final, i) => {
      return setInterval(() => {
        setDisplay(prev => {
          const next = [...prev];
          next[i] = weightedRand();
          return next;
        });
      }, 80);
    });
    intervalsRef.current = newIntervals;

    finals.forEach((final, i) => {
      setTimeout(() => {
        clearInterval(newIntervals[i]);
        setDisplay(prev => {
          const next = [...prev];
          next[i] = final;
          return next;
        });
        if (i === 2) {
          setTimeout(() => {
            const res = evalResult(finals);
            if (res.mult > 0) {
              const won = bet * res.mult;
              setCredits(c => {
                const total = c + won;
                supabase.from("slot_scores").insert({ user_id: user.id, score: total }).then(() => loadRankings());
                return total;
              });
              setMsg({ text: `${res.label} (+${bet * res.mult} créditos)`, type: res.type });
            } else {
              setMsg({ text: res.label, type: "lose" });
            }
            setSpinning(false);
          }, 200);
        }
      }, 600 + i * 400);
    });
  };

  const reset = () => {
    if (spinning) return;
    intervalsRef.current.forEach(clearInterval);
    setCredits(100);
    setBet(5);
    setDisplay(["⚽", "⚽", "⚽"]);
    setMsg({ text: "Elige apuesta y gira", type: "" });
    supabase.from("slot_credits").upsert(
      { user_id: user.id, credits: 100 },
      { onConflict: "user_id" }
    );
  };

  const msgColor = {
    jackpot: GREEN,
    big: "#f59e0b",
    win: "#4ade80",
    lose: "#7ab8e0",
    "": "#d0e4f7",
  }[msg.type] || "#d0e4f7";

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}> MUNDIAL</p>
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px", marginBottom: "16px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>CRÉDITOS</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN }}>{credits}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>APUESTA</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#f59e0b" }}>{bet}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
          {display.map((sym, i) => (
            <div key={i} style={{
              width: "88px", height: "88px",
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${spinning ? GREEN : BORDER}`,
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "44px",
              transition: "border-color 0.3s",
              boxShadow: spinning ? `0 0 8px rgba(79,195,247,0.2)` : "none",
            }}>
              {sym}
            </div>
          ))}
        </div>

        <div style={{
          minHeight: "32px", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Inter', sans-serif", fontSize: "12px", color: msgColor,
          background: msg.type ? "rgba(0,0,0,0.2)" : "transparent",
          borderRadius: "8px", padding: "6px 12px", marginBottom: "16px",
          fontWeight: msg.type === "jackpot" ? 700 : 400,
        }}>
          {msg.text}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px" }}>APUESTA</p>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
            {[1, 5, 10, 25].map(n => (
              <button key={n} onClick={() => !spinning && setBet(n)} style={{
                padding: "7px 14px", border: `1px solid ${bet === n ? GREEN : BORDER}`,
                borderRadius: "7px", background: bet === n ? GREEN_DIM : "transparent",
                color: bet === n ? GREEN : "#d0e4f7",
                fontFamily: "'Bebas Neue', cursive", fontSize: "16px", cursor: "pointer",
              }}>{n}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <button onClick={spin} disabled={spinning || credits < bet} style={{
            padding: "12px 36px", border: "none", borderRadius: "9px",
            background: spinning || credits < bet ? "rgba(0,0,0,0.2)" : `linear-gradient(135deg,${GREEN},#0077cc)`,
            color: spinning || credits < bet ? "#7ab8e0" : "#0a1628",
            fontFamily: "'Bebas Neue', cursive", fontSize: "18px", cursor: spinning || credits < bet ? "default" : "pointer",
            letterSpacing: "3px",
          }}>
            {spinning ? "GIRANDO..." : "🎰 GIRAR"}
          </button>
          <button onClick={reset} disabled={spinning} style={{
            padding: "12px 16px", border: `1px solid ${BORDER}`, borderRadius: "9px",
            background: "transparent", color: "#d0e4f7",
            fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer",
          }}>Reset</button>
        </div>
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", marginBottom: "16px", overflow: "hidden" }}>
        <button onClick={() => setShowPaytable(v => !v)} style={{
          width: "100%", padding: "12px 14px", border: "none", background: "transparent",
          color: "#d0e4f7", fontFamily: "'Inter', sans-serif", fontSize: "10px", letterSpacing: "2px",
          cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>TABLA DE PREMIOS</span>
          <span>{showPaytable ? "▲" : "▼"}</span>
        </button>
        {showPaytable && [
          ["⚽⚽⚽", "x50 — JACKPOT"],
          ["🏆🏆🏆", "x30"],
          ["🥅🥅🥅", "x20"],
          ["🌟🌟🌟", "x15"],
          ["🥇🥇🥇", "x10"],
          ["Bandera x3 iguales", "x8"],
          ["Bandera x3 distintas", "x5"],
          ["2 banderas", "x2"],
        ].map(([sym, pay]) => (
          <div key={sym} style={{ display: "flex", justifyContent: "space-between", padding: "7px 14px", borderTop: `1px solid ${BORDER}`, fontSize: "12px" }}>
            <span style={{ color: "#e0eaf8", fontFamily: "'Inter', sans-serif" }}>{sym}</span>
            <span style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive", fontSize: "14px" }}>{pay}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING — MEJOR BOTE</p>
      {loadingRank
        ? <SkeletonRanking count={4} />
        : rankings.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? `1px solid rgba(79,195,247,0.3)` : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
            <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
            <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
            <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>CRÉDITOS</span>
          </div>
        ))
      }
    </div>
  );
}

// ============================================================
// PENALTIS EN TIEMPO REAL — Canvas animado
// ============================================================
const PENALTY_DIRS = ["izq", "centro", "der"];
const PENALTY_LABELS = { izq: "← Izq", centro: "↑ Centro", der: "→ Der" };

const SHOOTERS = [
  { name: "MESSI", num: "10", shirt: "#6dc8f3", shorts: "#1a1a4e", skin: "#f5c89a" },
  { name: "MBAPPÉ", num: "10", shirt: "#002395", shorts: "#002395", skin: "#7a4a2a" },
  { name: "VINICIUS", num: "7",  shirt: "#ffd700", shorts: "#009900", skin: "#6b3a1a" },
  { name: "BELLINGHAM", num: "22", shirt: "#ffffff", shorts: "#c0392b", skin: "#c8915a" },
  { name: "PEDRI", num: "8",  shirt: "#a50044", shorts: "#004d98", skin: "#f0c090" },
  { name: "LEWANDOWSKI", num: "9", shirt: "#dc143c", shorts: "#ffffff", skin: "#f5d5b0" },
  { name: "SALAH", num: "11", shirt: "#cc0000", shorts: "#cc0000", skin: "#b07040" },
  { name: "KANE", num: "9",  shirt: "#ffffff", shorts: "#c0392b", skin: "#f0d0b0" },
  { name: "RONALDO", num: "7",  shirt: "#006600", shorts: "#cc0000", skin: "#d4a070" },
  { name: "YAMAL", num: "19", shirt: "#a50044", shorts: "#004d98", skin: "#f0c090" },
];

const KEEPERS = [
  { name: "OBLAK", num: "1",  shirt: "#ff6600", shorts: "#333333", skin: "#f5d5b0" },
  { name: "COURTOIS", num: "1",  shirt: "#ff0000", shorts: "#000000", skin: "#f5e0c0" },
  { name: "ALISSON", num: "1",  shirt: "#006600", shorts: "#006600", skin: "#7a4a2a" },
  { name: "EDERSON", num: "31", shirt: "#6eccf5", shorts: "#1c2c5b", skin: "#6b3a1a" },
  { name: "TER STEGEN", num: "1",  shirt: "#a50044", shorts: "#004d98", skin: "#f5e0c0" },
  { name: "DONNARUMMA", num: "1",  shirt: "#009246", shorts: "#009246", skin: "#f0c8a0" },
  { name: "PICKFORD", num: "1",  shirt: "#ffff00", shorts: "#333333", skin: "#f5e0c0" },
  { name: "SZCZESNY", num: "1",  shirt: "#dc143c", shorts: "#ffffff", skin: "#f5d5b0" },
];

function pickRandom(arr, seed) {
  return arr[seed % arr.length];
}

function drawPlayer(ctx, x, y, scale, shirt, shorts, skin, num, name, lean, legAngle, armAngle, isGk) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(lean);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Shadow
  ctx.save();
  ctx.scale(1, 0.3);
  ctx.beginPath();
  ctx.ellipse(0, 62, 14, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fill();
  ctx.restore();

  // Legs
  const legW = 6;
  // Left leg
  ctx.save();
  ctx.translate(-6, 20);
  ctx.rotate(isGk ? lean * 0.5 : 0);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-3, 22);
  ctx.strokeStyle = shorts; ctx.lineWidth = legW; ctx.stroke();
  // Boot left
  ctx.beginPath();
  ctx.moveTo(-3, 22); ctx.lineTo(-7, 28);
  ctx.strokeStyle = "#111"; ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();

  // Right leg (kicking)
  ctx.save();
  ctx.translate(6, 20);
  ctx.rotate(isGk ? -lean * 0.5 : -legAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(4, 22);
  ctx.strokeStyle = shorts; ctx.lineWidth = legW; ctx.stroke();
  // Boot right
  ctx.save();
  ctx.translate(4, 22);
  ctx.rotate(isGk ? 0 : legAngle * 0.5);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(8, 5);
  ctx.strokeStyle = "#111"; ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();
  ctx.restore();

  // Shirt body
  ctx.beginPath();
  ctx.moveTo(-12, -8);
  ctx.lineTo(-13, 20);
  ctx.lineTo(13, 20);
  ctx.lineTo(12, -8);
  ctx.closePath();
  ctx.fillStyle = shirt;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = 0.5; ctx.stroke();

  // Shirt stripe accent
  ctx.beginPath();
  ctx.moveTo(-3, -8); ctx.lineTo(-3, 20); ctx.lineTo(3, 20); ctx.lineTo(3, -8);
  ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fill();

  // Number on shirt
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(num, 0, 7);

  // Left arm
  ctx.save();
  ctx.translate(-12, 0);
  ctx.rotate(isGk ? armAngle : -0.3);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-10, 14);
  ctx.strokeStyle = shirt; ctx.lineWidth = 6; ctx.stroke();
  // Hand
  ctx.beginPath(); ctx.arc(-10, 14, 4, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.restore();

  // Right arm
  ctx.save();
  ctx.translate(12, 0);
  ctx.rotate(isGk ? -armAngle : 0.4);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(10, 14);
  ctx.strokeStyle = shirt; ctx.lineWidth = 6; ctx.stroke();
  ctx.beginPath(); ctx.arc(10, 14, 4, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.restore();

  // Neck
  ctx.beginPath(); ctx.moveTo(-3, -8); ctx.lineTo(-3, -14); ctx.moveTo(3, -8); ctx.lineTo(3, -14);
  ctx.strokeStyle = skin; ctx.lineWidth = 5; ctx.stroke();

  // Head
  ctx.beginPath(); ctx.arc(0, -22, 10, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 0.5; ctx.stroke();

  // Hair (simple)
  ctx.beginPath();
  ctx.arc(0, -28, 9, Math.PI, 0);
  ctx.fillStyle = isGk ? "#222" : "#1a0a00";
  ctx.fill();

  // Eyes
  ctx.beginPath(); ctx.arc(-3.5, -22, 1.5, 0, Math.PI * 2);
  ctx.beginPath(); ctx.arc(3.5, -22, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1a1a"; ctx.fill();

  // Name tag below
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(name, 0, 32);

  ctx.restore();
}

// Draw idle scene (jugadores en posicion, sin animacion)
function drawIdleScene(ctx, W, H, shooter, keeper, highlightZone) {
  const GW = W * 0.74, GH = H * 0.44;
  const GX = (W - GW) / 2, GY = H * 0.04;

  // Pitch
  ctx.fillStyle = "#111c0e"; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#173212" : "#1a3a15";
    ctx.fillRect(i * (W / 6), H * 0.55, W / 6, H * 0.45);
  }
  ctx.beginPath();
  ctx.arc(W / 2, H * 0.97, H * 0.22, Math.PI * 1.15, Math.PI * 1.85);
  ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.beginPath(); ctx.arc(W / 2, H * 0.82, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(GX - 14, GY + GH); ctx.lineTo(GX + GW + 14, GY + GH);
  ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 0.7;
  for (let nx = GX + 8; nx < GX + GW; nx += GW / 10) {
    ctx.beginPath(); ctx.moveTo(nx, GY + 4); ctx.lineTo(nx + 5, GY + GH - 2); ctx.stroke();
  }
  for (let ny = GY + 6; ny < GY + GH; ny += GH / 5) {
    ctx.beginPath(); ctx.moveTo(GX + 4, ny); ctx.lineTo(GX + GW - 4, ny); ctx.stroke();
  }

  // Highlight zones inside goal
  const zones = {
    izq:    { x: GX + 2,           y: GY + 2, w: GW * 0.33,  h: GH - 4 },
    centro: { x: GX + GW * 0.33,   y: GY + 2, w: GW * 0.34,  h: GH - 4 },
    der:    { x: GX + GW * 0.67,   y: GY + 2, w: GW * 0.33 - 2, h: GH - 4 },
  };
  Object.entries(zones).forEach(([key, z]) => {
    const isHover = highlightZone === key;
    ctx.fillStyle = isHover ? "rgba(79,195,247,0.25)" : "rgba(255,255,255,0.04)";
    ctx.fillRect(z.x, z.y, z.w, z.h);
    if (isHover) {
      ctx.strokeStyle = "rgba(79,195,247,0.7)"; ctx.lineWidth = 2;
      ctx.strokeRect(z.x, z.y, z.w, z.h);
    }
    // Zone label
    ctx.font = "bold 11px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = isHover ? "#f59e0b" : "rgba(255,255,255,0.3)";
    const label = key === "izq" ? "←" : key === "centro" ? "↑" : "→";
    ctx.fillText(label, z.x + z.w / 2, z.y + z.h / 2);
  });

  // Keeper idle (slight sway)
  drawPlayer(ctx, W / 2, GY + GH - 5, 0.85, keeper.shirt, keeper.shorts, keeper.skin, keeper.num, keeper.name, 0, 0, 0.3, true);

  // Posts (on top of keeper)
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(GX + 3, GY + 3, 5, GH); ctx.fillRect(GX + GW - 10, GY + 3, 5, GH); ctx.fillRect(GX + 3, GY + 3, GW - 6, 5);
  ctx.fillStyle = "#f0f0e8";
  ctx.fillRect(GX, GY, 5, GH); ctx.fillRect(GX + GW - 5, GY, 5, GH); ctx.fillRect(GX, GY, GW, 5);
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(GX + 1, GY + 1, 2, GH);

  // Ball on spot
  const ballR = 9;
  ctx.save(); ctx.translate(W / 2, H * 0.82);
  ctx.beginPath(); ctx.arc(0, 0, ballR, 0, Math.PI * 2);
  const bg = ctx.createRadialGradient(-3, -3, 1, 0, 0, ballR);
  bg.addColorStop(0, "#fff"); bg.addColorStop(0.7, "#e8e8e8"); bg.addColorStop(1, "#bbb");
  ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = "#1a1a1a";
  for (let p = 0; p < 5; p++) { const a = (p/5)*Math.PI*2; ctx.beginPath(); ctx.arc(Math.cos(a)*ballR*0.5, Math.sin(a)*ballR*0.5, ballR*0.22, 0, Math.PI*2); ctx.fill(); }
  ctx.restore();

  // Shooter idle
  drawPlayer(ctx, W / 2, H * 0.87, 1.0, shooter.shirt, shooter.shorts, shooter.skin, shooter.num, shooter.name, 0, 0, 0.15, false);
}

function usePenaltyCanvas(canvasRef, animState) {
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const playersRef = useRef(null);

  useEffect(() => {
    if (!animState || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    frameRef.current = 0;
    const { shootDir, saveDir, scored, seed } = animState;

    if (!playersRef.current || animState !== playersRef.current.state) {
      const s = seed || Math.floor(Math.random() * 999);
      playersRef.current = { state: animState, shooter: pickRandom(SHOOTERS, s), keeper: pickRandom(KEEPERS, s + 3) };
    }
    const { shooter, keeper } = playersRef.current;

    const GW = W * 0.74, GH = H * 0.44;
    const GX = (W - GW) / 2, GY = H * 0.04;
    const POST = 5;

    // Todo desde perspectiva del ESPECTADOR
    // izq = izquierda de pantalla, der = derecha de pantalla
    const zonasX = {
      izq:    GX + GW * 0.2,
      centro: GX + GW * 0.5,
      der:    GX + GW * 0.8,
    };

    const ballStartX = W / 2, ballStartY = H * 0.87;
    const ballEndX = zonasX[shootDir];
    const ballEndY = GY + GH * 0.5;

    const gkStartX = W / 2, gkStartY = GY + GH - 5;

    // El portero se mueve a la zona donde el lanzador disparó
    // (desde perspectiva espectador, izq del lanzador = izq de pantalla)
    // El portero se tira hacia donde va el balón
    const gkZonaX = {
      izq:    GX + 22,
      centro: W / 2,
      der:    GX + GW - 22,
    };
    const gkZonaY = {
      izq:    GY + GH * 0.25,
      centro: GY + GH - 5,
      der:    GY + GH * 0.25,
    };

    const gkEndX = gkZonaX[saveDir];
    const gkEndY = gkZonaY[saveDir];

    // Lean del portero: si va a izq de pantalla, se inclina a izq (-), si va a der se inclina a der (+)
    const gkLeanDir = saveDir === "izq" ? -1 : saveDir === "der" ? 1 : 0;

    const TOTAL_FRAMES = 60;

    const drawPitch = () => {
      ctx.fillStyle = "#111c0e"; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#173212" : "#1a3a15";
        ctx.fillRect(i * (W / 6), H * 0.55, W / 6, H * 0.45);
      }
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.97, H * 0.22, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.beginPath(); ctx.arc(W / 2, H * 0.82, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(GX - 14, GY + GH); ctx.lineTo(GX + GW + 14, GY + GH);
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 0.7;
      for (let nx = GX + 8; nx < GX + GW; nx += GW / 10) {
        ctx.beginPath(); ctx.moveTo(nx, GY + 4); ctx.lineTo(nx + 5, GY + GH - 2); ctx.stroke();
      }
      for (let ny = GY + 6; ny < GY + GH; ny += GH / 5) {
        ctx.beginPath(); ctx.moveTo(GX + 4, ny); ctx.lineTo(GX + GW - 4, ny); ctx.stroke();
      }
    };

    const drawGoal = () => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(GX + 3, GY + 3, POST, GH);
      ctx.fillRect(GX + GW - POST - 1, GY + 3, POST, GH);
      ctx.fillRect(GX + 3, GY + 3, GW - 6, POST);
      ctx.fillStyle = "#f0f0e8";
      ctx.fillRect(GX, GY, POST, GH);
      ctx.fillRect(GX + GW - POST, GY, POST, GH);
      ctx.fillRect(GX, GY, GW, POST);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(GX + 1, GY + 1, 2, GH);
    };

    const drawBall = (bx, by, frame, t) => {
      const r = 10 - t * 3;
      const spin = frame * 0.3;
      ctx.save(); ctx.translate(bx, by);
      ctx.save(); ctx.scale(1, 0.4);
      ctx.beginPath(); ctx.arc(0, r * 2, r * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fill();
      ctx.restore();
      ctx.rotate(spin);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      const ballGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      ballGrad.addColorStop(0, "#ffffff");
      ballGrad.addColorStop(0.7, "#e8e8e8");
      ballGrad.addColorStop(1, "#c0c0c0");
      ctx.fillStyle = ballGrad; ctx.fill();
      ctx.fillStyle = "#1a1a1a";
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + spin * 0.3;
        const px = Math.cos(a) * r * 0.52, py = Math.sin(a) * r * 0.52;
        ctx.beginPath();
        for (let v = 0; v < 5; v++) {
          const va = (v / 5) * Math.PI * 2;
          const vx = px + Math.cos(va) * r * 0.22, vy = py + Math.sin(va) * r * 0.22;
          v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
        }
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    };

    const draw = () => {
      const t = Math.min(frameRef.current / TOTAL_FRAMES, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easeIn = t * t;

      ctx.clearRect(0, 0, W, H);
      drawPitch();

      // Portero se mueve hacia donde va el balón
      const gkX = gkStartX + (gkEndX - gkStartX) * ease;
      const gkY = gkStartY + (gkEndY - gkStartY) * ease;
      const gkLean = gkLeanDir * 1.1 * ease;
      const gkArm = ease * 1.2;
      drawPlayer(ctx, gkX, gkY, 0.85, keeper.shirt, keeper.shorts, keeper.skin, keeper.num, keeper.name, gkLean, 0, gkArm, true);

      // Balón va a donde el lanzador eligió
      const bx = ballStartX + (ballEndX - ballStartX) * ease;
      const arcY = -H * 0.08 * Math.sin(t * Math.PI);
      const by = ballStartY + (ballEndY - ballStartY) * ease + arcY;
      drawBall(bx, by, frameRef.current, ease);

      const runOffset = Math.min(ease, 0.4) * 18;
      const kickLean = easeIn * 0.35;
      const legSwing = easeIn * 1.1;
      drawPlayer(ctx, W / 2 + runOffset, H * 0.87, 1.0, shooter.shirt, shooter.shorts, shooter.skin, shooter.num, shooter.name, kickLean, legSwing, 0.2, false);

      drawGoal();

      if (t >= 1) {
        ctx.save();
        ctx.fillStyle = scored ? "rgba(79,195,247,0.18)" : "rgba(0,100,200,0.18)";
        ctx.fillRect(0, 0, W, H);
        ctx.font = "bold 36px 'Bebas Neue', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = scored ? "#f59e0b" : "#005599";
        ctx.shadowColor = scored ? "#f59e0b" : "#005599";
        ctx.shadowBlur = 18;
        ctx.fillText(scored ? "¡GOL!" : "¡PARADA!", W / 2, H / 2);
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      frameRef.current++;
      if (frameRef.current <= TOTAL_FRAMES + 30) rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animState]);
}

function useIdleCanvas(canvasRef, shooter, keeper, highlightZone, active) {
  useEffect(() => {
    if (!active || !canvasRef.current || !shooter || !keeper) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawIdleScene(ctx, canvas.width, canvas.height, shooter, keeper, highlightZone);
  }, [shooter, keeper, highlightZone, active, canvasRef]);
}

function PenaltyGame({ user, onBack }) {
  const [phase, setPhase] = useState("lobby");
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [room, setRoom] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [myChoice, setMyChoice] = useState(null);
  const [waitingForOther, setWaitingForOther] = useState(false);
  const [animState, setAnimState] = useState(null);
  const [error, setError] = useState("");
  const [hoverZone, setHoverZone] = useState(null);
  const [players, setPlayers] = useState(null);
  const canvasRef = useRef(null);
  const channelRef = useRef(null);
  const roomIdRef = useRef(null);
  const myRoleRef = useRef(null);

  // Pick players when game starts
  useEffect(() => {
    if (phase === "playing" && !players) {
      const s = Math.floor(Math.random() * 999);
      setPlayers({ shooter: pickRandom(SHOOTERS, s), keeper: pickRandom(KEEPERS, s + 3) });
    }
  }, [phase]);

  const isIdle = phase === "playing" && !animState && !waitingForOther;
  usePenaltyCanvas(canvasRef, animState);
  useIdleCanvas(canvasRef, players?.shooter, players?.keeper, hoverZone, isIdle);
  useEffect(() => { myRoleRef.current = myRole; }, [myRole]);
  useEffect(() => {
    return () => {
      if (channelRef.current) channelRef.current.unsubscribe();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pollRef = useRef(null);

  const prevChoicesRef = useRef({ p1: null, p2: null });

  const checkRoom = async (roomId) => {
    const { data } = await supabase.from("penalty_rooms").select("*").eq("id", roomId).single();
    if (!data) return;
    setRoom(data);
    if (data.status === "playing") setPhase("playing");
    if (data.status === "finished") setPhase("finished");

    // p1 resuelve la ronda cuando ambos han elegido
    if (data.p1_turn_choice && data.p2_turn_choice && data.status === "playing" && myRoleRef.current === "p1") {
      resolveRound(data);
      return;
    }

    // p2: detectar que la ronda fue resuelta (choices vuelven a null) y resetear su estado
    if (myRoleRef.current === "p2") {
      const hadChoices = prevChoicesRef.current.p1 || prevChoicesRef.current.p2;
      const nowEmpty = !data.p1_turn_choice && !data.p2_turn_choice;
      if (hadChoices && nowEmpty) {
        // p1 acaba de resolver la ronda, sacar resultado del ultimo shot
        // El shooter anterior era el que tenía más shots antes de que se vaciaran los choices
        const p1s = Array.isArray(data.p1_shots) ? data.p1_shots : [];
        const p2s = Array.isArray(data.p2_shots) ? data.p2_shots : [];
        // El último en tirar es quien tiene el último shot en total
        const lastP1 = p1s[p1s.length - 1];
        const lastP2 = p2s[p2s.length - 1];
        // Comparar por índice total: quien tiene más shots tiró en el último turno
        const lastShot = p1s.length > p2s.length ? lastP1 : p2s.length > p1s.length ? lastP2 : (lastP1 || lastP2);
        if (lastShot) { setAnimState({ shootDir: lastShot.shoot, saveDir: lastShot.save, scored: lastShot.scored, seed: (data.p1_score + data.p2_score + p1s.length + p2s.length) }); setHoverZone(null); }
        setMyChoice(null);
        setWaitingForOther(false);
        setTimeout(() => setAnimState(null), 2800);
      }
    }
    prevChoicesRef.current = { p1: data.p1_turn_choice, p2: data.p2_turn_choice };
  };

  const subscribeRoom = (roomId) => {
    if (channelRef.current) channelRef.current.unsubscribe();
    channelRef.current = supabase
      .channel(`penalty_room_${roomId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "penalty_rooms", filter: `id=eq.${roomId}` },
        payload => {
          // Route through checkRoom so p2 reset logic runs in one place
          checkRoom(roomId);
        })
      .subscribe();
    // Polling fallback cada 2s por si Realtime no llega
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => checkRoom(roomId), 2000);
  };

  const createRoom = async () => {
    setError("");
    startedRef.current = false;
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const { data, error: err } = await supabase.from("penalty_rooms").insert({
      code, player1_id: user.id, player1_name: user.name,
      status: "waiting", current_round: 1, current_shooter: "p1",
      p1_shots: [], p2_shots: [], p1_score: 0, p2_score: 0,
    }).select().single();
    if (err) { setError("Error al crear sala: " + err.message); return; }
    setRoomCode(code); setMyRole("p1"); setRoom(data);
    roomIdRef.current = data.id; subscribeRoom(data.id); setPhase("waiting");
  };

  const joinRoom = async () => {
    setError("");
    startedRef.current = false;
    if (!inputCode.trim()) return;
    const { data, error: err } = await supabase.from("penalty_rooms")
      .select("*").eq("code", inputCode.trim().toUpperCase()).eq("status", "waiting").single();
    if (err || !data) { setError("Sala no encontrada o ya en curso"); return; }
    if (data.player1_id === user.id) { setError("No puedes unirte a tu propia sala"); return; }
    const { data: updated, error: err2 } = await supabase.from("penalty_rooms")
      .update({ player2_id: user.id, player2_name: user.name, status: "playing" })
      .eq("id", data.id).select().single();
    if (err2) { setError("Error al unirse"); return; }
    setMyRole("p2"); setRoom(updated); roomIdRef.current = updated.id; subscribeRoom(updated.id); setPhase("playing");
  };

  const submitChoice = async () => {
    if (!myChoice) return;
    setWaitingForOther(true);
    const field = myRole === "p1" ? "p1_turn_choice" : "p2_turn_choice";
    await supabase.from("penalty_rooms").update({ [field]: JSON.stringify({ choice: myChoice }) }).eq("id", roomIdRef.current);
  };

  const resolveRound = async (r) => {
    try {
      const p1c = typeof r.p1_turn_choice === "string" ? JSON.parse(r.p1_turn_choice) : r.p1_turn_choice;
      const p2c = typeof r.p2_turn_choice === "string" ? JSON.parse(r.p2_turn_choice) : r.p2_turn_choice;
      const shooter = r.current_shooter;
      const shootDir = shooter === "p1" ? p1c.choice : p2c.choice;
      const saveDir = shooter === "p1" ? p2c.choice : p1c.choice;
      const scored = shootDir !== saveDir;
      const newP1Score = r.p1_score + (shooter === "p1" && scored ? 1 : 0);
      const newP2Score = r.p2_score + (shooter === "p2" && scored ? 1 : 0);
      const p1Shots = Array.isArray(r.p1_shots) ? [...r.p1_shots] : [];
      const p2Shots = Array.isArray(r.p2_shots) ? [...r.p2_shots] : [];
      if (shooter === "p1") p1Shots.push({ shoot: shootDir, save: saveDir, scored });
      else p2Shots.push({ shoot: shootDir, save: saveDir, scored });
      let nextShooter = shooter === "p1" ? "p2" : "p1";
      let nextRound = r.current_round;
      if (nextShooter === "p1") nextRound += 1;
      const totalShots = p1Shots.length + p2Shots.length;
      const nextStatus = totalShots >= 10 ? "finished" : "playing";
      await supabase.from("penalty_rooms").update({
        p1_score: newP1Score, p2_score: newP2Score,
        current_round: Math.min(nextRound, 5), current_shooter: nextShooter,
        status: nextStatus, p1_shots: p1Shots, p2_shots: p2Shots,
        p1_turn_choice: null, p2_turn_choice: null,
      }).eq("id", r.id);
      setAnimState({ shootDir, saveDir, scored, seed: (newP1Score + newP2Score + p1Shots.length + p2Shots.length) }); setHoverZone(null);
      setMyChoice(null); setWaitingForOther(false); setHoverZone(null);
      setTimeout(() => setAnimState(null), 2800);
    } catch (e) { console.error("resolveRound error", e); }
  };

  const myScore = room ? (myRole === "p1" ? room.p1_score : room.p2_score) : 0;
  const theirScore = room ? (myRole === "p1" ? room.p2_score : room.p1_score) : 0;
  const theirName = room ? (myRole === "p1" ? room.player2_name : room.player1_name) : "";
  const amIShooter = room && room.current_shooter === myRole;
  const myShots = room ? (myRole === "p1" ? (Array.isArray(room.p1_shots) ? room.p1_shots : []) : (Array.isArray(room.p2_shots) ? room.p2_shots : [])) : [];
  const theirShots = room ? (myRole === "p1" ? (Array.isArray(room.p2_shots) ? room.p2_shots : []) : (Array.isArray(room.p1_shots) ? room.p1_shots : [])) : [];

  const btnSt = (val) => ({
    flex: 1, padding: "14px 4px", border: `1px solid ${myChoice === val ? GREEN : BORDER}`,
    borderRadius: "10px", background: myChoice === val ? GREEN_DIM : CARD,
    color: myChoice === val ? GREEN : "#d0e4f7", fontFamily: "'Inter', sans-serif", fontSize: "12px",
    cursor: "pointer", textAlign: "center", fontWeight: myChoice === val ? 700 : 400,
  });

  if (phase === "lobby") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>PENALTIS 1v1</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(255,82,82,0.2)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "10px" }}>🥅</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>PENALTIS 1v1</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>Multijugador · 5 penaltis cada uno<br/>Se alternan lanzador y portero</p>
      </div>
      {error && <p style={{ color: "#cc2222", fontFamily: "'Inter', sans-serif", fontSize: "12px", marginBottom: "12px", textAlign: "center" }}>⚠ {error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <button onClick={createRoom} style={{ padding: "20px", border: `1px solid ${GREEN}`, borderRadius: "12px", background: GREEN_DIM, color: GREEN, fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>➕ CREAR SALA</button>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", marginBottom: "8px", letterSpacing: "2px" }}>UNIRSE CON CÓDIGO</p>
          <input value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase())} placeholder="XXXXX" maxLength={5}
            style={{ width: "100%", padding: "10px", marginBottom: "8px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "rgba(0,0,0,0.3)", color: "#e0eaf8", fontSize: "18px", fontFamily: "'Bebas Neue', monospace", letterSpacing: "4px", textAlign: "center", outline: "none" }} />
          <button onClick={joinRoom} style={{ width: "100%", padding: "10px", border: "none", borderRadius: "7px", background: GREEN, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>UNIRSE</button>
        </div>
      </div>
    </div>
  );

  if (phase === "waiting") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: "52px", marginBottom: "16px" }}>⏳</div>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#e0eaf8", marginBottom: "8px" }}>ESPERANDO RIVAL</div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#e0eefa", marginBottom: "24px" }}>Comparte este código:</p>
      <div style={{ display: "inline-block", background: GREEN_DIM, border: `2px solid ${GREEN}`, borderRadius: "12px", padding: "16px 32px", marginBottom: "24px" }}>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "42px", color: GREEN, letterSpacing: "8px" }}>{roomCode}</span>
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#cce0f5" }}>La partida comenzará automáticamente</p>
      <button onClick={onBack} style={{ display: "block", margin: "24px auto 0", padding: "8px 16px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>Cancelar</button>
    </div>
  );

  if (phase === "playing" && room) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", marginBottom: "12px", alignItems: "center" }}>
        <div style={{ background: GREEN_DIM, border: `1px solid rgba(79,195,247,0.3)`, borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: GREEN }}>{myScore}</div>
          <div style={{ fontSize: "9px", fontFamily: "'Inter', sans-serif", color: "#c0d8f0" }}>TÚ · {amIShooter ? "⚽ LANZAS" : "🧤 PARAS"}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#cce0f5", marginBottom: "2px" }}>RONDA {room.current_round}/5</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#cce0f5" }}>VS</div>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: "#e0eaf8" }}>{theirScore}</div>
          <div style={{ fontSize: "9px", fontFamily: "'Inter', sans-serif", color: "#c0d8f0" }}>{theirName?.split(" ")[0] || "Rival"}</div>
        </div>
      </div>

      {/* Canvas — siempre visible */}
      <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${BORDER}`, marginBottom: "10px", background: "#111c0e" }}>
        <canvas ref={canvasRef} width={360} height={260} style={{ display: "block", width: "100%", height: "auto" }} />

        {/* Clickable goal zones — solo cuando el usuario elige */}
        {!animState && !waitingForOther && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Instruction overlay top */}
            <div style={{ position: "absolute", top: "6px", left: 0, right: 0, textAlign: "center" }}>
              <span style={{ fontSize: "10px", fontFamily: "'Bebas Neue', cursive", letterSpacing: "2px",
                color: amIShooter ? "#f59e0b" : "#005599",
                background: "rgba(0,0,0,0.55)", padding: "2px 10px", borderRadius: "6px" }}>
                {amIShooter ? "⚽ TAP DONDE DISPARAS" : "🧤 TAP DONDE TE TIRAS"}
              </span>
            </div>

            {/* Three clickable zones over the goal area (top ~46% of canvas) */}
            {["izq","centro","der"].map((zone, i) => (
              <div key={zone}
                onClick={() => { setMyChoice(zone); setHoverZone(zone); }}
                onMouseEnter={() => setHoverZone(zone)}
                onMouseLeave={() => !myChoice && setHoverZone(null)}
                style={{
                  position: "absolute",
                  top: "4%", height: "42%",
                  left: i === 0 ? "13%" : i === 1 ? "46%" : "67%",
                  width: "21%",
                  cursor: "pointer",
                  borderRadius: "4px",
                  background: myChoice === zone ? "rgba(79,195,247,0.15)" : "transparent",
                  border: myChoice === zone ? "2px solid rgba(79,195,247,0.8)" : "2px solid transparent",
                  transition: "all 0.15s ease",
                }}
              />
            ))}
          </div>
        )}

        {/* Waiting overlay */}
        {waitingForOther && !animState && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(28,21,16,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px", animation: "pulse 1.5s infinite" }}>⏳</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#e0eefa" }}>Esperando a {theirName?.split(" ")[0] || "rival"}...</p>
          </div>
        )}
      </div>

      {/* Confirm button or result */}
      {animState ? (
        <div style={{ padding: "12px", background: animState.scored ? GREEN_DIM : "rgba(255,82,82,0.1)", border: `1px solid ${animState.scored ? "rgba(79,195,247,0.4)" : "rgba(255,82,82,0.3)"}`, borderRadius: "10px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", letterSpacing: "3px", color: animState.scored ? GREEN : "#cc2222" }}>
            {animState.scored ? "⚽ ¡GOL!" : "🧤 ¡PARADA!"}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#d0e4f7", marginTop: "3px" }}>
            Disparo: {PENALTY_LABELS[animState.shootDir]} · Parada: {PENALTY_LABELS[animState.saveDir]}
          </p>
        </div>
      ) : !waitingForOther && (
        <button onClick={() => { if (myChoice) submitChoice(); }}
          disabled={!myChoice}
          style={{ width: "100%", padding: "13px", border: "none", borderRadius: "9px",
            background: myChoice ? `linear-gradient(135deg,${GREEN},#0077cc)` : "rgba(0,0,0,0.2)",
            color: myChoice ? "#0a1628" : "#cce0f5",
            fontFamily: "'Bebas Neue', cursive", fontSize: "16px", fontWeight: 800,
            cursor: myChoice ? "pointer" : "default", letterSpacing: "3px" }}>
          {myChoice ? `CONFIRMAR ${PENALTY_LABELS[myChoice]}` : "TAP EN LA PORTERÍA"}
        </button>
      )}

      {(myShots.length > 0 || theirShots.length > 0) && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "10px", marginTop: "10px" }}>
          <p style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "6px" }}>HISTORIAL</p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "'Inter', sans-serif", marginRight: "4px" }}>TÚ:</span>
            {myShots.map((s, i) => <span key={i} style={{ fontSize: "16px" }}>{s.scored ? "⚽" : "❌"}</span>)}
            <span style={{ color: "#b8d4ee", margin: "0 8px" }}>|</span>
            <span style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "'Inter', sans-serif", marginRight: "4px" }}>RIVAL:</span>
            {theirShots.map((s, i) => <span key={i} style={{ fontSize: "16px" }}>{s.scored ? "⚽" : "❌"}</span>)}
          </div>
        </div>
      )}
    </div>
  );

  if (phase === "finished" && room) {
    const iWon = myScore > theirScore;
    const draw = myScore === theirScore;
    return (
      <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
        <div style={{ background: CARD, border: `1px solid ${iWon ? "rgba(79,195,247,0.4)" : draw ? BORDER : "rgba(255,82,82,0.25)"}`, borderRadius: "14px", padding: "28px", marginBottom: "20px" }}>
          <div style={{ fontSize: "52px", marginBottom: "10px" }}>{iWon ? "🏆" : draw ? "🤝" : "😔"}</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: iWon ? GREEN : draw ? "#e0eefa" : "#cc2222", letterSpacing: "3px", marginBottom: "16px" }}>
            {iWon ? "¡GANASTE!" : draw ? "EMPATE" : "PERDISTE"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
            <div><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: GREEN }}>{myScore}</div><div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>TÚ</div></div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#cce0f5" }}>VS</div>
            <div><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: "#e0eaf8" }}>{theirScore}</div><div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{theirName?.split(" ")[0] || "Rival"}</div></div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {myShots.map((s, i) => <span key={i} style={{ fontSize: "18px" }}>{s.scored ? "⚽" : "❌"}</span>)}
          </div>
        </div>
        <button onClick={() => { setPhase("lobby"); setRoom(null); setMyRole(null); setMyChoice(null); setAnimState(null); setWaitingForOther(false); if (pollRef.current) clearInterval(pollRef.current); }}
          style={{ padding: "13px 36px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>
          🔄 NUEVA PARTIDA
        </button>
      </div>
    );
  }
  return null;
}

// ============================================================
// MUNDIAL DRAFT (estilo FUT Draft) — un juego más de la pestaña Juegos
// Requiere: players.json en /public  ·  tabla draft_scores en Supabase
// Usa el tema/fuentes/supabase globales del archivo (GREEN, CARD, BORDER...).
// ============================================================

// Banderas por nación (nombres tal cual vienen en players.json)
const DRAFT_FLAGS = {
  "France": "🇫🇷", "Spain": "🇪🇸", "Argentina": "🇦🇷", "England": "🇬🇧", "Portugal": "🇵🇹",
  "Brazil": "🇧🇷", "Netherlands": "🇳🇱", "Morocco": "🇲🇦", "Belgium": "🇧🇪", "Germany": "🇩🇪",
  "Croatia": "🇭🇷", "Colombia": "🇨🇴", "Senegal": "🇸🇳", "Mexico": "🇲🇽", "United States": "🇺🇸",
  "Uruguay": "🇺🇾", "Japan": "🇯🇵", "Switzerland": "🇨🇭", "Iran": "🇮🇷", "Austria": "🇦🇹",
  "Ecuador": "🇪🇨", "Australia": "🇦🇺", "South Korea": "🇰🇷", "Egypt": "🇪🇬", "Canada": "🇨🇦",
  "Ivory Coast": "🇨🇮", "Qatar": "🇶🇦", "Algeria": "🇩🇿", "Sweden": "🇸🇪", "Tunisia": "🇹🇳",
  "Czechia": "🇨🇿", "Türkiye": "🇹🇷", "Norway": "🇳🇴", "Scotland": "🇬🇧", "DR Congo": "🇨🇩",
  "Bosnia & Herzegovina": "🇧🇦", "Panama": "🇵🇦", "Saudi Arabia": "🇸🇦", "South Africa": "🇿🇦",
  "Iraq": "🇮🇶", "Uzbekistan": "🇺🇿", "Paraguay": "🇵🇾", "Ghana": "🇬🇭", "Jordan": "🇯🇴",
  "Cape Verde": "🇨🇻", "Curaçao": "🇨🇼", "Haiti": "🇭🇹", "New Zealand": "🇳🇿",
};
const draftFlag = n => DRAFT_FLAGS[n] || "🏳️";

// Posiciones compatibles por hueco
const DRAFT_ELIG = {
  GK: ["GK"], LB: ["LB", "LWB"], RB: ["RB", "RWB"], CB: ["CB"],
  CM: ["CM", "CDM", "CAM"], LW: ["LW", "LM"], RW: ["RW", "RM"], ST: ["ST", "CF"],
};
// Formación 4-3-3 (x,y en %, ataque arriba)
const DRAFT_FORMATION = [
  { pos: "ST", label: "DC", x: 50, y: 11 },
  { pos: "LW", label: "EI", x: 19, y: 25 },
  { pos: "RW", label: "ED", x: 81, y: 25 },
  { pos: "CM", label: "MC", x: 27, y: 46 },
  { pos: "CM", label: "MC", x: 50, y: 42 },
  { pos: "CM", label: "MC", x: 73, y: 46 },
  { pos: "LB", label: "LI", x: 14, y: 69 },
  { pos: "CB", label: "DFC", x: 38, y: 73 },
  { pos: "CB", label: "DFC", x: 62, y: 73 },
  { pos: "RB", label: "LD", x: 86, y: 69 },
  { pos: "GK", label: "POR", x: 50, y: 88 },
];
const draftEligible = (p, pos) => DRAFT_ELIG[pos].some(x => p.positions.includes(x));

function draftDraw(players, pos, usedIds, n = 5) {
  const pool = players.filter(p => draftEligible(p, pos) && !usedIds.has(p.id));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
function draftPlayerChem(player, pos, eleven) {
  const others = eleven.filter(x => x && x.id !== player.id);
  const inPos = draftEligible(player, pos);
  const nation = others.filter(o => o.nation === player.nation).length;
  const league = others.filter(o => o.league && o.league === player.league).length;
  const club = others.filter(o => o.club && o.club === player.club).length;
  const pts = Math.min(club, 2) * 2 + Math.min(nation, 3) + Math.min(league, 3);
  let chem = pts >= 5 ? 3 : pts >= 3 ? 2 : pts >= 1 ? 1 : 0;
  if (!inPos) chem = Math.min(chem, 1);
  return chem;
}
function draftScoreSquad(picks) {
  const eleven = picks.map(p => p.player);
  const chems = picks.map(pk => draftPlayerChem(pk.player, pk.pos, eleven));
  const teamChem = chems.reduce((s, c) => s + c, 0);
  const teamRating = Math.round(eleven.reduce((s, p) => s + p.rating, 0) / eleven.length);
  return { teamRating, teamChem, total: teamRating + teamChem, chems };
}
const chemCol = c => (c >= 3 ? GREEN : c === 2 ? "#34d399" : c === 1 ? "#ffd54f" : "#ff6b4a");

// Devuelve los enlaces de un jugador con el resto del once
function draftLinks(player, eleven) {
  const others = eleven.filter(x => x && x.id !== player.id);
  return {
    nation: others.filter(o => o.nation === player.nation).length,
    league: others.filter(o => o.league && o.league === player.league).length,
    club: others.filter(o => o.club && o.club === player.club).length,
  };
}
 
// 3 puntitos de química (0–3) con el color del nivel
function ChemDots({ value, size = 8 }) {
  return (
    <span style={{ display: "inline-flex", gap: "3px", alignItems: "center" }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{
          width: size, height: size, borderRadius: "50%",
          background: i <= value ? chemCol(value) : "rgba(255,255,255,0.15)",
          boxShadow: i <= value ? `0 0 5px ${chemCol(value)}55` : "none",
        }} />
      ))}
    </span>
  );
}
 
// Modal explicativo de la química
function DraftChemInfo({ onClose }) {
  const row = (icon, title, text) => (
    <div style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
      <span style={{ fontSize: "20px", lineHeight: 1.2, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: GREEN, letterSpacing: "1px", lineHeight: 1.2 }}>{title}</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.55, marginTop: "2px" }}>{text}</p>
      </div>
    </div>
  );
 
  const tableRow = (enlaces, quim, color) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 12px", borderTop: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: "11px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif" }}>{enlaces}</span>
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <ChemDots value={quim} size={7} />
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color }}>{quim}</span>
      </span>
    </div>
  );
 
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 270, background: "rgba(5,12,24,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
      animation: "fadeIn 0.25s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: "420px", maxHeight: "90vh", overflowY: "auto",
        background: "linear-gradient(160deg,#102339,#0a1628)", border: `2px solid ${GREEN}`,
        borderRadius: "16px", padding: "20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "26px" }}>🧪</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#e0eaf8", letterSpacing: "1px", lineHeight: 1 }}>¿CÓMO FUNCIONA LA QUÍMICA?</div>
          </div>
          <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${BORDER}`, background: "transparent", color: "#c0d8f0", cursor: "pointer", fontSize: "14px" }}>✕</button>
        </div>
 
        {row("🔗", "Cada jugador da de 0 a 3 de química", "Según los enlaces que comparta con el resto de tu once. Cuanto más en común, más química.")}
        {row("🌍🏆👕", "Tres tipos de enlace", "Misma selección 🌍, misma liga 🏆 y mismo club 👕. El mismo club vale doble (es el enlace más fuerte).")}
        {row("⚠️", "Fuera de posición", "Si colocas a un jugador en un hueco que no es el suyo, su química se queda como máximo en 1.")}
        {row("🧮", "Química del equipo", "Es la suma de los 11 jugadores. El máximo posible son 33.")}
        {row("🏅", "Puntuación final", "MEDIA (valoración media del once) + QUÍMICA del equipo. ¡Equilibra cracks y enlaces!")}
 
        <div style={{ marginTop: "8px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>PUNTOS DE ENLACE</span>
            <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>QUÍMICA</span>
          </div>
          {tableRow("0 enlaces", 0, "#ff6b4a")}
          {tableRow("1 – 2 enlaces", 1, "#ffd54f")}
          {tableRow("3 – 4 enlaces", 2, "#34d399")}
          {tableRow("5 o más", 3, GREEN)}
          <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", padding: "8px 12px", lineHeight: 1.5, borderTop: `1px solid ${BORDER}` }}>
            Club = 2 puntos por jugador (máx. 4) · Selección = 1 (máx. 3) · Liga = 1 (máx. 3)
          </p>
        </div>
 
        <button onClick={onClose} style={{
          width: "100%", marginTop: "16px", padding: "13px", border: "none", borderRadius: "10px",
          background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628",
          fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "2px", cursor: "pointer",
        }}>¡ENTENDIDO!</button>
      </div>
    </div>
  );
}

// Avatar con foto y fallback a bandera
function DraftFace({ p, size }) {
  const [err, setErr] = useState(false);
  if (!p.photo || err) {
    return (
      <div style={{ width: size, height: size, borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5 }}>
        {draftFlag(p.nation)}
      </div>
    );
  }
  return <img src={p.photo} width={size} height={size} alt="" onError={() => setErr(true)} style={{ borderRadius: "8px", objectFit: "cover", background: "rgba(0,0,0,0.3)" }} />;
}

// Campo con jugadores. Cada hueco ocupado muestra valoración (badge),
// nombre y equipo; en el resultado además la química (badge verde).
function DraftPitch({ picks, current, chems }) {
  const H = 360, av = 38;
  return (
    <div style={{
      position: "relative", width: "100%", height: `${H}px`,
      borderRadius: "12px", overflow: "hidden", border: `1px solid ${BORDER}`,
      background: "repeating-linear-gradient(0deg,#0f2e1a 0 8.33%,#0d2817 8.33% 16.66%)",
      marginBottom: "14px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 0%, rgba(79,195,247,0.10), transparent 60%)" }} />
      <div style={{ position: "absolute", left: "12%", right: "12%", top: "5%", bottom: "5%", border: "2px solid rgba(255,255,255,0.10)", borderRadius: "4px" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: "70px", height: "70px", transform: "translate(-50%,-50%)", border: "2px solid rgba(255,255,255,0.08)", borderRadius: "50%" }} />
      {DRAFT_FORMATION.map((slot, i) => {
        const pick = picks[i]?.player;
        const active = i === current;
        return (
          <div key={i} style={{ position: "absolute", left: `${slot.x}%`, top: `${slot.y}%`, transform: "translate(-50%,-50%)", textAlign: "center", width: "78px", zIndex: active ? 4 : pick ? 3 : 1 }}>
            <div style={{
              width: `${av + 8}px`, height: `${av + 8}px`, margin: "0 auto", borderRadius: "50%",
              border: `2px solid ${active ? GREEN : pick ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"}`,
              background: pick ? "rgba(10,22,40,0.5)" : "rgba(10,22,40,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              boxShadow: active ? `0 0 0 3px rgba(79,195,247,0.2), 0 0 16px rgba(79,195,247,0.4)` : "none",
              animation: active ? "pulse 1.6s ease-in-out infinite" : "none",
            }}>
              {pick ? <DraftFace p={pick} size={av} /> : (
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{slot.label}</span>
              )}
              {/* Valoración (puntos) */}
              {pick && (
                <span style={{ position: "absolute", top: "-7px", left: "-7px", width: "21px", height: "21px", borderRadius: "50%", background: GREEN, color: "#0a1628", fontFamily: "'Bebas Neue', cursive", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0a1628" }}>{pick.rating}</span>
              )}
              {/* Química (solo en el resultado) */}
              {pick && chems && (
                <span style={{ position: "absolute", bottom: "-6px", right: "-6px", width: "17px", height: "17px", borderRadius: "50%", background: chemCol(chems[i]), color: "#0a1628", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0a1628" }}>{chems[i]}</span>
              )}
            </div>
            {/* Nombre + equipo */}
            {pick && (
              <div style={{ marginTop: "3px", display: "inline-block", maxWidth: "78px", padding: "2px 5px", borderRadius: "5px", background: "rgba(10,22,40,0.8)", border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: "9.5px", fontWeight: 700, color: "#e0eaf8", fontFamily: "'Inter', sans-serif", lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pick.name}</div>
                <div style={{ fontSize: "8px", color: "#9cc4e6", fontFamily: "'Inter', sans-serif", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{draftFlag(pick.nation)} {pick.club || pick.nation}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DraftGame({ user, onBack }) {
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState("loading"); // loading|menu|playing|result
  const [picks, setPicks] = useState([]);
  const [used, setUsed] = useState(() => new Set());
  const [candidates, setCandidates] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewing, setViewing] = useState(null);   // ranking de quien vemos su 11
  const [showChem, setShowChem] = useState(false); // modal explicación química
 
  // Cargar jugadores
  useEffect(() => {
    fetch("/players.json")
      .then(r => r.json())
      .then(data => { setPlayers(data); setPhase("menu"); })
      .catch(() => setPhase("menu"));
  }, []);
 
  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("draft_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => {
        const cur = byUser[s.user_id];
        if (!cur || s.score > cur.score) byUser[s.user_id] = { score: s.score, squad: s.squad || null };
      });
      const r = Object.entries(byUser)
        .map(([uid, v]) => ({
          id: uid,
          name: profiles.find(p => p.id === uid)?.name || "Usuario",
          emoji: profiles.find(p => p.id === uid)?.emoji || "⚽",
          score: v.score,
          squad: v.squad,
        }))
        .sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };
  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);
 
  const current = picks.length;
  const slot = DRAFT_FORMATION[current] || DRAFT_FORMATION[0];
  const result = current === 11 ? draftScoreSquad(picks) : null;
 
  // 🔴 Marcador provisional EN VIVO (se recalcula cada pick)
  const liveScore = picks.length > 0 ? draftScoreSquad(picks) : null;
  const elevenSoFar = picks.map(x => x.player);
 
  const start = () => {
    const u = new Set();
    setUsed(u); setPicks([]); setSaved(false);
    setCandidates(draftDraw(players, DRAFT_FORMATION[0].pos, u));
    setPhase("playing");
  };
 
  const pick = (p) => {
    const next = [...picks, { pos: slot.pos, player: p }];
    const u = new Set(used); u.add(p.id);
    setUsed(u); setPicks(next);
    if (next.length === 11) { finish(next); return; }
    setCandidates(draftDraw(players, DRAFT_FORMATION[next.length].pos, u));
  };
 
  const finish = async (finalPicks) => {
    const r = draftScoreSquad(finalPicks);
    setPhase("result");
    const squad = finalPicks.map(p => ({ pos: p.pos, id: p.player.id }));
    await supabase.from("draft_scores").insert({ user_id: user.id, score: r.total, squad });
    setSaved(true);
    loadRankings();
  };
 
  // Marcador reutilizable (provisional o final)
  const Scoreboard = ({ media, quimica, total, provisional }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "12px 8px", marginBottom: "14px", position: "relative" }}>
      {provisional && (
        <span style={{ position: "absolute", top: "-8px", left: "12px", fontSize: "8px", letterSpacing: "2px", color: "#0a1628", background: "#ffd54f", padding: "2px 8px", borderRadius: "6px", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
          PROVISIONAL
        </span>
      )}
      {[
        { l: "MEDIA", v: media, c: "#e0eaf8" },
        { l: "QUÍMICA", v: `${quimica}`, c: "#34d399", sub: "/33" },
        { l: "TOTAL", v: total, c: GREEN, big: true },
      ].map((s, i) => (
        <div key={i} style={{ flex: 1, textAlign: "center", borderLeft: i ? `1px solid ${BORDER}` : "none" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: s.big ? "40px" : "30px", color: s.c, lineHeight: 1 }}>
            {s.v}{s.sub && <span style={{ fontSize: "14px", color: "#7ab8e0" }}>{s.sub}</span>}
          </div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginTop: "3px" }}>{s.l}</div>
        </div>
      ))}
    </div>
  );
 
  // Modal: ver el once de otro jugador
  const squadModal = viewing ? (() => {
    const byId = {};
    players.forEach(p => { byId[p.id] = p; });
    const vpicks = (viewing.squad || []).map(s => ({ pos: s.pos, player: byId[s.id] || null }));
    const full = vpicks.length === 11 && vpicks.every(x => x.player);
    const vres = full ? draftScoreSquad(vpicks) : null;
    return (
      <div onClick={() => setViewing(null)} style={{ position: "fixed", inset: 0, zIndex: 260, background: "rgba(5,12,24,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", animation: "fadeIn 0.25s ease" }}>
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "420px", maxHeight: "90vh", overflowY: "auto", background: "linear-gradient(160deg,#102339,#0a1628)", border: `2px solid ${GREEN}`, borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <span style={{ fontSize: "26px" }}>{viewing.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#e0eaf8", letterSpacing: "1px", lineHeight: 1 }}>{viewing.name}</div>
              <div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>El once con su mejor marca</div>
            </div>
            <button onClick={() => setViewing(null)} style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${BORDER}`, background: "transparent", color: "#c0d8f0", cursor: "pointer", fontSize: "14px" }}>✕</button>
          </div>
          {vpicks.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "20px 0" }}>
              Esta marca se guardó antes de registrar las alineaciones, así que no hay equipo que mostrar.
            </p>
          ) : (
            <>
              <Scoreboard media={vres ? vres.teamRating : "—"} quimica={vres ? vres.teamChem : "—"} total={viewing.score} />
              <DraftPitch picks={vpicks} current={-1} chems={vres ? vres.chems : null} />
            </>
          )}
        </div>
      </div>
    );
  })() : null;
 
  const medals = ["🥇", "🥈", "🥉"];
 
  // ---------- LOADING ----------
  if (phase === "loading") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>⚽</div>
      <p style={{ color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Cargando jugadores...</p>
    </div>
  );
 
  // ---------- MENU ----------
  if (phase === "menu") return (
    <>
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>MUNDIAL DRAFT</p>
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🃏</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>MUNDIAL DRAFT</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: "16px" }}>
          Monta tu once eligiendo entre 5 jugadores por posición.<br />
          Puntúas por <span style={{ color: GREEN }}>media</span> + <span style={{ color: "#34d399" }}>química</span> (selección · liga · club).
        </p>
        <button onClick={start} disabled={players.length === 0} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "10px" }}>⚡ JUGAR</button>
        <button onClick={() => setShowChem(true)} style={{ display: "block", margin: "0 auto", padding: "8px 16px", border: `1px solid ${BORDER}`, borderRadius: "8px", background: "transparent", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", fontSize: "11px", cursor: "pointer", letterSpacing: "1px" }}>
          🧪 ¿Cómo funciona la química?
        </button>
      </div>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "6px" }}>RANKING DRAFT</p>
      <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", marginBottom: "12px" }}>Toca a un jugador para ver su once 👁️</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <button key={i} onClick={() => r.squad && setViewing(r)} className="tappable" style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", cursor: r.squad ? "pointer" : "default" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ fontSize: "18px" }}>{r.emoji}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          {r.squad && <span style={{ fontSize: "13px", color: "#7ab8e0" }}>👁️</span>}
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>PTS</span>
        </button>
      ))}
    </div>
    {squadModal}
    {showChem && <DraftChemInfo onClose={() => setShowChem(false)} />}
    </>
  );
 
  // ---------- PLAYING ----------
  if (phase === "playing") return (
    <>
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button onClick={() => setPhase("menu")} style={{ padding: "6px 12px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#c0d8f0", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Salir</button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setShowChem(true)} style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${BORDER}`, background: "transparent", color: "#7ab8e0", cursor: "pointer", fontSize: "13px" }} title="Cómo funciona la química">ℹ️</button>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#c0d8f0" }}><span style={{ color: GREEN }}>{current + 1}</span> / 11</span>
        </div>
      </div>
 
      {/* 🔴 Marcador provisional en vivo */}
      {liveScore && (
        <Scoreboard media={liveScore.teamRating} quimica={liveScore.teamChem} total={liveScore.total} provisional />
      )}
 
      {/* Campo con química EN VIVO */}
      <DraftPitch picks={picks} current={current} chems={liveScore ? liveScore.chems : null} />
 
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "10px" }}>
        ELIGE TU {slot.label}
      </p>
 
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {candidates.map((p) => {
          const inPos = draftEligible(p, slot.pos);

          return (
            <button key={p.id} onClick={() => pick(p)} className="tappable" style={{
              display: "flex", alignItems: "center", gap: "12px", width: "100%", textAlign: "left",
              padding: "12px", borderRadius: "12px",
              border: `1px solid ${inPos ? BORDER : "rgba(255,107,74,0.3)"}`,
              background: CARD, cursor: "pointer",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <DraftFace p={p} size={52} />
                <span style={{ position: "absolute", top: "-6px", left: "-6px", width: "24px", height: "24px", borderRadius: "50%", background: GREEN, color: "#0a1628", fontFamily: "'Bebas Neue', cursive", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0a1628" }}>{p.rating}</span>
              </div>
 
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#e0eaf8", letterSpacing: "0.5px", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", marginTop: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {draftFlag(p.nation)} {p.nation} · {p.club || "—"}
                </div>
 
                {/* Posiciones + aviso fuera de sitio */}
                <div style={{ display: "flex", gap: "4px", marginTop: "5px", flexWrap: "wrap", alignItems: "center" }}>
                  {p.positions.map(pos => (
                    <span key={pos} style={{ fontSize: "9px", fontWeight: 700, padding: "1px 6px", borderRadius: "5px", background: "rgba(0,0,0,0.3)", color: DRAFT_ELIG[slot.pos].includes(pos) ? GREEN : "#7ab8e0", border: `1px solid ${DRAFT_ELIG[slot.pos].includes(pos) ? "rgba(79,195,247,0.4)" : BORDER}` }}>{pos}</span>
                  ))}
                  {!inPos && <span style={{ fontSize: "9px", color: "#ff6b4a", fontFamily: "'Inter', sans-serif" }}>⚠ fuera de posición</span>}
                </div>
              </div>
            </button>
          );
        })}
        {candidates.length === 0 && <p style={{ color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Sin candidatos disponibles.</p>}
      </div>
    </div>
    {showChem && <DraftChemInfo onClose={() => setShowChem(false)} />}
    </>
  );
 
  // ---------- RESULT ----------
  const r = result;
  const myRank = rankings.findIndex(x => x.name === user.name && x.score === r.total) + 1;
  return (
    <>
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <button onClick={() => setPhase("menu")} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", flex: 1 }}>TU PLANTILLA</p>
        <button onClick={() => setShowChem(true)} style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${BORDER}`, background: "transparent", color: "#7ab8e0", cursor: "pointer", fontSize: "13px" }} title="Cómo funciona la química">ℹ️</button>
      </div>
 
      <Scoreboard media={r.teamRating} quimica={r.teamChem} total={r.total} />
 
      <DraftPitch picks={picks} current={-1} chems={r.chems} />
 
      <button onClick={start} className="tappable" style={{ width: "100%", padding: "13px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "20px" }}>🔄 JUGAR OTRA VEZ</button>
 
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>RANKING DRAFT</p>
        {myRank > 0 && <span style={{ fontSize: "11px", color: GREEN, fontFamily: "'Inter', sans-serif" }}>Tu puesto #{myRank}</span>}
      </div>
      <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", marginBottom: "12px" }}>Toca a un jugador para ver su once 👁️</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((x, i) => {
        const isMe = x.name === user.name;
        return (
          <button key={i} onClick={() => x.squad && setViewing(x)} className="tappable" style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "12px", background: isMe ? GREEN_DIM : CARD, border: `1px solid ${isMe ? GREEN : BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", cursor: x.squad ? "pointer" : "default" }}>
            <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
            <span style={{ fontSize: "18px" }}>{x.emoji}</span>
            <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: isMe ? GREEN : "#e0eaf8", fontWeight: isMe ? 700 : 400 }}>{x.name}{isMe ? " (tú)" : ""}</span>
            {x.squad && <span style={{ fontSize: "13px", color: "#7ab8e0" }}>👁️</span>}
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{x.score}</span>
          </button>
        );
      })}
    </div>
    {squadModal}
    {showChem && <DraftChemInfo onClose={() => setShowChem(false)} />}
    </>
  );
}

// ============================================================
// SIETE CERO (7-0) — modo draft de selecciones históricas
// Pega TODO este bloque en app/page.js JUSTO ANTES de "function GamesView(...)".
// Requiere: sieteCeroSquads.json en /public  ·  tabla siete_cero_scores en Supabase.
// Usa el supabase global y los hooks ya importados arriba (useState/useEffect/useRef).
// ============================================================
/* ============================================================================
   SIETE-CERO  ·  modo de juego estilo "Sete a Zero" para Porra Vallau
   ----------------------------------------------------------------------------
   Bucle: cada turno se sortea una SELECCIÓN HISTÓRICA. Eliges 1 jugador y se
   coloca en un hueco compatible de tu formación. 11 turnos -> once cerrado ->
   el motor simula 3 grupos + 4 eliminatorias. Ganas los 7 => cierras el 7-0.

   USO EN TU APP (ya integrado): se renderiza desde GamesView como
     <SieteCeroGame user={user} onBack={() => setGame(null)} />
   Usa el supabase global y carga las plantillas desde /sieteCeroSquads.json
   ========================================================================== */

const SC_ACCENT = "#4fc3f7";          // tu azul (GREEN)
const SC_ACCENT_DARK = "#2b8fc0";
const SC_GOLD = "#ffce54";
const SC_RED = "#ef5350";
const SC_BG = "#0d1117";
const SC_PANEL = "#161b22";
const SC_PANEL2 = "#1f2630";
const SC_LINE = "#2a323d";
const SC_TXT = "#e6edf3";
const SC_MUT = "#8b98a6";

/* ----------------------------- DATASET (54 SELECCIONES) ------------------- */
/* 54 plantillas históricas (Brasil 70 → 2026). pos = principal, alt = comodín.*/
/* También disponible como sieteCeroSquads.json si prefieres importarlo aparte.*/
let SC_SQUADS = [];

/* ------------------------------ FORMACIONES ------------------------------- */
/* x/y en % sobre un campo vertical (ataque arriba). accepts = posiciones ok.  */
const SC_FORMATIONS = {
  "4-3-3": [
    { k: "GK", accepts: ["GK"], x: 50, y: 90 },
    { k: "RB", accepts: ["RB", "CB"], x: 84, y: 72 },
    { k: "CBd", accepts: ["CB"], x: 62, y: 78 },
    { k: "CBi", accepts: ["CB"], x: 38, y: 78 },
    { k: "LB", accepts: ["LB", "CB"], x: 16, y: 72 },
    { k: "MCd", accepts: ["CDM", "CM"], x: 68, y: 52 },
    { k: "MC", accepts: ["CM", "CDM", "CAM"], x: 50, y: 56 },
    { k: "MCi", accepts: ["CM", "CAM"], x: 32, y: 52 },
    { k: "ED", accepts: ["RW", "RM", "CAM", "ST"], x: 82, y: 26 },
    { k: "DC", accepts: ["ST", "CAM"], x: 50, y: 18 },
    { k: "EI", accepts: ["LW", "LM", "CAM", "ST"], x: 18, y: 26 },
  ],
  "4-4-2": [
    { k: "GK", accepts: ["GK"], x: 50, y: 90 },
    { k: "RB", accepts: ["RB", "CB"], x: 84, y: 72 },
    { k: "CBd", accepts: ["CB"], x: 62, y: 78 },
    { k: "CBi", accepts: ["CB"], x: 38, y: 78 },
    { k: "LB", accepts: ["LB", "CB"], x: 16, y: 72 },
    { k: "MD", accepts: ["RM", "RW", "CM"], x: 82, y: 48 },
    { k: "MCd", accepts: ["CM", "CDM"], x: 60, y: 52 },
    { k: "MCi", accepts: ["CM", "CAM", "CDM"], x: 40, y: 52 },
    { k: "MI", accepts: ["LM", "LW", "CM"], x: 18, y: 48 },
    { k: "DCd", accepts: ["ST", "CAM"], x: 62, y: 20 },
    { k: "DCi", accepts: ["ST", "CAM"], x: 38, y: 20 },
  ],
  "4-2-3-1": [
    { k: "GK", accepts: ["GK"], x: 50, y: 90 },
    { k: "RB", accepts: ["RB", "CB"], x: 84, y: 72 },
    { k: "CBd", accepts: ["CB"], x: 62, y: 78 },
    { k: "CBi", accepts: ["CB"], x: 38, y: 78 },
    { k: "LB", accepts: ["LB", "CB"], x: 16, y: 72 },
    { k: "MCDd", accepts: ["CDM", "CM"], x: 62, y: 58 },
    { k: "MCDi", accepts: ["CDM", "CM"], x: 38, y: 58 },
    { k: "MP", accepts: ["CAM", "CM"], x: 50, y: 40 },
    { k: "ED", accepts: ["RW", "RM", "ST"], x: 82, y: 32 },
    { k: "EI", accepts: ["LW", "LM", "ST"], x: 18, y: 32 },
    { k: "DC", accepts: ["ST", "CAM"], x: 50, y: 16 },
  ],
};

const SC_POS_LABEL = {
  GK: "POR", RB: "LD", CB: "DFC", LB: "LI", CDM: "MCD",
  CM: "MC", CAM: "MP", RM: "MD", LM: "MI", RW: "ED", LW: "EI", ST: "DC",
};

/* ------------------------------- HELPERS ---------------------------------- */
const scFits = (player, slot) => {
  const opts = [player.pos, ...(player.alt || [])];
  return opts.some((p) => slot.accepts.includes(p));
};

const scBestSlotFor = (player, slots, placed) => {
  // hueco abierto compatible; prioriza match exacto de pos principal
  const open = slots.filter((s) => !placed[s.k] && scFits(player, s));
  if (!open.length) return null;
  const exact = open.find((s) => s.accepts[0] === player.pos);
  return (exact || open[0]).k;
};

const scPoisson = (lambda) => {
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
};

const scTeamStrength = (xi) => {
  const vals = Object.values(xi).filter(Boolean);
  if (!vals.length) return 70;
  return Math.round(vals.reduce((a, p) => a + p.r, 0) / vals.length);
};

const SC_OPP_POOL = {
  "Grupos 1": [["🇨🇻", "Cabo Verde", 78], ["🇵🇦", "Panamá", 77], ["🇺🇿", "Uzbekistán", 79]],
  "Grupos 2": [["🇶🇦", "Qatar", 80], ["🇸🇦", "Arabia Saudí", 81], ["🇨🇦", "Canadá", 82]],
  "Grupos 3": [["🇯🇵", "Japón", 84], ["🇰🇷", "Corea", 83], ["🇲🇦", "Marruecos", 85]],
  "Octavos": [["🇲🇽", "México", 84], ["🇺🇸", "EE. UU.", 84], ["🇸🇳", "Senegal", 85]],
  "Cuartos": [["🇨🇭", "Suiza", 86], ["🇳🇱", "P. Bajos", 87], ["🇵🇹", "Portugal", 88]],
  "Semis": [["🇭🇷", "Croacia", 88], ["🇧🇪", "Bélgica", 89], ["🇬🇧", "Inglaterra", 90]],
  "Final": [["🇧🇷", "Brasil", 91], ["🇫🇷", "Francia", 92], ["🇦🇷", "Argentina", 93]],
};

// Orden de la alineación (portero → laterales → central → medios → delanteros)
const SC_XI_ORDER = ["GK", "LB", "RB", "CB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "ST", "CF"];
const SC_POS_ES = { GK: "POR", LB: "LI", RB: "LD", CB: "DFC", CDM: "MCD", CM: "MC", CAM: "MCO", LM: "MI", RM: "MD", LW: "EI", RW: "ED", ST: "DC", CF: "SD" };
const scSquadPlayers = (squad) => Array.isArray(squad) ? squad : (squad && Array.isArray(squad.p) ? squad.p : []);
const scSquadFormation = (squad) => (squad && !Array.isArray(squad) ? squad.f : null);
const scSquadOrdered = (squad) => {
  const players = scSquadPlayers(squad);
  const rank = (s) => {
    const i = SC_XI_ORDER.indexOf(s.slotPos || s.pos);
    return i === -1 ? 99 : i;
  };
  return [...players].sort((a, b) => rank(a) - rank(b) || (b.r || 0) - (a.r || 0));
};
// Ordena una lista de jugadores por posición (POR → laterales → central → medios → delanteros)
const scByPosition = (players) => {
  const rank = (p) => { const i = SC_XI_ORDER.indexOf(p.pos); return i === -1 ? 99 : i; };
  return [...players].sort((a, b) => rank(a) - rank(b) || (b.r || 0) - (a.r || 0));
};
// Media (valoración) de una plantilla guardada; null si no hay jugadores
const scSquadMedia = (squad) => {
  const pl = scSquadPlayers(squad);
  if (!pl.length) return null;
  return Math.round(pl.reduce((a, p) => a + (p.r || 0), 0) / pl.length);
};
// Ranking por "lo más lejos que llegó": campeón → ronda alcanzada → victorias → DG → GF
const SC_REACH_RANK = { "Grupos 1": 0, "Grupos 2": 1, "Grupos 3": 2, "Octavos": 3, "Cuartos": 4, "Semis": 5, "Final": 6 };
const scBoardKey = (e) => [e.champion ? 1 : 0, SC_REACH_RANK[e.ronda] ?? 0, e.wins || 0, e.gd || 0, e.gf || 0];
const scCmpKey = (a, b) => { for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) return b[i] - a[i]; } return 0; };
const SC_ROUNDS = ["Grupos 1", "Grupos 2", "Grupos 3", "Octavos", "Cuartos", "Semis", "Final"];
const SC_KO_FROM = 3; // a partir de Octavos, perder = eliminado

// nombres mostrados de cada ronda
const SC_ROUND_LABEL = {
  "Grupos 1": "Fase de grupos · Jornada 1",
  "Grupos 2": "Fase de grupos · Jornada 2",
  "Grupos 3": "Fase de grupos · Jornada 3",
  "Octavos": "Octavos de final",
  "Cuartos": "Cuartos de final",
  "Semis": "Semifinal",
  "Final": "Final",
};
const SC_ROUND_SHORT = {
  "Grupos 1": "Grupos J1", "Grupos 2": "Grupos J2", "Grupos 3": "Grupos J3",
  "Octavos": "Octavos", "Cuartos": "Cuartos", "Semis": "Semis", "Final": "Final",
};

/* --- Modelo de fuerza (réplica fiel del oficial: media + equilibrio + posición) ---
   El wiki de Sete a Zero indica que el resultado se calcula por la calidad global
   de la plantilla, el equilibrio de la formación y la fuerza por posición, con el
   portero decidiendo los partidos ajustados (media <85 sufre en octavos). El
   marcador exacto es cerrado; esto lo reproduce con esos mismos factores.        */
const SC_LINE_OF = (pos) =>
  pos === "GK" ? "GK"
  : ["RB", "CB", "LB"].includes(pos) ? "DEF"
  : ["CDM", "CM", "CAM", "RM", "LM"].includes(pos) ? "MID"
  : "ATT";

const scPowerOf = (xi) => {
  const vals = Object.values(xi).filter(Boolean);
  if (!vals.length) return 70;
  const mean = vals.reduce((a, p) => a + p.r, 0) / vals.length;
  // fuerza por línea
  const byLine = { GK: [], DEF: [], MID: [], ATT: [] };
  vals.forEach((p) => byLine[SC_LINE_OF(p.pos)].push(p.r));
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : mean);
  const gk = avg(byLine.GK), def = avg(byLine.DEF), mid = avg(byLine.MID), att = avg(byLine.ATT);
  // equilibrio: penaliza la línea más floja respecto a la media
  const weakest = Math.min(def, mid, att);
  const balancePenalty = Math.max(0, mean - weakest) * 0.12;
  // portero: pesa en los ajustados; bonus/malus según se aleje de la media
  const gkFactor = (gk - mean) * 0.18;
  return mean + gkFactor - balancePenalty;
};

// pmf de Poisson para derivar probabilidades coherentes con los goles simulados
const scPPoisson = (k, l) => (Math.exp(-l) * Math.pow(l, k)) / scFactorial(k);
function scFactorial(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }

const scLambdasFor = (diff) => ({
  // base: con igualdad (diff=0) el rival está ligeramente por delante, así que
  // hay que ser claramente mejor para imponerse. El coeficiente alto hace que
  // cada punto de diferencia de nivel pese mucho.
  you: Math.max(0.16, 1.22 + diff * 0.12),
  opp: Math.max(0.28, 1.50 - diff * 0.12),
});

// Prob. de ganar el partido (incluye penaltis en eliminatorias)
const scWinProbability = (diff, isKO) => {
  const { you, opp } = scLambdasFor(diff);
  let pWin = 0, pDraw = 0, pLoss = 0;
  for (let a = 0; a <= 9; a++) {
    for (let b = 0; b <= 9; b++) {
      const p = scPPoisson(a, you) * scPPoisson(b, opp);
      if (a > b) pWin += p; else if (a < b) pLoss += p; else pDraw += p;
    }
  }
  if (isKO) {
    const penEdge = Math.min(0.85, Math.max(0.15, 0.5 + diff * 0.02));
    pWin += pDraw * penEdge; pLoss += pDraw * (1 - penEdge); pDraw = 0;
  }
  return Math.round(pWin * 100);
};

/* ---------------------- Narración inventada del partido -------------------- */
const scPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Goleadores rivales: si el país rival tiene plantilla en el dataset, usamos un
// jugador real de ese país; si no, no nombramos a nadie.
const SC_NATION_ALIAS = { "P. Bajos": "Países Bajos", "Corea": "Corea del Sur" };
let SC_NATION_ATTACKERS = null;
const scBuildNationAttackers = () => {
  const m = {};
  SC_SQUADS.forEach((s) => {
    const atk = s.players.filter((p) => ["ATT", "MID"].includes(SC_LINE_OF(p.pos)));
    (m[s.team] = m[s.team] || []).push(...atk.map((p) => p.name));
  });
  Object.keys(m).forEach((k) => (m[k] = [...new Set(m[k])]));
  return m;
};
const scOppScorer = (oppName) => {
  if (!SC_NATION_ATTACKERS) SC_NATION_ATTACKERS = scBuildNationAttackers();
  const pool = SC_NATION_ATTACKERS[SC_NATION_ALIAS[oppName] || oppName];
  return pool && pool.length ? scPick(pool) : null;
};

const scBuildMatchEvents = (xi, yg, og, oppName) => {
  const players = Object.values(xi).filter(Boolean);
  const att = players.filter((p) => ["ATT", "MID"].includes(SC_LINE_OF(p.pos)));
  const gk = players.find((p) => p.pos === "GK");
  const def = players.filter((p) => SC_LINE_OF(p.pos) === "DEF");
  const mine = (pref) => (pref.length ? scPick(pref) : scPick(players));

  // minutos de gol repartidos
  const minutes = (n) => {
    const set = new Set();
    while (set.size < n) set.add(1 + Math.floor(Math.random() * 92));
    return [...set];
  };
  const evts = [];
  minutes(yg).forEach((m) => {
    const sc = mine(att);
    evts.push({ min: m, side: "you", type: "goal", who: sc.name,
      text: `¡GOOOL! ${sc.name} ${scPick(["define cruzado", "remata de cabeza", "fusila desde el área", "la clava al ángulo", "marca de penalti", "aprovecha el rechace"])}.` });
  });
  minutes(og).forEach((m) => {
    const sc = scOppScorer(oppName);
    evts.push({ min: m, side: "opp", type: "goal", who: sc,
      text: sc
        ? `Gol de ${oppName}. ${sc} ${scPick(["bate al portero", "define en el área", "remata a placer", "marca tras un rechace"])}.`
        : `Gol de ${oppName} ${scPick(["tras un contragolpe", "en un córner", "con un disparo lejano", "en boca de gol"])}.` });
  });

  // eventos de relleno (ocasiones, paradas, palos, tarjetas)
  const fillers = 5 + Math.floor(Math.random() * 4);
  const usedMin = new Set(evts.map((e) => e.min));
  for (let i = 0; i < fillers; i++) {
    let m; do { m = 1 + Math.floor(Math.random() * 92); } while (usedMin.has(m));
    usedMin.add(m);
    const roll = Math.random();
    if (roll < 0.28 && gk) {
      evts.push({ min: m, side: "you", type: "save",
        text: `🧤 ${scPick(["Paradón", "Gran intervención", "Mano salvadora"])} de ${gk.name} ${scPick(["abajo a su palo", "en el mano a mano", "desviando a córner"])}.` });
    } else if (roll < 0.5) {
      const w = mine(att);
      evts.push({ min: m, side: "you", type: "chance",
        text: `⚡ ${scPick(["Clarísima", "Ocasión enorme", "Aviso"])}: ${w.name} ${scPick(["estrella el balón en el palo", "se topa con el meta", "manda el remate alto por poco"])}.` });
    } else if (roll < 0.72) {
      evts.push({ min: m, side: "opp", type: "chance",
        text: `😬 ${oppName} perdona: ${scPick(["un disparo se estrella en el larguero", "un remate se va fuera solo ante el portero", "obligan a despejar sobre la línea"])}.` });
    } else if (roll < 0.86) {
      const d = mine(def.length ? def : players);
      evts.push({ min: m, side: "you", type: "tackle",
        text: `🛡️ Entradón de ${d.name} para cortar un contragolpe peligroso.` });
    } else {
      evts.push({ min: m, side: "opp", type: "card",
        text: `🟨 Amarilla a ${oppName} por una falta dura.` });
    }
  }
  evts.sort((a, b) => a.min - b.min);
  return evts;
};

const scSimulateCampaign = (xi) => {
  const power = scPowerOf(xi);
  const matches = [];
  let gf = 0, gc = 0, wins = 0, eliminated = false, reached = "";
  for (let i = 0; i < SC_ROUNDS.length; i++) {
    const round = SC_ROUNDS[i];
    const [flag, name, oppR] = scPick(SC_OPP_POOL[round]);
    const diff = power - oppR;
    const isKO = i >= SC_KO_FROM;
    const { you, opp } = scLambdasFor(diff);
    let yg = scPoisson(you);
    let og = scPoisson(opp);
    let pens = null;
    if (isKO && yg === og) {
      const meWins = Math.random() < Math.min(0.85, Math.max(0.15, 0.5 + diff * 0.02));
      pens = meWins ? "gana" : "pierde";
    }
    let outcome;
    if (yg > og) outcome = "W";
    else if (yg < og) outcome = "L";
    else outcome = pens === "gana" ? "W" : pens === "pierde" ? "L" : "D";

    const events = scBuildMatchEvents(xi, yg, og, name);
    const pWin = scWinProbability(diff, isKO);

    gf += yg; gc += og;
    if (outcome === "W") wins++;
    matches.push({ round, flag, name, oppR, yg, og, outcome, pens, events, pWin, isKO });
    reached = round;
    if (isKO && outcome !== "W") { eliminated = true; break; }
  }
  const champion = wins === 7;
  return { matches, gf, gc, gd: gf - gc, wins, champion, reached, eliminated, power: Math.round(power) };
};

/* =============================== COMPONENTE =============================== */
function SieteCeroGame({ user, onBack }) {
  const currentUser = user ? { id: user.id, nombre: user.name, emoji: user.emoji } : null;
  const [ready, setReady] = useState(SC_SQUADS.length > 0);
  useEffect(() => {
    if (SC_SQUADS.length > 0) { setReady(true); return; }
    fetch("/sieteCeroSquads.json")
      .then((r) => r.json())
      .then((data) => { SC_SQUADS = data; SC_NATION_ATTACKERS = null; setReady(true); })
      .catch(() => setReady(true));
  }, []);
  const [phase, setPhase] = useState("intro"); // intro | draft | match | result | board
  const [formationKey, setFormationKey] = useState("4-3-3");
  const [almanaque, setAlmanaque] = useState(false);
  const [name, setName] = useState(currentUser?.nombre || "");

  const slots = SC_FORMATIONS[formationKey];

  // estado de draft
  const [placed, setPlaced] = useState({});      // slotKey -> player
  const [turn, setTurn] = useState(0);           // 0..11
  const [drawn, setDrawn] = useState(null);      // squad sorteado actual
  const [rerolls, setRerolls] = useState(3);
  const [spinning, setSpinning] = useState(false); // animación de ruleta
  const [reelTeam, setReelTeam] = useState(null);  // selección que parpadea en la ruleta
  const spinRef = useRef(null);
  useEffect(() => () => { if (spinRef.current) clearTimeout(spinRef.current); }, []);

  // resultado
  const [campaign, setCampaign] = useState(null);
  const [matchIndex, setMatchIndex] = useState(0); // partido en curso en la fase 'match'
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const savingRef = useRef(false); // evita guardar dos veces la misma partida

  // leaderboard
  const [board, setBoard] = useState(null);
  const [viewing, setViewing] = useState(null); // entrada cuyo once estamos viendo
  const [memBoard, setMemBoard] = useState([
    { nombre: "Vallau", emoji: "🐐", wins: 7, gd: 14, gf: 16, champion: true, ronda: "Final", squad: null },
    { nombre: "Iker", emoji: "🧤", wins: 6, gd: 9, gf: 12, champion: false, ronda: "Semis", squad: null },
    { nombre: "Lucía", emoji: "🔥", wins: 5, gd: 7, gf: 11, champion: false, ronda: "Cuartos", squad: null },
  ]);

  // Ruleta de tragaperras: parpadea selecciones al azar y frena hasta caer en una.
  const drawTeam = () => {
    if (spinRef.current) clearTimeout(spinRef.current);
    const final = SC_SQUADS[Math.floor(Math.random() * SC_SQUADS.length)];
    setSpinning(true);
    setReelTeam(SC_SQUADS[Math.floor(Math.random() * SC_SQUADS.length)]);
    const total = 1300;          // duración total del giro (ms)
    let elapsed = 0;
    const tick = () => {
      setReelTeam(SC_SQUADS[Math.floor(Math.random() * SC_SQUADS.length)]);
      const t = elapsed / total;
      const delay = 55 + t * t * 340;   // arranca rápido y desacelera
      elapsed += delay;
      if (elapsed < total) {
        spinRef.current = setTimeout(tick, delay);
      } else {
        setReelTeam(final);
        setSpinning(false);
        setDrawn(final);
      }
    };
    spinRef.current = setTimeout(tick, 55);
  };

  const startGame = () => {
    setPlaced({}); setTurn(0); setCampaign(null); setSaved(false); setSaveError(null);
    savingRef.current = false;
    setRerolls(3);
    setPhase("draft");
    drawTeam();
  };

  const pickPlayer = (player) => {
    const k = scBestSlotFor(player, slots, placed);
    if (!k) return;
    const np = { ...placed, [k]: { ...player, _team: drawn.team, _flag: drawn.flag, _year: drawn.year } };
    setPlaced(np);
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    if (nextTurn >= 11) {
      const camp = scSimulateCampaign(np);
      setCampaign(camp);
      setMatchIndex(0);
      setPhase("match");
    } else {
      drawTeam();   // los rerolls NO se reponen: son 3 para toda la partida
    }
  };

  const reroll = () => {
    if (rerolls > 0 && !spinning) { setRerolls((r) => r - 1); drawTeam(); }
  };

  // ---- leaderboard load + save ----
  const loadBoard = async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from("siete_cero_scores")
        .select("user_id,nombre,emoji,wins,gf,gc,gd,champion,ronda,squad")
        .limit(500);
      if (error) { console.error("siete_cero loadBoard:", error.message); return; }
      // mejor partida por usuario (la que más lejos llegó); en empate, la que tenga alineación
      const best = {};
      (data || []).forEach((r) => {
        const cur = best[r.user_id];
        if (!cur) { best[r.user_id] = r; return; }
        const cmp = scCmpKey(scBoardKey(r), scBoardKey(cur));
        if (cmp < 0 || (cmp === 0 && scSquadFormation(r.squad) && !scSquadFormation(cur.squad))) best[r.user_id] = r;
      });
      setBoard(Object.values(best).sort((a, b) => scCmpKey(scBoardKey(a), scBoardKey(b))));
    } else {
      setBoard([...memBoard].sort((a, b) => scCmpKey(scBoardKey(a), scBoardKey(b))));
    }
  };

  const saveScore = async () => {
    if (!campaign || savingRef.current) return;
    savingRef.current = true;
    setSaved(true);
    setSaveError(null);
    const row = {
      nombre: name || currentUser?.nombre || "Anónimo",
      emoji: currentUser?.emoji || "⚽",
      wins: campaign.wins, gf: campaign.gf, gc: campaign.gc, // ⚠️ sin gd: es columna generada (gf-gc)
      champion: campaign.champion, ronda: campaign.reached,
      squad: {
        f: formationKey,
        p: slots.map((s) => {
          const pl = placed[s.k];
          return pl ? { k: s.k, slotPos: s.accepts[0], pos: pl.pos, name: pl.name, r: pl.r, flag: pl._flag, team: pl._team, year: pl._year } : null;
        }).filter(Boolean),
      },
    };
    if (supabase && currentUser?.id) {
      const { error } = await supabase.from("siete_cero_scores").insert({ user_id: currentUser.id, ...row });
      if (error) { console.error("siete_cero saveScore:", error.message); setSaveError(error.message); }
    } else {
      setMemBoard((b) => [...b, { ...row, gd: campaign.gd, user_id: currentUser?.id || row.nombre }]);
    }
    await loadBoard();
  };

  // Guarda tu marca automáticamente al terminar la partida (sin botón).
  useEffect(() => {
    if (phase === "result" && campaign && !saved) saveScore();
    /* eslint-disable-next-line */
  }, [phase, campaign]);

  // El ranking se carga al entrar al juego (intro) y al abrir el board.
  useEffect(() => { if (phase === "intro" || phase === "board") loadBoard(); /* eslint-disable-next-line */ }, [phase]);

  /* ------------------------------- RENDER -------------------------------- */
  if (!ready) {
    return (
      <div style={{ background: SC_BG, color: SC_TXT, minHeight: 200, borderRadius: 14, border: `1px solid ${SC_LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 40 }}>
        <div style={{ fontSize: 34 }}>⚽</div>
        <div style={{ fontSize: 12, color: SC_MUT }}>Cargando selecciones históricas…</div>
      </div>
    );
  }
  return (
    <div style={{ background: SC_BG, color: SC_TXT, minHeight: "100%", fontFamily: "system-ui, sans-serif", borderRadius: 14, overflow: "hidden", border: `1px solid ${SC_LINE}` }}>
      <SCHeader phase={phase} onBoard={() => setPhase("board")} onHome={() => setPhase("intro")} onBack={onBack} />

      {phase === "intro" && (
        <SCIntro
          formationKey={formationKey} setFormationKey={setFormationKey}
          almanaque={almanaque} setAlmanaque={setAlmanaque}
          name={name} setName={setName} hasUser={!!currentUser}
          onStart={startGame}
          board={board} meId={currentUser?.id} onView={setViewing}
        />
      )}

      {phase === "draft" && (
        <SCDraft
          slots={slots} placed={placed} drawn={drawn} turn={turn}
          rerolls={rerolls} almanaque={almanaque}
          spinning={spinning} reelTeam={reelTeam}
          onPick={pickPlayer} onReroll={reroll}
        />
      )}

      {phase === "match" && campaign && (
        <SCLiveMatch
          key={matchIndex}
          match={campaign.matches[matchIndex]}
          index={matchIndex}
          total={campaign.matches.length}
          xi={placed}
          cumWins={campaign.matches.slice(0, matchIndex).filter((m) => m.outcome === "W").length}
          onNext={() => {
            if (matchIndex + 1 < campaign.matches.length) setMatchIndex(matchIndex + 1);
            else setPhase("result");
          }}
        />
      )}

      {phase === "result" && campaign && (
        <SCResult
          campaign={campaign} placed={placed} formationKey={formationKey}
          onReplay={startGame} saveError={saveError}
          board={board} meId={currentUser?.id} onView={setViewing}
        />
      )}

      {phase === "board" && (
        <SCBoard board={board} meId={currentUser?.id} onView={setViewing} onReplay={startGame} />
      )}

      {viewing && <SCSquadModal entry={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

/* ------------------------------- HEADER ----------------------------------- */
function SCHeader({ phase, onBoard, onHome, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${SC_LINE}`, background: SC_PANEL }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${SC_LINE}`, borderRadius: 7, background: "transparent", color: SC_TXT, cursor: "pointer", fontSize: 11 }}>← Volver</button>
        )}
        <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: SC_TXT }}>
          <span style={{ fontWeight: 900, fontSize: 20, color: SC_ACCENT, letterSpacing: -1 }}>7–0</span>
          <span style={{ fontSize: 12, color: SC_MUT, fontWeight: 600 }}>SIETE CERO</span>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- INTRO ----------------------------------- */
function SCIntro({ formationKey, setFormationKey, almanaque, setAlmanaque, name, setName, hasUser, onStart, board, meId, onView }) {
  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 800 }}>Arma tu once. Cierra el 7-0.</h2>
      <p style={{ color: SC_MUT, fontSize: 13.5, margin: "0 0 16px", lineHeight: 1.5 }}>
        Cada turno se sortea una selección histórica. Eliges 1 jugador, se coloca en un hueco compatible.
        11 turnos, luego 3 grupos + 4 eliminatorias. Gana los 7 y lo cierras 7-0.
      </p>

      <label style={scLbl()}>Formación</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {Object.keys(SC_FORMATIONS).map((f) => (
          <button key={f} onClick={() => setFormationKey(f)}
            style={scChip(formationKey === f)}>{f}</button>
        ))}
      </div>

      <label style={scLbl()}>Modo</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setAlmanaque(false)} style={scChip(!almanaque)}>Clásico · ratings visibles</button>
        <button onClick={() => setAlmanaque(true)} style={scChip(almanaque)}>Almanaque · a ciegas</button>
      </div>

      {!hasUser && (
        <>
          <label style={scLbl()}>Tu nombre (para el ranking)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Escribe tu nombre"
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: `1px solid ${SC_LINE}`, background: SC_PANEL2, color: SC_TXT, marginBottom: 16, fontSize: 14 }} />
        </>
      )}

      <button onClick={onStart} style={scBtn("primary", true)}>Tirar 🎲 · empezar draft</button>

      <div style={{ marginTop: 22 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800 }}>🏆 Ranking · quién llegó más lejos</h3>
        <p style={{ color: SC_MUT, fontSize: 11.5, margin: "0 0 10px" }}>Toca a un jugador para ver su once 👁️</p>
        <SCRankingList board={board} meId={meId} onView={onView} />
      </div>
    </div>
  );
}

/* -------------------------------- DRAFT ----------------------------------- */
function SCDraft({ slots, placed, drawn, turn, rerolls, almanaque, spinning, reelTeam, onPick, onReroll }) {
  const openSlots = slots.filter((s) => !placed[s.k]);
  const picked = Object.values(placed).filter(Boolean);
  const media = picked.length ? Math.round(picked.reduce((a, p) => a + p.r, 0) / picked.length) : null;
  return (
    <div style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: SC_MUT }}>Jugador <b style={{ color: SC_TXT }}>{turn}/11</b></span>
          <span style={{ fontSize: 12, fontWeight: 800, color: media != null ? scRatingColor(media) : SC_MUT, background: "rgba(79,195,247,.10)", border: `1px solid ${SC_LINE}`, borderRadius: 8, padding: "3px 9px" }}>
            Media {media ?? "—"}
          </span>
        </div>
        <SCProgressDots total={11} done={turn} />
      </div>

      <SCPitch slots={slots} placed={placed} almanaque={almanaque} />

      {spinning ? (
        <SCReel team={reelTeam} />
      ) : drawn && (
        <div style={{ marginTop: 14, background: SC_PANEL, borderRadius: 12, border: `1px solid ${SC_LINE}`, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 26 }}>{drawn.flag}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{drawn.team}</div>
                <div style={{ fontSize: 12, color: SC_MUT }}>Mundial {drawn.year}</div>
              </div>
            </div>
            <button onClick={onReroll} disabled={rerolls === 0} style={scBtn(rerolls ? "ghost" : "disabled")}>
              🔄 Cambiar · {rerolls} {rerolls === 1 ? "restante" : "restantes"}
            </button>
          </div>

          <div style={{ fontSize: 11.5, color: SC_MUT, marginBottom: 8 }}>Toca un jugador para encajarlo en un hueco libre.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {scByPosition(drawn.players).map((p, i) => {
              const slotK = scBestSlotFor(p, slots, placed);
              const ok = !!slotK;
              return (
                <button key={i} onClick={() => ok && onPick(p)} disabled={!ok}
                  style={scPlayerCard(ok)}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: ok ? SC_ACCENT : SC_MUT, fontWeight: 700 }}>{SC_POS_LABEL[p.pos]}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: almanaque ? SC_MUT : scRatingColor(p.r) }}>
                      {almanaque ? "•••" : p.r}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2, opacity: ok ? 1 : 0.5 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: SC_MUT, marginTop: 1 }}>
                    {ok ? `→ ${slotK}` : "sin hueco"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------- RULETA (TRAGAPERRAS) ------------------------- */
function SCReel({ team }) {
  if (!team) return null;
  const idx = SC_SQUADS.findIndex((s) => s.id === team.id);
  const at = (o) => SC_SQUADS[(idx + o + SC_SQUADS.length) % SC_SQUADS.length];
  const rows = [at(-1), at(0), at(1)];
  return (
    <div style={{ marginTop: 14, background: SC_PANEL, borderRadius: 12, border: `1px solid ${SC_LINE}`, padding: 14 }}>
      <div style={{ fontSize: 12, color: SC_GOLD, fontWeight: 800, textAlign: "center", marginBottom: 10, letterSpacing: 2 }}>
        🎰 SORTEANDO…
      </div>
      <div style={{ position: "relative", height: 150, overflow: "hidden", borderRadius: 10, background: "#0b0f14", border: `1px solid ${SC_LINE}` }}>
        {/* difuminado arriba/abajo */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 48, background: "linear-gradient(#0b0f14,rgba(11,15,20,0))", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 48, background: "linear-gradient(rgba(11,15,20,0),#0b0f14)", zIndex: 2, pointerEvents: "none" }} />
        {/* ventana central */}
        <div style={{ position: "absolute", top: "50%", left: 8, right: 8, height: 52, marginTop: -26, border: `1.5px solid ${SC_ACCENT}`, borderRadius: 8, boxShadow: `0 0 12px ${SC_ACCENT}44`, zIndex: 1, pointerEvents: "none" }} />
        {/* filas (el carrete) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          {rows.map((t, i) => {
            const center = i === 1;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, height: 50, width: "100%", justifyContent: "center",
                opacity: center ? 1 : 0.3, transform: center ? "scale(1)" : "scale(.82)",
                filter: center ? "none" : "blur(.5px)",
              }}>
                <span style={{ fontSize: center ? 32 : 24 }}>{t.flag}</span>
                <div style={{ textAlign: "left", minWidth: 120 }}>
                  <div style={{ fontWeight: 800, fontSize: center ? 16 : 13, color: center ? SC_TXT : SC_MUT }}>{t.team}</div>
                  <div style={{ fontSize: 11, color: SC_MUT }}>Mundial {t.year}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- PITCH ----------------------------------- */
function SCPitch({ slots, placed, almanaque, small }) {
  const h = small ? 300 : 360;
  return (
    <div style={{
      position: "relative", width: "100%", height: h, borderRadius: 14,
      background: "linear-gradient(180deg,#0e3d24 0%,#0a2e1b 100%)",
      border: `1px solid #16482c`, overflow: "hidden",
    }}>
      {/* líneas */}
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,.12)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 60, height: 60, marginLeft: -30, marginTop: -30, border: "1px solid rgba(255,255,255,.12)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: -1, left: "30%", width: "40%", height: 34, border: "1px solid rgba(255,255,255,.12)", borderTop: "none", borderRadius: "0 0 8px 8px" }} />
      <div style={{ position: "absolute", bottom: -1, left: "30%", width: "40%", height: 34, border: "1px solid rgba(255,255,255,.12)", borderBottom: "none", borderRadius: "8px 8px 0 0" }} />

      {slots.map((s) => {
        const p = placed[s.k];
        return (
          <div key={s.k} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%,-50%)", textAlign: "center", width: 64 }}>
            <div style={{
              width: 40, height: 40, margin: "0 auto", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: p ? "rgba(0,0,0,.45)" : "transparent",
              border: p ? `2px solid ${SC_ACCENT}` : `2px dashed ${SC_RED}`,
              boxShadow: p ? `0 0 8px rgba(79,195,247,.4)` : "none",
              fontSize: 18,
            }}>
              {p ? p._flag : <span style={{ color: SC_RED, fontSize: 11, fontWeight: 800 }}>{SC_POS_LABEL[s.accepts[0]]}</span>}
            </div>
            {p && (
              <div style={{ marginTop: 3 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px #000", lineHeight: 1.1 }}>
                  {p.name.split(" ").slice(-1)[0]}
                </div>
                {!almanaque && <div style={{ fontSize: 9.5, color: scRatingColor(p.r), fontWeight: 800 }}>{p.r}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------- PARTIDO EN VIVO ----------------------------- */
function SCLiveMatch({ match, index, total, xi, cumWins, onNext }) {
  const { round, flag, name, yg, og, outcome, pens, events, pWin, isKO } = match;
  const [shown, setShown] = useState(0);     // nº de eventos revelados
  const [clock, setClock] = useState(0);     // minuto actual
  const [score, setScore] = useState({ y: 0, o: 0 });
  const [finished, setFinished] = useState(false);
  const tRef = useRef(null);

  useEffect(() => {
    if (shown >= events.length) {
      setClock(90);
      tRef.current = setTimeout(() => setFinished(true), 500);
      return () => clearTimeout(tRef.current);
    }
    const ev = events[shown];
    tRef.current = setTimeout(() => {
      setClock(ev.min);
      if (ev.type === "goal") {
        setScore((s) => (ev.side === "you" ? { ...s, y: s.y + 1 } : { ...s, o: s.o + 1 }));
      }
      setShown((n) => n + 1);
    }, shown === 0 ? 500 : 850);
    return () => clearTimeout(tRef.current);
  }, [shown, events]);

  const skip = () => {
    if (tRef.current) clearTimeout(tRef.current);
    setScore({ y: yg, o: og });
    setShown(events.length);
    setClock(90);
    setFinished(true);
  };

  const isLast = index + 1 >= total;
  const lostKO = isKO && outcome !== "W";
  const resultColor = outcome === "W" ? SC_ACCENT : outcome === "L" ? SC_RED : SC_MUT;

  return (
    <div style={{ padding: 16 }}>
      {/* cabecera ronda */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 16, color: SC_TXT, fontWeight: 800 }}>{SC_ROUND_LABEL[round]}</div>
          <div style={{ fontSize: 11, color: SC_MUT, fontWeight: 600, marginTop: 1 }}>
            Partido {SC_ROUNDS.indexOf(round) + 1} de 7
          </div>
        </div>
        {!finished && <button onClick={skip} style={scBtn("ghost")}>⏩ Saltar</button>}
      </div>

      {/* marcador en vivo */}
      <div style={{ background: SC_PANEL, borderRadius: 14, border: `1px solid ${finished ? resultColor : SC_LINE}`, padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 24 }}>🫵</div>
            <div style={{ fontSize: 12, fontWeight: 800, marginTop: 2 }}>Tu equipo</div>
          </div>
          <div style={{ textAlign: "center", minWidth: 120 }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 1, color: SC_TXT }}>
              {score.y}<span style={{ color: SC_MUT }}> - </span>{score.o}
            </div>
            <div style={{ fontSize: 12, color: finished ? resultColor : SC_ACCENT, fontWeight: 800 }}>
              {finished ? (pens ? `Final · penaltis ${pens === "gana" ? "✓" : "✗"}` : "Final")
                        : `${clock}'`}
            </div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 24 }}>{flag}</div>
            <div style={{ fontSize: 12, fontWeight: 800, marginTop: 2 }}>{name}</div>
          </div>
        </div>
      </div>

      {/* feed de acciones */}
      <div style={{ background: SC_PANEL, borderRadius: 12, border: `1px solid ${SC_LINE}`, padding: 6, minHeight: 180 }}>
        {events.slice(0, shown).map((e, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, padding: "8px 10px", borderBottom: i < shown - 1 ? `1px solid ${SC_LINE}` : "none",
            background: e.type === "goal" ? (e.side === "you" ? "rgba(79,195,247,.10)" : "rgba(239,83,80,.10)") : "transparent",
            borderRadius: 8,
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: e.type === "goal" ? (e.side === "you" ? SC_ACCENT : SC_RED) : SC_MUT, minWidth: 30 }}>{e.min}'</span>
            <span style={{ fontSize: 13, color: e.type === "goal" ? SC_TXT : SC_MUT, fontWeight: e.type === "goal" ? 700 : 500, lineHeight: 1.35 }}>{e.text}</span>
          </div>
        ))}
        {shown === 0 && <div style={{ color: SC_MUT, fontSize: 12, textAlign: "center", padding: 20 }}>Rueda el balón…</div>}
      </div>

      {/* botón siguiente al acabar */}
      {finished && (
        <button onClick={onNext} style={{ ...scBtn("primary", true), marginTop: 12 }}>
          {lostKO ? "Ver resultado final" : isLast ? "Ver resultado final 🏆" : "Siguiente partido →"}
        </button>
      )}
    </div>
  );
}

/* -------------------------------- RESULT ---------------------------------- */
function SCResult({ campaign, placed, formationKey, onReplay, board, meId, onView, saveError }) {
  const { matches, gf, gc, gd, wins, champion, reached, power } = campaign;
  const overall = scTeamStrength(placed);
  return (
    <div style={{ padding: 18 }}>
      <div style={{
        textAlign: "center", padding: "18px 12px", borderRadius: 14, marginBottom: 16,
        background: champion ? "linear-gradient(135deg,#1a2a3a,#0d1117)" : SC_PANEL,
        border: `1px solid ${champion ? SC_GOLD : SC_LINE}`,
      }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: champion ? SC_GOLD : SC_ACCENT, letterSpacing: -2 }}>
          {wins}-{gc === 0 ? "0" : gc}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>
          {champion ? "🏆 CAMPEÓN INVICTO · 7-0" : `Eliminado en ${SC_ROUND_LABEL[reached]}`}
        </div>
        <div style={{ fontSize: 12.5, color: SC_MUT, marginTop: 6 }}>
          {wins} V · {gf} GF · {gc} GC · DG {gd >= 0 ? "+" : ""}{gd} · media {overall} · fuerza {power}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {matches.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 12px", borderRadius: 10, background: SC_PANEL,
            border: `1px solid ${m.outcome === "W" ? "rgba(79,195,247,.4)" : m.outcome === "L" ? "rgba(239,83,80,.4)" : SC_LINE}`,
          }}>
            <span style={{ fontSize: 12, color: SC_MUT, width: 70 }}>{SC_ROUND_SHORT[m.round]}</span>
            <span style={{ fontSize: 13, flex: 1 }}>{m.flag} {m.name}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: scOutcomeColor(m.outcome), width: 56, textAlign: "right" }}>
              {m.yg}-{m.og}{m.pens ? " (p)" : ""}
            </span>
          </div>
        ))}
      </div>

      {saveError ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "rgba(239,83,80,.1)", border: `1px solid ${SC_RED}`, marginBottom: 16 }}>
          <span style={{ color: SC_RED, fontSize: 13 }}>⚠</span>
          <span style={{ fontSize: 12, color: SC_TXT }}>No se pudo guardar: {saveError}</span>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: SC_PANEL, border: `1px solid ${SC_LINE}`, marginBottom: 16 }}>
          <span style={{ color: SC_ACCENT, fontSize: 13 }}>✓</span>
          <span style={{ fontSize: 12.5, color: SC_MUT }}>Tu marca se ha guardado en el ranking</span>
        </div>
      )}

      <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800 }}>🏆 Ranking · quién llegó más lejos</h3>
      <p style={{ color: SC_MUT, fontSize: 11.5, margin: "0 0 10px" }}>Toca a un jugador para ver su once 👁️</p>
      <SCRankingList board={board} meId={meId} onView={onView} />

      <button onClick={onReplay} style={scBtn("primary", true)}>Jugar otra vez 🎲</button>
    </div>
  );
}

/* -------------------------------- BOARD ----------------------------------- */
function SCBoard({ board, meId, onView, onReplay }) {
  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>🏆 Ranking · quién llegó más lejos</h2>
      <p style={{ color: SC_MUT, fontSize: 11.5, margin: "0 0 12px" }}>Toca a un jugador para ver su once 👁️</p>
      <SCRankingList board={board} meId={meId} onView={onView} />
      <button onClick={onReplay} style={{ ...scBtn("primary", true), marginTop: 8 }}>Jugar 🎲</button>
    </div>
  );
}

/* Lista de ranking reutilizable (intro y board). Filas tocables si hay plantilla. */
function SCRankingList({ board, meId, onView }) {
  if (!board) return <div style={{ color: SC_MUT, padding: 16, textAlign: "center" }}>Cargando…</div>;
  if (board.length === 0) return <div style={{ color: SC_MUT, padding: 16, textAlign: "center" }}>Aún nadie ha jugado. Sé el primero.</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
      {board.map((e, i) => {
        const isMe = meId && e.user_id === meId;
        const hasSquad = scSquadPlayers(e.squad).length > 0;
        const media = scSquadMedia(e.squad);
        const reachLabel = e.champion ? "🏆 Campeón 7-0" : `Llegó a ${SC_ROUND_LABEL[e.ronda] || e.ronda || "—"}`;
        return (
          <button key={e.user_id || i} onClick={() => hasSquad && onView(e)} disabled={!hasSquad} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", textAlign: "left",
            borderRadius: 10, background: isMe ? "rgba(79,195,247,.12)" : SC_PANEL,
            border: `1px solid ${i === 0 ? SC_GOLD : isMe ? SC_ACCENT : SC_LINE}`,
            cursor: hasSquad ? "pointer" : "default", color: SC_TXT, width: "100%",
          }}>
            <span style={{ width: 22, fontWeight: 800, color: i === 0 ? SC_GOLD : SC_MUT }}>{i + 1}</span>
            <span style={{ fontSize: 18 }}>{e.emoji || "⚽"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {e.nombre}{isMe ? " (tú)" : ""}
              </div>
              <div style={{ fontSize: 11, color: e.champion ? SC_GOLD : SC_MUT }}>{reachLabel}</div>
            </div>
            {hasSquad && <span style={{ fontSize: 13, color: SC_MUT }}>👁️</span>}
            {media != null && (
              <div style={{ textAlign: "center", minWidth: 30 }}>
                <div style={{ fontSize: 16, fontWeight: 900, lineHeight: 1, color: scRatingColor(media) }}>{media}</div>
                <div style={{ fontSize: 8, color: SC_MUT, letterSpacing: 1 }}>MEDIA</div>
              </div>
            )}
            <div style={{ textAlign: "right", minWidth: 42 }}>
              <div style={{ fontSize: 13, color: SC_ACCENT, fontWeight: 800 }}>{e.wins} V</div>
              <div style={{ fontSize: 11, color: SC_MUT }}>DG {e.gd >= 0 ? "+" : ""}{e.gd}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* Modal: once de un jugador, sobre el campo + lista ordenada por posición. */
function SCSquadModal({ entry, onClose }) {
  const players = scSquadOrdered(entry.squad);
  const fKey = scSquadFormation(entry.squad);
  const slots = fKey && SC_FORMATIONS[fKey] ? SC_FORMATIONS[fKey] : null;
  // reconstruye el mapa hueco->jugador que espera SCPitch (necesita _flag)
  const placed = slots
    ? scSquadPlayers(entry.squad).reduce((acc, pl) => {
        if (pl.k) acc[pl.k] = { ...pl, _flag: pl.flag };
        return acc;
      }, {})
    : null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 260, background: "rgba(5,12,24,.85)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto",
        background: "linear-gradient(160deg,#102339,#0a1628)", border: `2px solid ${SC_ACCENT}`,
        borderRadius: 16, padding: 18,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 26 }}>{entry.emoji || "⚽"}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{entry.nombre}</div>
            <div style={{ fontSize: 11.5, color: entry.champion ? SC_GOLD : SC_MUT, marginTop: 2 }}>
              {entry.champion ? "🏆 Campeón invicto · 7-0" : `Llegó a ${SC_ROUND_LABEL[entry.ronda] || entry.ronda || "—"}`} · {entry.wins} V · DG {entry.gd >= 0 ? "+" : ""}{entry.gd}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${SC_LINE}`, background: "transparent", color: SC_MUT, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>

        {players.length === 0 ? (
          <p style={{ fontSize: 12.5, color: SC_MUT, textAlign: "center", padding: "20px 0" }}>
            Esta marca se guardó antes de registrar las alineaciones, así que no hay once que mostrar.
          </p>
        ) : (
          <>
            {slots && placed && (
              <div style={{ marginBottom: 12 }}>
                <SCPitch slots={slots} placed={placed} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {players.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: SC_PANEL, border: `1px solid ${SC_LINE}` }}>
                  <span style={{ width: 34, fontSize: 10, fontWeight: 800, color: SC_ACCENT, textAlign: "center" }}>
                    {SC_POS_ES[p.slotPos || p.pos] || p.pos}
                  </span>
                  <span style={{ fontSize: 16 }}>{p.flag || "🏳️"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize: 10.5, color: SC_MUT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.team}{p.year ? ` · ${p.year}` : ""}
                    </div>
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 900, color: scRatingColor(p.r), minWidth: 26, textAlign: "right" }}>{p.r}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ MINI UI ----------------------------------- */
function SCProgressDots({ total, done }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i < done ? SC_ACCENT : SC_LINE }} />
      ))}
    </div>
  );
}

/* ------------------------------ ESTILOS ----------------------------------- */
const scRatingColor = (r) => (r >= 90 ? SC_GOLD : r >= 84 ? SC_ACCENT : r >= 78 ? "#9cc7e0" : SC_MUT);
const scOutcomeColor = (o) => (o === "W" ? SC_ACCENT : o === "L" ? SC_RED : SC_MUT);

const scLbl = () => ({ display: "block", fontSize: 12, color: SC_MUT, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 });

const scChip = (active) => ({
  flex: 1, padding: "9px 6px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
  border: `1px solid ${active ? SC_ACCENT : SC_LINE}`,
  background: active ? "rgba(79,195,247,.14)" : SC_PANEL2,
  color: active ? SC_ACCENT : SC_MUT,
});

const scPlayerCard = (ok) => ({
  textAlign: "left", padding: "8px 10px", borderRadius: 10, cursor: ok ? "pointer" : "not-allowed",
  border: `1px solid ${ok ? "rgba(79,195,247,.35)" : SC_LINE}`,
  background: ok ? SC_PANEL2 : "#12161c", color: SC_TXT, opacity: ok ? 1 : 0.55,
});

function scBtn(kind, full) {
  const base = { padding: "11px 14px", borderRadius: 11, fontSize: 14, fontWeight: 800, cursor: "pointer", border: "none", width: full ? "100%" : "auto" };
  if (kind === "primary") return { ...base, background: SC_ACCENT, color: "#06222f" };
  if (kind === "ghost") return { ...base, background: SC_PANEL2, color: SC_TXT, border: `1px solid ${SC_LINE}`, fontWeight: 700 };
  if (kind === "disabled") return { ...base, background: SC_PANEL2, color: SC_MUT, cursor: "not-allowed", border: `1px solid ${SC_LINE}`, opacity: 0.6 };
  return base;
}

// ============================================================
// JUEGO FOOTLE
// ============================================================
const FOOTLE_WC_NATIONS = new Set([
  "France","Spain","England","Argentina","Brazil",
  "Portugal","Germany","Netherlands","Belgium","Uruguay",
]);

// Convocados REALES al Mundial 2026 (listas oficiales). Se compara por apellido
// normalizado, así que basta con que el apellido coincida con players.json.
const FOOTLE_SQUADS = {
  France: ["Maignan","Samba","Risser","Digne","Gusto","Lucas Hernandez","Theo Hernandez","Konaté","Koundé","Lacroix","Saliba","Upamecano","Kanté","Koné","Rabiot","Tchouaméni","Zaïre-Emery","Akliouche","Barcola","Cherki","Dembélé","Doué","Mateta","Mbappé","Olise","Thuram"],
  Spain: ["Unai Simón","Joan García","Raya","Cucurella","Grimaldo","Cubarsí","Laporte","Pubill","Eric García","Marcos Llorente","Pedro Porro","Pedri","Fabián Ruiz","Zubimendi","Gavi","Rodri","Baena","Merino","Oyarzabal","Dani Olmo","Nico Williams","Yeremy Pino","Ferran Torres","Borja Iglesias","Víctor Muñoz","Lamine Yamal"],
  England: ["Henderson","Pickford","Trafford","Burn","Guéhi","Reece James","Konsa","Livramento","O'Reilly","Quansah","Spence","Stones","Anderson","Bellingham","Eze","Mainoo","Rice","Rogers","Gordon","Kane","Madueke","Rashford","Saka","Toney","Watkins"],
  Argentina: ["Musso","Rulli","Martínez","Balerdi","Tagliafico","Montiel","Lisandro Martínez","Romero","Otamendi","Medina","Molina","Paredes","De Paul","Barco","Lo Celso","Palacios","Mac Allister","Enzo Fernández","Álvarez","Messi","Nicolás González","Almada","Simeone","Paz","López","Lautaro Martínez"],
  Brazil: ["Alisson","Ederson","Weverton","Marquinhos","Gabriel Magalhães","Bremer","Ibañez","Léo Pereira","Wesley","Alex Sandro","Douglas Santos","Danilo","Casemiro","Bruno Guimarães","Paquetá","Fabinho","Raphinha","Vinicius","Luiz Henrique","Martinelli","Neymar","Endrick","Matheus Cunha","Rayan","Igor Thiago"],
  Portugal: ["Diogo Costa","Rui Silva","José Sá","Rúben Dias","Gonçalo Inácio","Cancelo","Nuno Mendes","Dalot","Semedo","Tomás Araújo","Renato Veiga","Vitinha","João Neves","Bruno Fernandes","Rúben Neves","Matheus Nunes","Samu Costa","Bernardo Silva","Cristiano Ronaldo","Trincão","João Félix","Gonçalo Ramos","Pedro Neto","Conceição","Leão","Gonçalo Guedes"],
  Germany: ["Baumann","Neuer","Nübel","Anton","Brown","Raum","Rüdiger","Schlotterbeck","Tah","Thiaw","Amiri","Goretzka","Groß","Leweling","Kimmich","Musiala","Nmecha","Pavlović","Stiller","Sané","Wirtz","Beier","Havertz","Undav","Woltemade"],
  Netherlands: ["Verbruggen","Aké","Van Dijk","Hato","Van Hecke","Dumfries","Timber","Van de Ven","Gravenberch","De Jong","De Roon","Reijnders","Koopmeiners","Lang","Wieffer","Summerville","Brobbey","Depay","Gakpo","Kluivert","Malen","Weghorst"],
  Belgium: ["Courtois","Lammens","Penders","Castagne","De Cuyper","Meunier","Theate","Debast","Ngoy","De Winter","Mechele","Seys","Tielemans","Onana","Raskin","Vanaken","De Bruyne","Witsel","Trossard","Doku","Saelemaekers","Lukebakio","De Ketelaere","Lukaku","Moreira","Fernández-Pardo"],
  Uruguay: ["Rochet","Muslera","Mele","Varela","Araújo","Giménez","Bueno","Cáceres","Olivera","Piquerez","Viña","Ugarte","Bentancur","Valverde","Canobbio","Sanabria","De Arrascaeta","De La Cruz","Zalazar","Pellistri","Núñez","Aguirre","Viñas"],
};

// Normaliza: minúsculas, sin acentos, sin puntos
const footleNorm = s => (s || "")
  .toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[.'']/g, "").trim();

// Set con apellidos normalizados de todos los convocados de las 10 selecciones
const FOOTLE_SQUAD_KEYS = new Set(
  Object.values(FOOTLE_SQUADS).flat().map(n => {
    const norm = footleNorm(n);
    const parts = norm.split(/\s+/);
    return parts[parts.length - 1]; // apellido
  })
);

// ¿El jugador de players.json es un convocado de una de las 10 selecciones?
function footleIsCallup(p) {
  if (!FOOTLE_WC_NATIONS.has(p.nation)) return false;
  const norm = footleNorm(p.name);
  const parts = norm.split(/\s+/);
  const last = parts[parts.length - 1];
  if (FOOTLE_SQUAD_KEYS.has(last)) return true;
  // por si players.json trae el nombre completo y el apellido es compuesto
  return parts.some(w => w.length > 3 && FOOTLE_SQUAD_KEYS.has(w));
}

const FOOTLE_CONF = {
  France:"UEFA",Spain:"UEFA",Germany:"UEFA",England:"UEFA",Belgium:"UEFA",
  Netherlands:"UEFA",Portugal:"UEFA",Croatia:"UEFA",Switzerland:"UEFA",
  Norway:"UEFA",Sweden:"UEFA",Czechia:"UEFA",Scotland:"UEFA",Türkiye:"UEFA",
  "Bosnia & Herzegovina":"UEFA",Austria:"UEFA",
  Brazil:"CONMEBOL",Argentina:"CONMEBOL",Uruguay:"CONMEBOL",
  Colombia:"CONMEBOL",Ecuador:"CONMEBOL",Paraguay:"CONMEBOL",
  "United States":"CONCACAF",Mexico:"CONCACAF",Canada:"CONCACAF",
  Panama:"CONCACAF",Haiti:"CONCACAF","Curaçao":"CONCACAF",
  Morocco:"CAF",Senegal:"CAF",Egypt:"CAF",Ghana:"CAF",Tunisia:"CAF",
  "Ivory Coast":"CAF",Algeria:"CAF","South Africa":"CAF","DR Congo":"CAF",
  Japan:"AFC","South Korea":"AFC","Saudi Arabia":"AFC",Australia:"AFC",
  Iran:"AFC",Qatar:"AFC",Iraq:"AFC",Jordan:"AFC",Uzbekistan:"AFC",
  "New Zealand":"OFC",
};

const FOOTLE_POS_GROUP = {
  GK:"POR",CB:"DEF",LB:"DEF",RB:"DEF",
  CDM:"MED",CM:"MED",CAM:"MED",LM:"MED",RM:"MED",
  ST:"DEL",LW:"DEL",RW:"DEL",
};

function footleHints(guess, target) {
  return {
    nation: guess.nation === target.nation ? "✅" : "❌",
    nationLabel: guess.nation,
    pos: guess.positions[0] === target.positions[0] ? "✅" : "❌",
    posLabel: guess.positions[0],
    league: guess.league === target.league ? "✅" : "❌",
    leagueLabel: guess.league,
    club: guess.club === target.club ? "✅" : "❌",
    clubLabel: guess.club,
  };
}

function FootleGame({ user, onBack }) {
  const [allPlayers, setAllPlayers] = useState([]);
  const [phase, setPhase] = useState("loading");
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const MAX_GUESSES = 6;

  useEffect(() => {
    fetch("/players.json")
      .then(r => r.json())
      .then(data => { setAllPlayers(data.filter(footleIsCallup)); setPhase("menu"); })
      .catch(() => setPhase("menu"));
  }, []);

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("footle_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser)
        .map(([uid, sc]) => ({ name: profiles.find(p => p.id === uid)?.name || "Usuario", emoji: profiles.find(p => p.id === uid)?.emoji || "⚽", score: sc }))
        .sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };

  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);

  const startGame = () => {
    if (allPlayers.length === 0) return;
    setTarget(allPlayers[Math.floor(Math.random() * allPlayers.length)]);
    setGuesses([]); setInput(""); setSuggestions([]); setWon(false); setScore(0);
    setPhase("playing");
  };

  const guessedIds = new Set(guesses.map(g => g.player.id));

  useEffect(() => {
    if (input.length < 2) { setSuggestions([]); return; }
    const q = input.toLowerCase();
    setSuggestions(allPlayers.filter(p => p.name.toLowerCase().includes(q) && !guessedIds.has(p.id)).slice(0, 6));
  }, [input, allPlayers, guesses]);

  const submitGuess = async (player) => {
    if (!target || guesses.length >= MAX_GUESSES) return;
    const hints = footleHints(player, target);
    const newGuesses = [...guesses, { player, hints }];
    setGuesses(newGuesses);
    setInput(""); setSuggestions([]);
    if (player.id === target.id) {
      const pts = (MAX_GUESSES - newGuesses.length + 1) * 10;
      setScore(pts); setWon(true); setPhase("result");
      await supabase.from("footle_scores").insert({ user_id: user.id, score: pts, attempts: newGuesses.length });
      loadRankings();
    } else if (newGuesses.length >= MAX_GUESSES) {
      setScore(0); setWon(false); setPhase("result");
      await supabase.from("footle_scores").insert({ user_id: user.id, score: 0, attempts: MAX_GUESSES + 1 });
      loadRankings();
    }
  };

  const medals = ["🥇", "🥈", "🥉"];
  const HINT_COLS = [
    { key: "nation", label: "PAÍS" },
    { key: "pos", label: "POS" },
    { key: "league", label: "LIGA" },
    { key: "club", label: "EQUIPO" },
  ];
  const hintColor = v => {
    if (v === "✅") return { bg: "rgba(76,175,80,0.25)", border: "rgba(76,175,80,0.6)", color: "#81c784" };
    return { bg: "rgba(255,82,82,0.15)", border: "rgba(255,82,82,0.4)", color: "#ef9a9a" };
  };

  if (phase === "loading") return (
    <div style={{ textAlign: "center", padding: "40px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Cargando jugadores...</div>
  );

  if (phase === "menu") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>FOOTLE</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(76,175,80,0.3)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🕵️</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", letterSpacing: "4px", marginBottom: "8px" }}>FOOTLE</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.9, marginBottom: "6px" }}>
          Adivina el jugador del Mundial 2026<br/>
          <span style={{ color: "#81c784" }}>🟢 Acierto</span> · <span style={{ color: "#ef9a9a" }}>🔴 Fallo</span>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", marginBottom: "20px", marginTop: "12px" }}>
          {[["1 intento","60 pts"],["3 intentos","40 pts"],["6 intentos","10 pts"]].map(([a,b]) => (
            <div key={a} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "8px 4px" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#81c784" }}>{b}</div>
              <div style={{ fontSize: "9px", color: "#a0c0e0", fontFamily: "'Inter', sans-serif" }}>{a}</div>
            </div>
          ))}
        </div>
        <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg,#43a047,#1b5e20)", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚽ JUGAR</button>
      </div>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING FOOTLE</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? "rgba(76,175,80,0.1)" : CARD, border: i === 0 ? "1px solid rgba(76,175,80,0.3)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.emoji} {r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? "#81c784" : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>PTS</span>
        </div>
      ))}
    </div>
  );

  if (phase === "playing") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <button onClick={() => setPhase("menu")} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Salir</button>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: "#d0e4f7", letterSpacing: "2px" }}>INTENTO {guesses.length}/{MAX_GUESSES}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(4,56px)", gap: "3px", marginBottom: "4px" }}>
        <div style={{ fontSize: "8px", color: "#7090b0", fontFamily: "'Inter', sans-serif", paddingLeft: "4px" }}>JUGADOR</div>
        {HINT_COLS.map(c => <div key={c.key} style={{ fontSize: "8px", color: "#7090b0", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>{c.label}</div>)}
      </div>
      {guesses.map((g, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr repeat(4,56px)", gap: "3px", marginBottom: "3px" }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "7px", padding: "5px 7px", fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#e0eaf8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>{g.player.name}</div>
          {HINT_COLS.map(c => {
            const val = g.hints[c.key];
            const labelVal = g.hints[c.key + "Label"];
            const { bg, border, color } = hintColor(val);
            return (
              <div key={c.key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "7px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3px 2px", minHeight: "42px" }}>
                <span style={{ fontSize: val === "↑" || val === "↓" ? "14px" : "11px", color }}>{val}</span>
                <span style={{ fontSize: "7px", color, fontFamily: "'Inter', sans-serif", textAlign: "center", lineHeight: 1.2, marginTop: "1px", maxWidth: "48px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(labelVal)}</span>
              </div>
            );
          })}
        </div>
      ))}
      {Array.from({ length: MAX_GUESSES - guesses.length }).map((_, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr repeat(4,56px)", gap: "3px", marginBottom: "3px" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "7px", height: "42px" }} />
          {HINT_COLS.map(c => <div key={c.key} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "7px", height: "42px" }} />)}
        </div>
      ))}
      <div style={{ position: "relative", marginTop: "14px" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Escribe el nombre del jugador..."
          style={{ width: "100%", boxSizing: "border-box", padding: "13px 14px", border: `1px solid ${BORDER}`, borderRadius: "10px", background: "rgba(255,255,255,0.06)", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", fontSize: "13px", outline: "none" }} />
        {suggestions.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0e1f35", border: `1px solid ${BORDER}`, borderRadius: "10px", marginTop: "4px", zIndex: 10, overflow: "hidden" }}>
            {suggestions.map(p => (
              <button key={p.id} onClick={() => submitGuess(p)}
                style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 14px", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#4fc3f7", minWidth: "28px" }}>{p.rating}</span>
                <span style={{ flex: 1 }}>{p.name}</span>
                <span style={{ fontSize: "10px", color: "#a0c0e0" }}>{p.nation}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <p style={{ fontSize: "9px", color: "#506070", fontFamily: "'Inter', sans-serif", marginTop: "8px", lineHeight: 1.6 }}>
        💡 Verde = aciertas · Rojo = no coincide
      </p>
    </div>
  );

  if (phase === "result") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <button onClick={() => setPhase("menu")} style={{ marginBottom: "20px", padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
      <div style={{ background: CARD, border: `1px solid ${won ? "rgba(76,175,80,0.4)" : "rgba(255,82,82,0.3)"}`, borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>{won ? "⚽" : "😢"}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7", letterSpacing: "3px" }}>
          {won ? `¡ENCONTRADO EN ${guesses.length} ${guesses.length === 1 ? "INTENTO" : "INTENTOS"}!` : "¡ERA...!"}
        </div>
        <div style={{ margin: "14px auto", display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px", justifyContent: "center", maxWidth: "280px" }}>
          {target?.photo && <img src={target.photo} alt={target.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", background: "rgba(255,255,255,0.1)" }} onError={e => { e.target.style.display="none"; }} />}
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: won ? "#81c784" : "#ef9a9a" }}>{target?.name}</div>
            <div style={{ fontSize: "10px", color: "#a0c0e0", fontFamily: "'Inter', sans-serif" }}>{target?.nation} · {target?.positions?.[0]} · {target?.club}</div>
            <div style={{ fontSize: "10px", color: "#ffd54f", fontFamily: "'Inter', sans-serif" }}>OVR {target?.rating}</div>
          </div>
        </div>
        {won && <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: "#81c784", lineHeight: 1 }}>{score} PTS</div>}
      </div>
      <button onClick={startGame} style={{ width: "100%", padding: "14px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg,#43a047,#1b5e20)", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "20px" }}>🔄 OTRA PARTIDA</button>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING FOOTLE</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? "rgba(76,175,80,0.1)" : CARD, border: i === 0 ? "1px solid rgba(76,175,80,0.3)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.emoji} {r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? "#81c784" : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>PTS</span>
        </div>
      ))}
    </div>
  );

  return null;
}

// ============================================================
// SIMON DE BANDERAS — repite la secuencia
// ============================================================
const SIMON_FLAGS = [
  { name: "México", flag: "🇲🇽" }, { name: "Brasil", flag: "🇧🇷" }, { name: "España", flag: "🇪🇸" },
  { name: "Francia", flag: "🇫🇷" }, { name: "Argentina", flag: "🇦🇷" }, { name: "Alemania", flag: "🇩🇪" },
  { name: "Portugal", flag: "🇵🇹" }, { name: "Inglaterra", flag: "🇬🇧" }, { name: "Países Bajos", flag: "🇳🇱" },
];

function SimonGame({ user, onBack }) {
  const [phase, setPhase] = useState("menu"); // menu | playing | result
  const [sequence, setSequence] = useState([]);
  const [userStep, setUserStep] = useState(0);
  const [showing, setShowing] = useState(false);   // mostrando la secuencia
  const [activeIdx, setActiveIdx] = useState(null); // celda iluminada
  const [score, setScore] = useState(0);
  const [wrongIdx, setWrongIdx] = useState(null);   // celda fallada (flash rojo)
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);
  const timersRef = useRef([]);

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  useEffect(() => () => clearTimers(), []);

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("simon_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser)
        .map(([uid, sc]) => ({ name: profiles.find(p => p.id === uid)?.name || "Usuario", emoji: profiles.find(p => p.id === uid)?.emoji || "⚽", score: sc }))
        .sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };
  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);

  // Reproduce la secuencia iluminando celdas una a una
  const playSequence = (seq) => {
    setShowing(true);
    setUserStep(0);
    clearTimers();
    const speed = Math.max(260, 680 - seq.length * 38); // se acelera al avanzar
    seq.forEach((idx, i) => {
      timersRef.current.push(setTimeout(() => setActiveIdx(idx), i * speed + 300));
      timersRef.current.push(setTimeout(() => setActiveIdx(null), i * speed + 300 + speed * 0.6));
    });
    timersRef.current.push(setTimeout(() => setShowing(false), seq.length * speed + 300));
  };

  const startGame = () => {
    const first = [Math.floor(Math.random() * SIMON_FLAGS.length)];
    setSequence(first); setScore(0); setWrongIdx(null);
    setPhase("playing");
    playSequence(first);
  };

  const nextRound = (prevSeq) => {
    const next = [...prevSeq, Math.floor(Math.random() * SIMON_FLAGS.length)];
    setSequence(next);
    playSequence(next);
  };

  const finishGame = async (finalScore) => {
    clearTimers();
    setPhase("result");
    await supabase.from("simon_scores").insert({ user_id: user.id, score: finalScore });
    loadRankings();
  };

  const tapCell = (idx) => {
    if (showing || phase !== "playing") return;
    // Feedback al pulsar
    setActiveIdx(idx);
    setTimeout(() => setActiveIdx(null), 180);

    if (idx === sequence[userStep]) {
      const nextStep = userStep + 1;
      if (nextStep === sequence.length) {
        // Ronda completada
        const newScore = sequence.length;
        setScore(newScore);
        timersRef.current.push(setTimeout(() => nextRound(sequence), 700));
      } else {
        setUserStep(nextStep);
      }
    } else {
      // Fallo
      setWrongIdx(idx);
      timersRef.current.push(setTimeout(() => finishGame(score), 800));
    }
  };

  const medals = ["🥇", "🥈", "🥉"];

  // Paleta por celda (para que cada bandera tenga su color al iluminarse)
  const CELL_COLORS = ["#4fc3f7", "#34d399", "#ffd54f", "#ff6b4a", "#c084fc", "#f472b6", "#60a5fa", "#fb923c", "#2dd4bf"];

  if (phase === "menu") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>SIMON BANDERAS</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🧠🚩</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>SIMON DE BANDERAS</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: "20px" }}>
          Memoriza la secuencia de banderas y repítela.<br/>Cada ronda añade una más. ¿Hasta dónde llegas?
        </p>
        <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚡ JUGAR</button>
      </div>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING SIMON</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.emoji} {r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>RONDA</span>
        </div>
      ))}
    </div>
  );

  if (phase === "playing") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <button onClick={() => { clearTimers(); setPhase("menu"); }} style={{ padding: "6px 12px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#c0d8f0", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Salir</button>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: GREEN }}>RONDA {sequence.length}</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px", minHeight: "22px" }}>
        <span style={{ fontSize: "12px", color: showing ? "#ffd54f" : GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", animation: "pulse 1.5s infinite" }}>
          {showing ? "👀 MEMORIZA..." : "👆 TU TURNO"}
        </span>
      </div>

      {/* Cuadrícula 3x3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", maxWidth: "360px", margin: "0 auto" }}>
        {SIMON_FLAGS.map((f, i) => {
          const lit = activeIdx === i;
          const isWrong = wrongIdx === i;
          const color = CELL_COLORS[i % CELL_COLORS.length];
          return (
            <button
              key={i}
              onClick={() => tapCell(i)}
              disabled={showing}
              style={{
                aspectRatio: "1",
                border: `2px solid ${isWrong ? "#cc2222" : lit ? color : BORDER}`,
                borderRadius: "14px",
                background: isWrong ? "rgba(204,34,34,0.3)" : lit ? `${color}33` : CARD,
                cursor: showing ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "clamp(34px,11vw,46px)",
                transform: lit ? "scale(1.06)" : "scale(1)",
                boxShadow: lit ? `0 0 22px ${color}` : "none",
                transition: "all 0.12s ease",
                opacity: showing && !lit ? 0.55 : 1,
              }}>
              {f.flag}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", textAlign: "center", marginTop: "20px" }}>
        Pulsa las banderas en el mismo orden que se iluminaron
      </p>
    </div>
  );

  if (phase === "result") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
      <button onClick={() => setPhase("menu")} style={{ marginBottom: "20px", padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
      <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", padding: "28px", marginBottom: "20px" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>{score >= 12 ? "🏆" : score >= 7 ? "🧠" : "😅"}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7", letterSpacing: "3px" }}>LLEGASTE A LA RONDA</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "64px", color: GREEN, lineHeight: 1 }}>{score}</div>
        <p style={{ marginTop: "10px", fontSize: "12px", color: "#e0eefa", fontFamily: "'Inter', sans-serif" }}>
          {score >= 12 ? "¡Memoria de elefante! 🐘" : score >= 7 ? "Muy buen nivel 🧠" : "A entrenar la memoria 😅"}
        </p>
      </div>
      <button onClick={startGame} style={{ padding: "13px 36px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "20px" }}>🔄 OTRA VEZ</button>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING SIMON</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.emoji} {r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif" }}>RONDA</span>
        </div>
      ))}
    </div>
  );

  return null;
}

// ============================================================
// CHAPAS — fútbol de chapas 1v1 en tiempo real (estilo Soccer Stars)
// Horizontal · a 3 goles · física de rebotes por turnos
// Requiere: tablas soccer_rooms y soccer_scores en Supabase
// ============================================================
const CH_W = 600, CH_H = 360, CH_DR = 17, CH_BR = 12;
const CH_GTOP = 110, CH_GBOT = 250;     // boca de portería
const CH_FR = 0.986, CH_E = 0.9, CH_MINV = 0.05;
const CH_MAXPULL = 130, CH_MAXV = 15, CH_MINPULL = 6;
const CH_P1 = "#4fc3f7", CH_P2 = "#ff8a5b";   // colores de cada equipo
const CH_WIN_GOALS = 3;
const CH_SUBSTEPS = 2;   // ⬅️ menos pasos por frame = chapas y balón más lentos (antes iban a 4)
// Nota: el canvas pasa a ser 360x600 (vertical) y el campo se dibuja girado 90°.

function chFormation() {
  const mk = (x, y, team, idx, type) => ({
    x, y, vx: 0, vy: 0,
    r: type === "ball" ? CH_BR : CH_DR,
    m: type === "ball" ? 0.5 : 1, team, idx, type,
  });
  
  return [
    // --- Equipo 1 (Izquierda) ---
    mk(45, 180, "p1", 0, "disc"),   // Portero
    mk(150, 140, "p1", 1, "disc"),  // Defensa superior (más cerrado)
    mk(150, 220, "p1", 2, "disc"),  // Defensa inferior (más cerrado)
    mk(240, 155, "p1", 3, "disc"),  // Medio superior (bloqueando el centro)
    mk(240, 205, "p1", 4, "disc"),  // Medio inferior (bloqueando el centro)

    // --- Equipo 2 (Derecha) ---
    mk(555, 180, "p2", 0, "disc"),  // Portero
    mk(450, 140, "p2", 1, "disc"),  // Defensa superior
    mk(450, 220, "p2", 2, "disc"),  // Defensa inferior
    mk(360, 155, "p2", 3, "disc"),  // Medio superior
    mk(360, 205, "p2", 4, "disc"),  // Medio inferior

    // --- Balón ---
    mk(300, 180, "ball", 0, "ball"),
  ];
}

function chStep(b) {
  let goal = null;
  for (const p of b) {
    p.x += p.vx; p.y += p.vy; p.vx *= CH_FR; p.vy *= CH_FR;
    if (Math.abs(p.vx) < CH_MINV) p.vx = 0;
    if (Math.abs(p.vy) < CH_MINV) p.vy = 0;
    if (p.y - p.r < 0) { p.y = p.r; p.vy = -p.vy * CH_E; }
    if (p.y + p.r > CH_H) { p.y = CH_H - p.r; p.vy = -p.vy * CH_E; }
    const inBand = p.y > CH_GTOP && p.y < CH_GBOT;
    if (p.type === "ball" && inBand) {
      if (p.x < -p.r) goal = "p2";          // balón en portería izquierda → marca p2
      else if (p.x > CH_W + p.r) goal = "p1";
    } else {
      if (p.x - p.r < 0) { p.x = p.r; p.vx = -p.vx * CH_E; }
      if (p.x + p.r > CH_W) { p.x = CH_W - p.r; p.vx = -p.vx * CH_E; }
    }
  }
  for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
    const a = b[i], c = b[j];
    const dx = c.x - a.x, dy = c.y - a.y;
    const d = Math.hypot(dx, dy), min = a.r + c.r;
    if (d > 0 && d < min) {
      const nx = dx / d, ny = dy / d, overlap = min - d, totM = a.m + c.m;
      a.x -= nx * overlap * (c.m / totM); a.y -= ny * overlap * (c.m / totM);
      c.x += nx * overlap * (a.m / totM); c.y += ny * overlap * (a.m / totM);
      const rel = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
      if (rel < 0) {
        const imp = -(1 + CH_E) * rel / (1 / a.m + 1 / c.m);
        a.vx -= imp * nx / a.m; a.vy -= imp * ny / a.m;
        c.vx += imp * nx / c.m; c.vy += imp * ny / c.m;
      }
    }
  }
  return goal;
}
const chSettled = (b) => b.every(p => Math.abs(p.vx) < 0.08 && Math.abs(p.vy) < 0.08);

function chDraw(ctx, b, aim, myRole, p1Flag, p2Flag) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, CH_W, CH_H);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#0f2e1a" : "#0d2817";
    ctx.fillRect(i * (CH_W / 10), 0, CH_W / 10, CH_H);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(CH_W / 2, 0); ctx.lineTo(CH_W / 2, CH_H); ctx.stroke();
  ctx.beginPath(); ctx.arc(CH_W / 2, CH_H / 2, 52, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(CH_W / 2, CH_H / 2, 3, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fill();
  const drawGoal = (xLine, side) => {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(side === "L" ? xLine : xLine - 10, CH_GTOP - 4, 10, 8);
    ctx.fillRect(side === "L" ? xLine : xLine - 10, CH_GBOT - 4, 10, 8);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(side === "L" ? xLine - 14 : xLine, CH_GTOP, 14, CH_GBOT - CH_GTOP);
    ctx.strokeStyle = "#f0f0e8"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(xLine, CH_GTOP); ctx.lineTo(xLine, CH_GBOT); ctx.stroke();
  };
  drawGoal(2, "L"); drawGoal(CH_W - 2, "R");
  if (aim && aim.disc != null) {
    const d = b[aim.disc];
    ctx.strokeStyle = aim.power > 0.66 ? "#ff6b4a" : aim.power > 0.33 ? "#ffd54f" : CH_P1;
    ctx.lineWidth = 3; ctx.setLineDash([6, 5]);
    const len = 14 + aim.power * 70;
    const ex = d.x + aim.dx * len, ey = d.y + aim.dy * len;
    ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.setLineDash([]);
    const ang = Math.atan2(aim.dy, aim.dx);
    ctx.beginPath(); ctx.moveTo(ex, ey);
    ctx.lineTo(ex - 9 * Math.cos(ang - 0.4), ey - 9 * Math.sin(ang - 0.4));
    ctx.lineTo(ex - 9 * Math.cos(ang + 0.4), ey - 9 * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fillStyle = ctx.strokeStyle; ctx.fill();
  }
  for (const p of b) {
    if (p.type === "ball") continue;
    const ring = p.team === "p1" ? CH_P1 : CH_P2;
    const mine = p.team === myRole;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(10,22,40,0.85)"; ctx.fill();
    ctx.lineWidth = mine ? 3 : 2; ctx.strokeStyle = ring;
    if (mine) { ctx.shadowColor = ring; ctx.shadowBlur = 8; }
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.font = `${Math.round(p.r * 1.25)}px serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(p.team === "p1" ? p1Flag : p2Flag, p.x, p.y + 1);
  }
  const ball = b[10];
  ctx.font = `${Math.round(CH_BR * 1.9)}px serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("⚽", ball.x, ball.y + 1);
}

function ChapasGame({ user, onBack }) {
  const COUNTRIES = Object.values(GROUPS).flat();
  const [phase, setPhase] = useState("menu"); // menu | waiting | playing | finished
  const [myCountry, setMyCountry] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [room, setRoom] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [turn, setTurn] = useState("p1");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [error, setError] = useState("");
  const [ranking, setRanking] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [showGoal, setShowGoal] = useState(null);

  const canvasRef = useRef(null);
  const roomIdRef = useRef(null);
  const roomChanRef = useRef(null);
  const gameChanRef = useRef(null);
  const pollRef = useRef(null);

  const bodiesRef = useRef(chFormation());
  const aimRef = useRef(null);
  const animatingRef = useRef(false);
  const goalRef = useRef(null);
  const frameRef = useRef(0);
  const simShooterRef = useRef(null);   // 'me' | 'remote'
  const replayDoneRef = useRef(false);
  const pendingStateRef = useRef(null);
  const turnRef = useRef("p1");
  const scoreRef = useRef({ s1: 0, s2: 0 });
  const savedRef = useRef(false);
  const rafRef = useRef(null);
  const phaseRef = useRef("menu");
  const startedRef = useRef(false);
  const myRoleRef = useRef(null);
  const roomRef = useRef(null);
  const myCountryRef = useRef(null);
  const rotatedRef = useRef(false);
  const iRematchRef = useRef(false);
  const theyRematchRef = useRef(false);
  const [iWantRematch, setIWantRematch] = useState(false);
  const [theyWantRematch, setTheyWantRematch] = useState(false);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (roomChanRef.current) supabase.removeChannel(roomChanRef.current);
    if (gameChanRef.current) supabase.removeChannel(gameChanRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { myRoleRef.current = myRole; }, [myRole]);
  useEffect(() => { roomRef.current = room; }, [room]);
  useEffect(() => { myCountryRef.current = myCountry; }, [myCountry]);
  useEffect(() => {
    const upd = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    upd();
    window.addEventListener("resize", upd);
    window.addEventListener("orientationchange", upd);
    return () => { window.removeEventListener("resize", upd); window.removeEventListener("orientationchange", upd); };
  }, []);

  // ---------- estadísticas ----------
  const loadStats = async () => {
    setLoadingStats(true);
    const { data: scores } = await supabase.from("soccer_scores").select("*").order("created_at", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    const byUser = {};
    (scores || []).forEach(s => {
      if (!byUser[s.user_id]) byUser[s.user_id] = { wins: 0, games: 0 };
      byUser[s.user_id].games++;
      if (s.won) byUser[s.user_id].wins++;
    });
    const r = Object.entries(byUser).map(([uid, v]) => ({
      name: profiles?.find(p => p.id === uid)?.name || "Usuario",
      emoji: profiles?.find(p => p.id === uid)?.emoji || "⚽",
      wins: v.wins, games: v.games,
    })).sort((a, b) => b.wins - a.wins || b.games - a.games);
    setRanking(r);
    setHistory((scores || []).filter(s => s.user_id === user.id).slice(0, 12));
    setLoadingStats(false);
  };
  useEffect(() => { if (phase === "menu") loadStats(); /* eslint-disable-next-line */ }, [phase]);

  // ---------- lobby ----------
  const checkRoom = async (id) => {
    const { data } = await supabase.from("soccer_rooms").select("*").eq("id", id).single();
    if (!data) return;
    setRoom(data);
    if (data.status === "playing" && !startedRef.current) startPlaying(data);
  };
  const subscribeRoom = (id) => {
    if (roomChanRef.current) supabase.removeChannel(roomChanRef.current);
    roomChanRef.current = supabase.channel(`soccer_room_${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "soccer_rooms", filter: `id=eq.${id}` },
        () => checkRoom(id))
      .subscribe();
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => checkRoom(id), 2500);
  };

  const createRoom = async () => {
    setError("");
    if (!myCountry) { setError("Elige tu país primero"); return; }
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const { data, error: err } = await supabase.from("soccer_rooms").insert({
      code, player1_id: user.id, player1_name: user.name,
      player1_country: myCountry.name, player1_flag: myCountry.flag,
      status: "waiting", current_turn: "p1", score1: 0, score2: 0,
    }).select().single();
    if (err) { setError("Error al crear: " + err.message); return; }
    setRoomCode(code); setMyRole("p1"); setRoom(data);
    roomIdRef.current = data.id; subscribeRoom(data.id); setPhase("waiting");
  };
  const joinRoom = async () => {
    setError("");
    if (!myCountry) { setError("Elige tu país primero"); return; }
    if (!inputCode.trim()) return;
    const { data, error: err } = await supabase.from("soccer_rooms")
      .select("*").eq("code", inputCode.trim().toUpperCase()).eq("status", "waiting").single();
    if (err || !data) { setError("Sala no encontrada o ya en curso"); return; }
    if (data.player1_id === user.id) { setError("No puedes unirte a tu propia sala"); return; }
    const { data: up, error: e2 } = await supabase.from("soccer_rooms")
      .update({ player2_id: user.id, player2_name: user.name, player2_country: myCountry.name, player2_flag: myCountry.flag, status: "playing" })
      .eq("id", data.id).select().single();
    if (e2) { setError("Error al unirse"); return; }
    setMyRole("p2"); roomIdRef.current = up.id; subscribeRoom(up.id); startPlaying(up);
  };

  const startPlaying = (data) => {
    if (startedRef.current) return;          // ⬅️ evita reinicios repetidos
    startedRef.current = true;
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } // ⬅️ ya no hace falta sondear
    setRoom(data);
    bodiesRef.current = chFormation();
    setScore1(0); setScore2(0); scoreRef.current = { s1: 0, s2: 0 };
    setTurn("p1"); turnRef.current = "p1";
    savedRef.current = false; goalRef.current = null; animatingRef.current = false;
    setPhase("playing");
  };

  // ---------- canal de juego (broadcast) ----------
  useEffect(() => {
    if (!room?.id || gameChanRef.current) return;
    const ch = supabase.channel(`soccer_game_${room.id}`, { config: { broadcast: { self: false } } });
    ch.on("broadcast", { event: "shot" }, ({ payload }) => onRemoteShot(payload));
    ch.on("broadcast", { event: "state" }, ({ payload }) => onRemoteState(payload));
    ch.on("broadcast", { event: "rematch" }, () => onRemoteRematch());
    ch.on("broadcast", { event: "leave" }, () => onRemoteLeave());
    ch.subscribe();
    gameChanRef.current = ch;
    // No se cierra aquí: persiste para la revancha. Se cierra en resetToMenu/unmount.
    // eslint-disable-next-line
  }, [room?.id]);

  const send = (event, payload) => gameChanRef.current?.send({ type: "broadcast", event, payload });

  const onRemoteShot = ({ disc, vx, vy }) => {
    goalRef.current = null; frameRef.current = 0;
    simShooterRef.current = "remote"; replayDoneRef.current = false; pendingStateRef.current = null;
    const b = bodiesRef.current;
    b[disc].vx = vx; b[disc].vy = vy;
    animatingRef.current = true;
  };
  const onRemoteState = (s) => {
    if (animatingRef.current && simShooterRef.current === "remote" && !replayDoneRef.current) {
      pendingStateRef.current = s;
    } else {
      applyState(s);
    }
  };
  const applyState = (s) => {
    const b = bodiesRef.current;
    s.bodies.forEach((p, i) => { b[i].x = p.x; b[i].y = p.y; b[i].vx = 0; b[i].vy = 0; });
    setScore1(s.s1); setScore2(s.s2); scoreRef.current = { s1: s.s1, s2: s.s2 };
    setTurn(s.turn); turnRef.current = s.turn;
    if (s.scored) { setShowGoal(s.scored); setTimeout(() => setShowGoal(null), 1400); }
    if (s.over) finishMatch(s.s1, s.s2);
  };

  // ---------- bucle de animación ----------
  useEffect(() => {
    if (phase !== "playing") return;
    const ctx = canvasRef.current?.getContext("2d");
    const loop = () => {
      if (animatingRef.current && ctx) {
        for (let k = 0; k < CH_SUBSTEPS; k++) { const g = chStep(bodiesRef.current); if (g) { goalRef.current = g; break; } }
        frameRef.current++;
        if (goalRef.current || chSettled(bodiesRef.current) || frameRef.current > 3000) {
          animatingRef.current = false;
          onSimEnd();
        }
      }
      if (ctx) {
        const p1f = myRole === "p1" ? myCountry?.flag : (room?.player1_flag || "🏳️");
        const p2f = myRole === "p2" ? myCountry?.flag : (room?.player2_flag || "🏳️");
        chDraw(ctx, bodiesRef.current, aimRef.current, myRole, room?.player1_flag || p1f, room?.player2_flag || p2f);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line
  }, [phase, room, myRole]);

  const onSimEnd = () => {
    if (simShooterRef.current === "me") {
      const b = bodiesRef.current;
      const scored = goalRef.current;
      let { s1, s2 } = scoreRef.current;
      let newTurn, over = false, sentBodies;
      if (scored) {
        if (scored === "p1") s1++; else s2++;
        over = s1 >= CH_WIN_GOALS || s2 >= CH_WIN_GOALS;
        if (!over) {
          const f = chFormation(); bodiesRef.current = f;
          sentBodies = f.map(p => ({ x: p.x, y: p.y }));
          newTurn = scored === "p1" ? "p2" : "p1";
        } else {
          sentBodies = b.map(p => ({ x: p.x, y: p.y }));
          newTurn = turnRef.current;
        }
        setShowGoal(scored); setTimeout(() => setShowGoal(null), 1400);
      } else {
        sentBodies = b.map(p => ({ x: p.x, y: p.y }));
        newTurn = turnRef.current === "p1" ? "p2" : "p1";
      }
      scoreRef.current = { s1, s2 }; setScore1(s1); setScore2(s2);
      turnRef.current = newTurn; setTurn(newTurn);
      send("state", { bodies: sentBodies, s1, s2, turn: newTurn, scored, over });
      if (over) finishMatch(s1, s2);
    } else {
      replayDoneRef.current = true;
      if (pendingStateRef.current) { applyState(pendingStateRef.current); pendingStateRef.current = null; }
    }
  };

  // Reinicia el reloj cada vez que cambia el turno
  useEffect(() => { setTimeLeft(30); }, [turn, phase]);

  // Cuenta atrás de 30 s: solo corre en TU turno y cuando no hay animación
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      if (turnRef.current !== myRoleRef.current || animatingRef.current || savedRef.current) return;
      setTimeLeft(t => {
        if (t <= 1) { timeoutPass(); return 30; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [phase]);

  const finishMatch = async (s1, s2) => {
    if (savedRef.current) return;
    savedRef.current = true;
    const role = myRoleRef.current, rm = roomRef.current, mc = myCountryRef.current;
    const winner = s1 > s2 ? "p1" : "p2";
    const iWon = winner === role;
    const myScore = role === "p1" ? s1 : s2;
    const theirScore = role === "p1" ? s2 : s1;
    const theirName = role === "p1" ? rm?.player2_name : rm?.player1_name;
    setPhase("finished");
    await supabase.from("soccer_scores").insert({
      user_id: user.id, won: iWon, my_score: myScore, their_score: theirScore,
      country: mc?.name, flag: mc?.flag, opponent_name: theirName || "Rival",
    });
    await supabase.from("soccer_rooms").update({ status: "finished" }).eq("id", roomIdRef.current);
  };

  const startRematch = () => {
    iRematchRef.current = false; theyRematchRef.current = false;
    setIWantRematch(false); setTheyWantRematch(false); setOpponentLeft(false);
    bodiesRef.current = chFormation();
    setScore1(0); setScore2(0); scoreRef.current = { s1: 0, s2: 0 };
    setTurn("p1"); turnRef.current = "p1";
    savedRef.current = false; goalRef.current = null; animatingRef.current = false;
    setShowGoal(null);
    setPhase("playing");
  };
  const requestRematch = () => {
    if (iRematchRef.current || opponentLeft) return;
    iRematchRef.current = true; setIWantRematch(true);
    send("rematch", {});
    if (theyRematchRef.current) startRematch();
  };
  const onRemoteRematch = () => {
    theyRematchRef.current = true; setTheyWantRematch(true);
    if (iRematchRef.current) startRematch();
  };
  const onRemoteLeave = () => { setOpponentLeft(true); };
  const timeoutPass = () => {
    if (turnRef.current !== myRoleRef.current || animatingRef.current || savedRef.current) return;
    const newTurn = turnRef.current === "p1" ? "p2" : "p1";
    const sentBodies = bodiesRef.current.map(p => ({ x: p.x, y: p.y }));
    turnRef.current = newTurn; setTurn(newTurn);
    send("state", { bodies: sentBodies, s1: scoreRef.current.s1, s2: scoreRef.current.s2, turn: newTurn, scored: null, over: false });
  };
  const leaveGame = () => { send("leave", {}); resetToMenu(); };

  // ---------- input (apuntar y lanzar) ----------
  const toLogical = (e) => {
    const cv = canvasRef.current;
    const rect = cv.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    if (rotatedRef.current) {
      // El escenario está girado 90°. rect es el AABB del canvas girado.
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const sdx = clientX - cx, sdy = clientY - cy;
      const lx = sdy, ly = -sdx;                 // inversa de rotate(90deg)
      const cssW = rect.height, cssH = rect.width; // dimensiones sin girar
      return {
        x: (lx + cssW / 2) * (CH_W / cssW),
        y: (ly + cssH / 2) * (CH_H / cssH),
      };
    }
    return {
      x: (clientX - rect.left) * (CH_W / rect.width),
      y: (clientY - rect.top) * (CH_H / rect.height),
    };
  };
  const canShoot = () => phase === "playing" && turnRef.current === myRole && !animatingRef.current && !savedRef.current;
  const myRange = myRole === "p1" ? [0, 4] : [5, 9];

  const onDown = (e) => {
    if (!canShoot()) return;
    const p = toLogical(e);
    const b = bodiesRef.current;
    let best = -1, bestD = 1e9;
    for (let i = myRange[0]; i <= myRange[1]; i++) {
      const d = Math.hypot(b[i].x - p.x, b[i].y - p.y);
      if (d < CH_DR * 1.8 && d < bestD) { bestD = d; best = i; }
    }
    if (best >= 0) { aimRef.current = { disc: best, dx: 0, dy: 0, power: 0 }; e.preventDefault?.(); }
  };
  const onMove = (e) => {
    if (!aimRef.current) return;
    const p = toLogical(e);
    const d = bodiesRef.current[aimRef.current.disc];
    const pullx = d.x - p.x, pully = d.y - p.y;   // honda: tiras hacia atrás
    const mag = Math.hypot(pullx, pully);
    if (mag < 1) { aimRef.current.power = 0; return; }
    const power = Math.min(mag, CH_MAXPULL) / CH_MAXPULL;
    aimRef.current.dx = pullx / mag; aimRef.current.dy = pully / mag; aimRef.current.power = power;
    e.preventDefault?.();
  };
  const onUp = () => {
    const a = aimRef.current; aimRef.current = null;
    if (!a || a.disc == null) return;
    const d = bodiesRef.current[a.disc];
    const mag = a.power * CH_MAXPULL;
    if (mag < CH_MINPULL) return;
    const vx = a.dx * a.power * CH_MAXV, vy = a.dy * a.power * CH_MAXV;
    goalRef.current = null; frameRef.current = 0; simShooterRef.current = "me";
    d.vx = vx; d.vy = vy; animatingRef.current = true;
    send("shot", { disc: a.disc, vx, vy });
  };

  const resetToMenu = () => {
    if (gameChanRef.current) { supabase.removeChannel(gameChanRef.current); gameChanRef.current = null; }
    if (roomChanRef.current) { supabase.removeChannel(roomChanRef.current); roomChanRef.current = null; }
    if (pollRef.current) clearInterval(pollRef.current);
    setRoom(null); setMyRole(null); setRoomCode(""); setInputCode("");
    startedRef.current = false;
    bodiesRef.current = chFormation();
    iRematchRef.current = false; theyRematchRef.current = false;
    setIWantRematch(false); setTheyWantRematch(false); setOpponentLeft(false);
    setPhase("menu");
  };

  const medals = ["🥇", "🥈", "🥉"];

  // ============================== MENÚ ==============================
  if (phase === "menu") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>CHAPAS</p>
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "22px", textAlign: "center", marginBottom: "18px" }}>
        <div style={{ fontSize: "46px", marginBottom: "10px" }}>🔵⚽🟠</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>CHAPAS MUNDIAL</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>
          Fútbol de chapas 1v1 en tiempo real · por turnos<br/>Mete <span style={{ color: GREEN }}>3 goles</span> antes que tu rival 🔴
        </p>
        <p style={{ fontSize: "10px", color: "#ffd54f", fontFamily: "'Inter', sans-serif", marginTop: "8px" }}>JUEGO MULTIJUGADOR</p>
      </div>

      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px" }}>1️⃣ ELIGE TU PAÍS</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: "150px", overflowY: "auto", marginBottom: "16px", padding: "2px" }}>
        {COUNTRIES.map(c => (
          <button key={c.name} onClick={() => setMyCountry(c)} style={{
            display: "flex", alignItems: "center", gap: "5px", padding: "6px 9px",
            border: `1px solid ${myCountry?.name === c.name ? GREEN : BORDER}`, borderRadius: "8px",
            background: myCountry?.name === c.name ? GREEN_DIM : CARD,
            color: myCountry?.name === c.name ? GREEN : "#a8d4f0",
            cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "10px",
          }}>
            <span style={{ fontSize: "16px" }}>{c.flag}</span>{c.name}
          </button>
        ))}
      </div>

      {error && <p style={{ color: "#cc2222", fontFamily: "'Inter', sans-serif", fontSize: "12px", marginBottom: "10px", textAlign: "center" }}>⚠ {error}</p>}

      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px" }}>2️⃣ JUGAR</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <button onClick={createRoom} style={{ padding: "20px", border: `1px solid ${GREEN}`, borderRadius: "12px", background: GREEN_DIM, color: GREEN, fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>➕ CREAR SALA</button>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "'Inter', sans-serif", marginBottom: "8px", letterSpacing: "2px" }}>UNIRSE CON CÓDIGO</p>
          <input value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase())} placeholder="XXXXX" maxLength={5}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px", marginBottom: "8px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "rgba(0,0,0,0.3)", color: "#e0eaf8", fontSize: "18px", fontFamily: "'Bebas Neue', monospace", letterSpacing: "4px", textAlign: "center", outline: "none" }} />
          <button onClick={joinRoom} style={{ width: "100%", padding: "10px", border: "none", borderRadius: "7px", background: GREEN, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>UNIRSE</button>
        </div>
      </div>

      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>🏆 RANKING · VICTORIAS</p>
      {loadingStats ? <SkeletonRanking count={4} /> : ranking.length === 0
        ? <EmptyState emoji="⚽" title="AÚN NADIE HA JUGADO" text="Crea una sala y reta a alguien del grupo a las chapas." />
        : ranking.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
            <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
            <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.emoji} {r.name}</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8", lineHeight: 1 }}>{r.wins}</div>
              <div style={{ fontSize: "8px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{r.games} jug.</div>
            </div>
          </div>
        ))}

      {history.length > 0 && (
        <>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", margin: "18px 0 12px" }}>📋 TUS RESULTADOS</p>
          {history.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", marginBottom: "5px", borderRadius: "9px", background: CARD, border: `1px solid ${h.won ? "rgba(0,200,100,0.25)" : "rgba(255,107,74,0.25)"}`, borderLeft: `3px solid ${h.won ? "#34d399" : "#ff6b4a"}` }}>
              <span style={{ fontSize: "18px" }}>{h.flag || "⚽"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: h.won ? "#34d399" : "#ff6b4a", fontWeight: 700 }}>{h.won ? "VICTORIA" : "DERROTA"} · {h.my_score}-{h.their_score}</div>
                <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>vs {h.opponent_name}</div>
              </div>
              <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif" }}>{new Date(h.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );

  // ============================== ESPERANDO ==============================
  if (phase === "waiting") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: "52px", marginBottom: "16px" }}>⏳</div>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#e0eaf8", marginBottom: "6px" }}>ESPERANDO RIVAL</div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#e0eefa", marginBottom: "8px" }}>Tu equipo: {myCountry?.flag} {myCountry?.name}</p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#e0eefa", marginBottom: "20px" }}>Comparte este código:</p>
      <div style={{ display: "inline-block", background: GREEN_DIM, border: `2px solid ${GREEN}`, borderRadius: "12px", padding: "16px 32px", marginBottom: "24px" }}>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "42px", color: GREEN, letterSpacing: "8px" }}>{roomCode}</span>
      </div>
      <button
        onClick={() => {
          const texto = `⚽ ¡Te reto a las CHAPAS en la Porra Vallau!\n\nEntra en Juegos → Chapas → "Unirse con código" y mete este código:\n\n👉 ${roomCode}`;
          const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
          window.open(url, "_blank");
        }}
        style={{
          display: "block", margin: "0 auto 14px", padding: "12px 22px",
          border: "none", borderRadius: "10px", background: "#25D366", color: "#0a1628",
          fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800,
          cursor: "pointer", letterSpacing: "1px",
        }}>
        📲 COMPARTIR POR WHATSAPP
      </button>
      <button onClick={resetToMenu} style={{ display: "block", margin: "0 auto", padding: "8px 16px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>Cancelar</button>
    </div>
  );

  const vw = dims.w || 360, vh = dims.h || 640;
  const isPortrait = vh >= vw;
  rotatedRef.current = isPortrait;
  const stageW = isPortrait ? vh : vw;
  const stageH = isPortrait ? vw : vh;
  const stageWrap = (content) => (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: DARK, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: `${stageW}px`, height: `${stageH}px`,
        transform: `translate(-50%,-50%) rotate(${isPortrait ? 90 : 0}deg)`,
        transformOrigin: "center center",
        display: "flex", flexDirection: "column",
        padding: "8px 12px", boxSizing: "border-box",
      }}>{content}</div>
    </div>
  );

  // ============================== JUGANDO ==============================
  if (phase === "playing") {
    const amIShooter = turn === myRole && !animatingRef.current;
    const myFlag = myCountry?.flag;
    const theirFlag = myRole === "p1" ? room?.player2_flag : room?.player1_flag;
    const myScore = myRole === "p1" ? score1 : score2;
    const theirScore = myRole === "p1" ? score2 : score1;
    const boardW = stageW - 24, boardH = stageH - 72;
    const cW = Math.min(boardW, boardH * (CH_W / CH_H)), cH = cW * (CH_H / CH_W);
    return stageWrap(
      <>
        {/* MARCADOR ARRIBA */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <button onClick={leaveGame} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#c0d8f0", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px", flexShrink: 0 }}>Salir</button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: GREEN_DIM, border: `1px solid rgba(79,195,247,0.3)`, borderRadius: "8px", padding: "4px 12px" }}>
              <span style={{ fontSize: "20px" }}>{myFlag}</span>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: GREEN, lineHeight: 1 }}>{myScore}</span>
            </div>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: amIShooter ? (timeLeft <= 10 ? "#ff6b4a" : GREEN) : "#7ab8e0", minWidth: "96px", textAlign: "center", lineHeight: 1.1 }}>
              {amIShooter
                ? <>TU TURNO<br/><span style={{ fontSize: "22px", color: timeLeft <= 10 ? "#ff6b4a" : GREEN }}>⏱ {timeLeft}s</span></>
                : "TURNO RIVAL"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "4px 12px" }}>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eaf8", lineHeight: 1 }}>{theirScore}</span>
              <span style={{ fontSize: "20px" }}>{theirFlag}</span>
            </div>
          </div>
        </div>
        {/* TABLERO */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
          <div style={{ position: "relative" }}>
            <canvas ref={canvasRef} width={CH_W} height={CH_H}
              onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
              onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
              style={{ display: "block", width: `${cW}px`, height: `${cH}px`, borderRadius: "12px", border: `1px solid ${BORDER}`, touchAction: "none", cursor: amIShooter ? "pointer" : "default" }} />
            {showGoal && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)", borderRadius: "12px" }}>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "46px", letterSpacing: "4px", color: showGoal === myRole ? GREEN : "#ff8a5b", textShadow: "0 0 18px rgba(0,0,0,0.6)" }}>
                  {showGoal === myRole ? "¡GOOOL!" : "GOL RIVAL"}
                </span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ============================== FIN ==============================
  if (phase === "finished") {
    const myScore = myRole === "p1" ? score1 : score2;
    const theirScore = myRole === "p1" ? score2 : score1;
    const iWon = myScore > theirScore;
    const theirName = myRole === "p1" ? room?.player2_name : room?.player1_name;
    return stageWrap(
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", textAlign: "center" }}>
        <div style={{ fontSize: "44px" }}>{iWon ? "🏆" : "😔"}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: iWon ? GREEN : "#cc2222", letterSpacing: "3px" }}>{iWon ? "¡GANASTE!" : "PERDISTE"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "44px", color: GREEN, lineHeight: 1 }}>{myScore}</div><div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{myCountry?.flag} TÚ</div></div>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#7ab8e0" }}>-</span>
          <div><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "44px", color: "#e0eaf8", lineHeight: 1 }}>{theirScore}</div><div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>{theirName?.split(" ")[0] || "Rival"}</div></div>
        </div>

        {opponentLeft ? (
          <>
            <p style={{ fontSize: "12px", color: "#ff8a5b", fontFamily: "'Inter', sans-serif" }}>El rival ha salido de la partida</p>
            <button onClick={resetToMenu} style={{ padding: "12px 32px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "2px" }}>SALIR</button>
          </>
        ) : (
          <>
            {theyWantRematch && !iWantRematch && (
              <p style={{ fontSize: "11px", color: "#ffd54f", fontFamily: "'Inter', sans-serif" }}>🔁 El rival quiere la revancha</p>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={requestRematch} disabled={iWantRematch} style={{ padding: "12px 26px", border: "none", borderRadius: "10px", background: iWantRematch ? "rgba(79,195,247,0.15)" : `linear-gradient(135deg,${GREEN},#0077cc)`, color: iWantRematch ? GREEN : "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: iWantRematch ? "default" : "pointer", letterSpacing: "2px" }}>
                {iWantRematch ? "ESPERANDO RIVAL..." : "🔄 REVANCHA"}
              </button>
              <button onClick={leaveGame} style={{ padding: "12px 26px", border: `1px solid ${BORDER}`, borderRadius: "10px", background: "transparent", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, cursor: "pointer", letterSpacing: "2px" }}>SALIR</button>
            </div>
          </>
        )}
      </div>
    );
  }
return null;
}   // ⬅️ AQUÍ se cierra ChapasGame

// 🔒 BETA CHAPAS — el juego solo lo ven estos usuarios.
// Puedes poner el NOMBRE (tal cual aparece en la app) o el EMAIL. Da igual mayúsculas.
// Los admin lo ven siempre.
const CHAPAS_BETA = [
  "URIEN",            // ← por nombre
  "tu-email@mail.com", // ← o por email
  // "Otro amigo",
];

function chapasEnabled(user) { return true; }

// ============================================================
// ELIMINATORIAS — cuadro con resultado exacto (de momento solo admin)
// ============================================================
function KnockoutView({ user, matches, resultsMode = false }) {
  const KO_TABLE = resultsMode ? "knockout_results" : "knockout_picks";
  const [picks, setPicks] = useState({});        // { M73: { h, a, adv } }
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);  // matchId en edición
  const [hIn, setHIn] = useState("");
  const [aIn, setAIn] = useState("");
  const [advSel, setAdvSel] = useState(null);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [locks, setLocks] = useState({});

  // Clasificación REAL por grupo
  const standingsByGroup = {};
  Object.keys(GROUPS).forEach(g => { standingsByGroup[g] = calcRealStandings(g, matches); });

  // ⚙️ TEST: muestra el cuadro con la posición ACTUAL. Pon true para esperar
  // a que terminen los 72 partidos de grupos (comportamiento real).
  const WAIT_FOR_GROUPS_DONE = false;
  const groupMatches = matches.filter(m => m.grp);
  const groupsDone = groupMatches.length > 0 && groupMatches.every(m => m.result_home !== null && m.result_away !== null);
  const anyPlayed = matches.some(m => m.grp && m.result_home !== null);
  const groupsComplete = WAIT_FOR_GROUPS_DONE ? groupsDone : anyPlayed;

  useEffect(() => {
    (async () => {
      let q = supabase.from(KO_TABLE).select("*");
      if (!resultsMode) q = q.eq("user_id", user.id);
      const { data } = await q;
      const map = {};
      (data || []).forEach(r => {
        map[r.match_id] = { h: r.home_goals ?? null, a: r.away_goals ?? null, adv: r.winner ?? null };
      });
      setPicks(map);
      setLoading(false);
    })();
  }, [user.id]);

  // Candados por cruce (los abre/cierra el admin). En modo resultados no aplican.
  useEffect(() => {
    const loadLocks = async () => {
      const { data } = await supabase.from("knockout_locks").select("*");
      const m = {};
      (data || []).forEach(r => { m[r.id] = r.locked; });
      setLocks(m);
    };
    loadLocks();
    const ch = supabase
      .channel("ko_locks_" + (resultsMode ? "res" : "picks"))
      .on("postgres_changes", { event: "*", schema: "public", table: "knockout_locks" }, loadLocks)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [resultsMode]);

  // Mapa de descendientes (para limpiar lo que deja de ser válido al cambiar un ganador)
  const childMap = {};
  const addChild = (s, c) => { (childMap[s] = childMap[s] || []).push(c); };
  ["R16","QF","SF","FINAL","THIRD"].forEach(rk => KO_TREE[rk].forEach(d => d.from.forEach(s => addChild(s, d.match))));
  const collectDesc = (id, acc = new Set()) => {
    (childMap[id] || []).forEach(c => { if (!acc.has(c)) { acc.add(c); collectDesc(c, acc); } });
    return acc;
  };

  if (loading) return <div style={{ animation: "fadeIn 0.3s ease" }}><SkeletonRows count={4} height={70} /></div>;

  if (!groupsComplete) {
    return (
      <div style={{ animation: "fadeIn 0.3s ease" }}>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "16px" }}>FASE ELIMINATORIA</p>
        <EmptyState emoji="🔒" title="AÚN SIN RESULTADOS"
          text="El cuadro de eliminatorias aparecerá en cuanto haya resultados reales de la fase de grupos." />
      </div>
    );
  }

  const bracket = buildKnockoutBracket(standingsByGroup, picks);

  const openEdit = (m) => {
    if (m.home.placeholder || m.away.placeholder) return;
    if (!resultsMode && locks[m.match]) return; // cruce cerrado por el admin
    setEditing(m.match);
    setHIn(m.h != null ? String(m.h) : "");
    setAIn(m.a != null ? String(m.a) : "");
    setAdvSel(m.adv || (m.winner ? m.winner.name : null));
    setErr("");
  };

  const saveMatch = async () => {
    const m = bracket.byId[editing];
    const hh = hIn === "" ? null : parseInt(hIn);
    const aa = aIn === "" ? null : parseInt(aIn);
    if (hh == null || aa == null) { setErr("Mete el marcador completo"); return; }
    let adv = null;
    if (hh > aa) adv = m.home.name;
    else if (aa > hh) adv = m.away.name;
    else { if (!advSel) { setErr("Empate: elige quién pasa"); return; } adv = advSel; }

    const prevAdv = m.winner?.name || null;
    const next = { ...picks, [editing]: { h: hh, a: aa, adv: hh === aa ? adv : null } };
    let toDelete = [];
    if (adv !== prevAdv) { toDelete = [...collectDesc(editing)]; toDelete.forEach(id => delete next[id]); }

    setPicks(next); setSaving(true);
    const row = resultsMode
      ? { match_id: editing, home_goals: hh, away_goals: aa, winner: adv, manual_override: true, result_source: "manual", updated_at: new Date().toISOString() }
      : { user_id: user.id, match_id: editing, home_goals: hh, away_goals: aa, winner: adv, updated_at: new Date().toISOString() };
    await supabase.from(KO_TABLE).upsert(row, { onConflict: resultsMode ? "match_id" : "user_id,match_id" });
    if (toDelete.length) {
      let dq = supabase.from(KO_TABLE).delete().in("match_id", toDelete);
      if (!resultsMode) dq = dq.eq("user_id", user.id);
      await dq;
    }
    setSaving(false); setEditing(null);
  };

  const clearMatch = async () => {
    const next = { ...picks };
    const toDelete = [editing, ...collectDesc(editing)];
    toDelete.forEach(id => delete next[id]);
    setPicks(next); setSaving(true);
    let dq = supabase.from(KO_TABLE).delete().in("match_id", toDelete);
    if (!resultsMode) dq = dq.eq("user_id", user.id);
    await dq;
    setSaving(false); setEditing(null);
  };

  // ---- Tarjeta de un cruce ----
  const Cell = ({ m, accent = GREEN, gold }) => {
    const isLocked = !resultsMode && locks[m.match];
    const tappable = !m.home.placeholder && !m.away.placeholder && !isLocked;
    const draw = m.h != null && m.a != null && m.h === m.a;
    const teamRow = (team, score, top) => {
      const isAdv = m.winner && team.name === m.winner.name;
      return (
        <div style={{
          display: "flex", alignItems: "center", gap: "5px", padding: "5px 6px",
          background: isAdv ? GREEN_DIM : "transparent",
          borderLeft: `3px solid ${isAdv ? accent : "transparent"}`,
          opacity: team.placeholder ? 0.5 : 1,
        }}>
          <span style={{ fontSize: "14px" }}>{team.flag}</span>
          <span style={{ flex: 1, fontSize: "10px", fontFamily: "'Inter', sans-serif", fontWeight: isAdv ? 700 : 500,
            color: isAdv ? accent : team.placeholder ? "#7ab8e0" : "#e0eaf8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {team.placeholder ? team.name : koAbbr(team.name)}
          </span>
          {score != null && (
            <span style={{ fontFamily: "'Bebas Neue', monospace", fontSize: "14px", color: isAdv ? accent : "#c0d8f0", minWidth: "12px", textAlign: "center" }}>{score}</span>
          )}
          {isAdv && draw && <span style={{ fontSize: "8px", color: accent }}>p</span>}
        </div>
      );
    };
    return (
      <div onClick={() => tappable && openEdit(m)} style={{
        background: gold ? "rgba(255,213,79,0.06)" : CARD,
        border: `1px solid ${gold ? "rgba(255,213,79,0.4)" : BORDER}`,
        borderRadius: "8px", overflow: "hidden",
        cursor: tappable ? "pointer" : "default",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "7px", color: gold ? "#ffd54f" : "#7ab8e0", fontFamily: "'Bebas Neue', monospace", letterSpacing: "1px", padding: "2px 6px", borderBottom: `1px solid ${BORDER}` }}>
          <span>{gold === "final" ? "🏆 FINAL" : gold === "third" ? "🥉 3º PUESTO" : m.match}</span>
          {isLocked && <span style={{ fontSize: "9px" }}>🔒</span>}
        </div>
        {teamRow(m.home, m.h, true)}
        <div style={{ height: "1px", background: BORDER }} />
        {teamRow(m.away, m.a, false)}
      </div>
    );
  };

  const COL_W = 108, R32_W = 124, CENTER_W = 142, H = 620;
  const Column = ({ ids, w, accent }) => (
    <div style={{ width: w, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "0 3px" }}>
      {ids.map(id => <Cell key={id} m={bracket.byId[id]} accent={accent} />)}
    </div>
  );
  const HeadCell = ({ label, w }) => (
    <div style={{ width: w, flexShrink: 0, textAlign: "center", fontSize: "9px", color: GREEN, fontFamily: "'Bebas Neue', cursive", letterSpacing: "2px", padding: "6px 0" }}>{label}</div>
  );

  const editM = editing ? bracket.byId[editing] : null;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <p style={{ fontSize: "9px", color: resultsMode ? "#ffd54f" : "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>{resultsMode ? "⚙️ RESULTADOS REALES · ELIMINATORIA" : "CUADRO ELIMINATORIO"}</p>
        {saving && <span style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif" }}>guardando…</span>}
      </div>
      <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, marginBottom: "14px" }}>
        Toca un cruce e introduce el resultado exacto. Si empatan, elige quién pasa (penaltis). El ganador avanza solo. Desliza → para ver todo el cuadro.
      </p>

      {/* Campeón */}
      {bracket.champion && (() => {
        const t = getTeam(bracket.champion);
        return (
          <div style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(255,213,79,0.18), rgba(10,22,40,0) 70%), rgba(255,255,255,0.03)", border: "1px solid rgba(255,213,79,0.4)", borderRadius: "14px", padding: "14px", marginBottom: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "9px", color: "#ffd54f", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "4px" }}>🏆 TU CAMPEÓN</div>
            <div style={{ fontSize: "40px", lineHeight: 1 }}>{t.flag}</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: "#ffd54f", letterSpacing: "2px" }}>{bracket.champion}</div>
          </div>
        );
      })()}

      {/* Cuadro con scroll horizontal */}
      <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
        <div style={{ minWidth: `${R32_W*2 + COL_W*6 + CENTER_W}px` }}>
          {/* cabeceras */}
          <div style={{ display: "flex" }}>
            <HeadCell label="16avos" w={R32_W} /><HeadCell label="8avos" w={COL_W} />
            <HeadCell label="4tos" w={COL_W} /><HeadCell label="Semis" w={COL_W} />
            <HeadCell label="FINAL" w={CENTER_W} />
            <HeadCell label="Semis" w={COL_W} /><HeadCell label="4tos" w={COL_W} />
            <HeadCell label="8avos" w={COL_W} /><HeadCell label="16avos" w={R32_W} />
          </div>
          {/* columnas */}
          <div style={{ display: "flex", height: `${H}px` }}>
            <Column ids={KO_SIDES.left.R32} w={R32_W} accent={GREEN} />
            <Column ids={KO_SIDES.left.R16} w={COL_W} accent="#4fc3f7" />
            <Column ids={KO_SIDES.left.QF}  w={COL_W} accent="#34d399" />
            <Column ids={KO_SIDES.left.SF}  w={COL_W} accent="#ffd54f" />
            {/* centro: leyenda + final + 3er puesto */}
            <div style={{ width: CENTER_W, flexShrink: 0, display: "flex", flexDirection: "column", padding: "0 3px" }}>
              {/* Leyenda de puntos (hueco encima de la final) */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "10px 9px" }}>
                <div style={{ fontSize: "8px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px", textAlign: "center" }}>CÓMO SE PUNTÚA</div>
                {[
                  { ic: "🎯", t: "+5 resultado exacto", c: GREEN },
                  { ic: "📏", t: "+3 dif. de goles", c: "#4fc3f7" },
                  { ic: "✓", t: "+1 aciertas ganador", c: "#ffd54f" },
                  { ic: "✅", t: "+5 quién se clasifica", c: "#34d399" },
                  { ic: "🏆", t: "+10 campeón", c: "#ffd54f" },
                ].map(r => (
                  <div key={r.t} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", width: "15px", textAlign: "center" }}>{r.ic}</span>
                    <span style={{ fontSize: "8px", color: r.c, fontFamily: "'Inter', sans-serif", lineHeight: 1.2 }}>{r.t}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              <Cell m={bracket.FINAL[0]} accent="#ffd54f" gold="final" />
              <div style={{ height: "14px" }} />
              <Cell m={bracket.THIRD[0]} accent="#ff8a00" gold="third" />
              <div style={{ flex: 1 }} />
            </div>
            <Column ids={KO_SIDES.right.SF}  w={COL_W} accent="#ffd54f" />
            <Column ids={KO_SIDES.right.QF}  w={COL_W} accent="#34d399" />
            <Column ids={KO_SIDES.right.R16} w={COL_W} accent="#4fc3f7" />
            <Column ids={KO_SIDES.right.R32} w={R32_W} accent={GREEN} />
          </div>
        </div>
      </div>

      {/* Modal de edición del cruce */}
      {editM && (
        <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(5,12,24,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "fadeIn 0.2s ease" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "340px", background: "linear-gradient(160deg,#102339,#0a1628)", border: `2px solid ${GREEN}`, borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontSize: "9px", color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "16px", textAlign: "center" }}>{editM.match} · RESULTADO</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "30px" }}>{editM.home.flag}</div>
                <div style={{ fontSize: "11px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif" }}>{editM.home.name}</div>
              </div>
              <input value={hIn} onChange={e => setHIn(e.target.value)} type="number" min="0" max="20"
                style={{ width: "48px", height: "54px", border: `1px solid rgba(79,195,247,0.35)`, borderRadius: "10px", background: "rgba(0,0,0,0.3)", color: GREEN, fontSize: "28px", fontFamily: "'Bebas Neue', cursive", textAlign: "center", outline: "none" }} placeholder="–" />
              <span style={{ color: "#7ab8e0", fontSize: "20px" }}>:</span>
              <input value={aIn} onChange={e => setAIn(e.target.value)} type="number" min="0" max="20"
                style={{ width: "48px", height: "54px", border: `1px solid rgba(79,195,247,0.35)`, borderRadius: "10px", background: "rgba(0,0,0,0.3)", color: GREEN, fontSize: "28px", fontFamily: "'Bebas Neue', cursive", textAlign: "center", outline: "none" }} placeholder="–" />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "30px" }}>{editM.away.flag}</div>
                <div style={{ fontSize: "11px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif" }}>{editM.away.name}</div>
              </div>
            </div>

            {/* Selector de quién pasa (solo si empate) */}
            {hIn !== "" && aIn !== "" && parseInt(hIn) === parseInt(aIn) && (
              <div style={{ marginBottom: "14px" }}>
                <p style={{ fontSize: "9px", color: "#ffd54f", fontFamily: "'Inter', sans-serif", letterSpacing: "2px", marginBottom: "8px", textAlign: "center" }}>⚽ EMPATE · ¿QUIÉN PASA EN PENALTIS?</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[editM.home, editM.away].map(t => (
                    <button key={t.name} onClick={() => setAdvSel(t.name)} style={{
                      flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer",
                      border: `1px solid ${advSel === t.name ? GREEN : BORDER}`,
                      background: advSel === t.name ? GREEN_DIM : CARD,
                      color: advSel === t.name ? GREEN : "#a8d4f0",
                      fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700,
                    }}>{t.flag} {koAbbr(t.name)}</button>
                  ))}
                </div>
              </div>
            )}

            {err && <p style={{ color: "#ff6b4a", fontSize: "11px", fontFamily: "'Inter', sans-serif", textAlign: "center", marginBottom: "10px" }}>⚠ {err}</p>}

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={clearMatch} style={{ padding: "11px 14px", border: "1px solid rgba(204,34,34,0.3)", borderRadius: "8px", background: "rgba(204,34,34,0.06)", color: "#cc2222", fontFamily: "'Inter', sans-serif", fontSize: "11px", cursor: "pointer" }}>Borrar</button>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: "11px", border: `1px solid ${BORDER}`, borderRadius: "8px", background: "transparent", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", fontSize: "12px", cursor: "pointer" }}>Cancelar</button>
              <button onClick={saveMatch} style={{ flex: 2, padding: "11px", border: "none", borderRadius: "8px", background: GREEN, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, letterSpacing: "1px", cursor: "pointer" }}>GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TIROS LIBRES — swipe con efecto (rosca), barrera, portero y dianas
// ============================================================
function FreeKickGame({ user, onBack }) {
  const FK_W = 360, FK_H = 460;
  const GOAL = { x: 60, w: 240, cross: 68, ground: 148 }; // portería en perspectiva
  const BALL_START = { x: 180, y: 400 };

  const [phase, setPhase] = useState("menu"); // menu | playing | result
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [msg, setMsg] = useState(null);       // { text, color }
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef(null);   // estado del disparo en curso
  const swipeRef = useRef(null);   // puntos del gesto
  const roundRef = useRef(null);   // barrera/portero/viento de la ronda
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const livesRef = useRef(3);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ---------- ranking ----------
  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("freekick_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id].score) byUser[s.user_id] = s; });
      const r = Object.entries(byUser).map(([uid, s]) => ({
        name: profiles.find(p => p.id === uid)?.name || "Usuario",
        emoji: profiles.find(p => p.id === uid)?.emoji || "⚽",
        score: s.score, level: s.level,
      })).sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };
  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);

  // ---------- preparar ronda (barrera, portero, viento según nivel) ----------
  const newRound = (lvl) => {
    const wallPlayers = Math.min(3 + Math.floor(lvl / 2), 6);
    const wallSpan = wallPlayers * 26;
    const wallCenter = 180 + (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 45);
    const wind = lvl >= 3 ? (Math.random() - 0.5) * Math.min(lvl * 9, 55) : 0;
    roundRef.current = {
      wall: { cx: wallCenter, span: wallSpan, players: wallPlayers, y: 252, jumpH: 46 + lvl * 2 },
      keeper: { x: 180, reach: Math.min(30 + lvl * 3.5, 62), reads: Math.min(0.25 + lvl * 0.06, 0.7) },
      wind,
      targets: [
        { x: GOAL.x + 20, y: GOAL.cross + 16 },
        { x: GOAL.x + GOAL.w - 20, y: GOAL.cross + 16 },
      ],
    };
    stateRef.current = { mode: "aim" };
  };

  const startGame = () => {
    setScore(0); setLevel(1); setLives(3); setMsg(null); setShowHelp(true);
    scoreRef.current = 0; levelRef.current = 1; livesRef.current = 3;
    newRound(1);
    setPhase("playing");
  };

  // ---------- dibujo ----------
  const draw = (ctx) => {
    const R = roundRef.current, S = stateRef.current;
    if (!R || !S) return;
    ctx.clearRect(0, 0, FK_W, FK_H);

    // Césped con franjas en perspectiva
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#0f2e1a" : "#0d2817";
      ctx.fillRect(0, 140 + i * 42, FK_W, 42);
    }
    // Cielo de estadio
    const sky = ctx.createLinearGradient(0, 0, 0, 145);
    sky.addColorStop(0, "#0a1628"); sky.addColorStop(1, "#12253d");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, FK_W, 145);
    // Gradas (puntitos)
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    for (let i = 0; i < 60; i++) ctx.fillRect((i * 37) % FK_W, 8 + (i * 13) % 48, 2, 2);

    // Área
    ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(GOAL.x - 35, GOAL.ground); ctx.lineTo(GOAL.x - 55, 230);
    ctx.lineTo(GOAL.x + GOAL.w + 55, 230); ctx.lineTo(GOAL.x + GOAL.w + 35, GOAL.ground);
    ctx.stroke();

    // Red
    ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.lineWidth = 0.6;
    for (let nx = GOAL.x + 8; nx < GOAL.x + GOAL.w; nx += 14) {
      ctx.beginPath(); ctx.moveTo(nx, GOAL.cross + 3); ctx.lineTo(nx + 4, GOAL.ground - 2); ctx.stroke();
    }
    for (let ny = GOAL.cross + 8; ny < GOAL.ground; ny += 12) {
      ctx.beginPath(); ctx.moveTo(GOAL.x + 4, ny); ctx.lineTo(GOAL.x + GOAL.w - 4, ny); ctx.stroke();
    }
    // Palos
    ctx.fillStyle = "#f0f0e8";
    ctx.fillRect(GOAL.x - 4, GOAL.cross, 5, GOAL.ground - GOAL.cross);
    ctx.fillRect(GOAL.x + GOAL.w - 1, GOAL.cross, 5, GOAL.ground - GOAL.cross);
    ctx.fillRect(GOAL.x - 4, GOAL.cross - 4, GOAL.w + 9, 5);

    // Dianas en las escuadras
    R.targets.forEach(t => {
      ctx.beginPath(); ctx.arc(t.x, t.y, 13, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffd54f"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,213,79,0.5)"; ctx.fill();
    });

    // Portero
    const K = R.keeper;
    let kx = K.x, klean = 0;
    if (S.mode === "flying" && S.dive != null) {
      const kt = Math.min(1, S.t * 1.5);
      kx = K.x + (S.dive - K.x) * kt;
      klean = Math.sign(S.dive - K.x) * kt * 0.9;
    }
    ctx.save(); ctx.translate(kx, GOAL.ground - 4); ctx.rotate(klean);
    ctx.strokeStyle = "#ff8a00"; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -22); ctx.stroke();            // cuerpo
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-11, -30); ctx.moveTo(0, -20); ctx.lineTo(11, -30); ctx.stroke(); // brazos
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, 9); ctx.moveTo(0, 0); ctx.lineTo(7, 9); ctx.stroke();          // piernas
    ctx.beginPath(); ctx.arc(0, -30, 6, 0, Math.PI * 2); ctx.fillStyle = "#f5d5b0"; ctx.fill(); // cabeza
    ctx.restore();

    // Barrera (salta al disparar)
    const Wl = R.wall;
    const jump = S.mode === "flying" ? Math.sin(Math.min(1, S.t * 2.4) * Math.PI) * 16 : 0;
    for (let i = 0; i < Wl.players; i++) {
      const px = Wl.cx - Wl.span / 2 + 13 + i * 26;
      const py = Wl.y - jump;
      ctx.save(); ctx.translate(px, py);
      ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 7; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -30); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -38, 7, 0, Math.PI * 2); ctx.fillStyle = "#f5c89a"; ctx.fill();
      // manos protegiendo 😄
      ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-4, -14); ctx.lineTo(-4, -24); ctx.moveTo(4, -14); ctx.lineTo(4, -24); ctx.stroke();
      ctx.restore();
    }

    // Viento
    if (R.wind !== 0) {
      const dir = R.wind > 0 ? "→" : "←";
      const mag = Math.abs(R.wind);
      ctx.font = "bold 13px monospace"; ctx.textAlign = "center";
      ctx.fillStyle = mag > 30 ? "#ff6b4a" : "#ffd54f";
      ctx.fillText(`💨 ${dir.repeat(mag > 30 ? 3 : mag > 15 ? 2 : 1)}`, FK_W / 2, 30);
    }

    // Balón
    let bx = BALL_START.x, by = BALL_START.y, bs = 1;
    if (S.mode === "flying") {
      bx = S.pos.x; by = S.pos.y; bs = S.pos.s;
    }
    ctx.save(); ctx.translate(bx, by); ctx.scale(bs, bs);
    ctx.save(); ctx.scale(1, 0.35);
    ctx.beginPath(); ctx.arc(0, 26, 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fill(); ctx.restore();
    if (S.mode === "flying") ctx.rotate(S.t * 14 * (S.curve >= 0 ? 1 : -1));
    ctx.font = "26px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("⚽", 0, 0);
    ctx.restore();

    // Trazo del swipe mientras apuntas
    if (S.mode === "aim" && swipeRef.current && swipeRef.current.pts.length > 1) {
      const pts = swipeRef.current.pts;
      ctx.strokeStyle = "rgba(79,195,247,0.7)"; ctx.lineWidth = 3; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke(); ctx.setLineDash([]);
    }
  };

  // ---------- física del disparo ----------
  const launch = () => {
    const sw = swipeRef.current;
    swipeRef.current = null;
    if (!sw || sw.pts.length < 4) return;
    const p0 = sw.pts[0], pN = sw.pts[sw.pts.length - 1];
    const dx = pN.x - p0.x, dy = pN.y - p0.y;
    if (dy > -30) return; // hay que deslizar hacia arriba

    const dt = Math.max(60, pN.t - p0.t);
    const dist = Math.hypot(dx, dy);
    const power = Math.min(1, (dist / dt) * 1.9);       // velocidad del gesto
    // Curva = desviación lateral del punto medio respecto a la recta del gesto
    const mid = sw.pts[Math.floor(sw.pts.length / 2)];
    const t0 = { x: pN.x - p0.x, y: pN.y - p0.y };
    const len = Math.hypot(t0.x, t0.y) || 1;
    const cross = ((mid.x - p0.x) * t0.y - (mid.y - p0.y) * t0.x) / len;
    const curve = Math.max(-1, Math.min(1, cross / 45)); // -1..1 (rosca)

    const R = roundRef.current;
    // Destino en el plano de la portería
    const gx = BALL_START.x + dx * 1.15 + curve * 62 + R.wind * 0.9;
    const heightF = Math.min(1, Math.abs(dy) / 260) * (0.55 + power * 0.6);
    const gy = GOAL.ground - 8 - heightF * (GOAL.ground - GOAL.cross - 4); // altura final en portería
    // El portero elige: a veces "lee" el disparo (nivel alto), a veces al azar
    const zones = [GOAL.x + 45, 180, GOAL.x + GOAL.w - 45];
    let dive;
    if (Math.random() < R.keeper.reads) dive = gx;                        // te ha leído
    else dive = zones[Math.floor(Math.random() * 3)];
    dive = Math.max(GOAL.x + 20, Math.min(GOAL.x + GOAL.w - 20, dive));

    stateRef.current = {
      mode: "flying", t: 0, curve, power,
      from: { ...BALL_START }, gx, gy, dive,
      arcH: 55 + power * 95,
      pos: { x: BALL_START.x, y: BALL_START.y, s: 1 },
      resolved: false,
    };
    setShowHelp(false);
  };

  const resolveShot = (S) => {
    const R = roundRef.current;
    // 1) ¿Barrera? — la barrera está a t≈0.42 del recorrido
    const wt = 0.42;
    const wx = S.from.x + (S.gx - S.from.x) * wt - S.curve * Math.sin(wt * Math.PI) * 55;
    const arcAtWall = Math.sin(wt * Math.PI) * S.arcH;
    const Wl = R.wall;
    if (Math.abs(wx - Wl.cx) < Wl.span / 2 + 8 && arcAtWall < Wl.jumpH) {
      return { ok: false, text: "🧱 ¡A LA BARRERA!", color: "#ff6b4a" };
    }
    // 2) ¿Dentro de la portería?
    if (S.gx < GOAL.x + 6 || S.gx > GOAL.x + GOAL.w - 6) return { ok: false, text: "↔️ ¡FUERA!", color: "#ff6b4a" };
    if (S.gy < GOAL.cross + 4) return { ok: false, text: "⬆️ ¡POR ENCIMA!", color: "#ff6b4a" };
    // 3) ¿Diana en la escuadra? (el portero nunca llega ahí)
    const hitTarget = R.targets.some(tg => Math.hypot(S.gx - tg.x, S.gy - tg.y) < 16);
    if (hitTarget) return { ok: true, pts: 10 + levelRef.current * 2 + 15, text: "🎯 ¡ESCUADRA! +15 EXTRA", color: "#ffd54f" };
    // 4) ¿Lo para el portero?
    if (Math.abs(S.gx - S.dive) < R.keeper.reach && S.gy > GOAL.cross + 22) {
      return { ok: false, text: "🧤 ¡PARADÓN!", color: "#4fc3f7" };
    }
    return { ok: true, pts: 10 + levelRef.current * 2, text: "⚽ ¡GOOOL!", color: GREEN };
  };

  // ---------- bucle ----------
  useEffect(() => {
    if (phase !== "playing") return;
    const ctx = canvasRef.current?.getContext("2d");
    const loop = () => {
      const S = stateRef.current;
      if (S?.mode === "flying") {
        S.t = Math.min(1, S.t + 0.022);
        const t = S.t, e = t; // lineal queda bien con el arco
        const bend = Math.sin(t * Math.PI) * 55 * S.curve;  // la rosca 🍌
        S.pos.x = S.from.x + (S.gx - S.from.x) * e - bend;
        S.pos.y = S.from.y + (S.gy - S.from.y) * e - Math.sin(t * Math.PI) * S.arcH * (1 - e * 0.55);
        S.pos.s = 1 - 0.62 * e;
        if (t >= 1 && !S.resolved) {
          S.resolved = true;
          const res = resolveShot(S);
          setMsg({ text: res.text, color: res.color });
          setTimeout(() => {
            setMsg(null);
            if (res.ok) {
              scoreRef.current += res.pts; setScore(scoreRef.current);
              levelRef.current += 1; setLevel(levelRef.current);
              newRound(levelRef.current);
            } else {
              livesRef.current -= 1; setLives(livesRef.current);
              if (livesRef.current <= 0) { finishGame(); return; }
              newRound(levelRef.current);
            }
          }, 1300);
        }
      }
      if (ctx) draw(ctx);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line
  }, [phase]);

  const finishGame = async () => {
    cancelAnimationFrame(rafRef.current);
    setPhase("result");
    await supabase.from("freekick_scores").insert({ user_id: user.id, score: scoreRef.current, level: levelRef.current });
    loadRankings();
  };

  // ---------- input ----------
  const toXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * (FK_W / rect.width), y: (cy - rect.top) * (FK_H / rect.height), t: Date.now() };
  };
  const onDown = (e) => {
    if (stateRef.current?.mode !== "aim") return;
    swipeRef.current = { pts: [toXY(e)] };
    e.preventDefault?.();
  };
  const onMove = (e) => {
    if (!swipeRef.current) return;
    swipeRef.current.pts.push(toXY(e));
    if (swipeRef.current.pts.length > 40) swipeRef.current.pts.shift();
    e.preventDefault?.();
  };
  const onUp = () => { if (swipeRef.current) launch(); };

  const medals = ["🥇", "🥈", "🥉"];

  // ============ MENÚ ============
  if (phase === "menu") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px" }}>TIROS LIBRES</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌪️⚽</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>TIROS LIBRES</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif", lineHeight: 1.9, marginBottom: "8px" }}>
          Desliza para chutar · <b style={{ color: GREEN }}>curva el gesto para dar rosca</b> 🍌<br/>
          Supera la barrera y al portero · 3 vidas
        </p>
        <p style={{ fontSize: "10px", color: "#ffd54f", fontFamily: "'Inter', sans-serif", marginBottom: "20px" }}>
          🎯 Escuadra = +15 extra · 💨 Viento desde nivel 3 · el portero aprende...
        </p>
        <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚡ JUGAR</button>
      </div>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING TIROS LIBRES</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.emoji} {r.name}</span>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8", lineHeight: 1 }}>{r.score}</div>
            <div style={{ fontSize: "8px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>nivel {r.level}</div>
          </div>
        </div>
      ))}
    </div>
  );

  // ============ JUGANDO ============
  if (phase === "playing") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <button onClick={() => { cancelAnimationFrame(rafRef.current); setPhase("menu"); }} style={{ padding: "6px 12px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#c0d8f0", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Salir</button>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#ffd54f" }}>NIVEL {level}</span>
          <span style={{ fontSize: "14px" }}>{"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: GREEN }}>{score}</span>
        </div>
      </div>
      <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
        <canvas ref={canvasRef} width={FK_W} height={FK_H}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          style={{ display: "block", width: "100%", height: "auto", touchAction: "none", cursor: "crosshair" }} />
        {showHelp && stateRef.current?.mode === "aim" && (
          <div style={{ position: "absolute", bottom: "70px", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
            <span style={{ fontSize: "11px", color: "#e0eaf8", fontFamily: "'Inter', sans-serif", background: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: "14px", animation: "pulse 1.6s infinite" }}>
              👆 Desliza hacia la portería · curva el dedo = rosca 🍌
            </span>
          </div>
        )}
        {msg && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)", pointerEvents: "none" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "34px", letterSpacing: "3px", color: msg.color, textShadow: "0 0 20px rgba(0,0,0,0.7)", animation: "popIn 0.3s ease" }}>{msg.text}</span>
          </div>
        )}
      </div>
      <p style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "'Inter', sans-serif", textAlign: "center", marginTop: "8px" }}>
        Gesto rápido = potencia · gesto largo hacia arriba = altura · cuidado con el viento 💨
      </p>
    </div>
  );

  // ============ RESULTADO ============
  if (phase === "result") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
      <button onClick={() => setPhase("menu")} style={{ marginBottom: "20px", padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>← Volver</button>
      <div style={{ background: CARD, border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", padding: "28px", marginBottom: "20px" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>{score >= 120 ? "🏆" : score >= 60 ? "🌪️" : "😅"}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7", letterSpacing: "3px" }}>TU PUNTUACIÓN</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "64px", color: GREEN, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: "11px", color: "#ffd54f", fontFamily: "'Inter', sans-serif", marginTop: "6px" }}>Llegaste al nivel {level}</div>
        <p style={{ marginTop: "12px", fontSize: "12px", color: "#e0eefa", fontFamily: "'Inter', sans-serif" }}>
          {score >= 120 ? "¡Roberto Carlos estaría orgulloso! 🍌" : score >= 60 ? "Buena zurda... ¿o era diestra? ⚽" : "A entrenar el golpeo 😅"}
        </p>
      </div>
      <button onClick={startGame} style={{ padding: "13px 36px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#0077cc)`, color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "20px" }}>🔄 REPETIR</button>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "12px" }}>RANKING TIROS LIBRES</p>
      {loadingRank ? <SkeletonRanking count={4} /> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(79,195,247,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8" }}>{r.emoji} {r.name}</span>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8", lineHeight: 1 }}>{r.score}</div>
            <div style={{ fontSize: "8px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>nivel {r.level}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return null;
}

// ============================================================
// VISTA JUEGOS
// ============================================================
function GamesView({ user }) {
  const [game, setGame] = useState(null);

  if (game === "trivia") return <TriviaGame user={user} onBack={() => setGame(null)} />;
  if (game === "flappy") return <FlappyGame user={user} onBack={() => setGame(null)} />;
  if (game === "flags") return <FlagsGame user={user} onBack={() => setGame(null)} />;
  if (game === "slot") return <SlotGame user={user} onBack={() => setGame(null)} />;
  if (game === "penalty") return <PenaltyGame user={user} onBack={() => setGame(null)} />;
  if (game === "draft") return <DraftGame user={user} onBack={() => setGame(null)} />;
  if (game === "sietecero") return <SieteCeroGame user={user} onBack={() => setGame(null)} />;
  if (game === "footle") return <FootleGame user={user} onBack={() => setGame(null)} />;
  if (game === "simon") return <SimonGame user={user} onBack={() => setGame(null)} />;
  if (game === "chapas" && chapasEnabled(user)) return <ChapasGame user={user} onBack={() => setGame(null)} />;
  if (game === "freekick") return <FreeKickGame user={user} onBack={() => setGame(null)} />;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "'Inter', sans-serif", letterSpacing: "3px", marginBottom: "20px" }}>ZONA DE JUEGOS</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <button onClick={() => setGame("trivia")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", background: "rgba(79,195,247,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🧠</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>TRIVIAL</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>10 preguntas · 1 jugador</div>
        </button>
        <button onClick={() => setGame("flappy")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(0,176,255,0.2)", borderRadius: "14px", background: "rgba(0,176,255,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>⚽</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>FLAPPY BALÓN</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>Esquiva porterías · 1 jugador</div>
        </button>
        <button onClick={() => setGame("flags")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(255,193,7,0.2)", borderRadius: "14px", background: "rgba(255,193,7,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🌍</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>BANDERAS</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>48 países · 1 jugador</div>
        </button>
        <button onClick={() => setGame("slot")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", background: "rgba(79,195,247,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🎰</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>TRAGAPERRAS</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>Mundial 2026 · 1 jugador</div>
        </button>
        <button onClick={() => setGame("penalty")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(255,82,82,0.2)", borderRadius: "14px", background: "rgba(255,82,82,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🥅</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>PENALTIS</div>
          <div style={{ fontSize: "9px", color: "#ff8a80", fontFamily: "'Inter', sans-serif" }}>5 penaltis · 2 jugadores 🔴</div>
        </button>
        <button onClick={() => setGame("draft")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", background: "rgba(79,195,247,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🃏</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>MUNDIAL DRAFT</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>monta tu 11 · 1 jugador</div>
        </button>
        <button onClick={() => setGame("sietecero")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", background: "rgba(79,195,247,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🏆</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>SIETE CERO</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>monta tu 11 histórico · 1 jugador</div>
        </button>
        <button onClick={() => setGame("footle")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(76,175,80,0.25)", borderRadius: "14px", background: "rgba(76,175,80,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🕵️</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>FOOTLE</div>
          <div style={{ fontSize: "9px", color: "#a8d8a8", fontFamily: "'Inter', sans-serif" }}>adivina el jugador · 1 jugador</div>
        </button>
        <button onClick={() => setGame("simon")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(192,132,252,0.25)", borderRadius: "14px", background: "rgba(192,132,252,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🧠</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>SIMON BANDERAS</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>memoria · 1 jugador</div>
        </button>
        {chapasEnabled(user) && (
          <button onClick={() => setGame("chapas")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(255,138,91,0.25)", borderRadius: "14px", background: "rgba(255,138,91,0.05)", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: "34px", marginBottom: "8px" }}>🔵⚽</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>CHAPAS <span style={{ fontSize: "9px", color: "#ffb38a" }}>BETA</span></div>
            <div style={{ fontSize: "9px", color: "#ffb38a", fontFamily: "'Inter', sans-serif" }}>fútbol de chapas · 2 jugadores 🔴</div>
          </button>
          <button onClick={() => setGame("freekick")} className="tappable" style={{ padding: "20px 12px", border: "1px solid rgba(79,195,247,0.2)", borderRadius: "14px", background: "rgba(79,195,247,0.05)", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: "34px", marginBottom: "8px" }}>🌪️</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>TIROS LIBRES</div>
            <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "'Inter', sans-serif" }}>rosca y escuadras · 1 jugador</div>
          </button>
        )}
      </div>
    </div>
  );
}


// ============================================================
// TUTORIAL ONBOARDING (tooltips primera vez)
// ============================================================
const ONBOARDING_STEPS = [
  {
    tab: "home",
    icon: "🏠",
    title: "Pantalla de inicio",
    text: "Desde aquí accedes a todas las secciones. Cuenta atrás, tu progreso de pronósticos y acceso rápido a todo.",
  },
  {
    tab: "groups",
    icon: "⚽",
    title: "Mis pronósticos",
    text: "Introduce el marcador que crees que tendrá cada partido. Se guarda automáticamente. +3 exacto, +1 ganador.",
  },
  {
    tab: "community",
    icon: "👥",
    title: "Todos los pronósticos",
    text: "Una vez cerrado un partido, puedes ver qué pronóstico puso cada participante y cuántos puntos sacaron.",
  },
  {
    tab: "ranking",
    icon: "🏆",
    title: "Ranking",
    text: "Consulta la clasificación general de todos los participantes en tiempo real. ¿Quién va ganando la porra?",
  },
];

function OnboardingTooltips({ user, onFinish, setView }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  // Tab index en la barra inferior para calcular posición del indicador
  const bottomTabs = ["home", "groups", "community", "ranking"];
  const tabIdx = bottomTabs.indexOf(current.tab);
  const tabCount = bottomTabs.length;
  const arrowLeft = tabIdx >= 0 ? `calc(${(tabIdx + 0.5) / tabCount * 100}%)` : "50%";

  const next = () => {
    if (isLast) { onFinish(); return; }
    setView(ONBOARDING_STEPS[step + 1].tab);
    setStep(s => s + 1);
  };

  const skip = () => onFinish();

  return (
    <>
      {/* Overlay oscuro */}
      <div style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(28,21,16,0.85)" }} />
        {/* Hueco iluminado en la barra inferior */}
        {tabIdx >= 0 && (
          <div style={{
            position: "absolute", bottom: 0, left: `calc(${tabIdx / tabCount * 100}%)`,
            width: `${100 / tabCount}%`, height: "64px",
            background: "transparent",
            boxShadow: `0 0 0 9999px rgba(28,21,16,0.85), 0 0 20px 4px rgba(79,195,247,0.5)`,
            borderRadius: "8px 8px 0 0",
          }} />
        )}
      </div>

      {/* Tooltip card */}
      <div style={{
        position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 32px)", maxWidth: "420px",
        zIndex: 201, animation: "fadeIn 0.25s ease",
      }}>
        {tabIdx >= 0 && (
          <div style={{
            position: "absolute", bottom: "-8px", left: arrowLeft, transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderTop: `8px solid ${GREEN}`,
          }} />
        )}
        <div style={{
          background: "#0f0f0f", border: `1px solid ${GREEN}`,
          borderRadius: "14px", padding: "18px 18px 14px",
          boxShadow: `0 0 30px rgba(79,195,247,0.2)`,
        }}>
          <div style={{ display: "flex", gap: "5px", marginBottom: "12px" }}>
            {ONBOARDING_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= step ? GREEN : "rgba(79,195,247,0.15)", transition: "background 0.3s" }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
            <span style={{ fontSize: "28px", lineHeight: 1 }}>{current.icon}</span>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: GREEN, letterSpacing: "2px", marginBottom: "5px" }}>{current.title}</div>
              <p style={{ fontSize: "12px", color: "#c8a87a", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{current.text}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={skip} style={{ padding: "6px 12px", border: "none", background: "transparent", color: "#cce0f5", fontFamily: "'Inter', sans-serif", fontSize: "11px", cursor: "pointer" }}>
              Saltar tutorial
            </button>
            <button onClick={next} style={{
              padding: "10px 22px", border: "none", borderRadius: "8px",
              background: `linear-gradient(135deg,${GREEN},#0077cc)`,
              color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 800,
              cursor: "pointer", letterSpacing: "2px",
            }}>
              {isLast ? "¡EMPEZAR! 🚀" : "SIGUIENTE →"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={next} />
    </>
  );
}
// ============================================================
// Mide tiempo ACTIVO (pestaña visible) y lo va sumando a usage_daily
// ============================================================
function useUsageTracker(user) {
  const accumRef = useRef(0);
  const lastTickRef = useRef(Date.now());
  const visibleRef = useRef(typeof document !== "undefined" ? document.visibilityState === "visible" : true);

  useEffect(() => {
    if (!user) return;

    // RESET: Iniciar el reloj de verdad en el momento que el usuario hace login, 
    // no cuando carga la pantalla de login.
    lastTickRef.current = Date.now();
    accumRef.current = 0;

    // No debe ser "async". Si usamos await, el navegador cancela la petición 
    // al cerrar la pestaña antes de que se complete.
    const flush = () => {
      const secs = Math.round(accumRef.current);
      if (secs <= 0) return;
      accumRef.current = 0; // Vaciamos para no duplicar

      const day = new Date().toISOString().slice(0, 10);
      
      // Se lanza la petición "al aire" sin await para que el navegador la procese rápido
      supabase.rpc("add_usage_seconds", { p_user: user.id, p_day: day, p_seconds: secs })
        .catch(e => console.error("usage flush error", e));
    };

    const tick = () => {
      const now = Date.now();
      if (visibleRef.current) {
        accumRef.current += (now - lastTickRef.current) / 1000;
      }
      lastTickRef.current = now;
    };

    const onVisibility = () => {
      tick(); // Cierra el tramo actual
      visibleRef.current = document.visibilityState === "visible";
      if (!visibleRef.current) flush(); // Si se ocultó, enviamos de inmediato
    };

    // Función con nombre para poder eliminarla correctamente en el cleanup
    const handleUnload = () => {
      tick();
      flush();
    };

    const tickInt = setInterval(tick, 1000);
    const flushInt = setInterval(flush, 15000); // Reducido a 15s para perder menos datos si cierran rápido

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(tickInt);
      clearInterval(flushInt);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload(); // Guardar remanente al desmontar (ej. al hacer logout)
    };
  }, [user]);
}

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function Home() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [allClosed, setAllClosed] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEmojiTip, setShowEmojiTip] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [showAvisoM73, setShowAvisoM73] = useState(false);

  // PWA — registrar service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then(reg => console.log("SW registrado:", reg.scope))
        .catch(err => console.log("SW error:", err));
    }
  }, []);
  useUsageTracker(user);
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        const isOnboarded = profile?.onboarded === true;
        setUser({ ...session.user, name: profile?.name || session.user.email, role: profile?.role || "user", emoji: profile?.emoji || "⚽" });
        setScreen("app");
        // if (!isOnboarded) setShowOnboarding(true);
      }
      setLoadingSession(false);
    });
  }, []);

  useEffect(() => { if (user) loadData(); }, [user]);

  // 🔄 Realtime: refresca partidos/resultados sin recargar la página
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("matches_realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, () => loadData())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "matches" }, () => loadData())
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [user]);

  useEffect(() => {
      if (user) {
        // Actualiza la fecha de última actividad en la base de datos
        supabase
          .from("profiles")
          .update({ last_seen: new Date().toISOString() })
          .eq("id", user.id)
          .then(({ error }) => {
            if (error) console.error("Error actualizando última actividad:", error);
          });
      }
    }, [user, view]); // Se ejecutará al entrar y cada vez que cambien de pestaña

  // Mostrar el aviso de emoji UNA vez por dispositivo (relanzamiento v2, más visible)
  useEffect(() => {
    if (!user) return;
    try {
      if (!localStorage.getItem("emojiTipV2_seen")) setShowEmojiTip(true);
    } catch {
      setShowEmojiTip(true);
    }
  }, [user]);

  const dismissEmojiTip = () => {
    setShowEmojiTip(false);
    try { localStorage.setItem("emojiTipV2_seen", "1"); } catch {}
  };
  // Aviso único: anulación del pronóstico de M73 (Sudáfrica-Canadá)
  useEffect(() => {
    if (!user) return;
    try {
      if (!localStorage.getItem("avisoM73_seen")) setShowAvisoM73(true);
    } catch {
      setShowAvisoM73(true);
    }
  }, [user]);

  const dismissAvisoM73 = () => {
    setShowAvisoM73(false);
    try { localStorage.setItem("avisoM73_seen", "1"); } catch {}
  };
  
  const loadData = async () => {
    const { data: dbMatches } = await supabase.from("matches").select("*").order("match_date").order("match_time").order("id");
    let finalMatches;

    if (dbMatches && dbMatches.length > 0) {
      const updates = [];
      for (const m of dbMatches) {
        const localMatch = ALL_MATCHES.find(x => x.id === m.id);
        if (localMatch && (m.match_date !== localMatch.match_date || m.match_time !== localMatch.match_time)) {
          updates.push(
            supabase.from("matches")
              .update({ match_date: localMatch.match_date, match_time: localMatch.match_time })
              .eq("id", m.id)
          );
        }
      }
      if (updates.length > 0) await Promise.all(updates);
      const { data: refreshed } = await supabase.from("matches").select("*").order("match_date").order("match_time").order("id");
      finalMatches = refreshed || dbMatches;
    } else {
      const chunks = [];
      for (let i = 0; i < ALL_MATCHES.length; i += 10) chunks.push(ALL_MATCHES.slice(i, i + 10));
      let all = [];
      for (const chunk of chunks) {
        const { data } = await supabase.from("matches").insert(chunk).select();
        if (data) all = [...all, ...data];
      }
      finalMatches = all.length > 0 ? all : ALL_MATCHES;
    }

    setMatches(finalMatches);
    setAllClosed(finalMatches.length > 0 && finalMatches.every(m => m.status === "closed"));
    if (user) {
      const { data: p } = await supabase.from("predictions").select("*").range(0, 99999).eq("user_id", user.id);
      setPredictions(p || []);
    }
    setLoadingData(false);
  };

  const handleLogin = async (u) => {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", u.id).single();
    setUser({ ...u, emoji: profile?.emoji || "⚽" });
    setScreen("app");
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setScreen("login"); };

  const finishOnboarding = async () => {
    setShowOnboarding(false);
    setView("home");
    if (user) await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
  };

  if (loadingSession) return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>⚽</div>
        <span style={{ color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: "4px", fontSize: "11px" }}>CARGANDO...</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#e0eaf8" }}>
      <style>{css}</style>
      {screen === "login" && <LoginPage onLogin={handleLogin} />}
      {screen === "app" && user && (
        <>
          <NavBar user={user} view={view} setView={(v) => { if (v === "profile") setViewProfileId(null); setView(v); }} onLogout={handleLogout} />
          
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "62px 14px 84px", position: "relative", zIndex: 1 }}>
            {view === "home" && <HomeView user={user} matches={matches} predictions={predictions} setView={setView} loadingData={loadingData} />}
            {view === "groups" && <GroupsView user={user} matches={matches} predictions={predictions} onDataChange={loadData} allClosed={allClosed} />}
            {view === "results" && <ResultsView matches={matches} />}
            {view === "community" && <CommunityView matches={matches} user={user} />}
            {view === "profile" && <ProfileView user={user} matches={matches} viewProfileId={viewProfileId} onClearProfile={() => setViewProfileId(null)} />}
            {view === "ranking" && <RankingView matches={matches} user={user} setView={setView} setViewProfileId={setViewProfileId} />}
            {view === "games" && <GamesView user={user} />}
            {view === "payments" && <PaymentsView user={user} />}
            {view === "knockout" && <KnockoutView user={user} matches={matches} />}
            {view === "knockout_results" && user.role === "admin" && <KnockoutView user={user} matches={matches} resultsMode={true} />}
            {view === "admin" && user.role === "admin" && <AdminView matches={matches} onDataChange={loadData} />}
            {view === "export" && user.role === "admin" && <ExportView matches={matches} onBack={() => setView("home")} />}
          </div>
          {showEmojiTip && (
            <div
              onClick={dismissEmojiTip}
              style={{
                position: "fixed", inset: 0, zIndex: 250,
                background: "rgba(5,12,24,0.82)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "24px", animation: "fadeIn 0.25s ease",
              }}>
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  width: "100%", maxWidth: "360px",
                  background: "linear-gradient(160deg,#102339,#0a1628)",
                  border: `2px solid ${GREEN}`, borderRadius: "18px",
                  padding: "28px 24px 20px", textAlign: "center",
                  animation: "popIn 0.4s ease, glowPulse 2s ease-in-out infinite",
                }}>
                <div style={{ fontSize: "56px", lineHeight: 1, marginBottom: "12px", animation: "pulse 1.4s ease-in-out infinite" }}>👤⚽</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: GREEN, letterSpacing: "2px", marginBottom: "8px" }}>
                  ¡PERSONALIZA TU PERFIL!
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#c0d8f0", lineHeight: 1.6, marginBottom: "20px" }}>
                  Elige un emoji que te represente en el ranking y en los chats. Toca tu avatar arriba a la derecha o pulsa el botón.
                </p>
                <button
                  onClick={() => { dismissEmojiTip(); setView("profile"); }}
                  style={{
                    width: "100%", padding: "14px", border: "none", borderRadius: "10px",
                    background: `linear-gradient(135deg,${GREEN},#0077cc)`,
                    color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800,
                    letterSpacing: "2px", cursor: "pointer", marginBottom: "8px",
                  }}>
                  👤 IR A MI PERFIL →
                </button>
                <button
                  onClick={dismissEmojiTip}
                  style={{
                    width: "100%", padding: "10px", border: "none", background: "transparent",
                    color: "#7ab8e0", fontFamily: "'Inter', sans-serif", fontSize: "11px", cursor: "pointer",
                  }}>
                  Ahora no
                </button>
              </div>
            </div>
          )}
            {showAvisoM73 && (
            <div
              onClick={dismissAvisoM73}
              style={{
                position: "fixed", inset: 0, zIndex: 260,
                background: "rgba(5,12,24,0.85)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "24px", animation: "fadeIn 0.25s ease",
              }}>
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  width: "100%", maxWidth: "380px", maxHeight: "90vh", overflowY: "auto",
                  background: "linear-gradient(160deg,#102339,#0a1628)",
                  border: `2px solid #ffd54f`, borderRadius: "18px",
                  padding: "26px 22px 20px", textAlign: "center",
                  animation: "popIn 0.4s ease",
                }}>
                <div style={{ fontSize: "46px", lineHeight: 1, marginBottom: "12px" }}>⚠️</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#ffd54f", letterSpacing: "2px", marginBottom: "12px" }}>
                  AVISO IMPORTANTE
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#e0eaf8", lineHeight: 1.7, marginBottom: "10px" }}>
                  El pronóstico de <b>Gorka</b> en el <b>Sudáfrica - Canadá</b> (dieciseisavos) se registró con el partido ya empezado.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#c0d8f0", lineHeight: 1.7, marginBottom: "10px" }}>
                  Para que conste a todos: se ha decidido cambiarle el pronóstico a (<b>Sudáfrica 1-0</b>), así que ese cruce no le suma puntos.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#c0d8f0", lineHeight: 1.7, marginBottom: "10px" }}>
                  Como consecuencia, en las fases siguientes donde Gorka tenía a <b>Canadá</b> en un partido, ahora le aparecerá <b>Sudáfrica</b> en su lugar.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#c0d8f0", lineHeight: 1.7, marginBottom: "20px" }}>
                  El cambio solo afecta a Gorka. El resto de pronósticos no se han tocado.
                </p>
                <button
                  onClick={dismissAvisoM73}
                  style={{
                    width: "100%", padding: "14px", border: "none", borderRadius: "10px",
                    background: "linear-gradient(135deg,#ffd54f,#e6a100)",
                    color: "#0a1628", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800,
                    letterSpacing: "2px", cursor: "pointer",
                  }}>
                  ENTENDIDO
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
