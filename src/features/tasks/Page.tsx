import { QuickAdd } from './QuickAdd'
import { TaskList } from './TaskList'

export default function TasksPage() {
  return (
    <>
      <QuickAdd />
      <div style={{ marginTop: 'var(--sp-5)' }}>
        <TaskList />
      </div>
    </>
  )
}
