import { Router } from 'express';
import { prisma } from '../db.js';

export const exportRouter = Router();

function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// GET /api/export/csv - Download CSV with all fields + summarized interaction history
exportRouter.get('/csv', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        interacoes: {
          orderBy: { data: 'desc' }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });

    const headers = [
      'ID',
      'Nome',
      'Tipo de Estrutura',
      'Cidade',
      'Bairro',
      'Telefone',
      'Instagram',
      'Especialidade',
      'Nota Google',
      'Avaliações Google',
      'Fonte',
      'Potencial',
      'Justificativa do Potencial',
      'Estágio',
      'Motivo da Perda',
      'Data do Último Contato',
      'Data do Próximo Follow-Up',
      'Data de Criação',
      'Histórico de Interações'
    ];

    const rows = leads.map(l => {
      const interacoesResumo = l.interacoes && l.interacoes.length > 0
        ? l.interacoes.map(i => {
            const dateStr = new Date(i.data).toLocaleDateString('pt-BR');
            return `[${dateStr} - ${i.canal}]: ${i.resumo}${i.proximaAcao ? ` (Próxima Ação: ${i.proximaAcao})` : ''}`;
          }).join(' | ')
        : 'Nenhuma interação';

      return [
        escapeCsvField(l.id),
        escapeCsvField(l.nome),
        escapeCsvField(l.tipoEstrutura),
        escapeCsvField(l.cidade),
        escapeCsvField(l.bairro || ''),
        escapeCsvField(l.telefone),
        escapeCsvField(l.instagram || ''),
        escapeCsvField(l.especialidade),
        escapeCsvField(l.notaGoogle !== null ? l.notaGoogle : ''),
        escapeCsvField(l.avaliacoesGoogle !== null ? l.avaliacoesGoogle : ''),
        escapeCsvField(l.fonte),
        escapeCsvField(l.potencial),
        escapeCsvField(l.justificativaPotencial || ''),
        escapeCsvField(l.estagio),
        escapeCsvField(l.motivoPerda || ''),
        escapeCsvField(l.dataUltimoContato ? new Date(l.dataUltimoContato).toLocaleString('pt-BR') : ''),
        escapeCsvField(l.dataProximoFollowUp ? new Date(l.dataProximoFollowUp).toLocaleDateString('pt-BR') : ''),
        escapeCsvField(new Date(l.criadoEm).toLocaleString('pt-BR')),
        escapeCsvField(interacoesResumo)
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=prospeccao_ctrl_vision_${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    res.status(500).json({ error: 'Erro ao exportar CSV' });
  }
});
