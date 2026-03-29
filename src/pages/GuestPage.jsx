import { useState } from 'react'
import { eventDetails } from '../config'
import { supabase } from '../supabaseClient'

export default function GuestPage() {
  const [attending, setAttending] = useState(null)
  const [pax, setPax] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const finalPax = attending ? pax : 0

    const { error: dbError } = await supabase
      .from('rsvps_simple')
      .insert([{ attending, pax: finalPax }])

    if (dbError) {
      setError('Maaf, sila cuba sekali lagi.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Terima Kasih!</h2>
          <p>Kehadiran anda telah direkodkan.</p>
          <p className="success-sub">Semoga kita bertemu di majlis nanti, insyaAllah.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Bismillah Header */}
      <div className="bismillah">{eventDetails.subtitle}</div>

      {/* Decorative Divider */}
      <div className="ornament">✦</div>

      {/* Hero Section */}
      <section className="hero">
        <h1>{eventDetails.title}</h1>
        <p className="invitation-text">{eventDetails.invitation}</p>
      </section>

      <div className="ornament">✦ ✦ ✦</div>

      {/* Event Details */}
      <section className="details-section">
        <h2 className="section-title">Butiran Majlis</h2>

        <div className="detail-cards">
          <div className="detail-card">
            <span className="detail-icon">📅</span>
            <span className="detail-label">Tarikh</span>
            <span className="detail-value">{eventDetails.tarikh}</span>
          </div>

          <div className="detail-card">
            <span className="detail-icon">🕐</span>
            <span className="detail-label">Masa</span>
            <span className="detail-value">{eventDetails.masa}</span>
          </div>

          <div className="detail-card">
            <span className="detail-icon">📍</span>
            <span className="detail-label">Lokasi</span>
            <span className="detail-value">{eventDetails.lokasi}</span>
            {eventDetails.googleMapsUrl && (
              <a
                href={eventDetails.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="maps-link"
              >
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Aturcara */}
      {eventDetails.aturcara && eventDetails.aturcara.length > 0 && (
        <section className="aturcara-section">
          <h2 className="section-title">Aturcara (Tentatif)</h2>
          <div className="aturcara-list">
            {eventDetails.aturcara.map((item, i) => (
              <div key={i} className="aturcara-item">
                <span className="aturcara-masa">{item.masa}</span>
                <span className="aturcara-acara">{item.acara}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="ornament">✦ ✦ ✦</div>

      {/* RSVP Section */}
      <section className="rsvp-section" id="rsvp">
        <h2 className="section-title">Pengesahan Kehadiran</h2>
        <p className="rsvp-question">Adakah anda akan hadir?</p>

        <div className="attendance-buttons">
          <button
            className={`attend-btn yes ${attending === true ? 'active' : ''}`}
            onClick={() => setAttending(true)}
            type="button"
          >
            <span className="btn-icon">✓</span>
            Ya, saya hadir
          </button>
          <button
            className={`attend-btn no ${attending === false ? 'active' : ''}`}
            onClick={() => setAttending(false)}
            type="button"
          >
            <span className="btn-icon">✗</span>
            Maaf, tidak dapat hadir
          </button>
        </div>

        {attending === true && (
          <div className="pax-section">
            <p className="pax-label">Berapa orang?</p>
            <div className="pax-control">
              <button
                className="pax-btn"
                onClick={() => setPax(Math.max(1, pax - 1))}
                type="button"
                aria-label="Kurang"
              >
                −
              </button>
              <span className="pax-value">{pax}</span>
              <button
                className="pax-btn"
                onClick={() => setPax(Math.min(20, pax + 1))}
                type="button"
                aria-label="Tambah"
              >
                +
              </button>
            </div>
            <p className="pax-hint">Termasuk anda</p>
          </div>
        )}

        {attending !== null && (
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
            type="button"
          >
            {loading ? 'Menghantar...' : 'Hantar'}
          </button>
        )}

        {error && <p className="error-msg">{error}</p>}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="ornament">✦</div>
        <p>Jazakallahu Khairan</p>
        <p className="footer-sub">Semoga Allah membalas kebaikan anda</p>
        <p className="footer-copyright">© 2026 Mardhiah</p>
      </footer>
    </div>
  )
}
