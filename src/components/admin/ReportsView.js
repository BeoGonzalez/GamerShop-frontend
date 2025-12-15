import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReportsView = ({ productos, ordenes, categorias, darkMode }) => {
  // Colores dinámicos para Modo Oscuro
  const axisColor = darkMode ? "#e9ecef" : "#495057";
  const gridColor = darkMode ? "#495057" : "#dee2e6";
  const tooltipBg = darkMode ? "#212529" : "#ffffff";
  const tooltipText = darkMode ? "#ffffff" : "#000000";

  // 1. Datos para Gráfico Circular (Pie)
  const dataPie = categorias
    .map((cat) => ({
      name: cat.nombre,
      value: productos.filter((p) => p.categoria?.id === cat.id).length,
    }))
    .filter((item) => item.value > 0);

  const COLORES_PIE = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // 2. Datos para Gráfico de Barras (Stock)
  const dataBar = [...productos]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((p) => ({
      name: p.nombre.length > 10 ? p.nombre.substring(0, 10) + "..." : p.nombre,
      stock: p.stock,
    }));

  // 3. Datos para Gráfico de Líneas (Ventas individuales)
  const dataLine = ordenes.map((o, index) => ({
    name: `Ord #${index + 1}`, // Usamos índice simple para el eje X
    monto: o.total,
  }));

  // 4. Datos para Gráfico de Área (Ingreso Acumulado)
  let acumulado = 0;
  const dataArea = ordenes.map((o, index) => {
    acumulado += o.total;
    return { name: `Venta ${index + 1}`, ingreso: acumulado };
  });

  const cardStyle = "card border-0 shadow-lg h-100 rounded-4 overflow-hidden";
  // minWidth: 0 evita el error de Recharts en contenedores flexibles
  const containerH = { width: "100%", height: 300, minWidth: 0 };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length)
      return (
        <div
          style={{
            backgroundColor: tooltipBg,
            color: tooltipText,
            padding: "10px",
            borderRadius: "8px",
            border: `1px solid ${gridColor}`,
          }}
        >
          <p className="mb-0 fw-bold">{label}</p>
          <p className="mb-0">{`${payload[0].name || ""}: ${
            payload[0].value
          }`}</p>
        </div>
      );
    return null;
  };

  return (
    <div className="container-fluid animate__animated animate__fadeIn">
      <h3 className="fw-bold mb-4 text-body">
        <i className="bx bx-pie-chart-alt-2"></i> Reportes de la Tienda
      </h3>

      <div className="row g-4">
        {/* GRÁFICO 1: PIE - Categorías */}
        <div className="col-md-6">
          <div className={cardStyle}>
            <div className="card-header bg-transparent border-0 pt-4 text-center">
              <h5 className="fw-bold text-primary">Inventario por Categoría</h5>
            </div>
            <div className="card-body">
              <div style={containerH}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={dataPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {dataPie.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORES_PIE[index % COLORES_PIE.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICO 2: BARRAS - Stock */}
        <div className="col-md-6">
          <div className={cardStyle}>
            <div className="card-header bg-transparent border-0 pt-4 text-center">
              <h5 className="fw-bold text-primary">Top 5 Stock</h5>
            </div>
            <div className="card-body">
              <div style={containerH}>
                <ResponsiveContainer>
                  <BarChart data={dataBar}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={axisColor}
                      style={{ fontSize: "0.8rem" }}
                    />
                    <YAxis stroke={axisColor} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar dataKey="stock" fill="#82ca9d" radius={[5, 5, 0, 0]}>
                      {dataBar.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICO 3: LÍNEAS - Ventas (Este faltaba) */}
        <div className="col-md-6">
          <div className={cardStyle}>
            <div className="card-header bg-transparent border-0 pt-4 text-center">
              <h5 className="fw-bold text-primary">Ventas Individuales</h5>
            </div>
            <div className="card-body">
              <div style={containerH}>
                <ResponsiveContainer>
                  <LineChart data={dataLine}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                      opacity={0.3}
                    />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke={axisColor} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="monto"
                      stroke="#ff7300"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICO 4: ÁREA - Ingresos (Este faltaba) */}
        <div className="col-md-6">
          <div className={cardStyle}>
            <div className="card-header bg-transparent border-0 pt-4 text-center">
              <h5 className="fw-bold text-primary">Ingreso Acumulado</h5>
            </div>
            <div className="card-body">
              <div style={containerH}>
                <ResponsiveContainer>
                  <AreaChart data={dataArea}>
                    <defs>
                      <linearGradient
                        id="colorIngreso"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                      opacity={0.3}
                    />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke={axisColor} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="ingreso"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorIngreso)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsView;
