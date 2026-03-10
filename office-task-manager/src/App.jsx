import { useState } from 'react';
import { useTaskStore } from './store/taskStore';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import ListView from './components/ListView';
import TaskModal from './components/TaskModal';
import styles from './App.module.css';

export default function App() {
  const { view, deleteTask, setCurrentDate, setView } = useTaskStore();
  const [modal, setModal] = useState(null);

  const openNew = (defaultDate) => setModal({ task: null, defaultDate });
  const openEdit = (task) => setModal({ task, defaultDate: null });
  const closeModal = () => setModal(null);

  const handleDayClick = (day) => {
    setCurrentDate(day);
    setView('day');
  };

  return (
    <div className={styles.app}>
      <Header onNewTask={() => openNew()} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          {view === 'month' && <MonthView onTaskClick={openEdit} onDayClick={handleDayClick} />}
          {view === 'week' && <WeekView onTaskClick={openEdit} />}
          {view === 'day' && <DayView onTaskClick={openEdit} />}
          {view === 'list' && <ListView onTaskClick={openEdit} onDeleteTask={deleteTask} />}
        </main>
      </div>

      {modal !== null && (
        <TaskModal
          task={modal.task}
          defaultDate={modal.defaultDate}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
