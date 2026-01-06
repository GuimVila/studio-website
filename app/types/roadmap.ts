export type RoadmapNode = {
  id: string;
  seq: number;
  category: string;
  level: number;
  module: string;
  title: string;
  prereqIds: string[];

  categorySlug: string;
  slug: string;
  path: string;

  objective?: string;
  exercise?: string;
  resourceType?: string;
  monetization?: string;
  cta?: string;
  tags?: string;
  estMinutes?: number | null;
  measurable?: string;
  notes?: string;
};

export type RoadmapData = { nodes: RoadmapNode[] };
