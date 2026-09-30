export interface RawCsvRow {
  nome?: string;
  cidade?: string;
  bairro?: string;
  telefone?: string;
  notaGoogle?: string;
  avaliacoesGoogle?: string;
  instagram?: string;
  statusComercial?: string;
  potencial?: string;
  justificativaPotencial?: string;
  tipoEstrutura?: string;
  especialidade?: string;
  fonte?: string;
  estagio?: string;
  [key: string]: any;
}

export function parseCsvText(csvText: string): RawCsvRow[] {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  // Determine delimiter (, ; or \t)
  const firstLine = lines[0];
  let delimiter = ',';
  if ((firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length) {
    delimiter = ';';
  } else if ((firstLine.match(/\t/g) || []).length > (firstLine.match(/,/g) || []).length) {
    delimiter = '\t';
  }

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        if (inQuotes && line[i + 1] === char) {
          cur += char;
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map(h => h.replace(/^["']|["']$/g, '').trim());

  const rows: RawCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]).map(v => v.replace(/^["']|["']$/g, '').trim());
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

    const rowObj: RawCsvRow = {};
    headers.forEach((header, index) => {
      const val = values[index] !== undefined ? values[index] : '';
      rowObj[header] = val;

      const lowerHeader = header.toLowerCase();

      // Normalize common column names
      if (['nome', 'name', 'titulo', 'título', 'empresa', 'lead'].includes(lowerHeader)) {
        rowObj.nome = val;
      } else if (['cidade', 'city', 'município', 'municipio'].includes(lowerHeader)) {
        rowObj.cidade = val;
      } else if (['bairro', 'district', 'setor', 'regiao', 'região'].includes(lowerHeader)) {
        rowObj.bairro = val;
      } else if (['telefone', 'phone', 'celular', 'whatsapp', 'contato', 'fone'].includes(lowerHeader)) {
        rowObj.telefone = val;
      } else if (['nota', 'rating', 'nota google', 'avaliacao', 'avaliação'].includes(lowerHeader)) {
        rowObj.notaGoogle = val;
      } else if (['avaliações', 'avaliacoes', 'reviews', 'qtd avaliações', 'num_avaliacoes'].includes(lowerHeader)) {
        rowObj.avaliacoesGoogle = val;
      } else if (['presença digital', 'presenca digital', 'instagram', 'insta', 'rede social', 'social'].includes(lowerHeader)) {
        rowObj.instagram = val;
      } else if (['status', 'status comercial', 'potencial comercial', 'potencial', 'classificação'].includes(lowerHeader)) {
        rowObj.statusComercial = val;
      } else if (['tipo', 'tipo estrutura', 'tipo de estrutura', 'categoria'].includes(lowerHeader)) {
        rowObj.tipoEstrutura = val;
      } else if (['especialidade', 'ramo'].includes(lowerHeader)) {
        rowObj.especialidade = val;
      } else if (['fonte', 'origem'].includes(lowerHeader)) {
        rowObj.fonte = val;
      }
    });

    if (rowObj.nome || rowObj.telefone) {
      rows.push(rowObj);
    }
  }

  return rows;
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

