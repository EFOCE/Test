import { CATEGORIES } from '../store/taskStore';
import styles from './TaskChip.module.css';

export default function TaskChip({ task, onClick, compact = false }) {
  const cat = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[CATEGORIES.length - 1];
  const isDone = task.status === 'done';
  const isCancelled = task.status === 'cancelled';

  return (
    <div
      className={`${styles.chip} ${compact ? styles.compact : ''} ${isDone ? styles.done : ''} ${isCancelled ? styles.cancelled : ''}`}
      style={{ borderLeftColor: cat.color, background: `${cat.color}18` }}
      onClick={(e) => { e.stopPropagation(); onClick?.(task); }}
      title={task.title}
    >
      {!compact && task.startTime && (
        <span className={styles.time}>{task.startTime}</span>
      )}
      <span className={styles.label}>{task.title}</span>
    </div>
  );
}
