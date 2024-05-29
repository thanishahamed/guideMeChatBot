const express = require('express')
const app = express();
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], forceNER: true });

app.get('/', (req, res) => {
    res.send('welcome');
})

// app.get('/train', async (req, res) => {
// // Adds the utterances and intents for the NLP
// manager.addDocument('en', 'who is the developer of this application', 'about');
// manager.addDocument('en', 'Who is the developer of this application', 'about');
// manager.addDocument('en', 'Who is Thanish?', 'about');
// manager.addDocument('en', 'Open account', 'account.open');
// // manager.addDocument('en', 'bye bye take care', 'greetings.bye');
// // manager.addDocument('en', 'okay see you later', 'greetings.bye');
// // manager.addDocument('en', 'bye for now', 'greetings.bye');
// // manager.addDocument('en', 'i must go', 'greetings.bye');
// // manager.addDocument('en', 'hello', 'greetings.hello');
// // manager.addDocument('en', 'hi', 'greetings.hello');
// // manager.addDocument('en', 'howdy', 'greetings.hello');

// // Train also the NLG
// manager.addAnswer('en', 'acount.open', 'fn:open');
// manager.addAnswer('en', 'about', 'Thanish');
// manager.addAnswer('en', 'about', 'Thanish and some of the batch mates');
// // manager.addAnswer('en', 'greetings.bye', 'see you soon!');
// // manager.addAnswer('en', 'greetings.hello', 'Hey there!');
// // manager.addAnswer('en', 'greetings.hello', 'Greetings!');

// // Train and save the model.
// (async() => {
//     await manager.train();
//     manager.save();
// })();

// res.json({message: "Processed!"});
// })

app.get('/get/:message', async (req, res) => {
    let newManager = new NlpManager();
    newManager.load('./model.nlp');
    const response = await newManager.process('en', req.params.message);

    if (response.answers.length === 0) {
        res.json({message: "Please Train Me!", question: req.params.message})
    } else {
        console.log({message: response});
        res.json({message: response.answer})
    }
    // console.log(response);

    
})

app.listen(process.env.port || 3000, () => {
    console.log('server up and running', 3000)
})