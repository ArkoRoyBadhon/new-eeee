export const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Premium noise cancelling wireless headphones",
    price: 199.99,
    image: "/img/img1.webp",
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor",
    price: 149.99,
    image: "/img/img1.webp",
  },
  {
    id: 3,
    name: "Laptop Stand",
    description: "Ergonomic aluminum laptop stand",
    price: 49.99,
    image: "/img/img1.webp",
  },
  {
    id: 4,
    name: "Wireless Charger",
    description: "Fast charging wireless pad for smartphones",
    price: 29.99,
    image: "/img/img1.webp",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    description: "Portable waterproof bluetooth speaker",
    price: 79.99,
    image: "/img/img1.webp",
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical gaming keyboard",
    price: 129.99,
    image: "/img/img1.webp",
  },
  {
    id: 7,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    price: 39.99,
    image: "/img/img1.webp",
  },
];

export const recommendedProducts = [
  {
    id: "1",
    name: "Wireless Earbuds",
    price: 129.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Headphone Stand",
    price: 39.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Replacement Ear Pads",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Bluetooth Adapter",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Premium Audio Cable",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
  },
];

export const product = {
  id: "slug",
  name: "Premium Wireless Noise-Cancelling Headphones",
  description:
    "Experience immersive sound with our premium wireless headphones. Featuring advanced noise-cancelling technology, these headphones deliver crystal-clear audio quality and exceptional comfort for extended listening sessions.",
  price: 249.99,
  images: [
    "/img/img1.webp",
    "/img/img1.webp",
    "/img/img1.webp",
    "/img/img1.webp",
    "/img/img1.webp",
  ],
  attributes: [
    { name: "Brand", value: "AudioTech" },
    { name: "Model", value: "AT-500NC" },
    { name: "Color", value: "Matte Black" },
    { name: "Battery Life", value: "30 hours" },
    { name: "Connectivity", value: "Bluetooth 5.0" },
    { name: "Weight", value: "250g" },
  ],
  supplier: {
    name: "AudioTech Official Store",
    rating: 4.8,
    responseRate: "98%",
    responseTime: "within 24 hours",
  },
};

export const sampleProducts = [
  {
    _id: "1",
    title: "Premium Headphones",
    slug: "premium-headphones",
    // sku: "HDX-100",
    barcode: "8901234567890",
    modelNumber: "HDX100",
    description: "High-quality noise cancelling headphones with premium sound",
    stock: 45,
    sales: 120,
    prices: {
      originalPrice: 199.99,
      price: 149.99,
      discount: 25,
    },
    status: "show",
    isCombination: false,
    keyAttributes: {},
    image: ["/placeholder.svg?height=100&width=100"],
    category: "electronics",
    categories: ["electronics", "audio"],
  },
  {
    _id: "2",
    title: "Wireless Keyboard",
    slug: "wireless-keyboard",
    // sku: "KB-200",
    barcode: "8901234567891",
    modelNumber: "KB200",
    description: "Ergonomic wireless keyboard with backlit keys",
    stock: 30,
    sales: 75,
    prices: {
      originalPrice: 89.99,
      price: 69.99,
      discount: 22,
    },
    status: "show",
    isCombination: false,
    keyAttributes: {},
    image: ["/placeholder.svg?height=100&width=100"],
    category: "electronics",
    categories: ["electronics", "computer-accessories"],
  },
  {
    _id: "3",
    title: "Smart Watch",
    slug: "smart-watch",
    // sku: "SW-300",
    barcode: "8901234567892",
    modelNumber: "SW300",
    description: "Fitness tracker and smart watch with heart rate monitor",
    stock: 15,
    sales: 200,
    prices: {
      originalPrice: 299.99,
      price: 249.99,
      discount: 17,
    },
    status: "show",
    isCombination: true,
    keyAttributes: { color: "multiple", size: "one-size" },
    image: ["/placeholder.svg?height=100&width=100"],
    category: "wearables",
    categories: ["electronics", "wearables"],
  },
];
