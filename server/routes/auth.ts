import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'ctrl-vision-crm-super-secret-key-2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    nome: string;
  };
}

// 🔐 Middleware para proteger rotas da API
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado. Faça login no CRM.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; nome: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sessão expirada ou inválida. Faça login novamente.' });
  }
}

// 🚀 Assegurar que o usuário admin padrão exista no banco SQLite
export async function ensureDefaultUser() {
  try {
    const existing = await prisma.usuario.findFirst({
      where: { email: 'admin@ctrlvision.com.br' }
    });

    if (!existing) {
      const senhaHash = await bcrypt.hash('admin123456', 10);
      await prisma.usuario.create({
        data: {
          email: 'admin@ctrlvision.com.br',
          senhaHash: senhaHash,
          nome: 'Fundador CTRL Vision'
        }
      });
      console.log('✅ Usuário padrão de acesso criado: admin@ctrlvision.com.br / admin123456');
    }
  } catch (err) {
    console.error('Erro ao verificar usuário padrão:', err);
  }
}

// 🔑 POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const user = await prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const isMatch = await bcrypt.compare(senha, user.senhaHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // Gerar Token JWT com validade de 30 dias
    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

// 👤 GET /api/auth/me
authRouter.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
});
