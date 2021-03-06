// ==================== EXTERNAL IMPORTS ==================== //
const request = require('request');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// ==================== INTERNAL IMPORTS ==================== //

// ==================== GLOBAL VARIABLES ==================== //

const app = express();
const alunos = []; 


// ==================== MIDDLEWARE ==================== //

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// ==================== FUNCTIONS ==================== //
// função para separar alunos por colunas da planilha, caso não seja selecionado nada, mostrará todos.
app.get('/api/alunos', (req, res) =>{
    if(!req.query.column){
        res.send(alunos);
        return;
    }
    res.send(alunos.map(aluno => aluno[req.query.column]));
});
// ==================== ROUTES ==================== //
// request que alimenta o array com os alunos cadastrados via uma planilha
request("https://spreadsheets.google.com/feeds/list/1HR2AXgWv9DXqqe7SvmU8MkSp_cbQqYOTUT2Qb-7vFSE/od6/public/values?alt=json", (err, res) => {
    const data = JSON.parse(res.body);
    for(i = 0; i < data.feed.entry.length; i++){
        alunos.push({
            aluno: data.feed.entry[i]['gsx$aluno']['$t'],
            turma: data.feed.entry[i]['gsx$turma']['$t'],
            curso: data.feed.entry[i]['gsx$curso']['$t'],
            vestibular: data.feed.entry[i]['gsx$vestibular']['$t'],
            area: data.feed.entry[i]['gsx$area']['$t'],
        })
        console.log(alunos);
    }
})
// ==================== RENDER VIEWS ==================== //
// ==================== START SERVER ==================== //

app.listen(process.env.PORT || 3000, () => {
    console.log('READY');
});

// ====================================================== //
