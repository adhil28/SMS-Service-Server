var express = require('express');
const { existsSync, mkdirSync } = require('fs');
var app = express.Router();

/* GET home page. */
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
  console.log('send sms')
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

app.post('/config', (req, res) => {
  console.log(req.baseUrl);
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

app.post('/get-data', (req, res) => {
  if (req.body.access_key == '(@(U(HHQWIHWUQI*(*(#@*(SY(*SQ*(&(*@^(^&*)__@++!#(@*#@(^$&#T&8946342432NIOL:S{P{p[432p[jfm[e') {
      res.json({ token: api.getToken(req.body) })
  }
})


let router = app
module.exports = router;
