import { CalendarEvent, ApiResponse } from '../types';
import { generateMockCalendarEvents } from '../utils';

class CalendarAdapter {
  private events: CalendarEvent[] = [];

  constructor() {
    this.events = generateMockCalendarEvents();
  }

  // Get all events
  async getEvents(): Promise<ApiResponse<CalendarEvent[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: this.events,
          message: 'Events fetched successfully'
        });
      }, 500);
    });
  }

  // Get events for a specific date
  async getEventsByDate(date: string): Promise<ApiResponse<CalendarEvent[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dayEvents = this.events.filter(event => {
          const eventDate = new Date(event.startTime).toISOString().split('T')[0];
          return eventDate === date;
        });
        resolve({
          success: true,
          data: dayEvents,
          message: 'Events fetched successfully'
        });
      }, 300);
    });
  }

  // Get events for a date range
  async getEventsByRange(startDate: string, endDate: string): Promise<ApiResponse<CalendarEvent[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rangeEvents = this.events.filter(event => {
          const eventDate = new Date(event.startTime).toISOString().split('T')[0];
          return eventDate >= startDate && eventDate <= endDate;
        });
        resolve({
          success: true,
          data: rangeEvents,
          message: 'Events fetched successfully'
        });
      }, 400);
    });
  }

  // Create a new event
  async createEvent(eventData: Omit<CalendarEvent, 'id'>): Promise<ApiResponse<CalendarEvent>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent: CalendarEvent = {
          ...eventData,
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        this.events.push(newEvent);
        resolve({
          success: true,
          data: newEvent,
          message: 'Event created successfully'
        });
      }, 600);
    });
  }

  // Update an existing event
  async updateEvent(id: string, eventData: Partial<CalendarEvent>): Promise<ApiResponse<CalendarEvent>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eventIndex = this.events.findIndex(event => event.id === id);
        if (eventIndex === -1) {
          resolve({
            success: false,
            data: {} as CalendarEvent,
            message: 'Event not found'
          });
          return;
        }

        this.events[eventIndex] = { ...this.events[eventIndex], ...eventData };
        resolve({
          success: true,
          data: this.events[eventIndex],
          message: 'Event updated successfully'
        });
      }, 500);
    });
  }

  // Delete an event
  async deleteEvent(id: string): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eventIndex = this.events.findIndex(event => event.id === id);
        if (eventIndex === -1) {
          resolve({
            success: false,
            data: false,
            message: 'Event not found'
          });
          return;
        }

        this.events.splice(eventIndex, 1);
        resolve({
          success: true,
          data: true,
          message: 'Event deleted successfully'
        });
      }, 400);
    });
  }

  // Get upcoming events (next 7 days)
  async getUpcomingEvents(): Promise<ApiResponse<CalendarEvent[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcomingEvents = this.events.filter(event => {
          const eventDate = new Date(event.startTime);
          return eventDate >= now && eventDate <= nextWeek;
        }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        resolve({
          success: true,
          data: upcomingEvents,
          message: 'Upcoming events fetched successfully'
        });
      }, 300);
    });
  }

  // Get today's events
  async getTodayEvents(): Promise<ApiResponse<CalendarEvent[]>> {
    const today = new Date().toISOString().split('T')[0];
    return this.getEventsByDate(today);
  }

  // Search events by title or subject
  async searchEvents(query: string): Promise<ApiResponse<CalendarEvent[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchResults = this.events.filter(event => 
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          (event.subject && event.subject.toLowerCase().includes(query.toLowerCase()))
        );
        resolve({
          success: true,
          data: searchResults,
          message: 'Search completed successfully'
        });
      }, 400);
    });
  }
}

export default new CalendarAdapter();