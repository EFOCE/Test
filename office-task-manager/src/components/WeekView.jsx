import { format } from 'date-fns';
import { useTaskStore } from '../store/taskStore';
import { getWeekDays, HOURS, getTasksForHour, isSameDay } from '../utils/calendarUtils';
import TaskChip from './TaskChip';
import styles from './WeekView.module.css';

export default function WeekView({ onTaskClick }) {
  const { tasks, currentDate } = useTaskStore();
  const d = new Date(currentDate);
  const days = getWeekDays(d);
  const today = new Date();

  return (
    <div className={styles.weekView}>
      {/* Column headers */}
      <div className={styles.header}>
        <div className={styles.timeGutter} />
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={`${styles.dayHeader} ${isSameDay(day, today) ? styles.today : ''}`}
          >
            <div className={styles.dayName}>{['日','一','二','三','四','五','六'][day.getDay()]}</div>
            <div className={`${styles.dayNum} ${isSameDay(day, today) ? styles.todayNum : ''}`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className={styles.body}>
        <div className={styles.scrollArea}>
          {HOURS.map(hour => (
            <div key={hour} className={styles.hourRow}>
              <div className={styles.hourLabel}>
                {hour === 0 ? '' : `${hour.toString().padStart(2, '0')}:00`}
              </div>
              {days.map(day => {
                const hourTasks = getTasksForHour(tasks, day, hour);
                return (
                  <div
                    key={day.toISOString()}
                    className={`${styles.cell} ${isSameDay(day, today) ? styles.todayCol : ''}`}
                  >
                    {hourTasks.map(task => (
                      <TaskChip key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
