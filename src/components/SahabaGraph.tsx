import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { buildTwoLevelGraph } from '../utils/buildTwoLevelGraph';
import biographiesData from '../data/biographies.json';
import { Timeline } from './Timeline';
import { WikipediaModal } from './WikipediaModal';

const FlowInner: React.FC<{
  selectedNode: string | null;
  setSelectedNode: (node: string | null) => void;
}> = ({ selectedNode, setSelectedNode }) => {
  return (
    <>
      <Background
        color="#a0aec0"
        gap={16}
        style={{
          backgroundColor: 'transparent',
        }}
      />
      <Controls position="bottom-right" />
      <MiniMap
        position="bottom-left"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
        }}
      />

      {/* Side Panel - Biography */}
      {selectedNode && (biographiesData.biographies as any)[selectedNode] && (
        <div className="absolute right-0 top-0 w-80 h-full bg-white border-l border-gray-200 overflow-y-auto shadow-lg z-50">
          <div className="p-6">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {(biographiesData.biographies as any)[selectedNode].name}
              </h2>
              <p className="text-sm font-semibold text-prophet-gold">
                {(biographiesData.biographies as any)[selectedNode].title}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Brief History
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {(biographiesData.biographies as any)[selectedNode].history}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const wikipediaUrl = (biographiesData.biographies as any)[selectedNode].wikipedia;
                  document.dispatchEvent(
                    new CustomEvent('openWikipedia', {
                      detail: {
                        url: wikipediaUrl,
                        name: (biographiesData.biographies as any)[selectedNode].name
                      }
                    })
                  );
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Read Full Biography on Wikipedia →
              </button>
            </div>
          </div>
        </div>
      )} 
    </>
  );
};

