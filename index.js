const express = require('express');
const app = express();
const PORT = 8081;

const fs = require('fs');

caminhoArquivo = 'ficheiro.json';

app.listen(
    PORT,
    () => console.log(`O server está vivo no http://localhost:${PORT}`)
)

app.get('/status200', (_, res) => {
    res.status(200).send({ status: res.statusCode });
});

// abrir o ficheiro local

app.post('/tamanho', (_, res) => {

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            res.status(500).send('Erro ao processar o arquivo JSON');
            return;
        }
        const objetoJson = JSON.parse(data);

        res.send({ message: 'Tamanho do array: ' + `${objetoJson.length}` });
    });

});

app.post('/ordenar', (_, res) => {

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            res.status(500).send('Erro ao processar o arquivo JSON');
            return;
        }
        const objetoJson = JSON.parse(data);

        const compararDados = (a, b) => {
            // aqui utilizei o || 0 para quando um dos valores que podem ser tomados
            // pelo 'condicao_pagamento' não estiverem no 'lista' de prioridades
            // assim garanto que o valor para termos de comparaçao é o 0
            const prioridadeCondPag = { "DIN": 5, "30": 4, "R60": 3, "90": 2, "120": 1 };
            const prioridadePais = { "PORT": 1 }

            return (b.quantidade * 0.5 + (prioridadeCondPag[b.condicao_pagamento] || 0) * 0.3 + (prioridadePais[b.pais] || 0) * 0.2)
                - (a.quantidade * 0.5 + (prioridadeCondPag[a.condicao_pagamento] || 0) * 0.3 + (prioridadePais[a.pais] || 0) * 0.2);

        }
        objetoJson.sort(compararDados);

        for (let i = 0; i < objetoJson.length; i++) {
            objetoJson[i].previsao_consumo = 5 * objetoJson[i].quantidade;
        }

        res.send(objetoJson);
    });
});


// consumir o url

const https = require('https');
const url = 'https://pastebin.pl/view/raw/8fced5f8';

let dados = '';


app.post('/tamanhoURL', (_, res) => {

    https.get(url, (response) => {
        // A função de retorno de chamada é chamada quando os dados são recebidos
        response.on('data', (chunk) => {
            dados += chunk;
        });

        // A função de retorno de chamada é chamada quando a resposta é concluída
        response.on('end', () => {
            try {
                // Agora os dados estão armazenados em 'dados'
                // Aqui você pode fazer qualquer manipulação ou processamento com os dados
                // Por exemplo, você pode analisar o JSON se os dados são um JSON válido
                const array = JSON.parse(dados);
                res.send({ message: 'Tamanho do array: ' + `${array.length}` });
            } catch (error) {
                console.error('Erro ao analisar JSON:', error.message);
            }
        });
    }).on('error', (error) => {
        console.error('Erro ao fazer solicitação HTTP:', error.message);
    });

});

app.post('/ordenarURL', (_, res) => {

    https.get(url, (response) => {
        // A função de retorno de chamada é chamada quando os dados são recebidos
        response.on('data', (chunk) => {
            dados += chunk;
        });

        // A função de retorno de chamada é chamada quando a resposta é concluída
        response.on('end', () => {
            try {
                // Agora os dados estão armazenados em 'dados'
                // Aqui você pode fazer qualquer manipulação ou processamento com os dados
                // Por exemplo, você pode analisar o JSON se os dados são um JSON válido
                const array = JSON.parse(dados);

                const compararDados = (a, b) => {
                    const prioridadeCondPag = { "DIN": 5, "30": 4, "R60": 3, "90": 2, "120": 1 };
                    const prioridadePais = { "PORT": 1 }

                    return (b.quantidade * 0.5 + (prioridadeCondPag[b.condicao_pagamento] || 0) * 0.3 + (prioridadePais[b.pais] || 0) * 0.2)
                        - (a.quantidade * 0.5 + (prioridadeCondPag[a.condicao_pagamento] || 0) * 0.3 + (prioridadePais[a.pais] || 0) * 0.2);

                }
                array.sort(compararDados);

                for (let i = 0; i < array.length; i++) {
                    array[i].previsao_consumo = 5 * array[i].quantidade;
                }

                res.send(array);

            } catch (error) {
                console.error('Erro ao analisar JSON:', error.message);
            }
        });
    }).on('error', (error) => {
        console.error('Erro ao fazer solicitação HTTP:', error.message);
    });

});