import { storage } from "./firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";

export const uploadImg = async (file_name, file) => {
  const storageRef = ref(storage, file_name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  await uploadTask;

  const downloadUrl = getDownloadURL(uploadTask.snapshot.ref);

  return downloadUrl;
};

export async function downloadImage(url) {
  return axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) =>
      Buffer.from(response.data, "binary").toString("base64")
    );
}
