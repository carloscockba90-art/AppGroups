// Datos de ejemplo para el prototipo. Nada sale de un backend real.

export const INTERESTS = [
  { id: "padel", label: "Pádel", emoji: "🎾" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
  { id: "trekking", label: "Trekking", emoji: "🥾" },
  { id: "cocina", label: "Cocina", emoji: "🍳" },
  { id: "fotografia", label: "Fotografía", emoji: "📷" },
  { id: "running", label: "Running", emoji: "🏃" },
  { id: "vino", label: "Cata de vinos", emoji: "🍷" },
  { id: "musica", label: "Música", emoji: "🎸" },
  { id: "arte", label: "Arte", emoji: "🎨" },
  { id: "idiomas", label: "Idiomas", emoji: "🗣️" },
  { id: "surf", label: "Surf", emoji: "🏄" },
  { id: "baile", label: "Baile", emoji: "💃" },
];

export const PEOPLE = [
  { id: "p1", name: "Sofía M.", color: "#ff7aa8", interests: "Yoga · Bienestar · Viajes" },
  { id: "p2", name: "Diego R.", color: "#3db8ff", interests: "Pádel · Running" },
  { id: "p3", name: "Valentina C.", color: "#ffb020", interests: "Cocina · Vino" },
  { id: "p4", name: "Martín L.", color: "#12a37f", interests: "Trekking · Fotografía" },
  { id: "p5", name: "Camila P.", color: "#8f5bff", interests: "Baile · Música" },
  { id: "p6", name: "Tomás G.", color: "#e0483b", interests: "Surf · Running" },
  { id: "p7", name: "Isidora V.", color: "#5b4bff", interests: "Arte · Idiomas" },
];

export const EVENTS = [
  {
    id: "e1", title: "Yoga al amanecer en el cerro", cat: "Bienestar", emoji: "🧘", bg: "#ffe7f0",
    date: "Sáb 18 oct · 07:30", place: "Cerro San Cristóbal", price: 12000, spots: 4, total: 15,
    host: "p1", attendees: ["p2", "p3", "p5", "p7"], rating: 4.8,
    desc: "Sesión de 75 minutos para todos los niveles, con té caliente al final. Trae tu mat o pide uno prestado.",
    group: "g2",
  },
  {
    id: "e2", title: "Trekking a la cascada", cat: "Aventura", emoji: "🥾", bg: "#e2f6ef",
    date: "Dom 19 oct · 09:00", place: "Cajón del Maipo", price: 18000, spots: 0, total: 12,
    host: "p4", attendees: ["p1", "p6", "p2"], rating: 4.9,
    desc: "Ruta de 9 km, dificultad media. Incluye transporte ida y vuelta desde metro Bellavista.",
    group: null,
  },
  {
    id: "e3", title: "Taller de pasta fresca", cat: "Gastronomía", emoji: "🍝", bg: "#fff3dc",
    date: "Jue 23 oct · 19:30", place: "Providencia", price: 25000, spots: 6, total: 10,
    host: "p3", attendees: ["p5", "p7"], rating: 4.7,
    desc: "Aprende a hacer tagliatelle y ravioli desde cero. Terminamos cenando lo que cocinamos.",
    group: null,
  },
  {
    id: "e4", title: "Salida fotográfica nocturna", cat: "Arte", emoji: "📷", bg: "#e8eeff",
    date: "Vie 24 oct · 20:00", place: "Barrio Lastarria", price: 0, spots: 8, total: 12,
    host: "p4", attendees: ["p7"], rating: 4.6,
    desc: "Paseo de 2 horas practicando larga exposición. Sirve cualquier cámara, incluso el celular.",
    group: null,
  },
];

export const GROUPS = [
  {
    id: "g1", name: "Pádel nivel intermedio", emoji: "🎾", bg: "#e8eeff", status: "formacion",
    activity: "Clases de pádel · grupo de 8", zone: "Las Condes · fines de semana",
    min: 8, members: ["p2", "p6", "p4", "p5", "p1"], role: null, invitedBy: "p2",
  },
  {
    id: "g2", name: "Yoga del cerro", emoji: "🧘", bg: "#ffe7f0", status: "activo",
    activity: "Yoga al aire libre", zone: "Providencia",
    min: 6, members: ["p1", "p2", "p3", "p5", "p7"], role: "organizo", nextEvent: "e1",
  },
  {
    id: "g3", name: "Cocineros de jueves", emoji: "🍝", bg: "#fff3dc", status: "activo",
    activity: "Talleres de cocina", zone: "Providencia",
    min: 6, members: ["p3", "p5", "p7", "p4"], role: "participo", nextEvent: "e3",
  },
];

export const person = (id) => PEOPLE.find((p) => p.id === id);
export const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);
export const money = (n) => (n === 0 ? "Gratis" : "$" + n.toLocaleString("es-CL"));
