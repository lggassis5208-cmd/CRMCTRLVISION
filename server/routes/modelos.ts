import { Router } from 'express';
import { prisma } from '../db.js';

export const modelosRouter = Router();

// GET /api/modelos - List all message templates
modelosRouter.get('/', async (req, res) => {
  try {
    const { canal, categoria } = req.query;

    const where: any = {};
    if (canal && canal !== 'todos') {
      where.canal = String(canal);
    }
    if (categoria && categoria !== 'todas') {
      where.categoria = String(categoria);
    }

    const modelos = await prisma.modeloMensagem.findMany({
      where,
      orderBy: [{ categoria: 'asc' }, { nome: 'asc' }]
    });

    res.json(modelos);
  } catch (error) {
    console.error('Erro ao buscar modelos de mensagem:', error);
    res.status(500).json({ error: 'Erro ao buscar modelos de mensagem' });
  }
});

// POST /api/modelos - Create new message template
modelosRouter.post('/', async (req, res) => {
  try {
    const { nome, canal, categoria, texto } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ error: 'O nome do modelo é obrigatório' });
    }

    if (!texto || !texto.trim()) {
      return res.status(400).json({ error: 'O texto do modelo é obrigatório' });
    }

    const novoModelo = await prisma.modeloMensagem.create({
      data: {
        nome: nome.trim(),
        canal: canal || 'WhatsApp',
        categoria: categoria || 'Primeiro Contato',
        texto: texto.trim()
      }
    });

    res.status(201).json(novoModelo);
  } catch (error) {
    console.error('Erro ao criar modelo de mensagem:', error);
    res.status(500).json({ error: 'Erro ao criar modelo de mensagem' });
  }
});

// PUT /api/modelos/:id - Update message template
modelosRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, canal, categoria, texto } = req.body;

    const updated = await prisma.modeloMensagem.update({
      where: { id },
      data: {
        ...(nome && { nome: nome.trim() }),
        ...(canal && { canal }),
        ...(categoria && { categoria }),
        ...(texto && { texto: texto.trim() })
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar modelo de mensagem:', error);
    res.status(500).json({ error: 'Erro ao atualizar modelo de mensagem' });
  }
});

// DELETE /api/modelos/:id - Delete message template
modelosRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.modeloMensagem.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar modelo de mensagem:', error);
    res.status(500).json({ error: 'Erro ao deletar modelo de mensagem' });
  }
});
