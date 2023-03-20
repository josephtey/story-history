const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const fetch = require("node-fetch");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const uploadImageToFirebase = async (imgUrl) => {
  // Initialize Firebase storage
  const storage = getStorage();

  const response = await fetch(imgUrl);
  const blob = await response.blob();
  const storageRef = ref(storage, `images/${Date.now()}`);
  await uploadBytes(storageRef, blob);
  const firebaseImgUrl = await getDownloadURL(storageRef);
  return firebaseImgUrl;
};

exports.getFirebaseImageUrl = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const firebaseImgUrl = await uploadImageToFirebase(request.body.imgUrl);
    response.send({
      firebaseImgUrl,
    });
  });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send({
      data: "Hello world!",
    });
  });
});
