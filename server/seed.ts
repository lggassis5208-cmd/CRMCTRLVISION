import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Semeando banco de dados com leads (15+ leads em coluna para teste de scroll)...');

  // Clean existing example leads if any
  await prisma.lead.deleteMany({
    where: {
      nome: {
        startsWith: 'EXEMPLO —'
      }
    }
  });

  // Clean existing message templates
  await prisma.modeloMensagem.deleteMany({});

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  // 1. Core Example Leads with full interaction history
  const lead1 = await prisma.lead.create({
    data: {
      nome: 'EXEMPLO — Consultório Dra. Juliana (Optometria)',
      tipoEstrutura: 'Consultório Individual',
      cidade: 'Goiânia',
      bairro: 'Setor Bueno',
      telefone: '62998877665',
      instagram: '@dra.juliana_optometria',
      especialidade: 'Optometria',
      notaGoogle: 4.9,
      avaliacoesGoogle: 34,
      fonte: 'Instagram',
      potencial: 'Altíssimo',
      justificativaPotencial: 'Consultório de alto padrão no Bueno, interessada em anamnese digital rápida',
      estagio: 'Contatado',
      valorEstimado: 79.90,
      dataUltimoContato: yesterday,
      dataProximoFollowUp: today,
      criadoEm: fiveDaysAgo,
      interacoes: {
        create: [
          {
            canal: 'WhatsApp',
            resumo: 'Apresentado o CTRL Vision via áudio no WhatsApp. Respondeu demonstrando interesse em migrar do papel para prontuário digital.',
            proximaAcao: 'Enviar vídeo curto de 1 minuto mostrando a tela de anamnese.',
            data: yesterday
          }
        ]
      },
      historicoEstagios: {
        create: [
          {
            estagio: 'Novo',
            entrouEm: fiveDaysAgo,
            saiuEm: threeDaysAgo
          },
          {
            estagio: 'Contatado',
            entrouEm: threeDaysAgo,
            saiuEm: null
          }
        ]
      }
    }
  });

  const lead2 = await prisma.lead.create({
    data: {
      nome: 'EXEMPLO — Ótica & Gabinete Visão Real',
      tipoEstrutura: 'Ótica com Optometrista',
      cidade: 'Aparecida de Goiânia',
      bairro: 'Centro',
      telefone: '62981122334',
      instagram: '@otica_visaoreal',
      especialidade: 'Optometria',
      notaGoogle: 4.7,
      avaliacoesGoogle: 82,
      fonte: 'Google Maps',
      potencial: 'Alto',
      justificativaPotencial: '2 unidades com optometrista residente diariamente',
      estagio: 'Teste Agendado',
      valorEstimado: 149.90,
      dataUltimoContato: today,
      dataProximoFollowUp: tomorrow,
      criadoEm: fiveDaysAgo,
      interacoes: {
        create: [
          {
            canal: 'Ligação',
            resumo: 'Conversado com o responsável técnico Marcos. Agendado teste prático do sistema para amanhã às 14:00.',
            proximaAcao: 'Enviar link de acesso ao ambiente de teste por WhatsApp.',
            data: today
          }
        ]
      },
      historicoEstagios: {
        create: [
          {
            estagio: 'Novo',
            entrouEm: fiveDaysAgo,
            saiuEm: threeDaysAgo
          },
          {
            estagio: 'Contatado',
            entrouEm: threeDaysAgo,
            saiuEm: yesterday
          },
          {
            estagio: 'Respondeu',
            entrouEm: yesterday,
            saiuEm: today
          },
          {
            estagio: 'Teste Agendado',
            entrouEm: today,
            saiuEm: null
          }
        ]
      }
    }
  });

  // 2. Generate 15 additional sample leads in "Novo" column to test 15+ scroll capacity
  const bairrosGoiania = ['Setor Marista', 'Setor Oeste', 'Jardim Goiás', 'Setor Universitário', 'Campinas', 'Setor Sul'];
  
  for (let i = 1; i <= 15; i++) {
    const bairro = bairrosGoiania[i % bairrosGoiania.length];
    await prisma.lead.create({
      data: {
        nome: `EXEMPLO — Gabinete Optométrico ${i} (${bairro})`,
        tipoEstrutura: i % 2 === 0 ? 'Consultório Individual' : 'Gabinete Optométrico',
        cidade: 'Goiânia',
        bairro,
        telefone: `6299100${i.toString().padStart(4, '0')}`,
        instagram: `@optometria_${bairro.toLowerCase().replace(/\s+/g, '')}_${i}`,
        especialidade: 'Optometria',
        notaGoogle: 4.5 + (i % 5) * 0.1,
        avaliacoesGoogle: 10 + i * 4,
        fonte: 'Google Maps',
        potencial: i % 3 === 0 ? 'Altíssimo' : i % 2 === 0 ? 'Alto' : 'Médio',
        justificativaPotencial: `Importado via prospecção do bairro ${bairro}`,
        estagio: 'Novo',
        valorEstimado: 79.90,
        dataUltimoContato: threeDaysAgo,
        criadoEm: threeDaysAgo,
        historicoEstagios: {
          create: [
            {
              estagio: 'Novo',
              entrouEm: threeDaysAgo,
              saiuEm: null
            }
          ]
        }
      }
    });
  }

  // Seed Message Templates
  const templates = [
    {
      nome: 'Primeiro Contato - Abordagem Geral',
      canal: 'WhatsApp',
      categoria: 'Primeiro Contato',
      texto: 'Oi, {nome}, tudo bem? Vi seu trabalho como optometrista aqui no Instagram e fiquei curioso: você tem consultório próprio? Se tiver, como você controla agenda e fichas dos pacientes hoje?'
    },
    {
      nome: 'Primeiro Contato - Apresentação CTRL Vision',
      canal: 'WhatsApp',
      categoria: 'Primeiro Contato',
      texto: 'Oi, {nome}, tudo bem? Sou o Lucas, criador do CTRL Vision, um sistema feito por optometrista para optometrista: agenda, ficha clínica configurável, fila de espera com painel de TV e documentos prontos. Posso te mandar um teste grátis?'
    },
    {
      nome: 'Objeção - Já tem sistema',
      canal: 'WhatsApp',
      categoria: 'Resposta a Objeção',
      texto: 'Que bom, {nome}! Não quero te fazer trocar o que já funciona. Só fico curioso: e a parte do exame em si, como refração e receita, fica registrada onde?'
    },
    {
      nome: 'Objeção - Sem tempo agora',
      canal: 'WhatsApp',
      categoria: 'Resposta a Objeção',
      texto: 'Entendi, {nome}! Se um dia quiser dar uma olhada, te libero um teste grátis sem compromisso.'
    },
    {
      nome: 'Follow-up de Acompanhamento',
      canal: 'WhatsApp',
      categoria: 'Follow-up',
      texto: 'Oi, {nome}! Passando para saber se conseguiu ver aquela mensagem sobre o CTRL Vision. Ficou alguma dúvida?'
    },
    {
      nome: 'Fechamento / Agradecimento',
      canal: 'WhatsApp',
      categoria: 'Fechamento',
      texto: '{nome}, muito obrigado pelo tempo! Fico à disposição se quiser testar quando fizer sentido para você.'
    }
  ];

  for (const t of templates) {
    await prisma.modeloMensagem.create({ data: t });
  }

  console.log('✅ Seeds atualizados com sucesso!');
  console.log(`- 17 Leads de exemplo criados (15 na coluna 'Novo' para teste de scroll)`);
  console.log(`- 6 Modelos de mensagem cadastrados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
