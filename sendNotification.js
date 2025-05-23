const admin = require("firebase-admin");

// Load your service account key JSON file
const serviceAccount = require("./service-account.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Define target device token
const targetToken = "fgao78A-G44SvuxhT79G9k:APA91bHVGNnXw5p6Od4Pnb_uIXDVKV0BTJTSvaYbU8-3Rx8VcHiwYocEPuy2klqgXq4EoBCrd_-fieyd2r-n50AZfVfaKOQJ-rhVN47xpueCpK63ljKrdt0"; // Replace this

// Define the payload
const message = {
  token: targetToken,
  notification: {
    title: "PingMe - Incoming Call",
    body: "A visitor is calling you!",
    imageUrl: "https://img.icons8.com/color/96/video-call.png"
  },
  webpush: {
    fcmOptions: {
      link: "https://doorvi-fd448.web.app/resident_test.html"
    }
  }
};

// Send the message
admin.messaging().send(message)
  .then((response) => {
    console.log("✅ Notification sent successfully:", response);
  })
  .catch((error) => {
    console.error("❌ Error sending notification:", error);
  });
