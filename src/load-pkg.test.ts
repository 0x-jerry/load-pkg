import path from 'path'
import { loadPkg } from './index.js'

describe('load-pkg', () => {
  const dir = path.resolve('example')
  it('should return a monorepo', async () => {
    const file = await loadPkg(path.join(dir, 'packages/pkg1'))

    expect(file?.monorepo).toBe(false)
    expect(file?.parent?.monorepo).toBe(true)
  })

  it('should return a non-monorepo', async () => {
    const file = await loadPkg(path.join(dir, '..'))

    expect(file?.monorepo).toBe(false)
  })
})
