//@ts-check

const path = require("path")
const fs = require("fs")
const { generateIcons } = require("../dist/index.js")

const src = path.resolve(__dirname, "./svg")
const out = path.resolve(__dirname, "./out")

if (fs.existsSync(out)) {
    fs.rmdirSync(out, { recursive: true })
}

fs.mkdirSync(out)

generateIcons({
    srcDir: src,
    outDir: out,
    exporterPath: path.resolve(__dirname, "./out/index.js")
})