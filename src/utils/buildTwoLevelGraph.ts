import { Node, Edge } from 'reactflow';
import sahabaData from '../data/sahaba.json';
import relationshipsData from '../data/relationships.json';

interface Sahaba {
  id: string;
  name: string;
  type: string;
}

interface Relationship {
  source: string;
  target: string;
  type: string;
  familyType?: string;
}

const RADIUS_LEVEL_1 = 250;
const RADIUS_LEVEL_2 = 450;

/**
 * Build a two-level graph starting from any center node.
 * Level 1: Direct connections to the center node
 * Level 2: Connections from level-1 nodes
 * Returns filtered nodes and edges based on active relationship types.
 */
export function buildTwoLevelGraph(
  activeSuhbah: boolean,
  activeFamily: boolean,
  dragEnabled: boolean = false,
  centerNodeId: string = 'prophet'
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const sahaba: Sahaba[] = sahabaData.sahaba;
  const relationships: Relationship[] = relationshipsData.relationships;

  // Track which nodes to include
  const includedNodeIds = new Set<string>();
  const level1Nodes = new Set<string>();
  const level2Nodes = new Set<string>();

  // Always include the center node
  includedNodeIds.add(centerNodeId);

  // Find Level 1 nodes (direct connections to center node)
  relationships.forEach((rel) => {
    if (rel.source === centerNodeId && ((activeSuhbah && rel.type === 'suhbah') || (activeFamily && rel.type === 'family'))) {
      includedNodeIds.add(rel.target);
      level1Nodes.add(rel.target);
    }
    if (rel.target === centerNodeId && ((activeSuhbah && rel.type === 'suhbah') || (activeFamily && rel.type === 'family'))) {
      includedNodeIds.add(rel.source);
      level1Nodes.add(rel.source);
    }
  });

  // Find Level 2 nodes (connections from Level 1 nodes)
  relationships.forEach((rel) => {
    if (level1Nodes.has(rel.source)) {
      if (
        (rel.type === 'suhbah' && activeSuhbah) ||
        (rel.type === 'family' && activeFamily)
      ) {
        if (rel.target !== 'prophet') {
          includedNodeIds.add(rel.target);
          level2Nodes.add(rel.target);
        }
      }
    }
  });

  // Create nodes with positioning
  const level1Count = level1Nodes.size;
  let level1Index = 0;

  sahaba.forEach((person) => {
    if (!includedNodeIds.has(person.id)) return;

    let position = { x: 0, y: 0 };
    let nodeClass = 'level2';

    if (person.id === centerNodeId) {
      // Center the selected node
      position = { x: 0, y: 0 };
      nodeClass = 'prophet';
    } else if (level1Nodes.has(person.id)) {
      // Arrange Level 1 nodes in a circle
      const angle = (level1Index / level1Count) * 2 * Math.PI;
      position = {
        x: RADIUS_LEVEL_1 * Math.cos(angle),
        y: RADIUS_LEVEL_1 * Math.sin(angle),
      };
      nodeClass = 'level1';
      level1Index++;
    } else {
      // Arrange Level 2 nodes in outer circle
      // Find which level1 node it's connected to for positioning
      let parentIndex = 0;
      relationships.forEach((rel) => {
        if (rel.target === person.id && level1Nodes.has(rel.source)) {
          // Find the index of the parent in level1
          let idx = 0;
          level1Nodes.forEach((nodeId) => {
            if (nodeId === rel.source) parentIndex = idx;
            idx++;
          });
        }
      });

      const parentAngle = (parentIndex / level1Count) * 2 * Math.PI;
      const offset = 60; // offset from parent angle
      const childAngle = parentAngle + (offset * Math.PI) / 180;
      position = {
        x: RADIUS_LEVEL_2 * Math.cos(childAngle),
        y: RADIUS_LEVEL_2 * Math.sin(childAngle),
      };
    }

    nodes.push({
      id: person.id,
      data: { label: person.name },
      position,
      className: nodeClass,
      draggable: dragEnabled,
      connectable: false,
    });
  });

  // Create edges
  relationships.forEach((rel) => {
    if (
      includedNodeIds.has(rel.source) &&
      includedNodeIds.has(rel.target)
    ) {
      if (
        (rel.type === 'suhbah' && activeSuhbah) ||
        (rel.type === 'family' && activeFamily)
      ) {
        let labelText = rel.type === 'suhbah' ? 'Suhbah' : (rel.familyType || 'Family');
        
        edges.push({
          id: `${rel.source}-${rel.target}`,
          source: rel.source,
          target: rel.target,
          className: rel.type,
          animated: false,
          label: labelText,
          labelStyle: {
            fill: rel.type === 'suhbah' ? '#d4af37' : '#059669',
            fontSize: '11px',
            fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '2px 6px',
            borderRadius: '4px',
          },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
        });
      }
    }
  });

  return { nodes, edges };
}
