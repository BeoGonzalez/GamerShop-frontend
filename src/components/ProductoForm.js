import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://gamershop-backend-1.onrender.com/api/carrito";

function ProductoForm() {
    const [nombre, setNombre] = useState("");

    const guardar = async () =>{
        await axios.post(API_URL, {nombre});
        window.location.reload();
    };

    return(
        <div className="my-4">
            <input className="form-control"
                   placeholder="nombre"
                   value={(e) => setNombre(e.target.value)}/>
            <button className="btn btn-primary mt-2" onClick={guardar}>Guardar producto</button>
        </div>
    );
}

export default ProductoForm;