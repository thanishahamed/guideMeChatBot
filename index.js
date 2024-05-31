const express = require('express')
const app = express();
const cors = require('cors');
const { NlpManager } = require('node-nlp');
const bodyParser = require('body-parser');
const dummyData = require('./dummyTrainData/dummyData.json');

app.use(cors());

app.use(bodyParser.json({}));

app.get('/', (req, res) => {
    res.send('welcome');
})

app.post('/train', async (req, res) => {
    const bodyContent = JSON.parse(JSON.stringify(req.body))
    const token = bodyContent.token;
    const trainData = Object.values(bodyContent.trainData);
    const manager = new NlpManager({ languages: ['en'], forceNER: true });

    trainData.forEach(dt => {
        dt.questions.forEach(que => manager.addDocument('en', que, dt.intent));
        dt.answers.forEach(ans => manager.addAnswer('en', dt.intent, ans));
    })

    await manager.train();
    manager.save('./models/'+token+'.nlp');

    res.json({message: "Processed!", ...trainData});
})

app.post('/get', async (req, res) => {
    let newManager = new NlpManager();
    newManager.load('./models/'+req.body.token+'.nlp');

    const response = await newManager.process('en', req.body.message);

    if (response.answers.length === 0) {
        res.json({message: "Sorry :(. I don't have enough knowledge to assist you at the moment. If you are the admin, please train me how to respond to this request. Thank You!", question: req.body.message, trainMe: true})
    } else {
        res.json({message: response.answer, ...response})
    }
})


app.post('/trainDefault', async (req, res) => {
    const bodyContent = dummyData
    const token = bodyContent.token;
    const trainData = Object.values(bodyContent.trainData);
    const manager = new NlpManager({ languages: ['en'], forceNER: true });

    trainData.forEach(dt => {
        dt.questions.forEach(que => manager.addDocument('en', que, dt.intent));
        dt.answers.forEach(ans => manager.addAnswer('en', dt.intent, ans));
    })

    await manager.train();
    manager.save('./models/'+token+'.nlp'); 

    res.json({message: "Processed!", ...trainData});
})

app.post('/getDefault', async (req, res) => {
    let newManager = new NlpManager();
    newManager.load('./models/'+dummyData.token+'.nlp');

    const response = await newManager.process('en', req.body.message);

    if (response.answers.length === 0) {
        res.json({message: "Sorry :(. I don't have enough knowledge to assist you at the moment. If you are the admin, please train me how to respond to this request. Thank You!", question: req.body.message, trainMe: true})
    } else {
        res.json({message: response.answer, ...response})
    }
})

app.listen(process.env.port || 3000, () => {
    console.log('server up and running', 3000)
});