import { transform } from "@svgr/core"
import fs from "node:fs"
import path from "node:path"

interface generateIconsOptions {
    srcDir: string
    outDir: string
    exporterPath: string
    memo?: boolean
}

export async function generateIcons(options: generateIconsOptions) {
    const assets_path = path.normalize(options.srcDir)
    const icons_out = path.normalize(options.outDir)

    const { memo = true } = options

    const icon_exporter_path = path.normalize(options.exporterPath)

    const relative_path = path.relative(path.dirname(icon_exporter_path), icons_out)

    const srcDirExists = fs.existsSync(assets_path)

    if (!srcDirExists) {
        throw new Error(`Source directory ${assets_path} does not exist.`)
    }

    const outDirExists = fs.existsSync(icons_out)

    if (!outDirExists) {
        fs.mkdirSync(icons_out)
    } else {
        fs.rmSync(icons_out, { recursive: true })
        fs.mkdirSync(icons_out)
    }

    const icons = fs.readdirSync(assets_path)
        .filter((file) => file.endsWith(".svg"))
        .map((file) => path.join(assets_path, file))

    const export_list = []

    for (const icon of icons) {
        const icon_name = path.basename(icon, ".svg")
        const component_name =
            icon_name
                .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
                .replace(/^[a-z]/, (g) => g.toUpperCase())

        const svg_content = fs.readFileSync(icon, "utf-8")

        const component_content = await transform(
            svg_content,
            {
                exportType: "named",
                namedExport: component_name,
                typescript: true,
                expandProps: "end",
                titleProp: true,
                jsx: {},
                memo
            },
            { componentName: component_name }
        )

        fs.writeFileSync(path.resolve(icons_out, `${component_name}.tsx`), component_content)

        export_list.push(`export * from "./${relative_path}/${component_name}"`)
    }

    fs.writeFileSync(icon_exporter_path, export_list.join("\n"), { encoding: "utf-8" })
}