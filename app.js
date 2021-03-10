
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require("path");
var cors = require('cors')
const nodemailer = require('nodemailer')
const key = require('./key.json');

const appConfig = require('./config/app');
const routes = require('./routes/routes');
const db = require("./models");

const privateKey = fs.readFileSync('ssl/privkey.pem');
const certificate = fs.readFileSync('ssl/fullchain.pem');
var credentials = { key: privateKey, cert: certificate };

class Server {
    constructor() {
        this.app = express();
        this.app.use(cors())

        this.app.use(express.static("./uploads"));
        this.app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
        // this.app.use(express.static(__dirname + "/views"));

        db.sequelize.sync({ logging: false })
            .then(() => {
                console.log('MySQL connected successfully.');
            })
            .catch((error) => {
                console.log(error);
                console.log('✗ MySQL connection error. Please make sure MySQL is running. ✗');
            });
    }

    appConfig(io) {
        new appConfig(this.app).includeConfig(io);
        this.app.get("/doc", (req, res) => {
            res.sendFile(path.join(__dirname, "./api-doc/", "el-apis.html"));
        });

        this.app.get("/api/v1/encrypt_f2uGgiRc/:val", (req, res) => {
            let encrypted = crypto.encrypt(req.params.val);
            res.json({ encrypted: encrypted, message: "This is helper route to get encrypted value only in development mode" });
        });
        this.app.get("/api/v1/decrypt_f2uGgiRc/:val", (req, res) => {
            let decrypted = crypto.decrypt(req.params.val);
            res.json({ decrypted: decrypted, message: "This is helper route to get decrypted value only in development mode" });
        })
        
        this.app.get("/", (req, res) => {
            res.redirect('https://entuition.pk');
        });
        
        this.app.use(function(req, res, next) {  
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });  
    }

    includeRoute() {
        new routes(this.app).routesConfig();
    }

    async appExecute() {
        const port = process.env.PORT || 3000;

        // const io = require('socket.io').listen(this.app.listen(process.env.PORT_SOCKET));

        var io = require('socket.io')();
        io.on('connection', function (socket) {
            console.log('Socket new connection established');
        });

        this.appConfig(io);
        this.includeRoute();

        // var server = https.createServer(credentials, this.app);
        var server = http.createServer(this.app);
        server.listen(port);
        io.listen(server);
    }
}

const app = new Server();
app.appExecute();
