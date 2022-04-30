let fs = require('fs')

var admin = require("firebase-admin");

var serviceAccount = require("./auth.json");
let uniqid = require('uniqid')

let bcrypt = require('bcrypt')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



class API {
    admin() {
        return admin
    }
    sendSms({ api, message, to, plat, userName, password }) {
        return new Promise((resolve, reject) => {
            let req_token = JSON.parse(fs.readFileSync('./db/api/' + api + '/data.json', 'utf8'))
            if (req_token.active) {
                if (req_token.credentials == null) {
                    admin.messaging().send(
                        {
                            data: { to, message, plat },
                            token: req_token.token,
                            android: { priority: "high" }
                        }).then((r) => {
                            resolve(r)
                        })
                } else {
                    let apiPath = './db/api/' + api + '/data.json'
                    let apiData = JSON.parse(fs.readFileSync(apiPath, 'utf8'))
                    if (userName == apiData.credentials.userName) {
                        if (bcrypt.compareSync(password, apiData.credentials.password)) {
                            admin.messaging().send(
                                {
                                    data: { to, message, plat },
                                    token: req_token.token,
                                    android: { priority: "high" }
                                }).then((r) => {
                                    resolve(r)
                                })
                        } else {
                            resolve({ msg: 'Incorrect user name or password' })
                        }
                    } else {
                        resolve({ msg: 'Incorrect user name or password' })
                    }
                }

            } else {
                resolve({ msg: 'Inactivated API', code: 203 })
            }

        })
    }
    signUp({ email, password, token }) {
        return new Promise((resolve, reject) => {
            password = bcrypt.hashSync(password, 10)
            email = email.toLocaleLowerCase()

            let apiKey = uniqid() + uniqid() + uniqid()
            let savePath = './db/' + email
            if (fs.existsSync(savePath)) {
                resolve({ msg: 'Email already used by someone else', code: 201 })
            } else {
                fs.mkdirSync(savePath)
                fs.writeFileSync(savePath + '/data.json', JSON.stringify({
                    email, password, token, apiKey, active: true
                }))

                savePath = savePath.replace(email, 'api/' + apiKey)
                fs.mkdirSync(savePath)
                fs.writeFileSync(savePath + '/data.json', JSON.stringify({
                    apiKey, token, email, active: true
                }))
                resolve({ msg: 'account created successfully', code: 200, email, apiKey, active: true })
            }

        })
    }
    updateToken({ token, api }) {
        return new Promise((resolve, reject) => {
            if (api != null) {
                let path = './db/api/' + api + '/data.json'
                let data = JSON.parse(fs.readFileSync(path, 'utf8'))
                data.token = token
                resolve({ msg: 'done', code: 200 })
            } else {
                resolve({ msg: 'Error', code: 200 })
            }
        })
    }
    login({ email, password, token }) {
        return new Promise((resolve, reject) => {
            email = email.toLocaleLowerCase()
            let path = './db/' + email + '/data.json'
            if (fs.existsSync(path)) {
                let data = JSON.parse(fs.readFileSync(path, 'utf8'))
                bcrypt.compare(password, data.password).then((match) => {
                    if (match) {
                        data.token = token
                        let apiPath = './db/api/' + data.apiKey + '/data.json'
                        let apiData = JSON.parse(fs.readFileSync(apiPath, 'utf8'))
                        apiData.token = token
                        console.log(path);
                        fs.writeFileSync(apiPath, JSON.stringify(apiData))
                        fs.writeFileSync(path, JSON.stringify(data))
                        resolve({ msg: 'Success', code: 200, email, apiKey: data.apiKey, active: data.active })
                    } else {
                        resolve({ msg: 'Failed to login', code: 204 })
                    }
                })
            } else {
                resolve({ msg: 'Failed to login', code: 204 })
            }
        })
    }
    deleteAccount({ email }) {
        return new Promise((resolve, reject) => {
            let path = './db/' + email
            let data = JSON.parse(fs.readFileSync(path + '/data.json', 'utf8'))
            fs.rmSync(path, { recursive: true, force: true });
            let apiPath = './db/api/' + data.apiKey
            fs.rmSync(apiPath, { recursive: true, force: true });
            resolve({ msg: 'done', code: 200 })
        })
    }
    revokeApi({ email }) {
        return new Promise((resolve, reject) => {
            try {
                let path = './db/' + email
                let data = JSON.parse(fs.readFileSync(path + '/data.json', 'utf8'))
                let apiPath = './db/api/'
                console.log(apiPath + data.apiKey);
                fs.rmSync((apiPath + data.apiKey), { recursive: true, force: true });

                let newApiKey = uniqid() + uniqid() + uniqid()
                data.apiKey = newApiKey
                fs.writeFileSync(path + '/data.json', JSON.stringify(data))
                apiPath = apiPath + newApiKey
                fs.mkdirSync(apiPath)
                fs.writeFileSync(apiPath + '/data.json', JSON.stringify({ apiKey: newApiKey, token: data.token, email: data.email, active: true }))
                resolve({ msg: 'Api key is revoked', code: 200, apiKey: newApiKey })
            } catch (error) {
                reject(error)
            }
        })
    }
    disableApi({ api }) {
        return new Promise((resolve, reject) => {
            let apiPath = './db/api/' + api + '/data.json'
            let apiData = JSON.parse(fs.readFileSync(apiPath, 'utf8'))
            if (apiData.active) {
                apiData.active = false
            } else {
                apiData.active = true
            }
            fs.writeFileSync(apiPath, JSON.stringify(apiData))
            resolve({ msg: 'done', code: 200, active: apiData.active })
        })
    }
    enableAuthenetication({ api, userName, password }) {
        return new Promise((resolve, reject) => {
            let apiPath = './db/api/' + api + '/data.json'
            let apiData = JSON.parse(fs.readFileSync(apiPath, 'utf8'))
            password = bcrypt.hashSync(password, 10)
            apiData.credentials = { userName, password };
            fs.writeFileSync(apiPath, JSON.stringify(apiData))
            resolve({ msg: 'Done', code: 200 })
        })
    }
    getToken({ api }) {
        let apiPath = './db/api/' + api + '/data.json'
        let apiData = JSON.parse(fs.readFileSync(apiPath, 'utf8'))
        return apiData
    }
}
module.exports = API