import React from 'react';

export const LoanProgressChart = ({ outstanding = 22320, principal = 48000 }) => {
  // Let's draw a nice area line chart representing progress
  // Outstanding drops from $48,000 down to current outstanding balance.
  // We can plot 6 points: Month 1 to Month 6 (or representing progress)
  const paidPct = ((principal - outstanding) / principal) * 100;
  
  // Custom SVG Plotting Area
  // Width 300, Height 120
  // Margins: left 30, right 10, top 10, bottom 20
  const points = [
    { label: 'Sep', val: principal },
    { label: 'Nov', val: principal - 3720 },
    { label: 'Jan', val: principal - 7440 },
    { label: 'Mar', val: principal - 11160 },
    { label: 'May', val: principal - 24000 },
    { label: 'Jun', val: outstanding } // Connected dynamically to store value
  ];

  // Map values to coordinates
  const width = 300;
  const height = 120;
  const paddingX = 40;
  const paddingY = 15;
  
  const chartWidth = width - paddingX - 10;
  const chartHeight = height - paddingY - 15;
  
  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * chartWidth;
    // Map value to Y: principal is top, 0 is bottom.
    // Normalized ratio (0 to 1)
    const ratio = p.val / principal;
    const y = paddingY + (1 - ratio) * chartHeight;
    return { x, y, ...p };
  });

  // Construct SVG Path strings
  let linePath = '';
  let areaPath = `M ${coords[0].x} ${height - 20} `;
  
  coords.forEach((c, idx) => {
    if (idx === 0) {
      linePath += `M ${c.x} ${c.y} `;
    } else {
      // Use smooth quadratic/cubic curves or straight lines
      linePath += `L ${c.x} ${c.y} `;
    }
    areaPath += `L ${c.x} ${c.y} `;
  });
  
  areaPath += `L ${coords[coords.length - 1].x} ${height - 20} Z`;

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Repaid</span>
          <h4 className="text-sm font-semibold text-foreground">
            {paidPct.toFixed(1)}% Completed
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Remaining</span>
          <h4 className="text-sm font-semibold text-success">
            ${outstanding.toLocaleString()}
          </h4>
        </div>
      </div>
      
      {/* SVG Canvas */}
      <div className="h-32 w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(74% 0.17 165)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="oklch(74% 0.17 165)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--border)" />
              <stop offset="100%" stopColor="oklch(74% 0.17 165)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - 10} y2={paddingY} stroke="var(--border)" strokeDasharray="2 2" />
          <line x1={paddingX} y1={paddingY + chartHeight/2} x2={width - 10} y2={paddingY + chartHeight/2} stroke="var(--border)" strokeDasharray="2 2" />
          <line x1={paddingX} y1={height - 20} x2={width - 10} y2={height - 20} stroke="var(--border)" />

          {/* Area region */}
          <path d={areaPath} fill="url(#areaGrad)" />
          
          {/* Main trend line */}
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interaction dots and coordinates label */}
          {coords.map((c, idx) => (
            <g key={idx}>
              {idx === coords.length - 1 && (
                <circle cx={c.x} cy={c.y} r="5" fill="oklch(74% 0.17 165)" stroke="var(--card)" strokeWidth="1.5" />
              )}
              {idx === coords.length - 1 && (
                <circle cx={c.x} cy={c.y} r="9" fill="oklch(74% 0.17 165)" fillOpacity="0.15" />
              )}
              <text 
                x={c.x} 
                y={height - 5} 
                textAnchor="middle" 
                fill="var(--muted-foreground)" 
                fontSize="8"
                fontWeight="500"
              >
                {c.label}
              </text>
            </g>
          ))}
          
          {/* Y Axis values */}
          <text x="5" y={paddingY + 3} fill="var(--muted-foreground)" fontSize="7" fontWeight="500">$48K</text>
          <text x="5" y={paddingY + chartHeight/2 + 3} fill="var(--muted-foreground)" fontSize="7" fontWeight="500">$24K</text>
          <text x="5" y={height - 17} fill="var(--muted-foreground)" fontSize="7" fontWeight="500">$0</text>
        </svg>
      </div>
    </div>
  );
};

export default LoanProgressChart;
