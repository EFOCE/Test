import { useTaskStore } from '../store/taskStore';
import { HOURS, getTasksForHour } from '../utils/calendarUtils';
import TaskChip from './TaskChip';
import styles from './DayView.module.css';

export default function DayView({ onTaskClick }) {
  const { tasks, currentDate } = useTaskStore();
  const day = new Date(currentDate);

  return (
    <div className={styles.dayView}>
      <div className={styles.scrollArea}>
        {HOURS.map(hour => {
          const hourTasks = getTasksForHour(tasks, day, hour);
          return (
            <div key={hour} className={styles.hourRow}>
              <div className={styles.hourLabel}>
                {hour === 0 ? '' : `${hour.toString().padStart(2, '0')}:00`}
              </div>
              <div className={styles.cell}>
                {hourTasks.map(task => (
                  <TaskChip key={task.id} task={task} onClick={onTaskClick} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
