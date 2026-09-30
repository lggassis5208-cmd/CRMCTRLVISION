export type TipoEstrutura = 
  | 'Consultório Individual'
  | 'Gabinete Optométrico'
  | 'Ótica com Optometrista'
  | 'Clínica'
  | 'Hospital'
  | 'Outro';

export type Cidade = 
  | 'Goiânia'
  | 'Aparecida de Goiânia'
  | 'Anápolis'
  | 'Trindade'
  | 'Senador Canedo'
  | 'Outro';

export type Especialidade = 
  | 'Optometria'
  | 'Oftalmologia'
  | 'Ótica';

export type Fonte = 
  | 'Google Maps'
  | 'Instagram'
  | 'Indicação'
  | 'CNPJ/Receita'
  | 'CROO-GO'
  | 'Outro';

export type Potencial = 
  | 'Altíssimo'
  | 'Alto'
  | 'Médio'
  | 'Baixo';

export type Estagio = 
  | 'Novo'
  | 'Contatado'
  | 'Respondeu'
  | 'Qualificado'
  | 'Teste Agendado'
  | 'Em Teste'
  | 'Cliente'
  | 'Perdido'
  | 'Sem Interesse';

export type MotivoPerda = 
  | 'Já tem sistema'
  | 'Preço'
  | 'Sem tempo'
  | 'Quem decide é outra pessoa'
  | 'Não respondeu'
  | 'Outro';

export type CanalInteracao = 
  | 'Instagram'
  | 'WhatsApp'
  | 'Ligação'
  | 'Presencial';

export interface Interacao {
  id: string;
  leadId: string;
  data: string;
  canal: CanalInteracao;
  resumo: string;
  proximaAcao?: string | null;
}

export interface HistoricoEstagio {
  id: string;
  leadId: string;
  estagio: Estagio;
  entrouEm: string;
  saiuEm?: string | null;
}

export interface Lead {
  id: string;
  nome: string;
  tipoEstrutura: TipoEstrutura;
  cidade: Cidade;
  bairro?: string | null;
  telefone: string;
  instagram?: string | null;
  especialidade: Especialidade;
  notaGoogle?: number | null;
  avaliacoesGoogle?: number | null;
  fonte: Fonte;
  potencial: Potencial;
  justificativaPotencial?: string | null;
  estagio: Estagio;
  motivoPerda?: MotivoPerda | null;
  valorEstimado: number;
  dataUltimoContato: string;
  dataProximoFollowUp?: string | null;
  criadoEm: string;
  interacoes?: Interacao[];
  historicoEstagios?: HistoricoEstagio[];
}

export interface ModeloMensagem {
  id: string;
  nome: string;
  canal: 'WhatsApp' | 'Instagram';
  categoria: 'Primeiro Contato' | 'Follow-up' | 'Resposta a Objeção' | 'Fechamento';
  texto: string;
  criadoEm: string;
}

export interface FilterOptions {
  cidade: string;
  especialidade: string;
  potencial: string;
  estagio: string;
  fonte: string;
  search: string;
}

export interface MetricSummary {
  totalLeads: number;
  responseRate: number;
  overdueCount: number;
  totalPipelineValue: number;
  stageCounts: Record<Estagio, number>;
}

export const ESTAGIOS: Estagio[] = [
  'Novo',
  'Contatado',
  'Respondeu',
  'Qualificado',
  'Teste Agendado',
  'Em Teste',
  'Cliente',
  'Perdido',
  'Sem Interesse'
];

export const CIDADES: Cidade[] = [
  'Goiânia',
  'Aparecida de Goiânia',
  'Anápolis',
  'Trindade',
  'Senador Canedo',
  'Outro'
];

export const TIPOS_ESTRUTURA: TipoEstrutura[] = [
  'Consultório Individual',
  'Gabinete Optométrico',
  'Ótica com Optometrista',
  'Clínica',
  'Hospital',
  'Outro'
];

export const ESPECIALIDADES: Especialidade[] = [
  'Optometria',
  'Oftalmologia',
  'Ótica'
];

export const FONTES: Fonte[] = [
  'Google Maps',
  'Instagram',
  'Indicação',
  'CNPJ/Receita',
  'CROO-GO',
  'Outro'
];

export const POTENCIAIS: Potencial[] = [
  'Altíssimo',
  'Alto',
  'Médio',
  'Baixo'
];

export const MOTIVOS_PERDA: MotivoPerda[] = [
  'Já tem sistema',
  'Preço',
  'Sem tempo',
  'Quem decide é outra pessoa',
  'Não respondeu',
  'Outro'
];

export const CANAIS: CanalInteracao[] = [
  'WhatsApp',
  'Instagram',
  'Ligação',
  'Presencial'
];
