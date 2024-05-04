// ImageManager.js
import { useState } from 'react';


const updateProfileImage = (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      imageSrc = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const getImage = () => {
  const [imageSrc, setImage] = useState('../../Assets/upload.png')
  return imageSrc;
};

export { updateProfileImage, getImage };
