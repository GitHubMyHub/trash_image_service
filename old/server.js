const express = require('express');
const {createCanvas, loadImage} = require('canvas');
const fs = require('fs');
const pjson = require('./package.json');

const app = express();
const port = 3000;

const imagePath = './images'

const svgMapping = async (value, color) => {
  let svgData, svgBuffer;
  switch (value) {
    case 'trashcan':
      svgData = fs.readFileSync(`${imagePath}/template.svg`, 'utf8');
      svgData = svgData.replace('#PLACEHOLDER_COLOR', `#${color}`)
      svgBuffer = Buffer.from(svgData);
      return await loadImage(svgBuffer);
    case 'tree':
      svgData = fs.readFileSync(`${imagePath}/template.svg`, 'utf8');
      svgData = svgData.replace('#PLACEHOLDER_COLOR', `#${color}`)
      svgBuffer = Buffer.from(svgData);
      return await loadImage(svgBuffer);
    default:
      svgData = fs.readFileSync(`${imagePath}/template.svg`, 'utf8');
      svgData = svgData.replace('#PLACEHOLDER_COLOR', `#${color}`)
      svgBuffer = Buffer.from(svgData);
      return await loadImage(svgBuffer);
  }
}

const imageLoading = async (queryData) => {
  const data = []

  Object.entries(queryData).forEach((entry) => {
    if (Array.isArray(entry[1])) {
      entry[1].forEach((item) => {
        data.push(svgMapping(entry[0], item))
      })
      return
    }
    data.push(svgMapping(entry[0], entry[1]))
  })

  return await Promise.all(data);

}

app.get('/image', async (req, res) => {
  const mainData = await imageLoading(req.query)

  const canvasWidth = mainData.length * 270

  const canvas = createCanvas(canvasWidth, 230);
  const ctx = canvas.getContext('2d');

  mainData.forEach((item, index) => {
    ctx.drawImage(item, 270 * index, 0);
  })

  res.setHeader('Content-Type', 'image/png');

  canvas.pngStream().pipe(res);
});

app.listen(port, () => {
  console.log("___________                    .__      .___                                  _________                  .__              \n" +
   "\\__    ___/___________    _____|  |__   |   | _____ _____     ____   ____    /   _____/ ______________  _|__| ____  ____  \n" +
   "  |    |  \\_  __ \\__  \\  /  ___/  |  \\  |   |/     \\\\__  \\   / ___\\_/ __ \\   \\_____  \\_/ __ \\_  __ \\  \\/ /  |/ ___\\/ __ \\ \n" +
   "  |    |   |  | \\// __ \\_\\___ \\|   Y  \\ |   |  Y Y  \\/ __ \\_/ /_/  >  ___/   /        \\  ___/|  | \\/\\   /|  \\  \\__\\  ___/ \n" +
   "  |____|   |__|  (____  /____  >___|  / |___|__|_|  (____  /\\___  / \\___  > /_______  /\\___  >__|    \\_/ |__|\\___  >___  >\n" +
   "                      \\/     \\/     \\/            \\/     \\//_____/      \\/          \\/     \\/                    \\/    \\/ ")
  console.log(`Image Service: ${pjson.version}`)
  console.log(`Image Service Server running at http://localhost:${port}`);
});
