const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://doorvi-fd448-default-rtdb.asia-southeast1.firebasedatabase.app/'  // Your Firebase Database URL
});

const app = express();
app.use(express.json());

app.post("/send-notification", async (req, res) => {
  const { targetToken, message } = req.body;

  const payload = {
    notification: {
      title: "PingMe - Incoming Call",
      body: message || "A visitor is calling you!",
      icon: "https://img.icons8.com/color/96/video-call.png",
    },
    webpush: {
      fcm_options: {
        link: "https://doorvi-fd448.web.app/resident_test.html",
      },
    },
  };

  try {
    const response = await admin.messaging().sendToDevice(targetToken, payload);
    res.status(200).send({ success: true, response });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
