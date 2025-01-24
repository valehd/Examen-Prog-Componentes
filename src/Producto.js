import React from 'react';
import './App.css'; 

function Producto({ nombre, precio, imagen, agregarAlCarrito }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={imagen} className="card-img-top" alt={nombre} />
        <div className="card-body">
          <h5 className="card-title">{nombre}</h5>
          <p className="card-text">
            {new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
            }).format(precio)}
          </p>
          <button
            onClick={agregarAlCarrito}
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="bi bi-cart-plus me-2"></i>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default Producto;
