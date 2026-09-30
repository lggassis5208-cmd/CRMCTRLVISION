import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.lead.count();
  console.log(`TOTAL_LEADS_IN_DB: ${count}`);
}

main().finally(() => prisma.$disconnect());
