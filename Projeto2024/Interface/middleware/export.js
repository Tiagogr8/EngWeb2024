const { exec } = require('child_process');
const path = require('path');

module.exports.exportData = (callback) => {
  const datasetPath = path.resolve(__dirname, '../dataset');
  const comandoExportacao = `mongodump --uri "mongodb://mongodb:27017/EngWeb2024" --out ${datasetPath}`;
  //const comandoExportacao = `mongodump --db EngWeb2024 --out ../dataset`;
  
  exec(comandoExportacao, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao exportar base de dados: ${error.message}`);
      callback(error);
      return;
    }
    if (stderr && !stderr.includes('done dumping')) {
      console.error(`Erro ao exportar base de dados: ${stderr}`);
      callback(new Error(stderr));
      return;
    }
    console.log(`Base de dados exportada com sucesso: ${stdout}`);
    callback(null);
  });
};
