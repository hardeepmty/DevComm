import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDzsU_fwgJNnYb0-B8uMqyl04B3mpWtvRU",
  authDomain: "devcomm-491d0.firebaseapp.com",
  projectId: "devcomm-491d0",
  storageBucket: "devcomm-491d0.appspot.com",
  messagingSenderId: "427598963445",
  appId: "1:427598963445:web:43e3e72377351c859d9bbc",
  measurementId: "G-0NVQ18Y79L"
};

initializeApp(firebaseConfig);

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${image.name}`);
      try {
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
        alert("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Error uploading image.");
      }
    } else {
      alert("No image selected.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {imageUrl && (
        <div>
          <p>Image uploaded! Here is your link:</p>
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
