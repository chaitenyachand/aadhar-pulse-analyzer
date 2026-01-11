import { useEffect, useRef, useMemo } from "react";
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from "d3-sankey";

interface MigrationFlow {
  from: string;
  to: string;
  flow: number;
  confidence: number;
}

interface SankeyDiagramProps {
  data: MigrationFlow[];
  width?: number;
  height?: number;
  onNodeClick?: (node: string) => void;
}

interface NodeData {
  name: string;
  type: "source" | "target";
}

interface LinkData {
  source: number;
  target: number;
  value: number;
  confidence: number;
}

const COLORS = {
  source: "hsl(207, 90%, 45%)",
  target: "hsl(24, 95%, 53%)",
  link: "hsl(207, 90%, 65%)",
};

export function SankeyDiagram({
  data,
  width = 800,
  height = 500,
  onNodeClick,
}: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    if (!data || data.length === 0) {
      return { nodes: [], links: [] };
    }

    // Create unique nodes for sources and targets
    const sourceNodes = [...new Set(data.map((d) => d.from))];
    const targetNodes = [...new Set(data.map((d) => d.to))];
    
    // Ensure target nodes are distinct from source nodes in the layout
    const nodes: NodeData[] = [
      ...sourceNodes.map((name) => ({ name, type: "source" as const })),
      ...targetNodes.map((name) => ({ name: `${name}_dest`, type: "target" as const })),
    ];

    const nodeIndex = new Map(nodes.map((n, i) => [n.name, i]));

    const links: LinkData[] = data.map((d) => ({
      source: nodeIndex.get(d.from)!,
      target: nodeIndex.get(`${d.to}_dest`)!,
      value: d.flow,
      confidence: d.confidence,
    }));

    return { nodes, links };
  }, [data]);

  const sankeyData = useMemo(() => {
    if (nodes.length === 0 || links.length === 0) return null;

    const sankeyGenerator = sankey<NodeData, LinkData>()
      .nodeId((d) => nodes.indexOf(d as NodeData))
      .nodeWidth(20)
      .nodePadding(15)
      .extent([
        [50, 20],
        [width - 50, height - 20],
      ]);

    try {
      return sankeyGenerator({
        nodes: nodes.map((d) => ({ ...d })),
        links: links.map((d) => ({ ...d })),
      });
    } catch (error) {
      console.error("Sankey layout error:", error);
      return null;
    }
  }, [nodes, links, width, height]);

  const formatNumber = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!sankeyData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No migration data available
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="overflow-visible"
    >
      {/* Links */}
      <g className="links">
        {sankeyData.links.map((link, i) => {
          const pathData = sankeyLinkHorizontal()(link as any);
          const opacity = 0.3 + ((link as any).confidence || 0.5) * 0.4;
          
          return (
            <g key={i}>
              <path
                d={pathData || ""}
                fill="none"
                stroke={COLORS.link}
                strokeWidth={Math.max(1, (link as any).width || 1)}
                strokeOpacity={opacity}
                className="transition-all duration-200 hover:stroke-opacity-80"
              />
              <title>
                {(link.source as any).name?.replace("_dest", "")} → {(link.target as any).name?.replace("_dest", "")}: {formatNumber(link.value)}
              </title>
            </g>
          );
        })}
      </g>

      {/* Nodes */}
      <g className="nodes">
        {sankeyData.nodes.map((node, i) => {
          const nodeData = node as SankeyNode<NodeData, LinkData>;
          const isSource = nodeData.type === "source";
          const displayName = nodeData.name?.replace("_dest", "") || "";
          
          return (
            <g
              key={i}
              transform={`translate(${nodeData.x0},${nodeData.y0})`}
              className="cursor-pointer"
              onClick={() => onNodeClick?.(displayName)}
            >
              <rect
                width={(nodeData.x1 || 0) - (nodeData.x0 || 0)}
                height={(nodeData.y1 || 0) - (nodeData.y0 || 0)}
                fill={isSource ? COLORS.source : COLORS.target}
                rx={4}
                className="transition-all duration-200 hover:opacity-80"
              />
              <text
                x={isSource ? -6 : (nodeData.x1 || 0) - (nodeData.x0 || 0) + 6}
                y={((nodeData.y1 || 0) - (nodeData.y0 || 0)) / 2}
                dy="0.35em"
                textAnchor={isSource ? "end" : "start"}
                className="text-xs fill-foreground font-medium"
              >
                {displayName}
              </text>
              <title>
                {displayName}: {formatNumber(nodeData.value || 0)} migrations
              </title>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
