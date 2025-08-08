// Browser-compatible Google Calendar API service using fetch

class GoogleCalendarService {
  constructor() {
    this.apiKey = null;
    this.isInitialized = false;
  }

  async initialize(apiKey, clientId) {
    try {
      if (!apiKey) {
        throw new Error('API key is required');
      }
      
      this.apiKey = apiKey;
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Calendar service:', error);
      return false;
    }
  }

  async getEvents(calendarId = 'primary', maxResults = 10) {
    if (!this.isInitialized) {
      throw new Error('Google Calendar service not initialized');
    }

    try {
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + 7);

      const params = new URLSearchParams({
        key: this.apiKey,
        timeMin: now.toISOString(),
        timeMax: endOfWeek.toISOString(),
        maxResults: maxResults.toString(),
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.formatEvents(data.items || []);
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      throw error;
    }
  }

  formatEvents(events) {
    return events.map(event => {
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;
      
      let startTime = '';
      let duration = 60; // Default 1 hour
      let formattedDuration = '1h';

      if (start) {
        const startDate = new Date(start);
        startTime = startDate.toLocaleTimeString([], { 
          hour: 'numeric', 
          minute: '2-digit' 
        });

        if (end) {
          const endDate = new Date(end);
          duration = Math.round((endDate - startDate) / (1000 * 60)); // minutes
          
          if (duration >= 60) {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            formattedDuration = minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
          } else {
            formattedDuration = `${duration} minutes`;
          }
        }
      }

      return {
        id: event.id,
        summary: event.summary || 'No title',
        time: startTime,
        duration,
        formattedDuration,
        date: start ? new Date(start) : new Date(),
        location: event.location,
        description: event.description,
      };
    });
  }

  groupEventsByDay(events) {
    const grouped = [[], [], []]; // 3 days: today, tomorrow, day after
    
    events.forEach(event => {
      if (!event.date) return;
      
      // Parse the event date - handle both datetime and date-only formats
      let eventDate = new Date(event.date);
      
      // Get today's date in the same way the Calendar component does
      const now = new Date();
      
      // Create the three target dates exactly like Calendar component
      for (let i = 0; i < 3; i++) {
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + i);
        
        // Compare dates by checking if they fall on the same calendar day
        // This handles timezone issues by comparing the local date components
        if (
          eventDate.getDate() === targetDate.getDate() &&
          eventDate.getMonth() === targetDate.getMonth() &&
          eventDate.getFullYear() === targetDate.getFullYear()
        ) {
          grouped[i].push(event);
          break;
        }
      }
    });
    
    return grouped;
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;