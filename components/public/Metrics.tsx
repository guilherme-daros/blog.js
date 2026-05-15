export default function Metrics() {
  return (
    <section className="metrics-bar">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">IBOV</div>
          <div className="metric-value">
            131,902 <span className="unit">pts</span>
          </div>
          <div className="metric-change up">+1.42%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">USD/BRL</div>
          <div className="metric-value">5.6412</div>
          <div className="metric-change down">-0.38%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">SELIC</div>
          <div className="metric-value">
            14.25 <span className="unit">% a.a.</span>
          </div>
          <div className="metric-change up">+0.50pp</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">IPCA 12M</div>
          <div className="metric-value">
            5.48 <span className="unit">%</span>
          </div>
          <div className="metric-change down">-0.12pp</div>
        </div>
      </div>
    </section>
  );
}
