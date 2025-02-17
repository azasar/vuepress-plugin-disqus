const path = require('path')

module.exports = (options) => ({
  name: "disqus-spa",

  enhanceAppFiles: [path.resolve(__dirname, "enhanceAppFile.js")],

  define: {
    DISQUS_OPTIONS: JSON.stringify(options)
  }
})