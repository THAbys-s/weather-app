import { useState, useEffect } from "react";
import .env/apikey.env;
const API_KEY = process.env.API_KEY; // ← Reemplazá con tu clave de weatherapi.com
const CITY    = "Tokyo";           // ← Nombre de la ciudad (en inglés para la API)

function mapConditionCode(code) {
  if (code === 1000) return "sunny";
  if (code === 1003) return "partly";
  if ([1006, 1009, 1030, 1135, 1147].includes(code)) return "cloudy";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "stormy";
  if ([
    1063, 1072, 1150, 1153, 1168, 1171,
    1180, 1183, 1186, 1189, 1192, 1195,
    1198, 1201, 1240, 1243, 1246,
  ].includes(code)) return "rainy";
  return "cloudy";
}

const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

function parseForecastDay(fd) {
  const date   = new Date(fd.date + "T12:00:00");
  const noonHr = fd.hour?.[12] ?? fd.hour?.[0] ?? {};
  return {
    day:           DAY_LABELS[date.getDay()],
    date:          String(date.getDate()).padStart(2, "0"),
    condition:     mapConditionCode(fd.day.condition.code),
    conditionText: fd.day.condition.text,
    temp:          Math.round(fd.day.avgtemp_c),
    min:           Math.round(fd.day.mintemp_c),
    max:           Math.round(fd.day.maxtemp_c),
    humidity:      Math.round(fd.day.avghumidity),
    pressure:      Math.round(noonHr.pressure_mb ?? 1013), 
    wind:          parseFloat((fd.day.maxwind_kph / 3.6).toFixed(1)),
  };
}

function WeatherIcon({ condition, size = 80 }) {
  const s = size;
  const c = s / 2;

  if (condition === "sunny") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <circle cx={c} cy={c} r={s * 0.22} fill="#FFD95A" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={deg}
              x1={c + s * 0.29 * Math.cos(rad)} y1={c + s * 0.29 * Math.sin(rad)}
              x2={c + s * 0.40 * Math.cos(rad)} y2={c + s * 0.40 * Math.sin(rad)}
              stroke="#FFD95A" strokeWidth={s * 0.04} strokeLinecap="round"
            />
          );
        })}
      </svg>
    );
  }

  if (condition === "partly") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <circle cx={c * 0.75} cy={c * 0.75} r={s * 0.2} fill="#FFD95A" />
        {[30, 75, 120, 165, 210].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={deg}
              x1={c * 0.75 + s * 0.26 * Math.cos(rad)} y1={c * 0.75 + s * 0.26 * Math.sin(rad)}
              x2={c * 0.75 + s * 0.35 * Math.cos(rad)} y2={c * 0.75 + s * 0.35 * Math.sin(rad)}
              stroke="#FFD95A" strokeWidth={s * 0.035} strokeLinecap="round"
            />
          );
        })}
        <ellipse cx={c * 1.10} cy={c * 1.15} rx={s * 0.28} ry={s * 0.18} fill="#B0C8E8" />
        <ellipse cx={c * 0.85} cy={c * 1.22} rx={s * 0.22} ry={s * 0.15} fill="#C8DCEE" />
        <ellipse cx={c * 1.30} cy={c * 1.22} rx={s * 0.18} ry={s * 0.14} fill="#C8DCEE" />
      </svg>
    );
  }

  if (condition === "cloudy") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <ellipse cx={c}        cy={c * 0.95} rx={s * 0.32} ry={s * 0.22} fill="#8AACCC" />
        <ellipse cx={c * 0.72} cy={c * 1.05} rx={s * 0.24} ry={s * 0.17} fill="#A0BDD8" />
        <ellipse cx={c * 1.28} cy={c * 1.05} rx={s * 0.22} ry={s * 0.16} fill="#A0BDD8" />
        <ellipse cx={c}        cy={c * 1.15} rx={s * 0.38} ry={s * 0.19} fill="#B8CCDF" />
      </svg>
    );
  }

  if (condition === "rainy") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <ellipse cx={c}        cy={c * 0.70} rx={s * 0.30} ry={s * 0.20} fill="#6B8FAE" />
        <ellipse cx={c * 0.75} cy={c * 0.78} rx={s * 0.22} ry={s * 0.16} fill="#7A9CBF" />
        <ellipse cx={c * 1.25} cy={c * 0.78} rx={s * 0.20} ry={s * 0.15} fill="#7A9CBF" />
        <ellipse cx={c}        cy={c * 0.88} rx={s * 0.36} ry={s * 0.17} fill="#8AACCC" />
        {[0.7, 1.0, 1.3].map((xm, i) => (
          <line key={i}
            x1={c * xm}            y1={c * 1.10}
            x2={c * xm - s * 0.04} y2={c * 1.38}
            stroke="#6899BE" strokeWidth={s * 0.04} strokeLinecap="round"
          />
        ))}
      </svg>
    );
  }

  if (condition === "stormy") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <ellipse cx={c}        cy={c * 0.60} rx={s * 0.32} ry={s * 0.18} fill="#4A5568" />
        <ellipse cx={c * 0.72} cy={c * 0.68} rx={s * 0.22} ry={s * 0.16} fill="#5A6880" />
        <ellipse cx={c * 1.28} cy={c * 0.68} rx={s * 0.20} ry={s * 0.15} fill="#5A6880" />
        <ellipse cx={c}        cy={c * 0.78} rx={s * 0.38} ry={s * 0.17} fill="#606C84" />
        <polygon
          points={`${c*1.05},${c*0.92} ${c*0.88},${c*1.18} ${c*1.02},${c*1.15} ${c*0.93},${c*1.42} ${c*1.18},${c*1.08} ${c*1.04},${c*1.11}`}
          fill="#FFE566"
        />
      </svg>
    );
  }

  return null;
}

function HumidityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2 Q13 8 13 11.5 A4 4 0 0 1 5 11.5 Q5 8 9 2Z" fill="#7BA3CC" opacity="0.9" />
    </svg>
  );
}

function PressureIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6.5" stroke="#7BA3CC" strokeWidth="1.5" fill="none" />
      <circle cx="9" cy="9" r="1.5" fill="#7BA3CC" />
      <line x1="9" y1="9" x2="12.5" y2="6" stroke="#7BA3CC" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function WindIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 7 Q9 5 12 7 Q15 9 14 11 Q13 13 11 12"
        stroke="#7BA3CC" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M2 10 Q7 8.5 10 10 Q12 11 12 13 Q12 15 10 14.5"
        stroke="#7BA3CC" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.65" />
    </svg>
  );
}

const S = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0B1120 0%, #0F1E35 50%, #0A1525 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif", boxSizing: "border-box",
  },
  card: {
    width: "100%", maxWidth: "400px", minHeight: "100vh",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "48px 32px 40px", boxSizing: "border-box",
  },
  citySubtitle: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px", fontWeight: "500",
    letterSpacing: "0.35em", color: "#7BA3CC",
    textAlign: "center", marginBottom: "4px",
  },
  cityTitle: {
    fontSize: "38px", fontWeight: "700",
    letterSpacing: "0.1em", color: "#E8F2FF",
    textAlign: "center", marginBottom: "36px", lineHeight: 1,
  },
  dayNav: {
    display: "flex", alignItems: "center", gap: "6px",
    marginBottom: "44px", width: "100%", justifyContent: "center",
  },
  navBtn: {
    width: "32px", height: "32px", borderRadius: "50%",
    border: "1px solid rgba(123,163,204,0.3)",
    background: "rgba(255,255,255,0.04)",
    color: "#7BA3CC", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", flexShrink: 0,
  },
  daysRow: { display: "flex", gap: "4px", alignItems: "center" },
  dayPill: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "6px 10px", borderRadius: "20px",
    cursor: "pointer", minWidth: "40px",
  },
  iconWrap: {
    marginBottom: "36px",
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "120px", height: "120px", borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  tempMain: {
    fontSize: "88px", fontWeight: "200", color: "#E8F2FF",
    lineHeight: 1, letterSpacing: "-0.04em",
    textAlign: "center", marginBottom: "4px",
  },
  tempDeg:       { fontSize: "44px", fontWeight: "200", verticalAlign: "super", color: "#7BA3CC" },
  conditionLabel:{
    fontSize: "14px", letterSpacing: "0.2em", color: "#7BA3CC",
    fontWeight: "500", textTransform: "uppercase",
    textAlign: "center", marginBottom: "28px",
  },
  minMaxRow: {
    display: "flex", gap: "24px", alignItems: "center",
    justifyContent: "center", marginBottom: "44px",
  },
  minMaxItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  minMaxLabel:   { fontSize: "10px", letterSpacing: "0.15em", color: "#4A6880", fontWeight: "600" },
  minMaxVal:     { fontSize: "22px", fontWeight: "300", color: "#B0CCDD" },
  divider:       { width: "1px", height: "36px", background: "rgba(123,163,204,0.2)" },
  metricsRow: {
    display: "flex", width: "100%", borderRadius: "16px",
    border: "1px solid rgba(123,163,204,0.12)",
    background: "rgba(255,255,255,0.03)", overflow: "hidden",
  },
  metric: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "16px 8px", gap: "6px",
    borderRight: "1px solid rgba(123,163,204,0.12)",
  },
  metricVal:  { fontSize: "17px", fontWeight: "600", color: "#C8DDED", lineHeight: 1 },
  metricUnit: { fontSize: "10px", letterSpacing: "0.1em", color: "#4A6880", fontWeight: "500" },
  statusWrap: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: "16px", color: "#7BA3CC", textAlign: "center",
  },
  statusText: { fontSize: "14px", letterSpacing: "0.1em", color: "#7BA3CC" },
  statusErr:  { fontSize: "13px", color: "#E07070", maxWidth: "280px", lineHeight: 1.6 },
  spinner: {
    width: "36px", height: "36px", borderRadius: "50%",
    border: "2px solid rgba(123,163,204,0.15)",
    borderTop: "2px solid #7BA3CC",
    animation: "spin 0.9s linear infinite",
  },
};

