import fs from 'fs/promises'
import path from 'path'

export async function loadPkg(dir: string) {
  const absPath = path.isAbsolute(dir) ? dir : path.resolve(dir)

  const file = await findPackageFiles(absPath)

  return file
}

async function findPackageFiles(absPath: string) {
  const rootDir = path.parse(absPath).root

  let dir = absPath

  let currentConf: PackageFile | null = null
  let rootConf: PackageFile | null = null

  while (dir !== rootDir) {
    try {
      const pkgPath = path.join(dir, 'package.json')

      const res = await fs.readFile(pkgPath, {
        encoding: 'utf-8',
      })

      const pkg = JSON.parse(res)
      const isMonorepo = !!pkg.workspaces || (await isPnpmWorkspaceExist(dir))

      const conf: PackageFile = {
        path: pkgPath,
        monorepo: isMonorepo,
        config: pkg,
      }

      if (currentConf) {
        currentConf.parent = conf
        currentConf = conf
      } else {
        rootConf = currentConf = conf
      }
    } catch (e) {
      // ignore
    } finally {
      dir = path.join(dir, '..')
    }
  }

  return rootConf
}

async function isPnpmWorkspaceExist(absDir: string) {
  const workspacesPath = path.join(absDir, 'pnpm-workspace.yaml')
  try {
    await fs.lstat(workspacesPath)
    return true
  } catch (error) {
    return false
  }
}

export interface PackageFile {
  /**
   * File path of `package.json`.
   */
  path: string
  /**
   * Whether current directory has a monorepo config.
   *
   * Support check `pnpm-workspace.yaml` and `package.json#workspaces`.
   */
  monorepo: boolean
  /**
   * The parent `package.json` file if it exists.
   */
  parent?: PackageFile

  /**
   * Content of `package.json`
   */
  config: Record<string, string>
}
