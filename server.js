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

// Enable CORS for your frontend domain
app.use(cors({
  origin: "https://doorvi-fd448.web.app",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

// Parse JSON request bodies
app.use(express.json());

// Notification sending endpoint
app.post("/send-notification", async (req, res) => {
  const { targetToken, message } = req.body;

  if (!targetToken) {
    return res.status(400).json({ success: false, error: "targetToken is required" });
  }

  const payload = {
    token: targetToken,
    notification: {
      title: "PingMe - Incoming Call",
      body: message || "A visitor is calling you!"
    },
    data: {
      click_action: "https://doorvi-fd448.web.app/resident_test.html",
      title: "PingMe - Incoming Call",
      body: message || "A visitor is calling you!"
    },
    webpush: {
      notification: {
        icon: "https://img.icons8.com/color/96/video-call.png"
      },
      fcmOptions: {
        link: "https://doorvi-fd448.web.app/resident_test.html"
      }
    }
  };

  try {
    const response = await admin.messaging().send(payload);
    console.log("✅ Notification sent:", response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({ success: false, error: error.message || error });
  }
});

// Optional wakeup endpoint
app.get("/", (req, res) => {
  res.status(200).send("Backend is running.");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
