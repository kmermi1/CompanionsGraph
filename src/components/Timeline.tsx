import React, { useState } from 'react';

interface HistoricalEvent {
  id: string;
  year: number;
  age: number;
  title: string;
  description: string;
  details: string;
}

const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'birth',
    year: 570,
    age: 0,
    title: 'Birth of Prophet Muhammad',
    description: 'Birth in Mecca',
    details: 'The Prophet Muhammad was born in Mecca. His father Abdullah had died before his birth, and his mother Aminah died when he was six years old.'
  },
  {
    id: 'nurse',
    year: 576,
    age: 6,
    title: 'Death of Mother',
    description: 'Mother Aminah passes away',
    details: 'After his mother\'s death, the Prophet was raised by his grandfather Abdul Muttalib, and later by his uncle Abu Talib.'
  },
  {
    id: 'merchant',
    year: 595,
    age: 25,
    title: 'Marriage to Khadijah',
    description: 'Marries Khadijah bint Khuwaylid',
    details: 'The Prophet married Khadijah, a wealthy widow and successful merchant. She was 15 years older than him, and became his first and most devoted follower.'
  },
  {
    id: 'revelation',
    year: 610,
    age: 40,
    title: 'First Revelation',
    description: 'Receives first revelation in Cave of Hira',
    details: 'At age 40, while meditating in the Cave of Hira, the Prophet received his first revelation from Angel Gabriel. This marked the beginning of his prophetic mission.'
  },
  {
    id: 'preaching',
    year: 613,
    age: 43,
    title: 'Public Preaching Begins',
    description: 'Begins public preaching of Islam',
    details: 'The Prophet began preaching Islam publicly in Mecca, calling people to worship only Allah. He faced strong opposition from the Quraysh tribe.'
  },
  {
    id: 'hijra',
    year: 622,
    age: 52,
    title: 'Hijra to Medina',
    description: 'Migration from Mecca to Medina',
    details: 'Facing persecution, the Prophet and his followers migrated to Medina. This event marks the beginning of the Islamic calendar (Hijri calendar).'
  },
  {
    id: 'badr',
    year: 624,
    age: 54,
    title: 'Battle of Badr',
    description: 'First major battle with the Quraysh',
    details: 'The Muslims achieved a significant victory against the larger Quraysh army at the Battle of Badr. This boosted the morale of the young Muslim community.'
  },
  {
    id: 'uhud',
    year: 625,
    age: 55,
    title: 'Battle of Uhud',
    description: 'Second major battle near Medina',
    details: 'The Muslims faced defeat at the Battle of Uhud. The Prophet was injured and several companions were martyred, but the Muslim community remained steadfast.'
  },
  {
    id: 'khandaq',
    year: 627,
    age: 57,
    title: 'Battle of Khandaq',
    description: 'Battle of the Trench',
    details: 'The Muslims successfully defended Medina by digging a trench. The siege lasted several weeks, and the Quraysh eventually withdrew without breaking through.'
  },
  {
    id: 'hudaybiyyah',
    year: 628,
    age: 58,
    title: 'Treaty of Hudaybiyyah',
    description: 'Peace treaty with the Quraysh',
    details: 'A 10-year truce was established between the Muslims and Quraysh. This allowed for peaceful missionary work and strengthened the Muslim position.'
  },
  {
    id: 'khaybar',
    year: 628,
    age: 58,
    title: 'Conquest of Khaybar',
    description: 'Conquest of Jewish strongholds',
    details: 'The Muslims conquered the strongholds of Khaybar, a major Jewish settlement in northern Arabia. This expanded Muslim territory and resources.'
  },
  {
    id: 'mecca',
    year: 630,
    age: 60,
    title: 'Conquest of Mecca',
    description: 'Bloodless conquest of Mecca',
    details: 'The Prophet led an army of 10,000 Muslims and entered Mecca peacefully. The Kaaba was cleansed of idols, and Mecca became the holiest city in Islam.'
  },
  {
    id: 'hajj',
    year: 632,
    age: 62,
    title: 'Farewell Pilgrimage',
    description: 'Last Hajj and final sermon',
    details: 'The Prophet performed his final Hajj and delivered the Farewell Sermon, emphasizing brotherhood, justice, and equality. Hundreds of thousands of Muslims participated.'
  },
  {
    id: 'death',
    year: 632,
    age: 63,
    title: 'Death of the Prophet',
    description: 'The Prophet passes away in Medina',
    details: 'The Prophet Muhammad passed away in Medina. He left behind a unified Arabian Peninsula, millions of followers, and a legacy that would shape history.'
  }
];

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
