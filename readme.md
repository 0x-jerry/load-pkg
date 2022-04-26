# Load Pkg

Detect the closest `package.json` recursively.

## Example

```ts
const pkgFile = await loadPkg(path.join(__dirname, 'example/packages/pkg1'))
console.log(pkgFile)
```

output:

```json
{
  "path": "<root-path>/example/packages/pkg1/package.json",
  "monorepo": false,
  "parent": {
    "path": "<root-path>/example/package.json",
    "monorepo": true,
    "parent": {
      "path": "<root-path>/package.json",
      "monorepo": false
    }
  }
}
```
