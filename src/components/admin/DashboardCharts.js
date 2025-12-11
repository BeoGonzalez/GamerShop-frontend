import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const DashboardCharts = ({ ordenes, productos }) => {
  // A) Procesar datos para gráfico de Ventas (Agrupar por Fecha)
  const ventasData = ordenes.reduce((acc, orden) => {
    // AHORA TU BACKEND ENVÍA LA FECHA YA FORMATEADA (dd/MM/yyyy) EN EL DTO
    const fecha = orden.fecha || "N/A";

    const existente = acc.find((item) => item.name === fecha);
    if (existente) {
      // AQUÍ CAMBIAMOS 'totalPagado' POR 'total' (que es como se llama en tu Java)
      existente.total += orden.total;
    } else {
      acc.push({ name: fecha, total: orden.total });
    }
    return acc;
  }, []);

  // B) Procesar datos para gráfico de Inventario
  const stockData = productos.reduce((acc, prod) => {
    const catNombre = prod.categoria?.nombre || "Sin Cat.";
    const existente = acc.find((item) => item.name === catNombre);
    if (existente) {
      existente.cantidad += 1;
    } else {
      acc.push({ name: catNombre, cantidad: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="row g-4 animate__animated animate__fadeInUp">
      {/* GRÁFICO DE VENTAS (ÁREA) */}
      <div className="col-lg-8">
        <div className="card border-0 shadow-lg rounded-4 h-100">
          <div className="card-header bg-transparent border-0 pt-4 ps-4">
            <h5 className="fw-bold text-primary mb-0">
              <i className="bx bx-trending-up"></i> Tendencia de Ventas
            </h5>
          </div>
          <div className="card-body" style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ventasData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Ingresos",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#0d6efd"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVentas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GRÁFICO DE CATEGORÍAS (BARRAS) */}
      <div className="col-lg-4">
        <div className="card border-0 shadow-lg rounded-4 h-100">
          <div className="card-header bg-transparent border-0 pt-4 ps-4">
            <h5 className="fw-bold text-success mb-0">
              <i className="bx bx-pie-chart-alt-2"></i> Inventario por Categoría
            </h5>
          </div>
          <div className="card-body" style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "10px" }}
                />
                <Bar
                  dataKey="cantidad"
                  fill="#198754"
                  radius={[0, 10, 10, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
