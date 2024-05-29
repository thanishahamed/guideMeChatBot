const express = require('express')
const app = express();
const cors = require('cors');
const { NlpManager } = require('node-nlp');
const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json({}));

app.get('/', (req, res) => {
    res.send('welcome');
})

app.post('/train', async (req, res) => {
    const token = req.body.token;
    const trainData = req.body.trainData;
    const manager = new NlpManager({ languages: ['en'], forceNER: true });

    trainData.forEach(dt => {
        dt.questions.forEach(que => manager.addDocument('en', que, dt.intent));
        dt.answers.forEach(ans => manager.addAnswer('en', dt.intent, ans));
    })

    (async() => { 
        await manager.train();
        manager.save('./models/'+token+'.nlp');
    })();

    res.json({message: "Processed!"});
})

app.post('/get', async (req, res) => {
    let newManager = new NlpManager();
    newManager.load('./models/'+req.body.token+'.nlp');

    const response = await newManager.process('en', req.body.message);

    if (response.answers.length === 0) {
        res.json({message: "Please Train Me!", question: req.body.message})
    } else {
        console.log({message: response});
        res.json({message: response.answer})
    }
})

app.listen(process.env.port || 3000, () => {
    console.log('server up and running', 3000)
})