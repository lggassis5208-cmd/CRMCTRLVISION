import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function cleanName(name: string): string {
  return name.trim().replace(/^"|"$/g, '').replace(/\r$/, '');
}

async function main() {
  console.log("🚀 Sincronizando planilhas e definindo prioridade máxima para Optometristas e Gabinetes no CRM...");

  // 1. Atualizar todos os leads de Optometria / Gabinetes para Prioridade "Altíssimo"
  const optoUpdated = await prisma.lead.updateMany({
    where: {
      OR: [
        { especialidade: "Optometria" },
        { tipoEstrutura: "Gabinete Optométrico" },
        { tipoEstrutura: "Ótica com Optometrista" }
      ]
    },
    data: {
      potencial: "Altíssimo"
    }
  });

  console.log(`✅ ${optoUpdated.count} leads de Optometria/Gabinetes foram promovidos para Prioridade "Altíssimo"!`);

  // 2. Importar registros de todas as planilhas
  const filesToProcess = [
    "c:\\Users\\Lucas\\Desktop\\ctrl-vision-limpo\\clinicas_oftalmologia_optometria_goiania.csv",
    "c:\\Users\\Lucas\\Desktop\\ctrl-vision-limpo\\prospeccao_ctrl_vision_goiania_expandida.csv",
    "c:\\Users\\Lucas\\Desktop\\prospeccao_ctrl_vision_2026-09-30.csv"
  ];

  let addedFromCsv = 0;

  for (const filePath of filesToProcess) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Arquivo não encontrado: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) continue;

    const header = lines[0];
    const isSemicolon = header.includes(';');

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = isSemicolon ? line.split(';') : line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      if (cols.length < 2) continue;

      let nome = "";
      let especialidade = "Oftalmologia";
      let tipo = "Clínica";
      let cidade = "Goiânia";
      let bairro = "";
      let fone = "";
      let nota = 4.5;
      let av = 50;

      if (filePath.includes("clinicas_oftalmologia_optometria_goiania.csv")) {
        nome = cleanName(cols[0] || "");
        especialidade = cleanName(cols[1] || "Oftalmologia");
        tipo = cleanName(cols[2] || "Clínica");
        nota = parseFloat(cols[3]) || 4.5;
        av = parseInt(cols[4]) || 50;
      } else if (filePath.includes("prospeccao_ctrl_vision_goiania_expandida.csv")) {
        nome = cleanName(cols[1] || "");
        especialidade = cleanName(cols[2] || "Oftalmologia");
        tipo = cleanName(cols[3] || "Clínica");
        cidade = cleanName(cols[4] || "Goiânia");
        bairro = cleanName(cols[5] || "");
        fone = cleanName(cols[6] || "");
        nota = parseFloat(cols[7]) || 4.5;
        av = parseInt(cols[8]) || 50;
      } else {
        // prospeccao_ctrl_vision_2026-09-30.csv
        nome = cleanName(cols[1] || "");
        tipo = cleanName(cols[2] || "Clínica");
        cidade = cleanName(cols[3] || "Goiânia");
        bairro = cleanName(cols[4] || "");
        fone = cleanName(cols[5] || "");
        especialidade = cleanName(cols[7] || "Oftalmologia");
        nota = parseFloat(cleanName(cols[8])) || 4.5;
        av = parseInt(cleanName(cols[9])) || 50;
      }

      if (!nome || nome.toLowerCase() === "nome" || nome.toLowerCase() === "id") continue;

      // Verificar se já existe no banco
      const existing = await prisma.lead.findFirst({
        where: {
          OR: [
            { nome: { contains: nome } },
            { nome: nome }
          ]
        }
      });

      if (!existing) {
        const isOpto = especialidade.includes("Optometria") || tipo.includes("Optometria") || tipo.includes("Ótica");
        const potencial = isOpto ? "Altíssimo" : "Alto";

        await prisma.lead.create({
          data: {
            nome: nome,
            tipoEstrutura: tipo.includes("Gabinete") ? "Gabinete Optométrico" : tipo.includes("Hospital") ? "Hospital" : tipo.includes("Ótica") ? "Ótica com Optometrista" : tipo.includes("Consultório") ? "Consultório Individual" : "Clínica",
            cidade: cidade.includes("Aparecida") ? "Aparecida de Goiânia" : cidade.includes("Anápolis") ? "Anápolis" : cidade.includes("Trindade") ? "Trindade" : cidade.includes("Senador") ? "Senador Canedo" : "Goiânia",
            bairro: bairro || "Centro",
            telefone: fone || "(62) 99999-0000",
            especialidade: isOpto ? "Optometria" : "Oftalmologia",
            notaGoogle: nota,
            avaliacoesGoogle: av,
            fonte: "Importação Planilhas CSV Desktop",
            potencial: potencial,
            justificativaPotencial: isOpto ? "Prioridade Máxima (Optometria - ICP Ideal CTRL Vision)" : "Clínica de Refração",
            estagio: "Novo",
            valorEstimado: 79.90,
            dataUltimoContato: new Date(),
            historicoEstagios: {
              create: [{ estagio: "Novo", entrouEm: new Date() }]
            }
          }
        });
        addedFromCsv++;
      }
    }
  }

  const finalTotal = await prisma.lead.count();
  const altissimoCount = await prisma.lead.count({ where: { potencial: "Altíssimo" } });

  console.log(`🎉 Processamento Concluído!`);
  console.log(`- Novos leads inseridos das planilhas: ${addedFromCsv}`);
  console.log(`- Total de leads no banco CRM: ${finalTotal}`);
  console.log(`- Total com Prioridade "Altíssimo": ${altissimoCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
