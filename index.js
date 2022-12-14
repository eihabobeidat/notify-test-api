const admin = require("firebase-admin");
const fastify = require("fastify")({ logger: true, keepAliveTimeout: 12000000 });
const util = require("util");
const serviceAccount = require("./customerapp-70a7d-firebase-adminsdk-qpv6n-b907d5f9b4.json");


// fastify.register(require('@fastify/cors'), (instance) => {
//   return (req, callback) => {
//     const corsOptions = {
//       // This is NOT recommended for production as it enables reflection exploits
//       origin: true
//     };

//     // do not include CORS headers for requests from localhost
//     if (/^localhost$/m.test(req.headers.origin)) {
//       corsOptions.origin = false
//     }

//     // callback expects two parameters: error and options
//     callback(null, corsOptions)
//   }
// })

const delay = util.promisify(setTimeout);

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Remote Push Notification
async function sendAlarmNotification(token) {
  return admin.messaging().send({
    token,
    notification: {
      body: "Hi here's your alarm",
      title: "It's time to wake up",
    },
    data: {
      type: "alarmNotification",
    },
  });
}

// Partial Push Notification
async function sendPartialNotification(token) {
  return admin.messaging().send({
    token,
    data: {
      type: "partial_notification",
      notifee: JSON.stringify({
        body: "I'm your push notification",
        android: {
          channelId: "default",
        },
      }),
    },
  });
}

// Declare a notification route
fastify.get("/", async (request) => {
  return "works fine abo al SOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOS, OK";
});

// Declare a notification route
fastify.post("/notifications", async (request) => {
  await delay(5000);
  await sendPartialNotification(JSON.parse(request.body).token);
  return "OK";
});

// Declare a alarm route
fastify.post("/alarm", async (request) => {
  await delay(5000);
  await sendAlarmNotification(JSON.parse(request.body).token);
  return "OK";
});

const port_number = process.env.PORT || 3000;

// Run the server
const start = async () => {
  try {
    console.log('server listening at', port_number);
    await fastify.listen(port_number, '0.0.0.0');
  } catch (err) {
    fastify.log.error('Eihab check this out ===> ', 'port:', port_number, '  **  error: ',err);
    //process.exit(1);
  }
};
start();