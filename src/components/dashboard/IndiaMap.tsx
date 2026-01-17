import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface StateData {
  state: string;
  value: number;
}

interface IndiaMapProps {
  data: StateData[];
  onStateClick?: (state: string) => void;
  selectedState?: string;
  colorScale?: "blue" | "saffron" | "green" | "heat";
  className?: string;
}

// Simplified India map SVG paths for major states
// Note: Names match database format (e.g., "Jammu and Kashmir" not "Jammu & Kashmir")
const statePaths: Record<string, string> = {
  "Jammu and Kashmir": "M 150,20 L 180,15 L 200,30 L 210,60 L 190,80 L 160,75 L 140,50 Z",
  "Himachal Pradesh": "M 170,75 L 195,70 L 210,85 L 200,100 L 175,95 Z",
  "Punjab": "M 140,85 L 170,80 L 175,100 L 150,110 L 135,100 Z",
  "Uttarakhand": "M 200,90 L 230,85 L 245,100 L 225,115 L 200,110 Z",
  "Haryana": "M 150,105 L 175,100 L 180,120 L 165,135 L 145,125 Z",
  "Delhi": "M 170,120 L 180,118 L 182,130 L 170,132 Z",
  "Rajasthan": "M 95,115 L 145,110 L 165,135 L 160,185 L 110,200 L 85,170 Z",
  "Uttar Pradesh": "M 180,115 L 245,100 L 280,130 L 275,175 L 220,190 L 175,170 L 165,140 Z",
  "Bihar": "M 280,140 L 320,135 L 330,165 L 300,180 L 275,170 Z",
  "Sikkim": "M 330,130 L 345,125 L 350,140 L 335,145 Z",
  "Arunachal Pradesh": "M 370,110 L 420,95 L 440,120 L 410,140 L 375,135 Z",
  "Nagaland": "M 415,140 L 440,135 L 450,155 L 425,165 Z",
  "Manipur": "M 415,165 L 440,160 L 445,185 L 420,190 Z",
  "Mizoram": "M 410,195 L 435,190 L 440,225 L 415,230 Z",
  "Tripura": "M 395,195 L 415,190 L 415,215 L 395,220 Z",
  "Meghalaya": "M 360,160 L 400,155 L 405,175 L 365,180 Z",
  "Assam": "M 345,140 L 405,130 L 415,160 L 365,175 L 350,155 Z",
  "West Bengal": "M 300,175 L 340,160 L 365,180 L 350,230 L 310,240 L 295,200 Z",
  "Jharkhand": "M 275,180 L 310,175 L 320,210 L 290,225 L 270,205 Z",
  "Odisha": "M 270,210 L 310,205 L 330,240 L 300,275 L 260,260 Z",
  "Chhattisgarh": "M 230,195 L 275,190 L 285,230 L 260,265 L 220,250 Z",
  "Madhya Pradesh": "M 160,175 L 230,165 L 245,200 L 225,245 L 165,240 L 140,210 Z",
  "Gujarat": "M 60,175 L 110,165 L 130,200 L 110,250 L 65,260 L 45,220 Z",
  "Maharashtra": "M 110,245 L 170,235 L 200,270 L 180,320 L 120,330 L 90,290 Z",
  "Telangana": "M 180,275 L 230,265 L 250,295 L 225,330 L 185,325 Z",
  "Andhra Pradesh": "M 200,320 L 255,300 L 290,340 L 265,400 L 210,385 L 195,345 Z",
  "Karnataka": "M 120,325 L 185,315 L 210,380 L 180,430 L 115,420 L 100,370 Z",
  "Goa": "M 100,365 L 115,360 L 118,380 L 102,385 Z",
  "Kerala": "M 130,425 L 160,415 L 175,470 L 150,500 L 125,475 Z",
  "Tamil Nadu": "M 160,420 L 215,400 L 250,450 L 220,510 L 165,495 L 150,450 Z",
};

export function IndiaMap({
  data,
  onStateClick,
  selectedState,
  colorScale = "blue",
  className,
}: IndiaMapProps) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    
    switch (colorScale) {
      case "saffron":
        return `hsl(24, 95%, ${85 - intensity * 35}%)`;
      case "green":
        return `hsl(145, 76%, ${70 - intensity * 40}%)`;
      case "heat":
        // Blue to Yellow to Red
        if (intensity < 0.5) {
          return `hsl(${207 - intensity * 100}, 70%, 50%)`;
        }
        return `hsl(${57 - (intensity - 0.5) * 114}, 80%, 50%)`;
      default:
        return `hsl(207, 90%, ${75 - intensity * 40}%)`;
    }
  };

  const getStateValue = (stateName: string) => {
    const stateData = data.find(
      (d) => d.state.toLowerCase() === stateName.toLowerCase()
    );
    return stateData?.value || 0;
  };

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox="0 0 500 550"
        className="w-full h-auto"
        style={{ maxHeight: "500px" }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(207, 90%, 95%)" />
            <stop offset="100%" stopColor="hsl(207, 90%, 90%)" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="500" height="550" fill="url(#oceanGradient)" rx="12" />

        {/* States */}
        <g filter="url(#shadow)">
          {Object.entries(statePaths).map(([stateName, path]) => {
            const value = getStateValue(stateName);
            const isSelected = selectedState === stateName;

            return (
              <path
                key={stateName}
                d={path}
                fill={getColor(value)}
                stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={isSelected ? 2 : 0.5}
                className={cn(
                  "transition-all duration-200 cursor-pointer",
                  onStateClick && "hover:opacity-80 hover:stroke-primary hover:stroke-2"
                )}
                onClick={() => onStateClick?.(stateName)}
              >
                <title>
                  {stateName}: {value.toLocaleString("en-IN")}
                </title>
              </path>
            );
          })}
        </g>

        {/* Legend */}
        <g transform="translate(20, 480)">
          <text x="0" y="0" fontSize="12" fill="hsl(var(--muted-foreground))" fontWeight="500">
            Intensity Scale
          </text>
          <defs>
            <linearGradient id="legendGradient">
              <stop offset="0%" stopColor={getColor(0)} />
              <stop offset="50%" stopColor={getColor(maxValue / 2)} />
              <stop offset="100%" stopColor={getColor(maxValue)} />
            </linearGradient>
          </defs>
          <rect x="0" y="10" width="150" height="12" fill="url(#legendGradient)" rx="2" />
          <text x="0" y="35" fontSize="10" fill="hsl(var(--muted-foreground))">
            Low
          </text>
          <text x="130" y="35" fontSize="10" fill="hsl(var(--muted-foreground))">
            High
          </text>
        </g>
      </svg>
    </div>
  );
}
