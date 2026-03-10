import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameDay, isSameMonth,
  addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
  parseISO, isWithinInterval, startOfDay, endOfDay,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];
export const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function getMonthDays(date) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function getWeekDays(date) {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function formatMonthTitle(date) {
  return format(date, 'yyyy年 M月', { locale: zhCN });
}

export function formatWeekTitle(date) {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return `${format(start, 'M月d日')} – ${format(end, 'M月d日, yyyy')}`;
}

export function formatDayTitle(date) {
  return format(date, 'yyyy年M月d日 EEEE', { locale: zhCN });
}

export function navigate(view, currentDate, direction) {
  const d = new Date(currentDate);
  if (view === 'month') return direction > 0 ? addMonths(d, 1) : subMonths(d, 1);
  if (view === 'week') return direction > 0 ? addWeeks(d, 1) : subWeeks(d, 1);
  return direction > 0 ? addDays(d, 1) : subDays(d, 1);
}

export function getTasksForDay(tasks, day) {
  return tasks.filter((task) => {
    const start = parseISO(task.startDate);
    const end = parseISO(task.endDate);
    return isSameDay(day, start) || isSameDay(day, end) ||
      isWithinInterval(day, { start: startOfDay(start), end: endOfDay(end) });
  });
}

export function getTasksForHour(tasks, day, hour) {
  return tasks.filter((task) => {
    if (!isSameDay(parseISO(task.startDate), day)) return false;
    if (task.allDay) return false;
    const taskHour = parseInt(task.startTime?.split(':')[0] ?? '0');
    return taskHour === hour;
  });
}

export { isSameDay, isSameMonth, format, parseISO };
