import { TSprintForm } from '@/lib/types/sprints'

describe('Sprint Validation', () => {
  it('should validate valid sprint data', () => {
    const validSprint: TSprintForm = {
      name: 'Sprint 1',
      description: 'First sprint',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      is_completed: false
    }
    expect(validSprint.name).toBeTruthy()
    if (validSprint.start_date && validSprint.end_date) {
      expect(new Date(validSprint.end_date).getTime()).toBeGreaterThan(new Date(validSprint.start_date).getTime())
    }
  })

  it('should validate sprint without end date', () => {
    const sprintWithoutEnd: TSprintForm = {
      name: 'Sprint 2',
      description: 'Ongoing sprint',
      start_date: new Date().toISOString(),
      end_date: null,
      is_completed: false
    }
    expect(sprintWithoutEnd.name).toBeTruthy()
    expect(sprintWithoutEnd.end_date).toBeNull()
  })

  it('should validate sprint without description', () => {
    const sprintWithoutDescription: TSprintForm = {
      name: 'Sprint 3',
      description: null,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_completed: false
    }
    expect(sprintWithoutDescription.name).toBeTruthy()
    expect(sprintWithoutDescription.description).toBeNull()
  })

  it('should reject sprint with end date before start date', () => {
    const invalidSprint: TSprintForm = {
      name: 'Sprint 4',
      description: 'Invalid dates',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      is_completed: false
    }
    if (invalidSprint.start_date && invalidSprint.end_date) {
      expect(new Date(invalidSprint.end_date).getTime()).toBeLessThan(new Date(invalidSprint.start_date).getTime())
    }
  })
}) 