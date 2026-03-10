import { useTaskStore } from '../store/taskStore';
import { getMonthDays, getTasksForDay, isSameDay, isSameMonth, WEEK_DAYS } from '../utils/calendarUtils';
import TaskChip from './TaskChip';
import styles from './MonthView.module.css';

export default function MonthView({ onTaskClick, onDayClick }) {
  const { tasks, currentDate } = useTaskStore();
  const d = new Date(currentDate);
  const days = getMonthDays(d);
  const today = new Date();

  return (
    <div className={styles.monthView}>
      <div className={styles.weekHeader}>
        {WEEK_DAYS.map(w => <div key={w} className={styles.weekDay}>{w}</div>)}
      </div>
      <div className={styles.grid}>
        {days.map((day) => {
          const dayTasks = getTasksForDay(tasks, day);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, d);
          const MAX_VISIBLE = 3;
          const hidden = dayTasks.length - MAX_VISIBLE;

          return (
            <div
              key={day.toISOString()}
              className={`${styles.cell} ${isToday ? styles.today : ''} ${!isCurrentMonth ? styles.otherMonth : ''}`}
              onClick={() => onDayClick?.(day)}
            >
              <div className={styles.dayNum}>
                <span className={isToday ? styles.todayNum : ''}>{day.getDate()}</span>
              </div>
              <div className={styles.taskList}>
                {dayTasks.slice(0, MAX_VISIBLE).map(task => (
                  <TaskChip key={task.id} task={task} compact onClick={onTaskClick} />
                ))}
                {hidden > 0 && (
                  <div className={styles.moreLabel}>+{hidden} 项更多</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
