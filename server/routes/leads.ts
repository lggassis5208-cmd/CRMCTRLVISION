import { Router } from 'express';
import { prisma } from '../db.js';

export const leadsRouter = Router();

function validatePhoneDDD(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

function cleanInstagram(handle?: string | null): string | null {
  if (!handle || !handle.trim()) return null;
  let cleaned = handle.trim();
  if (cleaned.startsWith('@')) return cleaned;
  if (cleaned.includes('instagram.com/')) {
    const parts = cleaned.split('instagram.com/')[1].split('/')[0].split('?')[0];
    return `@${parts}`;
  }
  return `@${cleaned}`;
}

export function parseStatusComercial(rawStatus?: string | null): { potencial: string; justificativa: string | null } {
  if (!rawStatus || !rawStatus.trim()) {
    return { potencial: 'Médio', justificativa: null };
  }

  const trimmed = rawStatus.trim();
  const match = trimmed.match(/^([^(]+)(?:\((.*)\))?$/);

  let potencial = 'Médio';
  let justificativa: string | null = null;

  if (match) {
    const rawPot = match[1].trim();
    if (['Altíssimo', 'Alto', 'Médio', 'Baixo'].includes(rawPot)) {
      potencial = rawPot;
    } else if (rawPot.toLowerCase().includes('altiss') || rawPot.toLowerCase().includes('muito alto')) {
      potencial = 'Altíssimo';
    } else if (rawPot.toLowerCase().includes('alto')) {
      potencial = 'Alto';
    } else if (rawPot.toLowerCase().includes('baixo')) {
      potencial = 'Baixo';
    }

    if (match[2]) {
      justificativa = match[2].trim();
    }
  }

  return { potencial, justificativa };
}

// Helper to record stage transitions in HistoricoEstagio
async function recordStageTransition(leadId: string, newStage: string) {
  const now = new Date();

  // Close any active open stage entry
  const activeHistory = await prisma.historicoEstagio.findFirst({
    where: {
      leadId,
      saiuEm: null
    }
  });

  if (activeHistory) {
    if (activeHistory.estagio === newStage) {
      // Stage hasn't changed
      return;
    }
    await prisma.historicoEstagio.update({
      where: { id: activeHistory.id },
      data: { saiuEm: now }
    });
  }

  // Create new active stage entry
  await prisma.historicoEstagio.create({
    data: {
      leadId,
      estagio: newStage,
      entrouEm: now,
      saiuEm: null
    }
  });
}

// GET /api/leads
leadsRouter.get('/', async (req, res) => {
  try {
    const { cidade, especialidade, potencial, estagio, fonte, search } = req.query;

    const where: any = {};

    if (cidade && cidade !== 'todas' && cidade !== 'Todas') {
      where.cidade = String(cidade);
    }

    if (especialidade && especialidade !== 'todas' && especialidade !== 'Todas') {
      where.especialidade = String(especialidade);
    }

    if (potencial && potencial !== 'todos' && potencial !== 'Todos') {
      where.potencial = String(potencial);
    }

    if (estagio && estagio !== 'todos' && estagio !== 'Todos') {
      where.estagio = String(estagio);
    }

    if (fonte && fonte !== 'todas' && fonte !== 'Todas') {
      where.fonte = String(fonte);
    }

    if (search && String(search).trim() !== '') {
      const q = String(search).trim();
      where.OR = [
        { nome: { contains: q } },
        { telefone: { contains: q } },
        { instagram: { contains: q } },
        { bairro: { contains: q } }
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        interacoes: {
          orderBy: { data: 'desc' }
        },
        historicoEstagios: {
          orderBy: { entrouEm: 'desc' }
        }
      },
      orderBy: { dataUltimoContato: 'desc' }
    });

    res.json(leads);
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

// GET /api/leads/metrics - dashboard summary
leadsRouter.get('/metrics', async (req, res) => {
  try {
    const allLeads = await prisma.lead.findMany({
      select: {
        id: true,
        estagio: true,
        valorEstimado: true,
        dataProximoFollowUp: true
      }
    });

    const totalLeads = allLeads.length;

    const stageCounts: Record<string, number> = {
      'Novo': 0,
      'Contatado': 0,
      'Respondeu': 0,
      'Qualificado': 0,
      'Teste Agendado': 0,
      'Em Teste': 0,
      'Cliente': 0,
      'Perdido': 0,
      'Sem Interesse': 0
    };

    let totalPipelineValue = 0;

    allLeads.forEach(l => {
      if (stageCounts[l.estagio] !== undefined) {
        stageCounts[l.estagio]++;
      }
      if (l.estagio !== 'Perdido' && l.estagio !== 'Sem Interesse') {
        totalPipelineValue += l.valorEstimado || 79.90;
      }
    });

    const contatados = stageCounts['Contatado'] || 0;
    const responderam = (stageCounts['Respondeu'] || 0) + 
                        (stageCounts['Qualificado'] || 0) + 
                        (stageCounts['Teste Agendado'] || 0) + 
                        (stageCounts['Em Teste'] || 0) + 
                        (stageCounts['Cliente'] || 0);
    const totalOutreach = contatados + responderam;
    const responseRate = totalOutreach > 0 ? Math.round((responderam / totalOutreach) * 100) : 0;

    const now = new Date();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const overdueCount = allLeads.filter(l => {
      if (!l.dataProximoFollowUp) return false;
      return new Date(l.dataProximoFollowUp) <= endOfToday && l.estagio !== 'Cliente' && l.estagio !== 'Perdido' && l.estagio !== 'Sem Interesse';
    }).length;

    res.json({
      totalLeads,
      responseRate,
      overdueCount,
      totalPipelineValue,
      stageCounts
    });
  } catch (error) {
    console.error('Erro ao calcular métricas:', error);
    res.status(500).json({ error: 'Erro ao calcular métricas' });
  }
});

// POST /api/leads - Create single lead
leadsRouter.post('/', async (req, res) => {
  try {
    const {
      nome,
      tipoEstrutura,
      cidade,
      bairro,
      telefone,
      instagram,
      especialidade,
      notaGoogle,
      avaliacoesGoogle,
      fonte,
      potencial,
      justificativaPotencial,
      estagio,
      motivoPerda,
      valorEstimado,
      dataProximoFollowUp
    } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ error: 'O nome do lead é obrigatório' });
    }

    if (!telefone || !validatePhoneDDD(telefone)) {
      return res.status(400).json({ error: 'Telefone inválido. Informe DDD + número (ex: 62 99999-9999)' });
    }

    const cleanedInsta = cleanInstagram(instagram);
    const initialStage = estagio || 'Novo';

    const newLead = await prisma.lead.create({
      data: {
        nome: nome.trim(),
        tipoEstrutura: tipoEstrutura || 'Consultório Individual',
        cidade: cidade || 'Goiânia',
        bairro: bairro ? bairro.trim() : null,
        telefone: telefone.trim(),
        instagram: cleanedInsta,
        especialidade: especialidade || 'Optometria',
        notaGoogle: notaGoogle ? parseFloat(notaGoogle) : null,
        avaliacoesGoogle: avaliacoesGoogle ? parseInt(avaliacoesGoogle, 10) : null,
        fonte: fonte || 'Google Maps',
        potencial: potencial || 'Médio',
        justificativaPotencial: justificativaPotencial ? justificativaPotencial.trim() : null,
        estagio: initialStage,
        motivoPerda: initialStage === 'Perdido' ? motivoPerda : null,
        valorEstimado: valorEstimado !== undefined && valorEstimado !== null ? parseFloat(valorEstimado) : 79.90,
        dataProximoFollowUp: dataProximoFollowUp ? new Date(dataProximoFollowUp) : null,
        dataUltimoContato: new Date()
      },
      include: {
        interacoes: true,
        historicoEstagios: true
      }
    });

    // Record initial stage history entry
    await recordStageTransition(newLead.id, initialStage);

    res.status(201).json(newLead);
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    res.status(500).json({ error: 'Erro ao criar lead' });
  }
});

// POST /api/leads/import - Bulk import from CSV
leadsRouter.post('/import', async (req, res) => {
  try {
    const { leads: rawLeads } = req.body;

    if (!Array.isArray(rawLeads) || rawLeads.length === 0) {
      return res.status(400).json({ error: 'Nenhum lead fornecido para importação' });
    }

    const createdLeads = [];
    const errors = [];

    for (let index = 0; index < rawLeads.length; index++) {
      const row = rawLeads[index];
      
      const nome = row.nome || row.Nome || row.Name;
      if (!nome || !String(nome).trim()) {
        errors.push(`Linha ${index + 1}: Nome ausente`);
        continue;
      }

      const telefone = row.telefone || row.Telefone || row.Phone || '';
      if (!validatePhoneDDD(String(telefone))) {
        errors.push(`Linha ${index + 1} (${nome}): Telefone inválido (necessário DDD + número)`);
        continue;
      }

      const rawStatus = row.status || row.Status || row['Status Comercial'] || row['statusComercial'] || row.potencial || row.Potencial;
      const { potencial, justificativa } = parseStatusComercial(rawStatus);

      const cleanedInsta = cleanInstagram(row.instagram || row.Instagram || row['Presença Digital'] || row['Presenca Digital']);
      const initialStage = row.estagio || row.Estagio || 'Novo';

      try {
        const lead = await prisma.lead.create({
          data: {
            nome: String(nome).trim(),
            tipoEstrutura: row.tipoEstrutura || row.TipoEstrutura || 'Consultório Individual',
            cidade: row.cidade || row.Cidade || 'Goiânia',
            bairro: row.bairro || row.Bairro ? String(row.bairro || row.Bairro).trim() : null,
            telefone: String(telefone).trim(),
            instagram: cleanedInsta,
            especialidade: row.especialidade || row.Especialidade || 'Optometria',
            notaGoogle: row.notaGoogle || row.Nota || row.nota ? parseFloat(row.notaGoogle || row.Nota || row.nota) : null,
            avaliacoesGoogle: row.avaliacoesGoogle || row.Avaliações || row.Avaliacoes ? parseInt(row.avaliacoesGoogle || row.Avaliações || row.Avaliacoes, 10) : null,
            fonte: row.fonte || row.Fonte || 'Google Maps',
            potencial: row.potencial || potencial,
            justificativaPotencial: row.justificativaPotencial || justificativa,
            estagio: initialStage,
            valorEstimado: row.valorEstimado ? parseFloat(row.valorEstimado) : 79.90,
            dataUltimoContato: new Date()
          }
        });

        await recordStageTransition(lead.id, initialStage);
        createdLeads.push(lead);
      } catch (err: any) {
        errors.push(`Linha ${index + 1} (${nome}): ${err.message}`);
      }
    }

    res.json({
      success: true,
      importedCount: createdLeads.length,
      errorsCount: errors.length,
      errors
    });
  } catch (error) {
    console.error('Erro ao importar leads:', error);
    res.status(500).json({ error: 'Erro ao importar leads' });
  }
});

// PUT /api/leads/:id - Update lead (handles stage transition tracking)
leadsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    if (updateData.telefone && !validatePhoneDDD(updateData.telefone)) {
      return res.status(400).json({ error: 'Telefone inválido' });
    }

    if (updateData.instagram !== undefined) {
      updateData.instagram = cleanInstagram(updateData.instagram);
    }

    if (updateData.estagio && updateData.estagio !== 'Perdido') {
      updateData.motivoPerda = null;
    }

    if (updateData.notaGoogle !== undefined && updateData.notaGoogle !== null) {
      updateData.notaGoogle = parseFloat(updateData.notaGoogle);
    }

    if (updateData.avaliacoesGoogle !== undefined && updateData.avaliacoesGoogle !== null) {
      updateData.avaliacoesGoogle = parseInt(updateData.avaliacoesGoogle, 10);
    }

    if (updateData.valorEstimado !== undefined && updateData.valorEstimado !== null) {
      updateData.valorEstimado = parseFloat(updateData.valorEstimado);
    }

    if (updateData.dataProximoFollowUp) {
      updateData.dataProximoFollowUp = new Date(updateData.dataProximoFollowUp);
    } else if (updateData.dataProximoFollowUp === null) {
      updateData.dataProximoFollowUp = null;
    }

    // Check if stage changed
    const stageChanged = updateData.estagio && updateData.estagio !== existingLead.estagio;

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        interacoes: {
          orderBy: { data: 'desc' }
        },
        historicoEstagios: {
          orderBy: { entrouEm: 'desc' }
        }
      }
    });

    if (stageChanged) {
      await recordStageTransition(id, updateData.estagio);
    }

    res.json(updatedLead);
  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    res.status(500).json({ error: 'Erro ao atualizar lead' });
  }
});

// DELETE /api/leads/:id
leadsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar lead:', error);
    res.status(500).json({ error: 'Erro ao deletar lead' });
  }
});
