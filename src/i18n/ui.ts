import type { Locale } from './config';
import { DEFAULT_LOCALE } from './config';

type Dict = Record<string, string>;
const UI: Record<Locale, Dict> = {
  en: {
    'nav.work': 'work', 'nav.writing': 'writing', 'nav.podcast': 'podcast', 'nav.contact': 'contact',
    'section.experience': 'Experience', 'section.writing': 'Writing', 'section.podcast': 'Podcast',
    'section.contact': 'Get in touch', 'section.education': 'Education',
    'writing.viewAll': 'view all writing', 'writing.showLess': 'show less',
    'form.name': 'your name', 'form.email': 'your email', 'form.message': 'your message',
    'form.send': 'send →', 'form.sending': 'sending…', 'form.sent': 'thanks — message sent ✓',
    'form.error': 'that failed — email me directly?', 'contact.direct': 'or email me directly:',
    'podcast.break': 'on a break',
    'roles.expandAll': 'expand all ↓', 'roles.collapseAll': 'collapse all ↑', 'roles.now': 'now',
    'roles.hint': 'or click a row to expand',
  },
  zh: {
    'nav.work': '经历', 'nav.writing': '文章', 'nav.podcast': '播客', 'nav.contact': '联系',
    'section.experience': '工作经历', 'section.writing': '文章', 'section.podcast': '播客',
    'section.contact': '联系我', 'section.education': '教育背景',
    'writing.viewAll': '查看全部文章', 'writing.showLess': '收起',
    'form.name': '你的名字', 'form.email': '你的邮箱', 'form.message': '想说的话',
    'form.send': '发送 →', 'form.sending': '发送中…', 'form.sent': '已发送，谢谢 ✓',
    'form.error': '发送失败 — 直接发邮件给我？', 'contact.direct': '或直接发邮件：',
    'podcast.break': '暂停更新',
    'roles.expandAll': '展开全部 ↓', 'roles.collapseAll': '收起全部 ↑', 'roles.now': '现在',
    'roles.hint': '或点击任一行展开',
  },
};

export function t(lang: Locale, key: string): string {
  return UI[lang]?.[key] ?? UI[DEFAULT_LOCALE][key] ?? key;
}
