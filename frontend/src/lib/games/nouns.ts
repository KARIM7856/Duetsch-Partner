/**
 * A curated list of concrete German nouns from the A1/A2 (Goethe-Zertifikat)
 * vocabulary, grouped by theme. Concrete nouns work best for the "meine Puppe"
 * guessing game because the player can ask descriptive questions and the
 * closeness rating between two nouns is meaningful.
 *
 * `theme` labels are in German so they can be shown to the player as an optional
 * hint without leaking the secret word.
 */

export type Article = "der" | "die" | "das";

export interface Noun {
  /** The noun without its article, capitalised as in German. */
  word: string;
  article: Article;
  /** Plural form ("die …"); falls back to the singular for uncountable nouns. */
  plural: string;
  /** Short English gloss, shown after the round is over. */
  en: string;
  /** German category label, usable as an optional in-game hint. */
  theme: string;
}

export const NOUNS: Noun[] = [
  // ── Menschen & Familie ──────────────────────────────────────────────
  { word: "Mann", article: "der", plural: "Männer", en: "man", theme: "Menschen & Familie" },
  { word: "Frau", article: "die", plural: "Frauen", en: "woman", theme: "Menschen & Familie" },
  { word: "Kind", article: "das", plural: "Kinder", en: "child", theme: "Menschen & Familie" },
  { word: "Junge", article: "der", plural: "Jungen", en: "boy", theme: "Menschen & Familie" },
  { word: "Mädchen", article: "das", plural: "Mädchen", en: "girl", theme: "Menschen & Familie" },
  { word: "Vater", article: "der", plural: "Väter", en: "father", theme: "Menschen & Familie" },
  { word: "Mutter", article: "die", plural: "Mütter", en: "mother", theme: "Menschen & Familie" },
  { word: "Bruder", article: "der", plural: "Brüder", en: "brother", theme: "Menschen & Familie" },
  { word: "Schwester", article: "die", plural: "Schwestern", en: "sister", theme: "Menschen & Familie" },
  { word: "Freund", article: "der", plural: "Freunde", en: "friend", theme: "Menschen & Familie" },
  { word: "Lehrer", article: "der", plural: "Lehrer", en: "teacher", theme: "Menschen & Familie" },
  { word: "Arzt", article: "der", plural: "Ärzte", en: "doctor", theme: "Menschen & Familie" },
  { word: "Baby", article: "das", plural: "Babys", en: "baby", theme: "Menschen & Familie" },

  // ── Körper ──────────────────────────────────────────────────────────
  { word: "Kopf", article: "der", plural: "Köpfe", en: "head", theme: "Körper" },
  { word: "Haar", article: "das", plural: "Haare", en: "hair", theme: "Körper" },
  { word: "Auge", article: "das", plural: "Augen", en: "eye", theme: "Körper" },
  { word: "Nase", article: "die", plural: "Nasen", en: "nose", theme: "Körper" },
  { word: "Mund", article: "der", plural: "Münder", en: "mouth", theme: "Körper" },
  { word: "Ohr", article: "das", plural: "Ohren", en: "ear", theme: "Körper" },
  { word: "Hand", article: "die", plural: "Hände", en: "hand", theme: "Körper" },
  { word: "Arm", article: "der", plural: "Arme", en: "arm", theme: "Körper" },
  { word: "Bein", article: "das", plural: "Beine", en: "leg", theme: "Körper" },
  { word: "Fuß", article: "der", plural: "Füße", en: "foot", theme: "Körper" },
  { word: "Zahn", article: "der", plural: "Zähne", en: "tooth", theme: "Körper" },
  { word: "Herz", article: "das", plural: "Herzen", en: "heart", theme: "Körper" },

  // ── Essen & Trinken ─────────────────────────────────────────────────
  { word: "Brot", article: "das", plural: "Brote", en: "bread", theme: "Essen & Trinken" },
  { word: "Brötchen", article: "das", plural: "Brötchen", en: "bread roll", theme: "Essen & Trinken" },
  { word: "Käse", article: "der", plural: "Käse", en: "cheese", theme: "Essen & Trinken" },
  { word: "Ei", article: "das", plural: "Eier", en: "egg", theme: "Essen & Trinken" },
  { word: "Milch", article: "die", plural: "Milch", en: "milk", theme: "Essen & Trinken" },
  { word: "Wasser", article: "das", plural: "Wasser", en: "water", theme: "Essen & Trinken" },
  { word: "Kaffee", article: "der", plural: "Kaffees", en: "coffee", theme: "Essen & Trinken" },
  { word: "Tee", article: "der", plural: "Tees", en: "tea", theme: "Essen & Trinken" },
  { word: "Saft", article: "der", plural: "Säfte", en: "juice", theme: "Essen & Trinken" },
  { word: "Bier", article: "das", plural: "Biere", en: "beer", theme: "Essen & Trinken" },
  { word: "Apfel", article: "der", plural: "Äpfel", en: "apple", theme: "Essen & Trinken" },
  { word: "Banane", article: "die", plural: "Bananen", en: "banana", theme: "Essen & Trinken" },
  { word: "Tomate", article: "die", plural: "Tomaten", en: "tomato", theme: "Essen & Trinken" },
  { word: "Kartoffel", article: "die", plural: "Kartoffeln", en: "potato", theme: "Essen & Trinken" },
  { word: "Fisch", article: "der", plural: "Fische", en: "fish (food)", theme: "Essen & Trinken" },
  { word: "Fleisch", article: "das", plural: "Fleisch", en: "meat", theme: "Essen & Trinken" },
  { word: "Wurst", article: "die", plural: "Würste", en: "sausage", theme: "Essen & Trinken" },
  { word: "Suppe", article: "die", plural: "Suppen", en: "soup", theme: "Essen & Trinken" },
  { word: "Kuchen", article: "der", plural: "Kuchen", en: "cake", theme: "Essen & Trinken" },
  { word: "Schokolade", article: "die", plural: "Schokoladen", en: "chocolate", theme: "Essen & Trinken" },
  { word: "Zucker", article: "der", plural: "Zucker", en: "sugar", theme: "Essen & Trinken" },
  { word: "Salz", article: "das", plural: "Salze", en: "salt", theme: "Essen & Trinken" },
  { word: "Reis", article: "der", plural: "Reis", en: "rice", theme: "Essen & Trinken" },

  // ── Haus & Möbel ────────────────────────────────────────────────────
  { word: "Haus", article: "das", plural: "Häuser", en: "house", theme: "Haus & Möbel" },
  { word: "Wohnung", article: "die", plural: "Wohnungen", en: "apartment", theme: "Haus & Möbel" },
  { word: "Zimmer", article: "das", plural: "Zimmer", en: "room", theme: "Haus & Möbel" },
  { word: "Küche", article: "die", plural: "Küchen", en: "kitchen", theme: "Haus & Möbel" },
  { word: "Tür", article: "die", plural: "Türen", en: "door", theme: "Haus & Möbel" },
  { word: "Fenster", article: "das", plural: "Fenster", en: "window", theme: "Haus & Möbel" },
  { word: "Tisch", article: "der", plural: "Tische", en: "table", theme: "Haus & Möbel" },
  { word: "Stuhl", article: "der", plural: "Stühle", en: "chair", theme: "Haus & Möbel" },
  { word: "Bett", article: "das", plural: "Betten", en: "bed", theme: "Haus & Möbel" },
  { word: "Schrank", article: "der", plural: "Schränke", en: "cupboard", theme: "Haus & Möbel" },
  { word: "Sofa", article: "das", plural: "Sofas", en: "sofa", theme: "Haus & Möbel" },
  { word: "Lampe", article: "die", plural: "Lampen", en: "lamp", theme: "Haus & Möbel" },
  { word: "Garten", article: "der", plural: "Gärten", en: "garden", theme: "Haus & Möbel" },
  { word: "Spiegel", article: "der", plural: "Spiegel", en: "mirror", theme: "Haus & Möbel" },
  { word: "Schlüssel", article: "der", plural: "Schlüssel", en: "key", theme: "Haus & Möbel" },
  { word: "Uhr", article: "die", plural: "Uhren", en: "clock / watch", theme: "Haus & Möbel" },

  // ── Küche & Geschirr ────────────────────────────────────────────────
  { word: "Teller", article: "der", plural: "Teller", en: "plate", theme: "Küche & Geschirr" },
  { word: "Tasse", article: "die", plural: "Tassen", en: "cup", theme: "Küche & Geschirr" },
  { word: "Glas", article: "das", plural: "Gläser", en: "glass", theme: "Küche & Geschirr" },
  { word: "Gabel", article: "die", plural: "Gabeln", en: "fork", theme: "Küche & Geschirr" },
  { word: "Messer", article: "das", plural: "Messer", en: "knife", theme: "Küche & Geschirr" },
  { word: "Löffel", article: "der", plural: "Löffel", en: "spoon", theme: "Küche & Geschirr" },
  { word: "Flasche", article: "die", plural: "Flaschen", en: "bottle", theme: "Küche & Geschirr" },
  { word: "Topf", article: "der", plural: "Töpfe", en: "pot", theme: "Küche & Geschirr" },

  // ── Kleidung ────────────────────────────────────────────────────────
  { word: "Hemd", article: "das", plural: "Hemden", en: "shirt", theme: "Kleidung" },
  { word: "Hose", article: "die", plural: "Hosen", en: "trousers", theme: "Kleidung" },
  { word: "Rock", article: "der", plural: "Röcke", en: "skirt", theme: "Kleidung" },
  { word: "Kleid", article: "das", plural: "Kleider", en: "dress", theme: "Kleidung" },
  { word: "Pullover", article: "der", plural: "Pullover", en: "sweater", theme: "Kleidung" },
  { word: "Jacke", article: "die", plural: "Jacken", en: "jacket", theme: "Kleidung" },
  { word: "Mantel", article: "der", plural: "Mäntel", en: "coat", theme: "Kleidung" },
  { word: "Schuh", article: "der", plural: "Schuhe", en: "shoe", theme: "Kleidung" },
  { word: "Hut", article: "der", plural: "Hüte", en: "hat", theme: "Kleidung" },
  { word: "Brille", article: "die", plural: "Brillen", en: "glasses", theme: "Kleidung" },

  // ── Tiere ───────────────────────────────────────────────────────────
  { word: "Hund", article: "der", plural: "Hunde", en: "dog", theme: "Tiere" },
  { word: "Katze", article: "die", plural: "Katzen", en: "cat", theme: "Tiere" },
  { word: "Pferd", article: "das", plural: "Pferde", en: "horse", theme: "Tiere" },
  { word: "Vogel", article: "der", plural: "Vögel", en: "bird", theme: "Tiere" },
  { word: "Kuh", article: "die", plural: "Kühe", en: "cow", theme: "Tiere" },
  { word: "Schwein", article: "das", plural: "Schweine", en: "pig", theme: "Tiere" },
  { word: "Schaf", article: "das", plural: "Schafe", en: "sheep", theme: "Tiere" },
  { word: "Maus", article: "die", plural: "Mäuse", en: "mouse", theme: "Tiere" },
  { word: "Hase", article: "der", plural: "Hasen", en: "hare / rabbit", theme: "Tiere" },
  { word: "Löwe", article: "der", plural: "Löwen", en: "lion", theme: "Tiere" },
  { word: "Bär", article: "der", plural: "Bären", en: "bear", theme: "Tiere" },
  { word: "Elefant", article: "der", plural: "Elefanten", en: "elephant", theme: "Tiere" },
  { word: "Schlange", article: "die", plural: "Schlangen", en: "snake", theme: "Tiere" },
  { word: "Affe", article: "der", plural: "Affen", en: "monkey", theme: "Tiere" },
  { word: "Ente", article: "die", plural: "Enten", en: "duck", theme: "Tiere" },
  { word: "Wolf", article: "der", plural: "Wölfe", en: "wolf", theme: "Tiere" },

  // ── Natur & Wetter ──────────────────────────────────────────────────
  { word: "Baum", article: "der", plural: "Bäume", en: "tree", theme: "Natur & Wetter" },
  { word: "Blume", article: "die", plural: "Blumen", en: "flower", theme: "Natur & Wetter" },
  { word: "Berg", article: "der", plural: "Berge", en: "mountain", theme: "Natur & Wetter" },
  { word: "See", article: "der", plural: "Seen", en: "lake", theme: "Natur & Wetter" },
  { word: "Meer", article: "das", plural: "Meere", en: "sea", theme: "Natur & Wetter" },
  { word: "Fluss", article: "der", plural: "Flüsse", en: "river", theme: "Natur & Wetter" },
  { word: "Wald", article: "der", plural: "Wälder", en: "forest", theme: "Natur & Wetter" },
  { word: "Sonne", article: "die", plural: "Sonnen", en: "sun", theme: "Natur & Wetter" },
  { word: "Mond", article: "der", plural: "Monde", en: "moon", theme: "Natur & Wetter" },
  { word: "Stern", article: "der", plural: "Sterne", en: "star", theme: "Natur & Wetter" },
  { word: "Wolke", article: "die", plural: "Wolken", en: "cloud", theme: "Natur & Wetter" },
  { word: "Regen", article: "der", plural: "Regen", en: "rain", theme: "Natur & Wetter" },
  { word: "Schnee", article: "der", plural: "Schnee", en: "snow", theme: "Natur & Wetter" },
  { word: "Feuer", article: "das", plural: "Feuer", en: "fire", theme: "Natur & Wetter" },
  { word: "Stein", article: "der", plural: "Steine", en: "stone", theme: "Natur & Wetter" },
  { word: "Blatt", article: "das", plural: "Blätter", en: "leaf", theme: "Natur & Wetter" },

  // ── Stadt & Orte ────────────────────────────────────────────────────
  { word: "Stadt", article: "die", plural: "Städte", en: "city", theme: "Stadt & Orte" },
  { word: "Straße", article: "die", plural: "Straßen", en: "street", theme: "Stadt & Orte" },
  { word: "Bahnhof", article: "der", plural: "Bahnhöfe", en: "train station", theme: "Stadt & Orte" },
  { word: "Flughafen", article: "der", plural: "Flughäfen", en: "airport", theme: "Stadt & Orte" },
  { word: "Kirche", article: "die", plural: "Kirchen", en: "church", theme: "Stadt & Orte" },
  { word: "Hotel", article: "das", plural: "Hotels", en: "hotel", theme: "Stadt & Orte" },
  { word: "Restaurant", article: "das", plural: "Restaurants", en: "restaurant", theme: "Stadt & Orte" },
  { word: "Supermarkt", article: "der", plural: "Supermärkte", en: "supermarket", theme: "Stadt & Orte" },
  { word: "Bank", article: "die", plural: "Banken", en: "bank", theme: "Stadt & Orte" },
  { word: "Krankenhaus", article: "das", plural: "Krankenhäuser", en: "hospital", theme: "Stadt & Orte" },
  { word: "Apotheke", article: "die", plural: "Apotheken", en: "pharmacy", theme: "Stadt & Orte" },
  { word: "Markt", article: "der", plural: "Märkte", en: "market", theme: "Stadt & Orte" },
  { word: "Park", article: "der", plural: "Parks", en: "park", theme: "Stadt & Orte" },
  { word: "Brücke", article: "die", plural: "Brücken", en: "bridge", theme: "Stadt & Orte" },
  { word: "Schule", article: "die", plural: "Schulen", en: "school", theme: "Stadt & Orte" },

  // ── Verkehr ─────────────────────────────────────────────────────────
  { word: "Auto", article: "das", plural: "Autos", en: "car", theme: "Verkehr" },
  { word: "Bus", article: "der", plural: "Busse", en: "bus", theme: "Verkehr" },
  { word: "Zug", article: "der", plural: "Züge", en: "train", theme: "Verkehr" },
  { word: "Fahrrad", article: "das", plural: "Fahrräder", en: "bicycle", theme: "Verkehr" },
  { word: "Flugzeug", article: "das", plural: "Flugzeuge", en: "airplane", theme: "Verkehr" },
  { word: "Schiff", article: "das", plural: "Schiffe", en: "ship", theme: "Verkehr" },
  { word: "Motorrad", article: "das", plural: "Motorräder", en: "motorcycle", theme: "Verkehr" },
  { word: "Taxi", article: "das", plural: "Taxis", en: "taxi", theme: "Verkehr" },

  // ── Schule & Büro ───────────────────────────────────────────────────
  { word: "Buch", article: "das", plural: "Bücher", en: "book", theme: "Schule & Büro" },
  { word: "Heft", article: "das", plural: "Hefte", en: "notebook", theme: "Schule & Büro" },
  { word: "Stift", article: "der", plural: "Stifte", en: "pen", theme: "Schule & Büro" },
  { word: "Bleistift", article: "der", plural: "Bleistifte", en: "pencil", theme: "Schule & Büro" },
  { word: "Papier", article: "das", plural: "Papiere", en: "paper", theme: "Schule & Büro" },
  { word: "Tafel", article: "die", plural: "Tafeln", en: "blackboard", theme: "Schule & Büro" },
  { word: "Computer", article: "der", plural: "Computer", en: "computer", theme: "Schule & Büro" },
  { word: "Handy", article: "das", plural: "Handys", en: "mobile phone", theme: "Schule & Büro" },
  { word: "Telefon", article: "das", plural: "Telefone", en: "telephone", theme: "Schule & Büro" },
  { word: "Brief", article: "der", plural: "Briefe", en: "letter", theme: "Schule & Büro" },
  { word: "Zeitung", article: "die", plural: "Zeitungen", en: "newspaper", theme: "Schule & Büro" },
  { word: "Geld", article: "das", plural: "Gelder", en: "money", theme: "Schule & Büro" },
  { word: "Fernseher", article: "der", plural: "Fernseher", en: "television", theme: "Schule & Büro" },
  { word: "Kamera", article: "die", plural: "Kameras", en: "camera", theme: "Schule & Büro" },

  // ── Spielsachen & Dinge ─────────────────────────────────────────────
  { word: "Puppe", article: "die", plural: "Puppen", en: "doll", theme: "Spielsachen & Dinge" },
  { word: "Ball", article: "der", plural: "Bälle", en: "ball", theme: "Spielsachen & Dinge" },
  { word: "Tasche", article: "die", plural: "Taschen", en: "bag", theme: "Spielsachen & Dinge" },
  { word: "Koffer", article: "der", plural: "Koffer", en: "suitcase", theme: "Spielsachen & Dinge" },
  { word: "Regenschirm", article: "der", plural: "Regenschirme", en: "umbrella", theme: "Spielsachen & Dinge" },
  { word: "Bild", article: "das", plural: "Bilder", en: "picture", theme: "Spielsachen & Dinge" },
  { word: "Foto", article: "das", plural: "Fotos", en: "photo", theme: "Spielsachen & Dinge" },
  { word: "Geschenk", article: "das", plural: "Geschenke", en: "gift", theme: "Spielsachen & Dinge" },
  { word: "Spielzeug", article: "das", plural: "Spielzeuge", en: "toy", theme: "Spielsachen & Dinge" },
  { word: "Ring", article: "der", plural: "Ringe", en: "ring", theme: "Spielsachen & Dinge" },
];

/** Returns a uniformly random noun from {@link NOUNS}. Client-side only. */
export function pickRandomNoun(): Noun {
  const index = Math.floor(Math.random() * NOUNS.length);
  return NOUNS[index];
}

/** Picks a random noun different from `previous` so a new round feels fresh. */
export function pickDifferentNoun(previous: Noun | null): Noun {
  if (!previous || NOUNS.length < 2) return pickRandomNoun();
  let next = pickRandomNoun();
  while (next.word === previous.word) {
    next = pickRandomNoun();
  }
  return next;
}
