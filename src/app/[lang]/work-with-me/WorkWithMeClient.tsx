'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function WorkWithMeClient({ lang, dict }: { lang: string; dict: any }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const cDict = dict.home.contact;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    if (!supabase) {
      console.error('Supabase client not initialized. Check your environment variables.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    
    try {
      const { error } = await supabase
        .from('toshiki_tech_contacts')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            company: formData.company, 
            message: formData.message,
            status: 'new'
          }
        ]);

      if (error) throw error;
      
      setStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="pt-20 border-t border-[var(--border)]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight mb-8 text-center">{cDict.title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                {cDict.name}
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-all text-[rgb(var(--foreground-rgb))] placeholder-[var(--muted-foreground)]/50"
                placeholder={lang === 'en' ? 'Taro Tanaka' : '田所 太郎'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                {cDict.email}
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-all text-[rgb(var(--foreground-rgb))] placeholder-[var(--muted-foreground)]/50"
                placeholder="contact@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              {cDict.company}
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-all text-[rgb(var(--foreground-rgb))] placeholder-[var(--muted-foreground)]/50"
              placeholder={lang === 'en' ? 'Company Name' : '公司名称或个人项目'}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              {cDict.message}
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-all resize-none text-[rgb(var(--foreground-rgb))] placeholder-[var(--muted-foreground)]/50"
              placeholder={lang === 'en' ? 'Tell me about your project...' : '请分享您的项目背景与目标...'}
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full btn-primary py-4 text-lg rounded-xl flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {cDict.submitting}
              </>
            ) : (
              cDict.submit
            )}
          </button>
          
          <AnimatePresence>
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-3 text-sm"
              >
                <CheckCircle2 size={18} />
                {cDict.success}
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-3 text-sm"
              >
                <AlertCircle size={18} />
                {cDict.error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
