import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rawData = [
  { id: 1, nome: "Instituto de Olhos de Goiânia (IOG)", especialidade: "Oftalmologia", tipo: "Hospital Grande", cidade: "Goiânia", bairro: "Setor Oeste", fone: "(62) 3220-2500", nota: 3.0, av: 469, digital: "Possui Site Próprio", status: "Médio Potencial (Sistema legado corporativo)" },
  { id: 2, nome: "Dr. Lucas Pina - Catarata e Refrativa", especialidade: "Oftalmologia", tipo: "Consultório Individual", cidade: "Goiânia", bairro: "Setor Marista", fone: "(62) 99999-0001", nota: 5.0, av: 149, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Foco cirúrgico / atendimento direto)" },
  { id: 3, nome: "CBCO Hospital de Olhos", especialidade: "Oftalmologia", tipo: "Hospital Grande", cidade: "Goiânia", bairro: "Setor Bueno", fone: "(62) 3254-8000", nota: 4.8, av: 1037, digital: "Possui Site Próprio", status: "Médio Potencial (Alto volume de exames)" },
  { id: 4, nome: "Instituto Panamericano da Visão (IPVisão)", especialidade: "Oftalmologia", tipo: "Clínica Grande", cidade: "Goiânia", bairro: "Setor Marista", fone: "(62) 3096-8000", nota: 4.6, av: 3679, digital: "Possui Site Próprio", status: "Médio Potencial (Hospital-dia)" },
  { id: 5, nome: "Núcleo de Medicina Ocular", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Goiânia", bairro: "Setor Oeste", fone: "(62) 3212-4000", nota: 4.1, av: 109, digital: "Site Básico", status: "Alto Potencial (Vários médicos autônomos)" },
  { id: 6, nome: "Hospital de Olhos de Goiânia", especialidade: "Oftalmologia", tipo: "Hospital", cidade: "Goiânia", bairro: "Setor Oeste", fone: "(62) 3089-6400", nota: 3.2, av: 440, digital: "Possui Site Próprio", status: "Médio Potencial (Alto volume SUS/Convênios)" },
  { id: 7, nome: "VER Hospital de Olhos (Unidade Marista)", especialidade: "Oftalmologia", tipo: "Rede / Hospital", cidade: "Goiânia", bairro: "Setor Marista", fone: "(62) 3942-4242", nota: 4.1, av: 919, digital: "Possui Site Próprio", status: "Médio Potencial (Rede de unidades)" },
  { id: 8, nome: "Fundação Banco de Olhos de Goiás (FUG)", especialidade: "Oftalmologia", tipo: "Hospital Institucional", cidade: "Goiânia", bairro: "Vila Nova", fone: "(62) 3269-9900", nota: 3.6, av: 558, digital: "Possui Site Próprio", status: "Médio Potencial (Instituição filantrópica/SUS)" },
  { id: 9, nome: "Centro Médico Goiânia (Hapvida)", especialidade: "Oftalmologia", tipo: "Rede de Convênio", cidade: "Goiânia", bairro: "Setor Central", fone: "(62) 4002-3633", nota: 1.9, av: 630, digital: "Sistema Corporativo", status: "Baixo Potencial (Rede verticalizada Hapvida)" },
  { id: 10, nome: "Hospital da Visão", especialidade: "Oftalmologia", tipo: "Hospital Médio", cidade: "Goiânia", bairro: "Setor Oeste", fone: "(62) 3224-3000", nota: 3.2, av: 337, digital: "Sem Site Dedicado", status: "Alto Potencial (Gestão de recepção e prontuário)" },
  { id: 11, nome: "Clínica Eye Vision", especialidade: "Oftalmologia", tipo: "Clínica / Centro", cidade: "Goiânia", bairro: "Setor Central", fone: "(62) 3223-1010", nota: 4.9, av: 1856, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Altíssima reputação no Centro)" },
  { id: 12, nome: "Centro Integrado da Visão (CIV)", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Goiânia", bairro: "Setor Central", fone: "(62) 3229-2020", nota: 4.2, av: 210, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Foco em agendamento direto)" },
  { id: 13, nome: "Centro Oftalmológico San Charbel", especialidade: "Oftalmologia", tipo: "Galeria Médica", cidade: "Goiânia", bairro: "Setor Bueno", fone: "(62) 3281-5050", nota: 4.3, av: 100, digital: "Site Básico", status: "Alto Potencial (Consultórios individuais/Dr. Jamil)" },
  { id: 14, nome: "Clínica Olhar Perfeito", especialidade: "Oftalmologia", tipo: "Clínica / Centro", cidade: "Goiânia", bairro: "Setor Central", fone: "(62) 3524-3030", nota: 5.0, av: 359, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Nota 5.0 com 359 avaliações)" },
  { id: 15, nome: "Centro Oftalmológico de Goiânia", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Goiânia", bairro: "Setor Aeroporto", fone: "(62) 3225-0008", nota: 4.4, av: 180, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Localização tradicional)" },
  { id: 16, nome: "Clínica Ocularis (Unidade Bueno)", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Goiânia", bairro: "Setor Bueno", fone: "(62) 3251-4040", nota: 4.5, av: 230, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Consultórios de alta refração)" },
  { id: 17, nome: "Vistta Oftalmologia", especialidade: "Oftalmologia", tipo: "Clínica Médica", cidade: "Goiânia", bairro: "Setor Marista", fone: "(62) 3093-7000", nota: 4.7, av: 410, digital: "Possui Site Próprio", status: "Alto Potencial (Foco em cirurgias refrativas)" },
  { id: 18, nome: "Clínica Brasil Goiânia", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Goiânia", bairro: "Setor Sul", fone: "(62) 3545-4000", nota: 4.3, av: 320, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Prontuário e agendamento web)" },
  { id: 19, nome: "Dr. Leandro Costa de Araújo", especialidade: "Oftalmologia", tipo: "Consultório Individual", cidade: "Goiânia", bairro: "Setor Marista", fone: "(62) 99811-2020", nota: 4.9, av: 112, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Glaucoma e Catarata)" },
  { id: 20, nome: "Dr. João Victor Godinho", especialidade: "Oftalmologia", tipo: "Consultório Individual", cidade: "Goiânia", bairro: "Setor Bueno", fone: "(62) 99655-3030", nota: 5.0, av: 98, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Córnea e Cirurgia Refrativa)" },
  { id: 21, nome: "Dra. Gabriela Ventura Bariani Belem", especialidade: "Oftalmologia", tipo: "Consultório Individual", cidade: "Goiânia", bairro: "Setor Marista", fone: "(62) 98112-4040", nota: 5.0, av: 145, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Ceratocone e Refrativa)" },
  { id: 22, nome: "Consultório Oftalmológico Ed. Órion", especialidade: "Oftalmologia", tipo: "Consultório Privado", cidade: "Goiânia", bairro: "Setor Marista", fone: "(62) 3920-8080", nota: 4.8, av: 85, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Edifício médico de luxo)" },
  { id: 23, nome: "Consultório Dr. Jamil L. Filho", especialidade: "Oftalmologia", tipo: "Consultório Privado", cidade: "Goiânia", bairro: "Setor Bueno", fone: "(62) 3281-5051", nota: 4.9, av: 76, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Especialista em refração)" },
  { id: 24, nome: "Clínica Lumyna Oftalmologia", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Goiânia", bairro: "Setor Oeste", fone: "(62) 3091-9000", nota: 4.6, av: 190, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Atendimento particular)" },
  { id: 25, nome: "Clínica MedPrime Oftalmo", especialidade: "Oftalmologia", tipo: "Clínica Popular", cidade: "Goiânia", bairro: "Setor Central", fone: "(62) 3224-5555", nota: 4.2, av: 450, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Alto volume diário)" },
  { id: 26, nome: "Clínica Gedda (Oftalmologia)", especialidade: "Oftalmologia", tipo: "Clínica Popular", cidade: "Goiânia", bairro: "Setor Jardim América", fone: "(62) 3251-0000", nota: 4.1, av: 520, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Consultas rápidas e refração)" },
  { id: 27, nome: "Centro Primário da Visão", especialidade: "Optometria", tipo: "Consultório Optométrico", cidade: "Goiânia", bairro: "Setor Central", fone: "(62) 98450-1010", nota: 4.9, av: 34, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Exame optométrico completo)" },
  { id: 28, nome: "CEALC Optometria & Terapia Visual", especialidade: "Optometria", tipo: "Centro de Optometria", cidade: "Goiânia", bairro: "Setor Bueno", fone: "(62) 98122-2020", nota: 5.0, av: 358, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Referência em lentes e terapia)" },
  { id: 29, nome: "OCLOS Optometria e Lentes", especialidade: "Optometria", tipo: "Loja + Optometrista", cidade: "Goiânia", bairro: "Setor Central", fone: "(62) 99133-3030", nota: 5.0, av: 29, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Atendimento Opt. Leandro)" },
  { id: 30, nome: "Gabinete Optométrico Central", especialidade: "Optometria", tipo: "Consultório Privado", cidade: "Goiânia", bairro: "Setor Central", fone: "(62) 98400-4040", nota: 4.8, av: 65, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Refração direta e lentes)" },
  { id: 31, nome: "Centro Optométrico Campinas", especialidade: "Optometria", tipo: "Consultório de Optometria", cidade: "Goiânia", bairro: "Setor Campinas", fone: "(62) 99255-5050", nota: 4.7, av: 88, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Região comercial de óticas)" },
  { id: 32, nome: "Visão Técnica Optometria", especialidade: "Optometria", tipo: "Consultório Privado", cidade: "Goiânia", bairro: "Setor Pedro Ludovico", fone: "(62) 98144-6060", nota: 5.0, av: 42, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Atendimento especializado)" },
  { id: 33, nome: "Gabinete Optométrico 24 de Outubro", especialidade: "Optometria", tipo: "Consultório de Optometria", cidade: "Goiânia", bairro: "Setor Campinas", fone: "(62) 99366-7070", nota: 4.9, av: 110, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Foco em contatologia)" },
  { id: 34, nome: "Ótica & Optometria Visão Real", especialidade: "Optometria", tipo: "Ótica + Consultório", cidade: "Goiânia", bairro: "Setor Vila Nova", fone: "(62) 98277-8080", nota: 4.8, av: 54, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Exames e prescrição visual)" },
  { id: 35, nome: "Hospital de Olhos Aparecida (HOA)", especialidade: "Oftalmologia", tipo: "Hospital", cidade: "Aparecida de Goiânia", bairro: "Centro", fone: "(62) 3097-8100", nota: 4.3, av: 840, digital: "Possui Site Próprio", status: "Alto Potencial (Hospital de referência local)" },
  { id: 36, nome: "Clínica Ocularis (Vila São Tomaz)", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Aparecida de Goiânia", bairro: "Vila São Tomaz", fone: "(62) 3519-9695", nota: 4.5, av: 310, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Atendimento clínico regional)" },
  { id: 37, nome: "Dra. Christiane R. C. Candido", especialidade: "Oftalmologia", tipo: "Consultório Individual", cidade: "Aparecida de Goiânia", bairro: "Centro", fone: "(62) 99844-9090", nota: 4.9, av: 88, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Catarata e Cirurgia Refrativa)" },
  { id: 38, nome: "Atend Já Aparecida (Oftalmologia)", especialidade: "Oftalmologia", tipo: "Clínica Popular", cidade: "Aparecida de Goiânia", bairro: "Garavelo", fone: "(62) 3288-1000", nota: 4.2, av: 490, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Alto fluxo no Garavelo)" },
  { id: 39, nome: "Gabinete Optométrico Garavelo", especialidade: "Optometria", tipo: "Consultório Optométrico", cidade: "Aparecida de Goiânia", bairro: "Setor Garavelo", fone: "(62) 99188-1122", nota: 4.9, av: 73, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Grande polo de óticas)" },
  { id: 40, nome: "Centro Optométrico Cidade Livre", especialidade: "Optometria", tipo: "Consultório Optométrico", cidade: "Aparecida de Goiânia", bairro: "Cidade Livre", fone: "(62) 98499-2233", nota: 4.8, av: 39, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Consulta e refração)" },
  { id: 41, nome: "Hospital Doma (Doma Oftalmologia)", especialidade: "Oftalmologia", tipo: "Hospital de Olhos", cidade: "Anápolis", bairro: "Jundiaí", fone: "(62) 98591-4381", nota: 4.7, av: 620, digital: "Possui Site Próprio", status: "Alto Potencial (Hospital referência em Anápolis)" },
  { id: 42, nome: "Clínica de Olhos de Anápolis", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Anápolis", bairro: "Centro", fone: "(62) 3324-6281", nota: 4.4, av: 290, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Pioneira no centro de Anápolis)" },
  { id: 43, nome: "Hospital de Olhos Camargo Zambrin", especialidade: "Oftalmologia", tipo: "Hospital de Olhos", cidade: "Anápolis", bairro: "Jundiaí", fone: "(62) 3310-7000", nota: 4.6, av: 480, digital: "Possui Site Próprio", status: "Alto Potencial (Dr. Marco Zambrin / Glaucoma)" },
  { id: 44, nome: "Clínica de Olhos Jaiara", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Anápolis", bairro: "Vila Jaiara", fone: "(62) 3318-1200", nota: 4.5, av: 195, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Grande bairro comercial)" },
  { id: 45, nome: "Dr. Raphael Alexandre Hannum", especialidade: "Oftalmologia", tipo: "Consultório Individual", cidade: "Anápolis", bairro: "Jundiaí", fone: "(62) 99922-3344", nota: 5.0, av: 130, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Cirurgia refrativa e córnea)" },
  { id: 46, nome: "Gabinete Optométrico Jundiaí", especialidade: "Optometria", tipo: "Consultório Optométrico", cidade: "Anápolis", bairro: "Jundiaí", fone: "(62) 99155-4455", nota: 5.0, av: 64, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Optometria avançada)" },
  { id: 47, nome: "Centro Optométrico Anápolis", especialidade: "Optometria", tipo: "Consultório Optométrico", cidade: "Anápolis", bairro: "Centro", fone: "(62) 98433-5566", nota: 4.9, av: 82, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Exame de vista e refração)" },
  { id: 48, nome: "Clínica Olha! (Senador Canedo)", especialidade: "Oftalmologia", tipo: "Clínica de Olhos", cidade: "Senador Canedo", bairro: "Centro", fone: "(62) 3532-4040", nota: 4.6, av: 175, digital: "Possui Site Próprio", status: "Alto Potencial (Estrutura moderna no município)" },
  { id: 49, nome: "HF Visão (Senador Canedo)", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Senador Canedo", bairro: "Jardim das Oliveiras", fone: "(62) 3512-9090", nota: 4.3, av: 110, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Atendimento ambulatorial)" },
  { id: 50, nome: "Instituto de Medicina Canedo (Oftalmo)", especialidade: "Oftalmologia", tipo: "Centro Médico", cidade: "Senador Canedo", bairro: "Centro", fone: "(62) 3532-1000", nota: 4.1, av: 240, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Consultas e exames de vista)" },
  { id: 51, nome: "Centro Clínico Manoel da Costa", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Trindade", bairro: "Centro", fone: "(62) 3505-2020", nota: 4.4, av: 210, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Tradição em Trindade)" },
  { id: 52, nome: "Clínica de Olhos Nova Visão", especialidade: "Oftalmologia", tipo: "Clínica Média", cidade: "Trindade", bairro: "Centro", fone: "(62) 3505-8888", nota: 4.5, av: 145, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Consultas e refração)" },
  { id: 53, nome: "Gabinete Optométrico Trindade", especialidade: "Optometria", tipo: "Consultório Optométrico", cidade: "Trindade", bairro: "Vila Pai Eterno", fone: "(62) 99244-6677", nota: 4.9, av: 51, digital: "Sem Site Próprio", status: "Altíssimo Potencial (Atendimento direto ao público)" }
];

function parseStatus(rawStatus: string): { potencial: string; justificativa: string } {
  if (rawStatus.includes('Altíssimo')) {
    const match = rawStatus.match(/Altíssimo Potencial \((.*)\)/);
    return { potencial: 'Altíssimo', justificativa: match ? match[1] : rawStatus };
  }
  if (rawStatus.includes('Alto')) {
    const match = rawStatus.match(/Alto Potencial \((.*)\)/);
    return { potencial: 'Alto', justificativa: match ? match[1] : rawStatus };
  }
  if (rawStatus.includes('Médio')) {
    const match = rawStatus.match(/Médio Potencial \((.*)\)/);
    return { potencial: 'Médio', justificativa: match ? match[1] : rawStatus };
  }
  if (rawStatus.includes('Baixo')) {
    const match = rawStatus.match(/Baixo Potencial \((.*)\)/);
    return { potencial: 'Baixo', justificativa: match ? match[1] : rawStatus };
  }
  return { potencial: 'Médio', justificativa: rawStatus };
}

function mapTipo(rawTipo: string): string {
  if (rawTipo.includes('Optométrico') || rawTipo.includes('Optometria')) return 'Gabinete Optométrico';
  if (rawTipo.includes('Consultório')) return 'Consultório Individual';
  if (rawTipo.includes('Ótica')) return 'Ótica com Optometrista';
  if (rawTipo.includes('Hospital')) return 'Hospital';
  if (rawTipo.includes('Clínica') || rawTipo.includes('Centro')) return 'Clínica';
  return 'Outro';
}

function mapCidade(rawCidade: string): string {
  if (rawCidade.includes('Goiânia')) return 'Goiânia';
  if (rawCidade.includes('Aparecida')) return 'Aparecida de Goiânia';
  if (rawCidade.includes('Anápolis')) return 'Anápolis';
  if (rawCidade.includes('Trindade')) return 'Trindade';
  if (rawCidade.includes('Senador')) return 'Senador Canedo';
  return 'Outro';
}

async function main() {
  console.log('🚀 Importando os 53 leads para o banco SQLite do CRM...');

  let insertedCount = 0;
  for (const item of rawData) {
    const { potencial, justificativa } = parseStatus(item.status);
    const tipo = mapTipo(item.tipo);
    const cidade = mapCidade(item.cidade);

    const lead = await prisma.lead.create({
      data: {
        nome: item.nome,
        tipoEstrutura: tipo,
        cidade: cidade,
        bairro: item.bairro,
        telefone: item.fone,
        especialidade: item.especialidade === 'Optometria' ? 'Optometria' : 'Oftalmologia',
        notaGoogle: item.nota,
        avaliacoesGoogle: item.av,
        fonte: 'Google Maps',
        potencial: potencial,
        justificativaPotencial: justificativa,
        estagio: 'Novo',
        valorEstimado: 79.90,
        dataUltimoContato: new Date(),
        historicoEstagios: {
          create: [
            {
              estagio: 'Novo',
              entrouEm: new Date(),
              saiuEm: null
            }
          ]
        }
      }
    });
    insertedCount++;
  }

  console.log(`✅ ${insertedCount} leads foram importados com sucesso!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
