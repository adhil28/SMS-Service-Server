const express = require('express')
const app = express()
const port = 3000
let api = new (require('./APi'))
let bodyParser = require('body-parser')
app.use(bodyParser.json())
let { mkdirSync, existsSync } = require('fs')
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
    api.signUp(req.body).then((data)=>{
        res.json(data)
    }).catch((e)=>{
        console.log(e);
    })
})
app.post('/login', (req, res) => {
    api.login(req.body).then((data)=>{
        res.json(data)
    }).catch((e)=>{
        console.log(e);
    })
})
app.post('/update-token',(req,res)=>{
    api.updateToken(req.body).then((d)=>{
        res.json(d)
    })
})
app.post('/delete-account', (req, res) => {
    console.log('delete account');
    api.deleteAccount(req.body).then((data)=>{
        res.json(data)
    }).catch((e)=>{
        console.log(e);
    })
})
app.post('/revoke-api',(req,res)=>{
    console.log('revoke api');
    api.revokeApi(req.body).then((data)=>{
        console.log(data);
        res.json(data)
    }).catch((e)=>{
        console.log(e);
    })
})
app.post('/disable-api',(req,res)=>{
    console.log('disable api');
    api.disableApi(req.body).then((data)=>{
        console.log(data);
        res.json(data)
    }).catch((e)=>{
        console.log(e);
    })
})
app.post('/enable-auth',(req,res)=>{
    console.log('disable api');
    api.enableAuthenetication(req.body).then((data)=>{
        console.log(data);
        res.json(data)
    }).catch((e)=>{
        console.log(e);
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})