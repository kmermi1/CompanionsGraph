import React, { useState } from 'react';
import timelineData from '../data/timeline.json';

interface HistoricalEvent {
  id: string;
  year: number;
  age: number;
  title: string;
  description: string;
  details: string;
}

const HISTORICAL_EVENTS: HistoricalEvent[] = timelineData.events;

interface TimelineProps {
  onEventSelect?: (event: HistoricalEvent) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ onEventSelect }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('birth');
  const [sliderValue, setSliderValue] = useState<number>(0);

  const selectedEvent = HISTORICAL_EVENTS[sliderValue];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setSliderValue(newValue);
    setSelectedEventId(HISTORICAL_EVENTS[newValue].id);
    onEventSelect?.(HISTORICAL_EVENTS[newValue]);
  };

  const handleEventClick = (index: number) => {
    setSliderValue(index);
    setSelectedEventId(HISTORICAL_EVENTS[index].id);
    onEventSelect?.(HISTORICAL_EVENTS[index]);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Prophet Muhammad's Life Timeline
      </h2>

      {/* Timeline Slider */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={HISTORICAL_EVENTS.length - 1}
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-prophet-gold"
              style={{
                pointerEvents: 'auto',
                background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${
                  (sliderValue / (HISTORICAL_EVENTS.length - 1)) * 100
                }%, #e5e7eb ${(sliderValue / (HISTORICAL_EVENTS.length - 1)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            {selectedEvent.year} CE (Age {selectedEvent.age})
          </span>
        </div>

        {/* Event Points */}
        <div className="flex justify-between px-0 mb-2">
          {HISTORICAL_EVENTS.map((event, index) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(index)}
              title={event.title}
              className={`relative group transition-all ${
                selectedEventId === event.id ? 'opacity-100' : 'opacity-60 hover:opacity-80'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  selectedEventId === event.id
                    ? 'bg-prophet-gold ring-2 ring-prophet-gold ring-offset-2'
                    : 'bg-gray-400 hover:bg-prophet-gold'
                }`}
              />
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {event.year}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-gradient-to-br from-prophet-gold/5 to-family-green/5 rounded-lg p-6 border border-prophet-gold/20">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {selectedEvent.title}
          </h3>
          <p className="text-sm font-semibold text-prophet-gold">
            {selectedEvent.year} CE • Age {selectedEvent.age}
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {selectedEvent.details}
        </p>
      </div>
    </div>
  );
};
