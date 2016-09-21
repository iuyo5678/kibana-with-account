var Confidence = require('confidence');

var criteria = {
    env: process.env.NODE_ENV
};


var config = {
    $meta: 'This file configures the plot device.',
    projectName: 'kibana-account',
    port: {
        web: {
            $filter: 'env',
            test: 9000,
            production: process.env.PORT,
            $default: 8000
        }
    },
    baseUrl: {
        $filter: 'env',
        $meta: 'values should not end in "/"',
        production: 'https://getaqua.herokuapp.com',
        $default: 'http://127.0.0.1:8000'
    },
    authAttempts: {
        forIp: 50,
        forIpAndUser: 7
    },
    cookieSecret: {
        $filter: 'env',
        production: process.env.COOKIE_SECRET,
        $default: '~k3yb04rdK4tz!'
    },
    hapiMongoModels: {
        $filter: 'env',
        production: {
            mongodb: {
                url: process.env.MONGOLAB_URI
            },
            autoIndex: false
        },
        test: {
            mongodb: {
                url: 'mongodb://localhost:27017/kibana-account-test'
            },
            autoIndex: true
        },
        $default: {
            mongodb: {
                url: 'mongodb://localhost:27017/kibana-account'
            },
            autoIndex: true
        }
    },
    nodemailer: {
        host: 'smtp.163.com',
        port: 465,
        secure: true,
        auth: {
            user: 'iuyo5678@163.com',
            pass: 'AiboKHV@0909'
        }
    },
    system: {
        fromAddress: {
            name: 'kibana-account',
            address: 'iuyo5678@163.com'
        },
        toAddress: {
            name: 'kibana-account',
            address: 'iuyo5678@163.com'
        }
    }
};


var store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
