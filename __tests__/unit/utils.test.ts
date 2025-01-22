import { formatBytes } from '@/hooks/formatBytes'

describe('formatBytes Utility', () => {
  it('should format bytes correctly with default options', () => {
    expect(formatBytes(0)).toBe('0 Byte')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('should format bytes with decimals', () => {
    expect(formatBytes(1500, { decimals: 2 })).toBe('1.46 KB')
    expect(formatBytes(1024 * 1024 * 1.5, { decimals: 2 })).toBe('1.50 MB')
  })

  it('should use accurate size types when specified', () => {
    expect(formatBytes(1024, { sizeType: 'accurate' })).toBe('1 KiB')
    expect(formatBytes(1024 * 1024, { sizeType: 'accurate' })).toBe('1 MiB')
    expect(formatBytes(1024 * 1024 * 1024, { sizeType: 'accurate' })).toBe('1 GiB')
  })

  it('should handle edge cases', () => {
    expect(formatBytes(-1024)).toBe('0 Byte')
    expect(formatBytes(NaN)).toBe('0 Byte')
    expect(formatBytes(Infinity)).toBe('0 Byte')
  })

  it('should handle very large numbers', () => {
    const largeNumber = 1024 * 1024 * 1024 * 1024 * 5 // 5 TB
    expect(formatBytes(largeNumber)).toBe('5 TB')
  })
}) 