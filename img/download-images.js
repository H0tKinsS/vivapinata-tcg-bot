const axios = require('axios');
const fs = require('fs');
const path = require('path');

const pinatas = require('../pinatas.js');

const imagesPath = path.join(`./pinatas/`);
async function downloadImage(url, filename) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  fs.writeFile(path.join(imagesPath, filename), response.data, (err) => {
    if (err) throw err;
    console.log('Image downloaded successfully!');
  });
}
// Grab all the command files from the commands directory you created earlier

for (const pinata of pinatas){
  const imageFilePath = `./img/pinatas/${pinata}.png`;
  if (fs.existsSync(imageFilePath)) {
    console.log(`Image for ${pinata.name} already exists`);
  } else {
    downloadImage(pinata.image_url, `${pinata.name}.png`);
  }
}