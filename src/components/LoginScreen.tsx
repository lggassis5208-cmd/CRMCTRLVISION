import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (token: string, user: { id: string; email: string; nome: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@ctrlvision.com.br');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.');
      }

      // Save token in localStorage and notify parent
      localStorage.setItem('ctrl_crm_token', data.token);
      localStorage.setItem('ctrl_crm_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao realizar login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-ctrl-blue to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
              CTRL Vision CRM
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Acesso Exclusivo de Prospecção & Gestão
            </p>
          </div>
        </div>

        {/* Informative Helper Badge */}
        <div className="bg-blue-950/60 border border-blue-800/50 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-blue-200">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-blue-100">Painel Protegido</span>
            <p className="text-[11px] text-blue-300/90 mt-0.5 leading-relaxed">
              Digite suas credenciais abaixo para desbloquear os 202 leads e o funil de prospecção.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 p-3 rounded-xl text-xs font-semibold text-center animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ctrlvision.com.br"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ctrl-blue focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ctrl-blue focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-ctrl-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Entrar no CRM</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-500">
            CTRL Vision SaaS &copy; 2026 — Gestão para Optometria
          </span>
        </div>

      </div>
    </div>
  );
};
