import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserCheck } from 'lucide-react';
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import LocationMapModal from '../components/family/LocationMapModal';

export default function FamilyView() {
  const { people, loading, error } = useHomeAssistant();
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Filter to only person entities (not device_tracker or zone)
  const persons = people.filter(p => p.entity_id.startsWith('person.'));

  // Separate people by location status
  const homePeople = persons.filter(p => p.state === 'home');
  const awayPeople = persons.filter(p => p.state !== 'home' && p.state !== 'unknown');

  // Color mappings for family members - assign specific colors to Mom/Dad
  const getPersonColorClasses = (entityId) => {
    const name = entityId.toLowerCase();
    
    if (name.includes('mom') || name.includes('mother')) {
      return { border: 'border-green-500', text: 'text-green-500', bg: 'bg-white' };
    } else if (name.includes('dad') || name.includes('father')) {
      return { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-white' };
    }
    
    // Fallback color rotation for other family members
    const colorMaps = [
      { border: 'border-purple-500', text: 'text-purple-500', bg: 'bg-purple-500' },
      { border: 'border-orange-500', text: 'text-orange-500', bg: 'bg-orange-500' },
      { border: 'border-pink-400', text: 'text-pink-400', bg: 'bg-pink-400' },
    ];
    const index = entityId.split('.')[1].length % colorMaps.length;
    return colorMaps[index];
  };

  const getPersonIcon = (personName) => {
    console.log('getPersonIcon called with:', personName);
    const name = personName.toLowerCase();
    if (name.includes('mom') || name.includes('mother')) {
      console.log('Returning mom icon');
      return <span className="text-9xl">👩</span>;
    } else if (name.includes('dad') || name.includes('father')) {
      console.log('Returning dad icon');
      return <span className="text-9xl">👨</span>;
    }
    console.log('Returning initials for:', personName);
    // Fallback to initials
    const initials = personName.split(' ').map(n => n[0]).join('').toUpperCase();
    return <span className="text-6xl font-bold text-white">{initials}</span>;
  };

  const PersonCard = ({ person, isHome }) => {
    const colors = getPersonColorClasses(person.entity_id);

    return (
      <motion.div
        layout
        initial={false}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedPerson(person)}
        className="p-8 cursor-pointer group transition-all duration-300"
      >
        {/* Large avatar circle */}
        <div className="flex flex-col items-center space-y-6">
          <div className={`w-80 h-80 rounded-full border-12 ${colors.border} ${colors.bg} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`} style={{ borderWidth: '12px' }}>
            {console.log('Rendering person:', person.attributes.friendly_name, 'has picture:', !!person.attributes.picture)}
            {person.attributes.picture ? (
              <img
                src={person.attributes.picture}
                alt={person.attributes.friendly_name}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  console.log('Image failed to load:', person.attributes.picture);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex items-center justify-center">
                {getPersonIcon(person.attributes.friendly_name)}
              </div>
            )}
          </div>

        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading family locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h2>
          <p className="text-red-600 mb-4">Unable to load family location data</p>
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  if (persons.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No Family Members Found</h2>
          <p className="text-gray-600 mb-4">Configure person entities in Home Assistant to see family locations</p>
          <p className="text-sm text-gray-500">Add person.* entities with device tracker sources</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-32 min-h-[400px]">
          {/* Home Column */}
          <div className="space-y-6 flex flex-col items-end">
            <div className="text-center">
              <h2 className="text-[36px] font-serif text-[#5A3210] mb-1">Home</h2>
            </div>
            
            <div className="space-y-6 flex flex-col items-center">
              <AnimatePresence>
                {homePeople.map(person => (
                  <PersonCard
                    key={person.entity_id}
                    person={person}
                    isHome={true}
                  />
                ))}
              </AnimatePresence>
              
              {homePeople.length === 0 && (
                <div className="text-center text-gray-500 mt-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <p>Nobody home</p>
                </div>
              )}
            </div>
          </div>

          {/* Away Column */}
          <div className="space-y-6 flex flex-col items-start">
            <div className="text-center">
              <h2 className="text-[36px] font-serif text-[#5A3210] mb-1">Away</h2>
            </div>
            
            <div className="space-y-6 flex flex-col items-center">
              <AnimatePresence>
                {awayPeople.map(person => (
                  <PersonCard
                    key={person.entity_id}
                    person={person}
                    isHome={false}
                  />
                ))}
              </AnimatePresence>
              
              {awayPeople.length === 0 && (
                <div className="text-center text-gray-500 mt-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">📍</span>
                  </div>
                  <p>Everyone's home</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Map Modal */}
      <LocationMapModal
        person={selectedPerson}
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </div>
  );
}