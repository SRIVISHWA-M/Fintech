import React from 'react';

export const EmiBreakdownChart = ({ principal = 980, interest = 210, fees = 50 }) => {
  const total = principal + interest + fees;
  
  // Percentages
  const pPct = (principal / total) * 100;
  const iPct = (interest / total) * 100;
  const fPct = (fees / total) * 100;
  
  // Circumference of radius 50 circle = 2 * PI * 50 = 314.159
  const circ = 314.16;
  
  // Stroke dash offsets
  const pStroke = (pPct / 100) * circ;
  const iStroke = (iPct / 100) * circ;
  const fStroke = (fPct / 100) * circ;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative h-44 w-44">
        {/* SVG Donut */}
        <svg viewBox="0 0 120 120" className="h-full w-full transform -rotate-90">
          <defs>
            {/* Gradients */}
            <linearGradient id="principalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(74% 0.17 165)" />
              <stop offset="100%" stopColor="oklch(62% 0.16 175)" />
            </linearGradient>
            <linearGradient id="interestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(80% 0.12 200)" />
              <stop offset="100%" stopColor="oklch(68% 0.14 210)" />
            </linearGradient>
            <linearGradient id="feesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(65% 0.12 300)" />
              <stop offset="100%" stopColor="oklch(55% 0.14 310)" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke="var(--border)" 
            strokeWidth="10" 
          />
          
          {/* Principal segment */}
          <circle 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke="url(#principalGrad)" 
            strokeWidth="10" 
            strokeDasharray={`${pStroke} ${circ - pStroke}`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />

          {/* Interest segment */}
          <circle 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke="url(#interestGrad)" 
            strokeWidth="10" 
            strokeDasharray={`${iStroke} ${circ - iStroke}`}
            strokeDashoffset={-pStroke}
            strokeLinecap="round"
          />

          {/* Fees segment */}
          <circle 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke="url(#feesGrad)" 
            strokeWidth="10" 
            strokeDasharray={`${fStroke} ${circ - fStroke}`}
            strokeDashoffset={-(pStroke + iStroke)}
            strokeLinecap="round"
          />
        </svg>

        {/* Donut inner label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly EMI</span>
          <span className="text-xl font-bold tracking-tight text-foreground">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center w-full">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded bg-[var(--success)]" style={{ background: 'url(#principalGrad)' }} />
            Principal
          </div>
          <div className="text-sm font-semibold mt-1">${principal}</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded bg-blue-500" style={{ background: 'url(#interestGrad)' }} />
            Interest
          </div>
          <div className="text-sm font-semibold mt-1">${interest}</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded bg-purple-500" style={{ background: 'url(#feesGrad)' }} />
            Fees
          </div>
          <div className="text-sm font-semibold mt-1">${fees}</div>
        </div>
      </div>
    </div>
  );
};

export default EmiBreakdownChart;
