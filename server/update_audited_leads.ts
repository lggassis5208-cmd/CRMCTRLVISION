import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const auditedUpdates: Record<string, { fone?: string; notes?: string }> = {
  "Instituto de Olhos de Goiânia (IOG)": { fone: "(62) 3220-2500" },
  "Dr. Lucas Pina - Catarata e Refrativa": { fone: "(62) 99685-2030" },
  "CBCO Hospital de Olhos": { fone: "(62) 3252-5566" },
  "Instituto Panamericano da Visão (IPVisão)": { fone: "(62) 99993-8123" },
  "Núcleo de Medicina Ocular": { fone: "(62) 98191-4410" },
  "Hospital de Olhos de Goiânia": { fone: "(62) 3089-6400" },
  "VER Hospital de Olhos (Unidade Marista)": { fone: "(62) 99944-5721" },
  "Fundação Banco de Olhos de Goiás (FUG)": { fone: "(62) 99513-4523" },
  "Hospital da Visão": { fone: "(62) 98259-0800" },
  "Clínica Eye Vision": { fone: "(62) 3223-1010" },
  "Centro Oftalmológico San Charbel": { fone: "(62) 3214-1012" },
  "Consultório Dr. Jamil L. Filho": { fone: "(62) 99812-5050" },
  "Vistta Oftalmologia": { fone: "(62) 99912-4004" },
  "Dr. Leandro Costa de Araújo": { fone: "(62) 99927-1001" },
  "Dr. João Victor Godinho": { fone: "(62) 99816-9720" },
  "Dra. Gabriela Ventura Bariani Belem": { fone: "(62) 99934-5510" },
  "Consultório Oftalmológico Ed. Órion": { fone: "(62) 99968-8935" },
  "Clínica Gedda (Oftalmologia)": { fone: "(62) 99825-6655" },
  "Hospital de Olhos Aparecida (HOA)": { fone: "(62) 3097-8100" },
  "Hospital Doma (Doma Oftalmologia)": { fone: "(62) 98591-4381" },
  "Clínica de Olhos de Anápolis": { fone: "(62) 3310-5600" },
  "Clínica Olha! (Senador Canedo)": { fone: "(62) 99830-9902" }
};

async function main() {
  console.log("🔄 Atualizando leads no banco SQLite com dados auditados do Google...");

  for (const [nomeLead, data] of Object.entries(auditedUpdates)) {
    const lead = await prisma.lead.findFirst({
      where: { nome: nomeLead }
    });

    if (lead) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          telefone: data.fone || lead.telefone
        }
      });
      console.log(`✅ Atualizado: ${nomeLead} -> ${data.fone}`);
    }
  }

  console.log("🎉 Todos os leads aplicáveis foram atualizados no banco de dados!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
