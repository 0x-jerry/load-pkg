import fs from 'fs/promises'
import path from 'path'

loadPkg(path.join(__dirname, '../example'))

export async function loadPkg(dir: string) {
  const absPath = path.isAbsolute(dir) ? dir : path.resolve(dir)

  const file = await findPackageFiles(absPath)

  console.log(file)

  return []
}

async function findPackageFiles(absPath: string) {
  const name = 'package.json'

  let dir = absPath
  const rootDir = path.parse(dir).root

  let file: PackageFileConfig | null = null

  while (dir !== rootDir) {
    try {
      const pkgPath = path.join(dir, name)

      const res = await fs.readFile(pkgPath, {
        encoding: 'utf-8',
      })

      const json = JSON.parse(res)
      const isMonorepo = !!json.workspaces

      if (file) {
        file.parent = {
          path: pkgPath,
          monorepo: isMonorepo,
        }
      } else {
        file = {
          path: pkgPath,
          monorepo: isMonorepo,
        }
      }
    } catch (e) {
      // ignore
    } finally {
      dir = path.join(dir, '..')
    }
  }

  return file
}

interface PackageFileConfig {
  path: string
  monorepo: boolean
  parent?: PackageFileConfig
}
