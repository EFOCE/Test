import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useTaskStore, CATEGORIES, PRIORITIES, STATUS_OPTIONS } from '../store/taskStore';
import styles from './TaskModal.module.css';

const EMPTY_TASK = {
  title: '',
  description: '',
  category: 'other',
  priority: 'medium',
  status: 'todo',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '10:00',
  assignee: '',
  allDay: false,
};

export default function TaskModal({ task, onClose, defaultDate }) {
  const { addTask, updateTask, deleteTask } = useTaskStore();
  const isEdit = !!task?.id;

  const [form, setForm] = useState(() => {
    if (task) return { ...task };
    return { ...EMPTY_TASK, startDate: defaultDate || EMPTY_TASK.startDate, endDate: defaultDate || EMPTY_TASK.endDate };
  });

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (isEdit) {
      updateTask(task.id, form);
    } else {
      addTask(form);
    }
    onClose();
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个任务吗？')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEdit ? '编辑任务' : '新建任务'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>任务标题 *</label>
            <input
              className={styles.input}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="输入任务标题..."
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label>描述</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="任务详细描述..."
              rows={3}
            />
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label>类别</label>
              <select className={styles.select} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>优先级</label>
              <select className={styles.select} value={form.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label>状态</label>
              <select className={styles.select} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>负责人</label>
              <input
                className={styles.input}
                value={form.assignee}
                onChange={e => set('assignee', e.target.value)}
                placeholder="负责人姓名"
              />
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label>开始日期</label>
              <input type="date" className={styles.input} value={form.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>结束日期</label>
              <input type="date" className={styles.input} value={form.endDate} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label>开始时间</label>
              <input type="time" className={styles.input} value={form.startTime} onChange={e => set('startTime', e.target.value)} disabled={form.allDay} />
            </div>
            <div className={styles.field}>
              <label>结束时间</label>
              <input type="time" className={styles.input} value={form.endTime} onChange={e => set('endTime', e.target.value)} disabled={form.allDay} />
            </div>
          </div>

          <div className={styles.checkRow}>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={form.allDay} onChange={e => set('allDay', e.target.checked)} />
              全天事件
            </label>
          </div>

          <div className={styles.actions}>
            {isEdit && (
              <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
                <Trash2 size={14} /> 删除
              </button>
            )}
            <div className={styles.rightActions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>取消</button>
              <button type="submit" className={styles.saveBtn}>
                {isEdit ? '保存更改' : '创建任务'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
