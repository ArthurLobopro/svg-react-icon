//@ts-check

const path = require("path")
const { generateIcons } = require("../dist/index.js")

const src = path.resolve(__dirname, "./svg")
const out = path.resolve(__dirname, "./out")

generateIcons({
    srcDir: src,
    outDir: out,
    exporterPath: path.resolve(__dirname, "./exporter.js"),
})