// COMPONENTE PRINCIPAL
export default function WeatherApp() {
  const [days, setDays]          = useState([]);
  const [cityName, setCityName]  = useState("");
  const [country, setCountry]    = useState("");
  const [activeIndex, setActive] = useState(0);
  const [loading, setLoading]    = useState(true);
  const [error, setError]        = useState(null);

  useEffect(() => {
    // Verificación antes de llamar a la API
    if (!API_KEY || API_KEY === "process.env.API_KEY") {
      setError(
        'Reemplazá API_KEY con tu clave de weatherapi.com\n' +
        'Podés obtener una gratis en https://www.weatherapi.com/signup.aspx'
      );
      setLoading(false);
      return;
    }

    const url =
      `https://api.weatherapi.com/v1/forecast.json` +
      `?key=${API_KEY}&q=${encodeURIComponent(CITY)}&days=7&aqi=no&alerts=no`;

    fetch(url)
      .then((res) => {
        if (!res.ok)
          return res.json().then((e) => {
            throw new Error(e?.error?.message ?? `HTTP ${res.status}`);
          });
        return res.json();
      })
      .then((data) => {
        setCityName(data.location.name.toUpperCase());
        setCountry(data.location.country.toUpperCase());
        setDays(data.forecast.forecastday.map(parseForecastDay));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const prev = () => setActive((i) => (i - 1 + days.length) % days.length);
  const next = () => setActive((i) => (i + 1) % days.length);

  // ── Estado: cargando ──
  if (loading) {
    return (
      <div style={S.app}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={S.statusWrap}>
          <div style={S.spinner} />
          <span style={S.statusText}>CARGANDO DATOS</span>
        </div>
      </div>
    );
  }

  // ── Estado: error ──
  if (error) {
    return (
      <div style={S.app}>
        <div style={S.statusWrap}>
          <span style={{ fontSize: "28px", color: "#E07070" }}>⚠</span>
          <span style={S.statusText}>ERROR DE CARGA</span>
          <span style={S.statusErr}>{error}</span>
        </div>
      </div>
    );
  }

  const d = days[activeIndex];

  return (
    <div style={S.app}>
      <div style={S.card}>

        {/* Ciudad */}
        <div style={S.citySubtitle}>{country}</div>
        <div style={S.cityTitle}>{cityName}</div>

        {/* Navegación de días */}
        <div style={S.dayNav}>
          <button style={S.navBtn} onClick={prev} aria-label="día anterior">‹</button>
          <div style={S.daysRow}>
            {days.map((w, i) => (
              <div
                key={i}
                role="button"
                aria-label={`${w.day} ${w.date}`}
                onClick={() => setActive(i)}
                style={{
                  ...S.dayPill,
                  background: i === activeIndex ? "rgba(123,163,204,0.18)" : "transparent",
                  border:     i === activeIndex
                    ? "1px solid rgba(123,163,204,0.4)"
                    : "1px solid transparent",
                }}
              >
                <span style={{
                  fontSize: "10px", fontWeight: "600", letterSpacing: "0.08em",
                  color: i === activeIndex ? "#7BA3CC" : "#33536A",
                }}>
                  {w.day}
                </span>
                <span style={{
                  fontSize: "15px", fontWeight: "700", lineHeight: 1.2,
                  color: i === activeIndex ? "#E8F2FF" : "#2A4256",
                }}>
                  {w.date}
                </span>
              </div>
            ))}
          </div>
          <button style={S.navBtn} onClick={next} aria-label="día siguiente">›</button>
        </div>

        {/* Ícono de condición climática */}
        <div style={S.iconWrap}>
          <WeatherIcon condition={d.condition} size={80} />
        </div>

        {/* Temperatura principal */}
        <div style={S.tempMain}>
          {d.temp}<span style={S.tempDeg}>°</span>
        </div>

        {/* Texto de condición real de la API */}
        <div style={S.conditionLabel}>{d.conditionText}</div>

        {/* Temperatura mínima / máxima */}
        <div style={S.minMaxRow}>
          <div style={S.minMaxItem}>
            <span style={S.minMaxLabel}>MÍN</span>
            <span style={S.minMaxVal}>{d.min}°</span>
          </div>
          <div style={S.divider} />
          <div style={S.minMaxItem}>
            <span style={S.minMaxLabel}>MÁX</span>
            <span style={S.minMaxVal}>{d.max}°</span>
          </div>
        </div>

        {/* Métricas secundarias: humedad, presión, viento */}
        <div style={S.metricsRow}>
          <div style={S.metric}>
            <HumidityIcon />
            <span style={S.metricVal}>{d.humidity}</span>
            <span style={S.metricUnit}>%</span>
          </div>
          <div style={S.metric}>
            <PressureIcon />
            <span style={S.metricVal}>{d.pressure}</span>
            <span style={S.metricUnit}>hPa</span>
          </div>
          <div style={{ ...S.metric, borderRight: "none" }}>
            <WindIcon />
            <span style={S.metricVal}>{d.wind}</span>
            <span style={S.metricUnit}>m/s</span>
          </div>
        </div>

      </div>
    </div>
  );
}
