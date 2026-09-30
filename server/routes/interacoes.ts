import { Router } from 'express';
import { prisma } from '../db.js';

export const interacoesRouter = Router();

// POST /api/interacoes - Create new interaction for lead
interacoesRouter.post('/', async (req, res) => {
  try {
    const { leadId, canal, resumo, proximaAcao, dataProximoFollowUp } = req.body;

    if (!leadId) {
      return res.status(400).json({ error: 'O leadId é obrigatório' });
    }

    if (!resumo || !resumo.trim()) {
      return res.status(400).json({ error: 'O resumo da interação é obrigatório' });
    }

    const leadExists = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!leadExists) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    // Create interaction
    const interacao = await prisma.interacao.create({
      data: {
        leadId,
        canal: canal || 'WhatsApp',
        resumo: resumo.trim(),
        proximaAcao: proximaAcao ? proximaAcao.trim() : null
      }
    });

    // Update lead's dataUltimoContato and optional dataProximoFollowUp
    const leadUpdateData: any = {
      dataUltimoContato: new Date()
    };

    if (dataProximoFollowUp) {
      leadUpdateData.dataProximoFollowUp = new Date(dataProximoFollowUp);
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: leadUpdateData,
      include: {
        interacoes: {
          orderBy: { data: 'desc' }
        }
      }
    });

    res.status(201).json({
      interacao,
      lead: updatedLead
    });
  } catch (error) {
    console.error('Erro ao registrar interação:', error);
    res.status(500).json({ error: 'Erro ao registrar interação' });
  }
});
