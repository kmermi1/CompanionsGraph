import React, { useState, useRef, useEffect } from 'react';

interface WikipediaModalProps {
  isOpen: boolean;
  url: string;
  name: string;
  onClose: () => void;
}

export const WikipediaModal: React.FC<WikipediaModalProps> = ({ isOpen, url, name, onClose }) => {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<string>('');
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    setIsResizing(true);
    setResizeType(type);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartWidth(width);
    setStartHeight(height);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const minWidth = 400;
      const minHeight = 300;

      if (resizeType === 'right') {
        setWidth(Math.max(minWidth, startWidth + deltaX));
      } else if (resizeType === 'bottom') {
        setHeight(Math.max(minHeight, startHeight + deltaY));
      } else if (resizeType === 'corner') {
        setWidth(Math.max(minWidth, startWidth + deltaX));
        setHeight(Math.max(minHeight, startHeight + deltaY));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeType('');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeType, startX, startY, startWidth, startHeight]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl flex flex-col relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: '95vw',
          maxHeight: '95vh',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 truncate">{name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none ml-4 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content - Wikipedia iframe */}
        <div className="overflow-hidden flex-1">
          <iframe
            src={url}
            className="w-full h-full border-none"
            title={`Wikipedia article about ${name}`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Open Full Page →
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded transition-colors"
          >
            Close
          </button>
        </div>

        {/* Resize Handles */}
        {/* Right edge */}
        <div
          onMouseDown={(e) => handleMouseDown(e, 'right')}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 hover:w-2 transition-all"
        />

        {/* Bottom edge */}
        <div
          onMouseDown={(e) => handleMouseDown(e, 'bottom')}
          className="absolute left-0 right-0 bottom-0 h-1 cursor-row-resize hover:bg-blue-500 hover:h-2 transition-all"
        />

        {/* Corner */}
        <div
          onMouseDown={(e) => handleMouseDown(e, 'corner')}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #3b82f6 50%)',
          }}
        />
      </div>
    </div>
  );
};
