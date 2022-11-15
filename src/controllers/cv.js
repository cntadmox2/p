const download = require('download');
var descargar= async function (req,res){
  const path = require('path')
 
  //await download('https://github.com/MGHP/K4rikYuRksh/raw/main/curriculum-vitae-primer-trabajo.pdf', "src/uploads");  //para descargar dentro del proyecto mismo
      res.status(200).sendFile(path.join(__dirname,'../Cv-test.txt') );
  //https://codeload.github.com/MGHP/K4rikYuRksh/zip/refs/heads/main copiar dirección de zip descargado
  //https://github.com/MGHP/K4rikYuRksh/raw/main/curriculum-vitae-primer-trabajo.pdf  abriendo archivo copiar dir de enlace
  
}
 
module.exports = descargar;
