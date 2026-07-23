<div className="analytics">

  <div className="analytics-card">
    <h3>🌿 Total Plants</h3>
    <p>{plants.length}</p>
  </div>

  <div className="analytics-card">
    <h3>💚 Healthy Ratio</h3>
    <p>
      {plants.length > 0
        ? Math.round(
            (healthyPlants / plants.length) * 100
          )
        : 0}
      %
    </p>
  </div>

  <div className="analytics-card">
    <h3>💧 Water Due</h3>
    <p>{needsWater}</p>
  </div>

  <div className="analytics-card">
    <h3>📍 Locations</h3>
    <p>
      {
        new Set(
          plants.map((p) => p.location)
        ).size
      }
    </p>
  </div>

</div>