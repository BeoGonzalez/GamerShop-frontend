import React, {useState, useEffect} from "react";
import axios from "axios"

const API_URL = "https://gamershop-backend-1.onrender.com/api/carrito";

function ProductoList(){
    const [productos,setProductos] = useState([]);

    const cargar = async () =>{
        const res = await axios.get(API_URL);
        setProductos(res.data);
    };

    const eliminar = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        cargar();
    };

    useEffect(() =>{
        cargar();
    },[]);

    return(<ul className="list-group">
        {productos.map(p => (
            <li key={p.id} className="list-group-item d-flex justify-content-between">
                {p.nombre}
                <button className="btn btn-danger btn-sm" onClick={()=> eliminar(p.id)}>Eliminar</button>
            </li>
        ))}
    </ul>);
}

export default ProductoList;