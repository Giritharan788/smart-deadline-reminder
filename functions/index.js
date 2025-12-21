const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

// Runs every day at 9 AM IST
exports.checkUpcomingDeadlines = functions.pubsub
  .schedule("0 9 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    console.log("Checking upcoming deadlines...");

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const usersSnapshot = await db.collection("users").get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      const deadlinesSnapshot = await db
        .collection("users")
        .doc(userId)
        .collection("deadlines")
        .where("completed", "==", false)
        .where("reminderSent", "==", false)
        .get();

      deadlinesSnapshot.forEach((deadlineDoc) => {
        const deadline = deadlineDoc.data();
        const dueDate = new Date(deadline.dueDate);

        if (dueDate <= tomorrow && dueDate >= now) {
          console.log(
            `Upcoming deadline for user ${userId}:`,
            deadline.title
          );
        }
      });
    }

    return null;
  });
