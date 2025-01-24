import React, { useState, useEffect } from "react";
import Producto from "./Producto";
import Formulario from "./Formulario";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UploadImage from "./cargaimagen";
import './App.css';  

function App() {
  const [productos] = useState([
    { id: 1, nombre: "Moroccanoil aceite", precio: 20000, imagen: "/assets/producto1.jpg" },
    { id: 2, nombre: "Kerastase elixir", precio: 25000, imagen: "/assets/producto2.jpg" },
    { id: 3, nombre: "Olaplex 7", precio: 30000, imagen: "/assets/producto3.jpg" },
  ]);

  const [carrito, setCarrito] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);  // Para gestionar el estado de envío
  const [formSuccess, setFormSuccess] = useState(null);     // Para mostrar mensajes de éxito o error
  const [user, setUser] = useState(null);  // Estado para guardar los datos del usuario autenticado

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);  // Si el usuario está autenticado, guardar los datos
      } else {
        setUser(null);  // Si no está autenticado, poner el estado de usuario en null
      }
    });

    return () => unsubscribe();  // Limpiar el efecto cuando el componente se desmonte
  }, []);

  // Agregar productos al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // Enviar datos a Firebase
  const handleFormSubmit = async (datosUsuario) => {
    setIsSubmitting(true);   // Comienza el proceso de envío
    setFormSuccess(null);    // Limpiar el mensaje anterior

    try {
      const pedido = {
        usuario: datosUsuario,
        productos: carrito,
        total: carrito.reduce((acc, prod) => acc + prod.precio, 0),
      };

      await addDoc(collection(db, "pedidos"), pedido);
      setFormSuccess("Pedido enviado correctamente");
      setCarrito([]); // Vaciar el carrito después de enviar el pedido
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      setFormSuccess("Error al enviar el pedido. Intenta nuevamente.");
    }

    setIsSubmitting(false);  // Finaliza el proceso de envío
  };

  // Función de inicio de sesión
  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  // Función de cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4 text-center">Tienda Nox</h1>

      {/* Mostrar interfaz de inicio de sesión si el usuario no está autenticado */}
      {!user ? (
        <div>
          <h2>Iniciar Sesión</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              handleLogin(email, password);
            }}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input type="password" id="password" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary">Iniciar sesión</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Bienvenido, {user.email}</h2>
          <button onClick={handleLogout} className="btn btn-danger">Cerrar sesión</button>
        </div>
      )}

      <h2 className="my-4">Productos</h2>
      <h4>Elige tus productos y agrégalos al carrito de compras</h4>
      <div className="row">
        {productos.map((producto) => (
          <Producto
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
            agregarAlCarrito={() => agregarAlCarrito(producto)}
          />
        ))}
      </div>

      <h2 className="my-4">Carrito de compras</h2>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <>
          {carrito.map((item, index) => (
            <div key={index} className="d-flex justify-content-between">
              <p>{item.nombre}</p>
              <p>
                {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }).format(item.precio)}
              </p>
            </div>
          ))}
          <h4>Total: 
            {new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
            }).format(carrito.reduce((acc, item) => acc + item.precio, 0))}
          </h4>
          <button 
            className="btn btn-danger my-2" 
            onClick={() => setCarrito([])}
          >
            Vaciar Carrito
          </button>
        </>
      )}

      <h2 className="my-4 text-center">Formulario de compra</h2>
      <Formulario onSubmit={handleFormSubmit} />

      {/* Mostrar el mensaje de éxito o error */}
      {formSuccess && (
        <div className={`alert ${formSuccess.includes("Error") ? "alert-danger" : "alert-success"}`}>
          {formSuccess}
        </div>
      )}

      <UploadImage />
    </div>
  );
}

export default App;
