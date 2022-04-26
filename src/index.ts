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

      const pkg = JSON.parse(res)
      const isMonorepo = !!pkg.workspaces || (await isPnpmWorkspaceExist(dir))

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

async function isPnpmWorkspaceExist(absDir: string) {
  const workspacesPath = path.join(absDir, 'pnpm-workspace.yaml')
  try {
    await fs.access(workspacesPath)
    return true
  } catch (error) {
    return false
  }
}

interface PackageFileConfig {
  path: string
  monorepo: boolean
  parent?: PackageFileConfig
}
