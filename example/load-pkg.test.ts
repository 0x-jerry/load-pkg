import path from 'path'
import { loadPkg } from '../src'

describe('load-pkg', () => {
  it('should return a monorepo', async () => {
    const file = await loadPkg(path.join(__dirname, 'packages/pkg1'))

    expect(file?.monorepo).toBe(false)
    expect(file?.parent?.monorepo).toBe(true)
  })

  it('should return a non-monorepo', async () => {
    const file = await loadPkg(path.join(__dirname, '..'))

    expect(file?.monorepo).toBe(false)
  })
})
