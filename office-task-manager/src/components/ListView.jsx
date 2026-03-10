import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTaskStore, CATEGORIES, PRIORITIES, STATUS_OPTIONS } from '../store/taskStore';
import { Edit2, Trash2, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import styles from './ListView.module.css';

const STATUS_ICONS = {
  todo: <Clock size={14} />,
  inprogress: <AlertCircle size={14} />,
  done: <CheckCircle size={14} />,
  cancelled: <XCircle size={14} />,
};

const STATUS_COLORS = {
  todo: '#888',
  inprogress: '#ff8c00',
  done: '#107c10',
  cancelled: '#999',
};

export default function ListView({ onTaskClick, onDeleteTask }) {
  const { tasks } = useTaskStore();

  const sorted = [...tasks].sort((a, b) => {
    const pa = ['high','medium','low'].indexOf(a.priority);
    const pb = ['high','medium','low'].indexOf(b.priority);
    if (pa !== pb) return pa - pb;
    return a.startDate.localeCompare(b.startDate);
  });

  const grouped = {};
  sorted.forEach(task => {
    const key = task.startDate;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });

  return (
    <div className={styles.listView}>
      <div className={styles.tableHeader}>
        <span style={{ flex: 3 }}>任务</span>
        <span style={{ flex: 1 }}>类别</span>
        <span style={{ flex: 1 }}>优先级</span>
        <span style={{ flex: 1 }}>状态</span>
        <span style={{ flex: 1 }}>日期</span>
        <span style={{ flex: 1 }}>负责人</span>
        <span style={{ width: 80 }}>操作</span>
      </div>
      <div className={styles.tableBody}>
        {Object.entries(grouped).map(([date, dayTasks]) => (
          <div key={date}>
            <div className={styles.dateGroup}>
              {format(parseISO(date), 'M月d日 EEEE', { locale: zhCN })}
            </div>
            {dayTasks.map(task => {
              const cat = CATEGORIES.find(c => c.id === task.category);
              const pri = PRIORITIES.find(p => p.id === task.priority);
              const sta = STATUS_OPTIONS.find(s => s.id === task.status);
              return (
                <div
                  key={task.id}
                  className={`${styles.row} ${task.status === 'done' ? styles.done : ''} ${task.status === 'cancelled' ? styles.cancelled : ''}`}
                  onClick={() => onTaskClick(task)}
                >
                  <span className={styles.titleCell} style={{ flex: 3 }}>
                    <span className={styles.catDot} style={{ background: cat?.color }} />
                    {task.title}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span className={styles.badge} style={{ background: `${cat?.color}22`, color: cat?.color }}>
                      {cat?.label}
                    </span>
                  </span>
                  <span style={{ flex: 1 }}>
                    <span className={styles.badge} style={{ background: `${pri?.color}22`, color: pri?.color }}>
                      {pri?.label}
                    </span>
                  </span>
                  <span style={{ flex: 1 }}>
                    <span className={styles.statusChip} style={{ color: STATUS_COLORS[task.status] }}>
                      {STATUS_ICONS[task.status]}
                      {sta?.label}
                    </span>
                  </span>
                  <span style={{ flex: 1, fontSize: 12, color: '#666' }}>
                    {task.startDate}
                    {task.startTime && ` ${task.startTime}`}
                  </span>
                  <span style={{ flex: 1, fontSize: 12, color: '#666' }}>{task.assignee || '—'}</span>
                  <span style={{ width: 80, display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button className={styles.actionBtn} onClick={() => onTaskClick(task)} title="编辑">
                      <Edit2 size={13} />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => onDeleteTask(task.id)} title="删除">
                      <Trash2 size={13} />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        ))}
        {tasks.length === 0 && (
          <div className={styles.empty}>暂无任务，点击"新建任务"添加</div>
        )}
      </div>
    </div>
  );
}
