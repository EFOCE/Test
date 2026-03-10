import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CATEGORIES = [
  { id: 'meeting', label: '会议', color: '#0078d4' },
  { id: 'maintenance', label: '维护', color: '#107c10' },
  { id: 'cleaning', label: '清洁', color: '#00b7c3' },
  { id: 'supply', label: '采购', color: '#ff8c00' },
  { id: 'it', label: 'IT支持', color: '#7719aa' },
  { id: 'other', label: '其他', color: '#767676' },
];

const PRIORITIES = [
  { id: 'high', label: '高', color: '#d13438' },
  { id: 'medium', label: '中', color: '#ff8c00' },
  { id: 'low', label: '低', color: '#107c10' },
];

const STATUS_OPTIONS = [
  { id: 'todo', label: '待办' },
  { id: 'inprogress', label: '进行中' },
  { id: 'done', label: '已完成' },
  { id: 'cancelled', label: '已取消' },
];

const SAMPLE_TASKS = [
  {
    id: '1',
    title: '办公室月度清洁',
    description: '安排专业清洁团队进行全面清洁，包括地毯、窗户和公共区域。',
    category: 'cleaning',
    priority: 'medium',
    status: 'todo',
    startDate: '2026-03-10',
    endDate: '2026-03-10',
    startTime: '09:00',
    endTime: '12:00',
    assignee: '张三',
    allDay: false,
  },
  {
    id: '2',
    title: '季度部门会议',
    description: '所有部门负责人参加，讨论Q1工作总结及Q2计划。',
    category: 'meeting',
    priority: 'high',
    status: 'todo',
    startDate: '2026-03-12',
    endDate: '2026-03-12',
    startTime: '14:00',
    endTime: '16:00',
    assignee: '李四',
    allDay: false,
  },
  {
    id: '3',
    title: '打印机维修',
    description: '3楼打印机卡纸，需联系维修人员检修。',
    category: 'it',
    priority: 'high',
    status: 'inprogress',
    startDate: '2026-03-11',
    endDate: '2026-03-11',
    startTime: '10:00',
    endTime: '11:00',
    assignee: '王五',
    allDay: false,
  },
  {
    id: '4',
    title: '办公用品采购',
    description: '补充A4纸、签字笔、订书机等日常办公用品。',
    category: 'supply',
    priority: 'low',
    status: 'todo',
    startDate: '2026-03-15',
    endDate: '2026-03-15',
    startTime: '14:00',
    endTime: '15:00',
    assignee: '赵六',
    allDay: false,
  },
  {
    id: '5',
    title: '空调系统维护',
    description: '年度空调滤网清洗和系统检查。',
    category: 'maintenance',
    priority: 'medium',
    status: 'todo',
    startDate: '2026-03-18',
    endDate: '2026-03-18',
    startTime: '08:00',
    endTime: '17:00',
    assignee: '张三',
    allDay: false,
  },
  {
    id: '6',
    title: '网络安全培训',
    description: '全员参加信息安全意识培训。',
    category: 'it',
    priority: 'medium',
    status: 'todo',
    startDate: '2026-03-20',
    endDate: '2026-03-20',
    startTime: '09:00',
    endTime: '12:00',
    assignee: '李四',
    allDay: false,
  },
];

export { CATEGORIES, PRIORITIES, STATUS_OPTIONS };

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: SAMPLE_TASKS,
      selectedTask: null,
      view: 'month', // 'month' | 'week' | 'day' | 'list'
      currentDate: new Date().toISOString(),

      setView: (view) => set({ view }),
      setCurrentDate: (date) => set({ currentDate: new Date(date).toISOString() }),

      selectTask: (task) => set({ selectedTask: task }),
      clearSelection: () => set({ selectedTask: null }),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          selectedTask:
            state.selectedTask?.id === id
              ? { ...state.selectedTask, ...updates }
              : state.selectedTask,
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
        })),
    }),
    { name: 'office-tasks' }
  )
);
