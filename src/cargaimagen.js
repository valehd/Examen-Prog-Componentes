import React, { useState } from "react";
import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function UploadImage() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Manejar la selección de archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Subir el archivo a Firebase Storage
  const handleUpload = async () => {
    if (!image) return; // Si no hay imagen seleccionada, no hacer nada

    setUploading(true);
    const storageRef = ref(storage, `images/${image.name}`); // Ruta donde se guardará la imagen

    try {
      // Subir el archivo a Firebase Storage
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL); // Guardar la URL de la imagen subida
      alert("Imagen subida correctamente");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-4">
      <h3>Subir Imagen</h3>
      <input type="file" onChange={handleFileChange} />
      <button 
        className="btn btn-primary mt-2" 
        onClick={handleUpload} 
        disabled={uploading}
      >
        {uploading ? "Subiendo..." : "Subir Imagen"}
      </button>

      {imageUrl && (
        <div className="mt-4">
          <h4>Imagen Subida:</h4>
          <img src={imageUrl} alt="Imagen subida" width="200" />
        </div>
      )}
    </div>
  );
}

export default UploadImage;