export const SahabaGraph: React.FC = () => {
  const [activeSuhbah, setActiveSuhbah] = useState(true);
  const [activeFamily, setActiveFamily] = useState(true);
  const [activeLevel1, setActiveLevel1] = useState(true);
  const [activeLevel2, setActiveLevel2] = useState(true);
  const [dragEnabled, setDragEnabled] = useState(true);
  const [centerNode, setCenterNode] = useState('prophet');
  const [selectedNode, setSelectedNode] = useState<string | null>('prophet');
  const [pendingCenter, setPendingCenter] = useState<string | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [wikipediaModal, setWikipediaModal] = useState({ isOpen: false, url: '', name: '' });

  const { nodes: initialNodes, edges: initialEdges } = buildTwoLevelGraph(activeSuhbah, activeFamily, dragEnabled, centerNode, activeLevel1, activeLevel2);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  // Listen for Wikipedia modal event
  React.useEffect(() => {
    const handleOpenWikipedia = (event: any) => {
      const { url, name } = event.detail;
      setWikipediaModal({ isOpen: true, url, name });
    };

    document.addEventListener('openWikipedia', handleOpenWikipedia);
    return () => document.removeEventListener('openWikipedia', handleOpenWikipedia);
  }, []);

  // Handle animation completion - update center and merge new nodes
  const handleAnimationComplete = useCallback(() => {
    if (pendingCenter) {
      // Get the new graph for the new center
      const { nodes: newGraphNodes, edges: newGraphEdges } = buildTwoLevelGraph(activeSuhbah, activeFamily, dragEnabled, pendingCenter, activeLevel1, activeLevel2);
      
      // Merge nodes - keep existing ones and add new ones with their positions
      setNodes(currentNodes => {
        const existingNodeIds = new Set(currentNodes.map(n => n.id));
        const nodesToAdd = newGraphNodes.filter(n => !existingNodeIds.has(n.id));
        return [...currentNodes, ...nodesToAdd];
      });
      
      // Merge edges - add new edges that don't exist
      setEdges(currentEdges => {
        const existingEdgeIds = new Set(currentEdges.map(e => e.id));
        const edgesToAdd = newGraphEdges.filter(e => !existingEdgeIds.has(e.id));
        return [...currentEdges, ...edgesToAdd];
      });
      
      // Update center and clear pending
      setCenterNode(pendingCenter);
      setPendingCenter(null);
    }
  }, [pendingCenter, activeSuhbah, activeFamily, dragEnabled, activeLevel1, activeLevel2, setNodes, setEdges]);

  // Update nodes and edges when dependencies change
  React.useEffect(() => {
    const { nodes: updatedNodes, edges: updatedEdges } = buildTwoLevelGraph(activeSuhbah, activeFamily, dragEnabled, centerNode, activeLevel1, activeLevel2);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [activeSuhbah, activeFamily, dragEnabled, centerNode, activeLevel1, activeLevel2, setNodes, setEdges]);

  // Animate to the pending center node when a node is clicked
  React.useEffect(() => {
    if (!pendingCenter || !reactFlowInstance) return;

    const node = reactFlowInstance.getNode(pendingCenter);
    if (!node) return;

    const currentZoom = reactFlowInstance.getZoom();
    reactFlowInstance.setCenter(
      node.position.x + (node.width || 0) / 2,
      node.position.y + (node.height || 0) / 2,
      { duration: 800, zoom: currentZoom }
    );

    const timer = setTimeout(() => {
      handleAnimationComplete();
    }, 800);

    return () => clearTimeout(timer);
  }, [pendingCenter, reactFlowInstance, handleAnimationComplete]);

  // Handle node click to set as center
  const handleNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setPendingCenter(node.id);
    setSelectedNode(node.id);
  }, []);

  // Add marker end to edges
  const edgesWithArrows = edges.map(edge => ({
    ...edge,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: edge.className === 'suhbah' ? '#d4af37' : '#059669',
    },
  }));

  const handleSuhbahToggle = useCallback(() => {
    setActiveSuhbah((prev) => !prev);
  }, []);

  const handleFamilyToggle = useCallback(() => {
    setActiveFamily((prev) => !prev);
  }, []);

  const handleDragToggle = useCallback(() => {
    setDragEnabled((prev) => !prev);
  }, []);

  const handleLevel1Toggle = useCallback(() => {
    setActiveLevel1((prev) => !prev);
  }, []);

  const handleLevel2Toggle = useCallback(() => {
    setActiveLevel2((prev) => !prev);
  }, []);

  return (
    <div className="w-full min-h-screen bg-calm-beige">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Companions Graph
        </h1>
        <p className="text-gray-600 text-sm">
          Mapping Exemplary Lives
        </p>
      </div>

      {/* Controls Panel */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4 items-center flex-wrap z-10">
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-3 rounded transition-colors">
          <input
            type="checkbox"
            checked={activeSuhbah}
            onChange={handleSuhbahToggle}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Companionship (Suhbah)
          </span>
          <div className="w-3 h-3 bg-prophet-gold rounded-full opacity-60" />
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-3 rounded transition-colors">
          <input
            type="checkbox"
            checked={activeFamily}
            onChange={handleFamilyToggle}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Family Relations
          </span>
          <div className="w-3 h-3 bg-family-green rounded-full opacity-50" />
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-3 rounded transition-colors">
          <input
            type="checkbox"
            checked={activeLevel1}
            onChange={handleLevel1Toggle}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Level 1
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-3 rounded transition-colors">
          <input
            type="checkbox"
            checked={activeLevel2}
            onChange={handleLevel2Toggle}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Level 2
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-3 rounded transition-colors">
          <input
            type="checkbox"
            checked={dragEnabled}
            onChange={handleDragToggle}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Drag
          </span>
          <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded ${dragEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
            {dragEnabled ? 'ON' : 'OFF'}
          </span>
        </label>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        <div className="absolute left-4 top-4 z-10 text-xs text-gray-600 bg-white/90 border border-gray-200 rounded px-2 py-1 shadow">
          Nodes: {nodes.length} • Edges: {edges.length}
        </div>
        {/* Graph Area */}
        <div style={{ width: '100%', height: '600px' }}>
          <ReactFlow 
            nodes={nodes} 
            edges={edgesWithArrows}
            onNodesChange={onNodesChange}
            onNodeClick={handleNodeClick}
            onInit={setReactFlowInstance}
            fitView
            panOnScroll={false}
            zoomOnScroll={false}
            style={{ width: '100%', height: 600 }}
          >
            <FlowInner
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          </ReactFlow>
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              No nodes to display.
            </div>
          )}
        </div>

        {/* Timeline Component */}
        <Timeline />
      </div>

      {/* Wikipedia Modal */}
      <WikipediaModal
        isOpen={wikipediaModal.isOpen}
        url={wikipediaModal.url}
        name={wikipediaModal.name}
        onClose={() => setWikipediaModal({ isOpen: false, url: '', name: '' })}
      />
    </div>
  );
};
