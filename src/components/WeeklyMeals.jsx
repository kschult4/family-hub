

import React, { useState } from "react";
import SectionHeader from "./SectionHeader";

export default function WeeklyMeals() {
  // Placeholder meal names for each day (Monday-Sunday)
  const mealNames = [
    'Chicken Alfredo',
    'Taco Tuesday',
    'Beef Stir Fry',
    'Lemon Herb Salmon',
    'Pizza Night',
    'BBQ Ribs',
    'Roast Chicken'
  ];

  // Background images for each day (Monday-Sunday)
  const bgImages = [
    'https://images.unsplash.com/photo-1578515637272-e4afe0b8ec82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1526213174737-acd9757c6bf3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1482275548304-a58859dc31b7?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1630443876697-e0d2faac7b51?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get today's index (0=Monday, 6=Sunday)
  const todayIdx = (new Date().getDay() + 6) % 7;
  // Offset for the small card (starts at 1 for tomorrow)
  const [offset, setOffset] = useState(1);

  // Calculate indices for today and upcoming
  const todayCardIdx = todayIdx;
  const upcomingCardIdx = (todayIdx + offset) % 7;

  // Handlers
  const handleNext = () => setOffset((prev) => (prev + 1) % 7);

  return (
    <div className="w-full mb-8">
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
        {/* Left Card (2/3 width) */}
        <div style={{
          flex: '2 1 0',
          height: '380px',
          borderRadius: '16px',
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.0) 66%, rgba(0,0,0,0.0) 100%), url('${bgImages[todayCardIdx]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
          <div style={{ fontWeight: '200', fontSize: '2.75rem', color: '#ffffff', textAlign: 'left' }}>{mealNames[todayCardIdx]}</div>
        </div>
        {/* Right Card (1/3 width) */}
        <div style={{
          flex: '1 1 0',
          height: '380px',
          borderRadius: '16px',
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.0) 66%, rgba(0,0,0,0.0) 100%), url('${bgImages[upcomingCardIdx]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
          overflow: 'hidden',
          paddingLeft: '40px',
          minWidth: 0,
          marginRight: 0
        }}>
          <div style={{ fontWeight: '700', fontSize: '1rem', color: '#48AF55', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase', textAlign: 'left' }}>{dayLabels[upcomingCardIdx]}</div>
          <div style={{ fontWeight: '200', fontSize: '2.75rem', color: '#ffffff', textAlign: 'left' }}>{mealNames[upcomingCardIdx]}</div>
        </div>
        {/* Right-facing arrow (floated over the small card) */}
        <div style={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          height: '28px',
          width: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
        }} onClick={handleNext}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#48AF55" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
      </div>
    </div>
  );
}
