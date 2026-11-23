import React, { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { apiFetch } from '../auth';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [dailyData, setDailyData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadAllStats();
    const interval = setInterval(loadAllStats, 30000); // 30 secondes
    return () => clearInterval(interval);
  }, []);

  const loadAllStats = async () => {
    try {
      setStats(await apiFetch("/orders/stats/overview"));
      setDailyData((await apiFetch("/orders/stats/daily")).slice(-7)); // 7 derniers jours
      setProductData((await apiFetch("/orders/stats/products")).slice(0, 5)); // Top 5
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
      setLoading(false);
    }
  };

  // ... exportCSV, statusData et le JSX : inchangés
  const exportCSV = () => {
    const csv = "Statistiques Coffee Shop\n\n" +
      `Total Commandes,${stats.totalOrders || 0}\n` +
      `Chiffre d'Affaires Total,${stats.totalRevenue || 0} MAD\n` +
      `Ventes Aujourd'hui,${stats.todayRevenue || 0} MAD\n` +
      `Ventes du Mois,${stats.monthRevenue || 0} MAD\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stats_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

  const statusData = [
    { name: 'En attente', value: stats.pending || 0, color: '#FFC107' },
    { name: 'Préparation', value: stats.preparing || 0, color: '#2196F3' },
    { name: 'Prêt', value: stats.ready || 0, color: '#4CAF50' },
    { name: 'Livré', value: stats.delivered || 0, color: '#9C27B0' }
  ];

  return (
    <div className="container fade-in">
      {/* En-tête */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">📊 Tableau de Bord</h1>
          <p className="subtitle">Vue d'ensemble de votre activité</p>
        </div>
        <button className="btn btn-secondary" onClick={exportCSV}>
          📥 Exporter CSV
        </button>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="stats-grid">
        <div className="stat-card-modern primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{(stats.totalRevenue || 0).toFixed(2)} MAD</div>
            <div className="stat-label">Chiffre d'Affaires Total</div>
          </div>
        </div>

        <div className="stat-card-modern success">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{(stats.todayRevenue || 0).toFixed(2)} MAD</div>
            <div className="stat-label">Ventes Aujourd'hui</div>
          </div>
        </div>

        <div className="stat-card-modern info">
          <div className="stat-icon">🗓️</div>
          <div className="stat-content">
            <div className="stat-value">{(stats.monthRevenue || 0).toFixed(2)} MAD</div>
            <div className="stat-label">Ventes du Mois</div>
          </div>
        </div>

        <div className="stat-card-modern warning">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalOrders || 0}</div>
            <div className="stat-label">Total Commandes</div>
          </div>
        </div>
      </div>

      {/* Statuts des commandes */}
      <div className="dashboard-grid">
        <div className="dashboard-card status-pending">
          <div className="status-icon">⏳</div>
          <div className="status-number">{stats.pending || 0}</div>
          <div className="status-label">En attente</div>
        </div>

        <div className="dashboard-card status-preparing">
          <div className="status-icon">👨‍🍳</div>
          <div className="status-number">{stats.preparing || 0}</div>
          <div className="status-label">En préparation</div>
        </div>

        <div className="dashboard-card status-ready">
          <div className="status-icon">✅</div>
          <div className="status-number">{stats.ready || 0}</div>
          <div className="status-label">Prêtes</div>
        </div>

        <div className="dashboard-card status-delivered">
          <div className="status-icon">🚚</div>
          <div className="status-number">{stats.delivered || 0}</div>
          <div className="status-label">Livrées</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        {/* Graphique Ventes Journalières */}
        <div className="chart-card">
          <h3 className="chart-title">📈 Ventes des 7 derniers jours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} MAD`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#8B4513" 
                strokeWidth={3}
                name="Ventes (MAD)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique Répartition Statuts */}
        <div className="chart-card">
          <h3 className="chart-title">🥧 Répartition des commandes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Produits les plus vendus */}
      <div className="chart-card full-width">
        <h3 className="chart-title">🏆 Top 5 des produits</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={productData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8B4513" name="Quantité" />
            <Bar dataKey="revenue" fill="#D2691E" name="Revenus (MAD)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau des produits */}
      <div className="card mt-2">
        <h3 className="info-title">📦 Détails des produits vendus</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité vendue</th>
                <th>Revenus générés</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.product}</strong></td>
                  <td>{item.quantity} unités</td>
                  <td className="revenue-cell">{item.revenue.toFixed(2)} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;