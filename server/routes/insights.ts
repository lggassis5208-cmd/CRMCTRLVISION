import { Router } from 'express';
import { prisma } from '../db.js';

export const insightsRouter = Router();

const STAGES_ORDER = [
  'Novo',
  'Contatado',
  'Respondeu',
  'Qualificado',
  'Teste Agendado',
  'Em Teste',
  'Cliente'
];

// GET /api/insights - All metrics for Insights screen
insightsRouter.get('/', async (req, res) => {
  try {
    const allLeads = await prisma.lead.findMany({
      include: {
        historicoEstagios: true
      }
    });

    const allHistory = await prisma.historicoEstagio.findMany();

    // 1. Funil com valor & Leads Perdidos por motivo
    const stageSummary: Record<string, { count: number; totalValue: number }> = {};
    STAGES_ORDER.forEach(s => {
      stageSummary[s] = { count: 0, totalValue: 0 };
    });

    const lostByReason: Record<string, { count: number; totalValue: number }> = {};

    allLeads.forEach(lead => {
      const val = lead.valorEstimado || 79.90;

      if (lead.estagio === 'Perdido' || lead.estagio === 'Sem Interesse') {
        const reason = lead.motivoPerda || (lead.estagio === 'Sem Interesse' ? 'Sem Interesse' : 'Outro');
        if (!lostByReason[reason]) {
          lostByReason[reason] = { count: 0, totalValue: 0 };
        }
        lostByReason[reason].count++;
        lostByReason[reason].totalValue += val;
      } else if (stageSummary[lead.estagio]) {
        stageSummary[lead.estagio].count++;
        stageSummary[lead.estagio].totalValue += val;
      }
    });

    const funnelData = STAGES_ORDER.map(stage => ({
      stage,
      count: stageSummary[stage].count,
      totalValue: Math.round(stageSummary[stage].totalValue * 100) / 100
    }));

    const lostData = Object.keys(lostByReason).map(reason => ({
      reason,
      count: lostByReason[reason].count,
      totalValue: Math.round(lostByReason[reason].totalValue * 100) / 100
    }));

    // 2. Ciclo de vida médio por estágio (em dias)
    const stageDurations: Record<string, number[]> = {};
    const now = new Date();

    allHistory.forEach(h => {
      const start = new Date(h.entrouEm).getTime();
      const end = h.saiuEm ? new Date(h.saiuEm).getTime() : now.getTime();
      const durationDays = Math.max(0, (end - start) / (1000 * 60 * 60 * 24));

      if (!stageDurations[h.estagio]) {
        stageDurations[h.estagio] = [];
      }
      stageDurations[h.estagio].push(durationDays);
    });

    const avgStageLifecycle = [...STAGES_ORDER, 'Perdido', 'Sem Interesse'].map(stage => {
      const durations = stageDurations[stage] || [];
      const avgDays = durations.length > 0
        ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
        : 0;

      return {
        stage,
        avgDays,
        samplesCount: durations.length
      };
    });

    // 3. Taxa de conversão em cascata
    // Calculate how many leads reached each stage or beyond
    const reachedStageCounts: Record<string, number> = {};

    STAGES_ORDER.forEach(stage => {
      reachedStageCounts[stage] = 0;
    });

    allLeads.forEach(lead => {
      const historyStages = new Set(lead.historicoEstagios.map(h => h.estagio));
      historyStages.add(lead.estagio);

      STAGES_ORDER.forEach(stage => {
        if (historyStages.has(stage)) {
          reachedStageCounts[stage]++;
        }
      });
    });

    const conversionCascade = STAGES_ORDER.map((stage, idx) => {
      const count = reachedStageCounts[stage];
      const prevCount = idx > 0 ? reachedStageCounts[STAGES_ORDER[idx - 1]] : count;
      const conversionRate = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;
      const totalConversionRate = reachedStageCounts['Novo'] > 0 ? Math.round((count / reachedStageCounts['Novo']) * 100) : 0;

      return {
        stage,
        count,
        conversionRate,
        totalConversionRate
      };
    });

    // 4. Forecast simples (Soma de Teste Agendado e Em Teste)
    const testeAgendadoLeads = allLeads.filter(l => l.estagio === 'Teste Agendado');
    const emTesteLeads = allLeads.filter(l => l.estagio === 'Em Teste');

    const somaTesteAgendado = testeAgendadoLeads.reduce((acc, l) => acc + (l.valorEstimado || 79.90), 0);
    const somaEmTeste = emTesteLeads.reduce((acc, l) => acc + (l.valorEstimado || 79.90), 0);
    const totalForecast = somaTesteAgendado + somaEmTeste;

    const forecast = {
      countTesteAgendado: testeAgendadoLeads.length,
      somaTesteAgendado: Math.round(somaTesteAgendado * 100) / 100,
      countEmTeste: emTesteLeads.length,
      somaEmTeste: Math.round(somaEmTeste * 100) / 100,
      totalForecast: Math.round(totalForecast * 100) / 100
    };

    // 5. Leads ao longo do tempo (por semana de criação)
    const leadsByWeekMap: Record<string, number> = {};

    allLeads.forEach(lead => {
      const date = new Date(lead.criadoEm);
      // Format week start date e.g. "DD/MM"
      const firstDayOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekLabel = `${firstDayOfWeek.getDate().toString().padStart(2, '0')}/${(firstDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}`;
      
      leadsByWeekMap[weekLabel] = (leadsByWeekMap[weekLabel] || 0) + 1;
    });

    const leadsOverTime = Object.keys(leadsByWeekMap).map(week => ({
      week,
      count: leadsByWeekMap[week]
    }));

    res.json({
      funnelData,
      lostData,
      avgStageLifecycle,
      conversionCascade,
      forecast,
      leadsOverTime,
      hasEnoughData: allLeads.length > 0
    });
  } catch (error) {
    console.error('Erro ao calcular dados dos insights:', error);
    res.status(500).json({ error: 'Erro ao calcular dados dos insights' });
  }
});
