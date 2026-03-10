import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTaskStore, CATEGORIES, PRIORITIES, STATUS_OPTIONS } from '../store/taskStore';
import styles from './Sidebar.module.css';

function MiniCalendar({ currentDate, onSelect }) {
  const d = new Date(currentDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i));

  return (
    <div className={styles.miniCal}>
      <div className={styles.miniCalHeader}>
        {format(d, 'yyyy年M月', { locale: zhCN })}
      </div>
      <div className={styles.miniCalGrid}>
        {['日','一','二','三','四','五','六'].map(w => (
          <div key={w} className={styles.miniCalWeekDay}>{w}</div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`${styles.miniCalDay} ${
              day && day.toDateString() === today.toDateString() ? styles.today : ''
            } ${
              day && day.toDateString() === d.toDateString() ? styles.selected : ''
            } ${!day ? styles.empty : ''}`}
            onClick={() => day && onSelect(day)}
          >
            {day ? day.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { tasks, currentDate, setCurrentDate } = useTaskStore();

  const categoryCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: tasks.filter(t => t.category === cat.id).length,
  }));

  const statusCounts = STATUS_OPTIONS.map(s => ({
    ...s,
    count: tasks.filter(t => t.status === s.id).length,
  }));

  return (
    <aside className={styles.sidebar}>
      <MiniCalendar currentDate={currentDate} onSelect={setCurrentDate} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>按类别</div>
        {categoryCounts.map(cat => (
          <div key={cat.id} className={styles.categoryItem}>
            <span className={styles.dot} style={{ background: cat.color }} />
            <span className={styles.catLabel}>{cat.label}</span>
            <span className={styles.count}>{cat.count}</span>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>按状态</div>
        {statusCounts.map(s => (
          <div key={s.id} className={styles.statusItem}>
            <span className={styles.statusLabel}>{s.label}</span>
            <span className={styles.count}>{s.count}</span>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>总览</div>
        <div className={styles.statRow}>
          <span>总任务</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className={styles.statRow}>
          <span>已完成</span>
          <strong className={styles.done}>{tasks.filter(t => t.status === 'done').length}</strong>
        </div>
        <div className={styles.statRow}>
          <span>高优先级</span>
          <strong className={styles.high}>{tasks.filter(t => t.priority === 'high').length}</strong>
        </div>
      </div>
    </aside>
  );
}
