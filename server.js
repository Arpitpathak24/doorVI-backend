const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Parse the Firebase Admin credentials from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://doorvi-fd448-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const app = express();

// Enable CORS for all origins (or specify origin for security)
app.use(cors({
  origin: "https://doorvi-fd448.web.app", // ✅ only allow your frontend
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

// Parse JSON request bodies
app.use(express.json());

// Notification sending endpoint
app.post("/send-notification", async (req, res) => {
  const { targetToken, message } = req.body;

  const payload = {
    notification: {
      title: "PingMe - Incoming Call",
      body: message || "A visitor is calling you!",
      icon: "https://img.icons8.com/color/96/video-call.png"
    },
    webpush: {
      fcm_options: {
        link: "https://doorvi-fd448.web.app/resident_test.html"
      }
    }
  };

  try {
    const response = await admin.messaging().sendToDevice(targetToken, payload);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send({ success: false, error: error.message || error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
