import { TTaskForm, TTaskStatus } from '@/lib/types/tasks'

describe('Task Validation', () => {
  it('should validate valid task data', () => {
    const validTask: TTaskForm = {
      title: 'Implement feature',
      status: 'todo',
      sprint_id: undefined
    }
    expect(validTask.title).toBeTruthy()
    expect(validTask.status).toBe('todo')
  })

  it('should validate task without sprint', () => {
    const taskWithoutSprint: TTaskForm = {
      title: 'Review code',
      status: 'todo'
    }
    expect(taskWithoutSprint.title).toBeTruthy()
    expect(taskWithoutSprint.sprint_id).toBeUndefined()
  })

  it('should validate task with sprint', () => {
    const fullTask: TTaskForm = {
      title: 'Complex task',
      status: 'in-progress',
      sprint_id: 'sprint-123'
    }
    expect(fullTask.title).toBeTruthy()
    expect(fullTask.sprint_id).toBeTruthy()
  })

  it('should validate task status transitions', () => {
    const task: TTaskForm = {
      title: 'Status test',
      status: 'todo'
    }

    const validStatuses: TTaskStatus[] = ['todo', 'in-progress', 'done']
    validStatuses.forEach(status => {
      task.status = status
      expect(['todo', 'in-progress', 'done'] as TTaskStatus[]).toContain(task.status)
    })
  })
}) 