const fs = require('fs')

var dir = 'dist';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

let file = fs.createReadStream('node_modules/powerbi-client/dist/powerbi.min.js', 'utf8')

let result = ''

file.on('data', (chunk) => {
    result += chunk.toString().replace('app.powerbi.com', 'app.powerbigov.us')
})

file.on('end', () => {
    fs.writeFile(`${dir}/powerbi.gov.min.js`, result, (err) => {
        if (err) return console.error(err)
    })
})
