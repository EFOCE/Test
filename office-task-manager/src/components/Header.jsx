import { ChevronLeft, ChevronRight, Plus, Calendar, List, LayoutGrid } from 'lucide-react';
import { useTaskStore, CATEGORIES } from '../store/taskStore';
import { navigate, formatMonthTitle, formatWeekTitle, formatDayTitle } from '../utils/calendarUtils';
import styles from './Header.module.css';

export default function Header({ onNewTask }) {
  const { view, setView, currentDate, setCurrentDate } = useTaskStore();
  const d = new Date(currentDate);

  const title =
    view === 'month' ? formatMonthTitle(d) :
    view === 'week' ? formatWeekTitle(d) :
    view === 'day' ? formatDayTitle(d) : '任务列表';

  const handleNav = (dir) => {
    if (view === 'list') return;
    setCurrentDate(navigate(view, d, dir));
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Calendar size={22} />
          <span>办公室事务管理</span>
        </div>
      </div>

      <div className={styles.center}>
        <button className={styles.iconBtn} onClick={() => handleNav(-1)}>
          <ChevronLeft size={18} />
        </button>
        <button className={styles.todayBtn} onClick={() => setCurrentDate(new Date())}>
          今天
        </button>
        <button className={styles.iconBtn} onClick={() => handleNav(1)}>
          <ChevronRight size={18} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.viewToggle}>
          {[
            { id: 'month', icon: <LayoutGrid size={16} />, label: '月' },
            { id: 'week', icon: <Calendar size={16} />, label: '周' },
            { id: 'day', icon: <Calendar size={16} />, label: '日' },
            { id: 'list', icon: <List size={16} />, label: '列表' },
          ].map((v) => (
            <button
              key={v.id}
              className={`${styles.viewBtn} ${view === v.id ? styles.active : ''}`}
              onClick={() => setView(v.id)}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          ))}
        </div>
        <button className={styles.newTaskBtn} onClick={onNewTask}>
          <Plus size={16} />
          新建任务
        </button>
      </div>
    </header>
  );
}
