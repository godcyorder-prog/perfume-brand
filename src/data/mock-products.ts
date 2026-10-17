import type { Product } from "@/types/product";

export const mockProducts: Product[] = [
  { productId: "baby-cloud", name: "Little Cloud", price: 1299, image: "/products/baby-cloud.svg", category: "baby", origin: "korea", note: "Soft cotton · pear · musk", stock: 10 },
  { productId: "baby-moon", name: "Moonlight Baby", price: 1499, image: "/products/baby-moon.svg", category: "baby", origin: "india", note: "Chamomile · vanilla · skin musk", stock: 10 },
  { productId: "rose-noir", name: "Rose No. 08", price: 2890, image: "/products/rose-noir.svg", category: "women", origin: "india", note: "Rose · saffron · amber", stock: 10 },
  { productId: "seoul-blossom", name: "Seoul Blossom", price: 3190, image: "/products/seoul-blossom.svg", category: "women", origin: "korea", note: "Peony · plum · white tea", stock: 10 },
  { productId: "golden-hour", name: "Golden Hour", price: 3490, image: "/products/golden-hour.svg", category: "women", origin: "usa", note: "Neroli · jasmine · sandalwood", stock: 10 },
  { productId: "blue-hour", name: "Blue Hour", price: 3290, image: "/products/blue-hour.svg", category: "men", origin: "usa", note: "Bergamot · cedar · vetiver", stock: 10 },
  { productId: "saffron-woods", name: "Saffron Woods", price: 3690, image: "/products/saffron-woods.svg", category: "men", origin: "india", note: "Saffron · leather · oud", stock: 10 },
  { productId: "tea-house", name: "Quiet Tea House", price: 2990, image: "/products/tea-house.svg", category: "men", origin: "china", note: "Green tea · incense · cypress", stock: 10 },
];
