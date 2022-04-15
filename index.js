const express = require('express')
const app = express()
const port = 3001
let api = new (require('./APi'))
let bodyParser = require('body-parser')
app.use(bodyParser.json())
let { mkdirSync, existsSync } = require('fs')
let axios = require('axios')
require('dotenv').config()

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
};

if (!existsSync('./db')) {
    mkdirSync('./db')
}
if (!existsSync('./db/api')) {
    mkdirSync('./db/api')
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/send-sms', (req, res) => {
    api.sendSms(req.body).then((data) => {
        res.send(data)
    })
})
app.post('/sign-up', (req, res) => {
    api.signUp(req.body).then((data) => {
        res.json(data)
    }).catch((e) => {
        console.log(e);
    })
})

app.post('/config',(req,res)=>{
    res.json(firebaseConfig)
})

app.post('/login', (req, res) => {
    api.login(req.body).then((data) => {
        res.json(data)
    }).catch((e) => {
        console.log(e);
    })
})
app.post('/update-token', (req, res) => {
    api.updateToken(req.body).then((d) => {
        res.json(d)
    })
})
app.post('/delete-account', (req, res) => {
    console.log('delete account');
    api.deleteAccount(req.body).then((data) => {
        res.json(data)
    }).catch((e) => {
        console.log(e);
    })
})
app.post('/revoke-api', (req, res) => {
    console.log('revoke api');
    api.revokeApi(req.body).then((data) => {
        console.log(data);
        res.json(data)
    }).catch((e) => {
        console.log(e);
    })
})
app.post('/disable-api', (req, res) => {
    console.log('disable api');
    api.disableApi(req.body).then((data) => {
        console.log(data);
        res.json(data)
    }).catch((e) => {
        console.log(e);
    })
})
app.post('/enable-auth', (req, res) => {
    console.log('disable api');
    api.enableAuthenetication(req.body).then((data) => {
        console.log(data);
        res.json(data)
    }).catch((e) => {
        console.log(e);
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

try {
    setInterval(() => {
        axios.default.get('http://localhost:3000').then((e) => { })
    }, 1000 * 60 * 4)
} catch (error) {

}



