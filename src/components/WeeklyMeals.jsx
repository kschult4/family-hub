

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { useIsMobile } from "../hooks/useMediaQuery";
import LazyImage, { ImageSkeleton } from "./LazyImage";

export default function WeeklyMeals({ meals = {} }) {
  
  // Default meal names for each day (Monday-Sunday)
  const defaultMealNames = [
    'Chicken Alfredo',
    'Taco Tuesday',
    'Beef Stir Fry',
    'Lemon Herb Salmon',
    'Pizza Night',
    'BBQ Ribs',
    'Roast Chicken'
  ];

  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const getMealName = (meal) => {
    if (!meal) return 'No meal planned';
    if (typeof meal === 'string') return meal;
    return meal.name || 'No meal planned';
  };

  // Use meals from props, supporting legacy strings and object format
  const mealNames = dayLabels.map((day) => getMealName(meals[day]));

  // All available background images
  const allBgImages = [
    'https://images.unsplash.com/photo-1578515637272-e4afe0b8ec82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1526213174737-acd9757c6bf3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1482275548304-a58859dc31b7?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1630443876697-e0d2faac7b51?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  // Get today's index (0=Monday, 6=Sunday)
  const todayIdx = (new Date().getDay() + 6) % 7;
  
  // State for rotating background photo (for the small card)
  const [currentBgPhoto, setCurrentBgPhoto] = useState(() => {
    // Initialize with a random photo that's not the today photo
    const todayPhoto = allBgImages[todayIdx];
    const availablePhotos = allBgImages.filter(photo => photo !== todayPhoto);
    const selectedPhoto = availablePhotos.length > 0 
      ? availablePhotos[Math.floor(Math.random() * availablePhotos.length)]
      : allBgImages[0]; // Fallback to first image if filtering fails
    return selectedPhoto;
  });

  // Rotate background photo every 2 hours
  useEffect(() => {
    const rotatePhoto = () => {
      const todayPhoto = allBgImages[todayIdx];
      const availablePhotos = allBgImages.filter(photo => 
        photo !== todayPhoto && photo !== currentBgPhoto
      );
      
      if (availablePhotos.length > 0) {
        const newPhoto = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
        setCurrentBgPhoto(newPhoto);
      } else {
        // Fallback: if no photos available, use a different photo from the array
        const fallbackPhoto = allBgImages.find(photo => photo !== currentBgPhoto) || allBgImages[0];
        setCurrentBgPhoto(fallbackPhoto);
      }
    };

    // Set interval for 2 hours (7200000 ms)
    const interval = setInterval(rotatePhoto, 7200000);
    
    return () => clearInterval(interval);
  }, [currentBgPhoto, todayIdx]);

  const isMobile = useIsMobile();

  if (isMobile) {
    // Simplified mobile UI - just a list of meals
    return (
      <div className="w-full mb-6">
        <SectionHeader title="Weekly Meal Plan" className="mb-4" />
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="space-y-3">
            {dayLabels.map((day, index) => {
              const isPast = index < todayIdx;
              const isToday = index === todayIdx;
              
              return (
                <div 
                  key={day}
                  className={`flex justify-between items-center py-2 px-3 rounded ${
                    isToday ? 'bg-green-50 border border-green-200' : 
                    isPast ? 'opacity-60' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    isToday ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {isToday ? 'Today' : day}
                  </div>
                  <div className={`text-sm ${
                    isToday ? 'text-green-800 font-medium' : 'text-gray-800'
                  }`}>
                    {mealNames[index]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Desktop UI - original complex design
  return (
    <div className="w-full mb-8 pt-8">
      <SectionHeader title="Weekly Meal Plan" className="mb-6" />
      <div style={{
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: '12px',
        position: 'relative',
      }}>
        {/* Left Card (2/3 width) - Today */}
        <div className="parallax-bg" style={{
          flex: '2 1 0',
          height: '380px',
          borderRadius: '16px',
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.0) 66%, rgba(0,0,0,0.0) 100%), url('${allBgImages[todayIdx]}')`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(229, 231, 235, 1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
          overflow: 'hidden',
          paddingLeft: '40px',
          minWidth: 0
        }}>
          <div style={{ fontWeight: '700', fontSize: '1rem', color: '#48AF55', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase', textAlign: 'left' }}>Today</div>
          <div style={{ fontWeight: '200', fontSize: '2.75rem', color: '#ffffff', textAlign: 'left' }}>{mealNames[todayIdx]}</div>
        </div>
        
        {/* Right Card (1/3 width) - All 7 days scrollable */}
        <motion.div 
          className="relative overflow-hidden bg-cover bg-center bg-no-repeat meals-small-card" 
          style={{
            flex: '1 1 0',
            height: '380px',
            borderRadius: '16px',
            backgroundImage: `url('${currentBgPhoto}')`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(229, 231, 235, 1)',
            minWidth: 0,
            marginRight: 0
          }}
          key={currentBgPhoto}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 flex flex-col"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Scrollable list of all 7 days */}
            <div style={{
              flex: '1 1 0',
              overflowY: 'auto',
              paddingLeft: '32px',
              paddingRight: '16px',
              paddingTop: '24px',
              paddingBottom: '24px'
            }} className="scrollbar-hide">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {dayLabels.map((day, index) => {
                  const isPast = index < todayIdx;
                  const opacity = isPast ? 0.6 : 1;
                  
                  return (
                    <div 
                      key={day}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        opacity: opacity
                      }}
                    >
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: index === todayIdx ? '#48AF55' : '#93C5FD',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {index === todayIdx ? 'Today' : day}
                      </div>
                      <div style={{
                        fontSize: '1.375rem',
                        fontWeight: '300',
                        color: '#ffffff',
                        lineHeight: '1.3'
                      }}>
                        {mealNames[index]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
