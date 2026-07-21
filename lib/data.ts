const CDN = "https://ozpuzzle.com/cdn/shop/files";

export const SHOP_URL = "https://ozpuzzle.com";
export const INSTAGRAM_URL = "https://www.instagram.com/ozpuzzle/";

export type Collection = {
  slug: string;
  title: string;
  tagline: string;
  image: string;
};

export const collections: Collection[] = [
  {
    slug: "customized-puzzle",
    title: "Customized Puzzle",
    tagline: "Your photo, hand-cut in wood",
    image: `${CDN}/WoodenPuzzle8.jpg?v=1778574686&width=1100`,
  },
  {
    slug: "oz-puzzle",
    title: "OZ Puzzle",
    tagline: "The originals that started it all",
    image: `${CDN}/Untitleddesign_2.png?v=1730881483&width=1100`,
  },
  {
    slug: "dollhouse",
    title: "OZy Dream DollHouse",
    tagline: "Build a little world of your own",
    image: `${CDN}/LargeDollHouse.jpg?v=1776721253&width=1100`,
  },
  {
    slug: "guest-book-puzzle",
    title: "Guest Book Puzzle",
    tagline: "Every guest signs a piece",
    image: `${CDN}/The_Guest_Book.jpg?v=1782209811&width=1100`,
  },
  {
    slug: "pieces-of-anywhere",
    title: "Pieces of Anywhere",
    tagline: "One puzzle. One random photo. Endless curiosity",
    image: `${CDN}/The_Kiss1.jpg?v=1782209086&width=1100`,
  },
  {
    slug: "islamic-puzzle",
    title: "Islamic Puzzle",
    tagline: "Geometry, calligraphy, patience",
    image: `${CDN}/BabElMasjad_1.jpg?v=1782211626&width=1100`,
  },
];

export type Product = {
  slug: string;
  title: string;
  price: string;
  compareAt?: string;
  fromPrice?: boolean;
  image: string;
};

export const products: Product[] = [
  {
    slug: "pink-world",
    title: "Pink World",
    price: "LE 550",
    compareAt: "LE 750",
    image: `${CDN}/Untitleddesign_2.png?v=1730881483&width=900`,
  },
  {
    slug: "moon",
    title: "Moon",
    price: "LE 500",
    compareAt: "LE 700",
    image: `${CDN}/Moon_Puzzle.png?v=1730883414&width=900`,
  },
  {
    slug: "dino-world",
    title: "Dino World",
    price: "LE 490",
    compareAt: "LE 600",
    image: `${CDN}/Dino_Puzzle_Pic.png?v=1730882654&width=900`,
  },
  {
    slug: "candy-party",
    title: "Candy Party",
    price: "LE 500",
    fromPrice: true,
    image: `${CDN}/C1.jpg?v=1743765313&width=900`,
  },
  {
    slug: "springz",
    title: "Springz",
    price: "LE 500",
    fromPrice: true,
    image: `${CDN}/Springz4.jpg?v=1746104319&width=900`,
  },
];

/** Photography used by the hero jigsaw board (cycled piece-by-piece). */
export const heroImages = [
  { src: `${CDN}/The_Kiss1.jpg?v=1782209086&width=1500`, label: "Pieces of Anywhere" },
  { src: `${CDN}/BabElMasjad_1.jpg?v=1782211626&width=1500`, label: "Islamic Puzzle" },
  { src: `${CDN}/WoodenPuzzle8.jpg?v=1778574686&width=1500`, label: "Customized Puzzle" },
  { src: `${CDN}/The_Guest_Book.jpg?v=1782209811&width=1500`, label: "Guest Book Puzzle" },
];

/** Cards for the hover-assemble puzzle gallery. */
export const galleryItems = [
  { title: "The Kiss", note: "Pieces of Anywhere", image: `${CDN}/The_Kiss1.jpg?v=1782209086&width=900` },
  { title: "Bab El Masjad", note: "Islamic Puzzle", image: `${CDN}/BabElMasjad_1.jpg?v=1782211626&width=900` },
  { title: "Dream DollHouse", note: "OZy DollHouse", image: `${CDN}/LargeDollHouse.jpg?v=1776721253&width=900` },
  { title: "Candy Party", note: "OZ Puzzle", image: `${CDN}/C1.jpg?v=1743765313&width=900` },
  { title: "Springz", note: "OZ Puzzle", image: `${CDN}/Springz4.jpg?v=1746104319&width=900` },
  { title: "Moon", note: "OZ Puzzle", image: `${CDN}/Moon_Puzzle.png?v=1730883414&width=900` },
];
