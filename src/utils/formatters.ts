import { formatDistanceToNow, isToday, isBefore, startOfDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Potencial } from '../types/crm';

export function formatWhatsAppUrl(phone: string, messageText?: string): string {
  if (!phone) return '#';
  let digits = phone.replace(/\D/g, '');
  // If user didn't type country code 55, add it
  if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }
  const baseUrl = `https://wa.me/${digits}`;
  if (messageText && messageText.trim()) {
    const encodedText = encodeURIComponent(messageText.trim());
    return `${baseUrl}?text=${encodedText}`;
  }
  return baseUrl;
}

export function formatInstagramUrl(handle?: string | null): string | null {
  if (!handle || !handle.trim()) return null;
  const clean = handle.trim().replace(/^@/, '');
  return `https://instagram.com/${clean}`;
}

export function formatDisplayPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function getDaysSinceLastContact(isoDate: string): { label: string; isRecent: boolean } {
  try {
    const date = parseISO(isoDate);
    const today = startOfDay(new Date());
    const contactDay = startOfDay(date);

    if (isToday(contactDay)) {
      return { label: 'Hoje', isRecent: true };
    }

    const diffTime = Math.abs(today.getTime() - contactDay.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return { label: 'Há 1 dia', isRecent: true };
    }
    return { label: `Há ${diffDays} dias`, isRecent: diffDays <= 3 };
  } catch {
    return { label: 'Sem data', isRecent: false };
  }
}

export function checkFollowUpStatus(followUpIso?: string | null): { status: 'overdue' | 'today' | 'future' | 'none'; label: string } {
  if (!followUpIso) return { status: 'none', label: 'Sem follow-up' };
  
  try {
    const date = parseISO(followUpIso);
    const todayStart = startOfDay(new Date());
    const dateStart = startOfDay(date);

    if (isBefore(dateStart, todayStart)) {
      const diffTime = Math.abs(todayStart.getTime() - dateStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { status: 'overdue', label: `Atrasado ${diffDays}d` };
    }

    if (isToday(dateStart)) {
      return { status: 'today', label: 'Follow-up Hoje' };
    }

    return { status: 'future', label: `Agendado ${date.toLocaleDateString('pt-BR')}` };
  } catch {
    return { status: 'none', label: 'Sem follow-up' };
  }
}

export function getPotencialBadgeStyle(potencial: Potencial | string): { bg: string; text: string; border: string; badge: string } {
  switch (potencial) {
    case 'Altíssimo':
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      };
    case 'Alto':
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300'
      };
    case 'Médio':
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-700',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-800 border-orange-300'
      };
    case 'Baixo':
    default:
      return {
        bg: 'bg-red-500',
        text: 'text-red-700',
        border: 'border-red-200',
        badge: 'bg-red-100 text-red-800 border-red-300'
      };
  }
}
