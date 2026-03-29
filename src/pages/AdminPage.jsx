import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalResponses: 0,
    totalAttending: 0,
    totalPax: 0,
    totalNotAttending: 0,
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [connectionError, setConnectionError] = useState(false)

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps_simple')
        .select('attending, pax')

      if (error) {
        console.error('Error fetching RSVPs:', error)
        setConnectionError(true)
        setLoading(false)
        return
      }

      setConnectionError(false)
      const totalResponses = data.length
      const totalAttending = data.filter((r) => r.attending).length
      const totalPax = data.filter((r) => r.attending).reduce((sum, r) => sum + r.pax, 0)
      const totalNotAttending = data.filter((r) => !r.attending).length

      setStats({ totalResponses, totalAttending, totalPax, totalNotAttending })
      setLastUpdated(new Date())
      setLoading(false)
    } catch (err) {
      console.error('Connection error:', err)
      setConnectionError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="page admin-page">
        <div className="loading">Memuatkan data...</div>
      </div>
    )
  }

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1>Ringkasan RSVP</h1>
        <p className="admin-subtitle">Majlis Kesyukuran dan Doa Selamat</p>
        {connectionError && (
          <p className="error-msg" style={{ marginBottom: '1rem' }}>
            ⚠️ Tidak dapat berhubung dengan pangkalan data. Sila periksa tetapan Supabase.
          </p>
        )}
        {lastUpdated && (
          <p className="last-updated">
            Kemaskini terakhir: {lastUpdated.toLocaleTimeString('ms-MY')}
          </p>
        )}
        <button className="refresh-btn" onClick={fetchStats} type="button">
          ↻ Muat Semula
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{stats.totalPax}</span>
          <span className="stat-label">Jumlah Tetamu</span>
          <span className="stat-sub">bilangan orang yang akan hadir</span>
        </div>

        <div className="stat-card success">
          <span className="stat-icon">✓</span>
          <span className="stat-value">{stats.totalAttending}</span>
          <span className="stat-label">Jumlah Hadir</span>
          <span className="stat-sub">respons 'Ya'</span>
        </div>

        <div className="stat-card danger">
          <span className="stat-icon">✗</span>
          <span className="stat-value">{stats.totalNotAttending}</span>
          <span className="stat-label">Tidak Hadir</span>
          <span className="stat-sub">respons 'Tidak'</span>
        </div>

        <div className="stat-card info">
          <span className="stat-icon">📊</span>
          <span className="stat-value">{stats.totalResponses}</span>
          <span className="stat-label">Jumlah Respons</span>
          <span className="stat-sub">keseluruhan maklum balas</span>
        </div>
      </div>
    </div>
  )
}
