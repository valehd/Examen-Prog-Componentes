import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function Formulario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "usuarios"), {
        nombre,
        email,
        direccion,
      });
      alert(`Datos guardados con éxito. ID: ${docRef.id}`);
      setNombre("");
      setEmail("");
      setDireccion("");
    } catch (error) {
      console.error("Error al guardar los datos: ", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <input
          type="text"
          id="nombre"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="direccion" className="form-label">Dirección</label>
        <input
          type="text"
          id="direccion"
          className="form-control"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">Enviar</button>
    </form>
  );
}

export default Formulario;
