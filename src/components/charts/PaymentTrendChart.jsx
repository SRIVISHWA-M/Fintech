import React from 'react';

export const PaymentTrendChart = () => {
  // Let's create a beautiful stacked bar chart showing payment installments of last 6 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Heights and positioning
  const width = 300;
  const height = 120;
  const paddingX = 40;
  const paddingY = 15;
  
  const chartWidth = width - paddingX - 10;
  const chartHeight = height - paddingY - 15;
  
  // Monthly installments data
  // Total EMI = $1240. Principal goes up slightly and Interest goes down slightly in real amortization,
  // but let's mock it slightly or keep it standard ($980 Principal, $210 Interest, $50 fees)
  const data = [
    { label: 'Jan', principal: 940, interest: 250, fees: 50 },
    { label: 'Feb', principal: 950, interest: 240, fees: 50 },
    { label: 'Mar', principal: 960, interest: 230, fees: 50 },
    { label: 'Apr', principal: 970, interest: 220, fees: 50 },
    { label: 'May', principal: 980, interest: 210, fees: 50 },
    { label: 'Jun', principal: 990, interest: 200, fees: 50 }
  ];

  const totalEMI = 1290; // $990 + $250 + $50 = max sum in data list

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Instalments</span>
          <h4 className="text-sm font-semibold text-foreground">Monthly Payment Trend</h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Average</span>
          <h4 className="text-sm font-semibold text-foreground">$1,240 / mo</h4>
        </div>
      </div>

      <div className="h-32 w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - 10} y2={paddingY} stroke="var(--border)" strokeDasharray="2 2" />
          <line x1={paddingX} y1={paddingY + chartHeight/2} x2={width - 10} y2={paddingY + chartHeight/2} stroke="var(--border)" strokeDasharray="2 2" />
          <line x1={paddingX} y1={height - 20} x2={width - 10} y2={height - 20} stroke="var(--border)" />

          {/* Draw bars */}
          {data.map((d, idx) => {
            const x = paddingX + (idx / (data.length)) * chartWidth + 8;
            const barWidth = 18;

            // Heights normalized to totalEMI
            const pHeight = (d.principal / totalEMI) * chartHeight;
            const iHeight = (d.interest / totalEMI) * chartHeight;
            const fHeight = (d.fees / totalEMI) * chartHeight;

            // Y coordinates
            const yF = height - 20 - fHeight;
            const yI = yF - iHeight;
            const yP = yI - pHeight;

            return (
              <g key={idx}>
                {/* Principal segment (emerald green) */}
                <rect 
                  x={x} 
                  y={yP} 
                  width={barWidth} 
                  height={pHeight} 
                  fill="oklch(74% 0.17 165)" 
                  rx="2"
                />
                
                {/* Interest segment (blue) */}
                <rect 
                  x={x} 
                  y={yI} 
                  width={barWidth} 
                  height={iHeight} 
                  fill="oklch(80% 0.12 200)"
                  rx="1"
                />

                {/* Fees segment (purple) */}
                <rect 
                  x={x} 
                  y={yF} 
                  width={barWidth} 
                  height={fHeight} 
                  fill="oklch(65% 0.12 300)"
                  rx="1"
                />

                {/* X Axis Label */}
                <text 
                  x={x + barWidth/2} 
                  y={height - 5} 
                  textAnchor="middle" 
                  fill="var(--muted-foreground)" 
                  fontSize="8"
                  fontWeight="500"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Y Axis text */}
          <text x="5" y={paddingY + 3} fill="var(--muted-foreground)" fontSize="7" fontWeight="500">$1.2K</text>
          <text x="5" y={paddingY + chartHeight/2 + 3} fill="var(--muted-foreground)" fontSize="7" fontWeight="500">$600</text>
          <text x="5" y={height - 17} fill="var(--muted-foreground)" fontSize="7" fontWeight="500">$0</text>
        </svg>
      </div>

      {/* Mini Color Indicator */}
      <div className="mt-2 flex justify-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-[var(--success)]" />
          Principal
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-blue-400" />
          Interest
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-purple-400" />
          Fees
        </div>
      </div>
    </div>
  );
};

export default PaymentTrendChart;
