import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const beers = [
  {
    name: "Macá Golden",
    style: "Golden Ale",
    abv: 4.8,
    ibu: 18,
    description: "Rubia liviana y fácil de tomar, notas a miel y cereal.",
    imageUrl: "/beers/golden.png",
    price: 3200,
    stock: 24,
  },
  {
    name: "Macá IPA",
    style: "IPA",
    abv: 6.5,
    ibu: 55,
    description: "Amarga y aromática, con lúpulos cítricos y resinosos.",
    imageUrl: "/beers/ipa.png",
    price: 3600,
    stock: 18,
  },
  {
    name: "Macá Stout",
    style: "Stout",
    abv: 5.5,
    ibu: 32,
    description: "Negra cremosa, notas a café y chocolate torrado.",
    imageUrl: "/beers/brown.png",
    price: 3600,
    stock: 12,
  },
  {
    name: "Macá Session Lager",
    style: "Lager",
    abv: 4.2,
    ibu: 14,
    description: "Cerveza de sesión, fresca y con final seco.",
    imageUrl: "/beers/sessionlager.png",
    price: 3000,
    stock: 0,
  },
];

async function main() {
  for (const beer of beers) {
    await prisma.beer.upsert({
      where: { name: beer.name },
      update: beer,
      create: beer,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
