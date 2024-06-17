const { exec } = require('child_process');

module.exports.importData = (path, callback) => {
    const comandoImportacao = `mongorestore --uri "mongodb://mongodb:27017/EngWeb2024" --db EngWeb2024 ${path}`;
    //const comandoImportacao = `mongorestore --db EngWeb2024 ${path}`;
    exec(comandoImportacao, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao importar base de dados: ${error.message}`);
            callback(error);
            return;
        }
        if (stderr && stderr.toLowerCase().includes('error') && !stderr.toLowerCase().includes('deprecated')) {
            console.error(`Erro ao importar base de dados: ${stderr}`);
            callback(new Error(stderr));
            return;
        }
        console.log(`Base de dados importada com sucesso: ${stdout}`);
        callback(null);
    });
};