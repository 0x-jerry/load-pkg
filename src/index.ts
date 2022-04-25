import fs from 'fs/promises'
import path from 'path'

loadPkg(path.join(__dirname, '../example'))

export async function loadPkg(dir: string) {
  const absPath = path.isAbsolute(dir) ? dir : path.resolve(dir)

  const files = await findPackageFiles(absPath)

  console.log(files)

  return []
}

async function findPackageFiles(absPath: string) {
  const name = 'package.json'

  let dir = absPath
  const rootDir = path.parse(dir).root

  const files: PackageFileConfig[] = []

  while (dir !== rootDir) {
    try {
      const pkgPath = path.join(dir, name)

      const res = await fs.readFile(pkgPath, {
        encoding: 'utf-8',
      })

      const json = JSON.parse(res)
      const isMonoRepo = !!json.workspaces

      files.push({
        path: pkgPath,
        monorepo: isMonoRepo,
      })
    } catch (e) {
      // ignore
    } finally {
      dir = path.join(dir, '..')
    }
  }

  return files
}

interface PackageFileConfig {
  path: string
  monorepo: boolean
}
