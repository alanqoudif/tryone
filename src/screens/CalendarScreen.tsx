import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useIsDark } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { CalendarAdapter } from '../adapters';
import { CalendarEvent } from '../types';

interface CalendarScreenProps {
  navigation: any;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const isDark = useIsDark();
  const colors = {
    background: isDark ? '#000000' : '#ffffff',
    card: isDark ? '#1c1c1e' : '#f2f2f7',
    border: isDark ? '#38383a' : '#c6c6c8',
    text: isDark ? '#ffffff' : '#000000',
    primary: '#007AFF',
    notification: '#FF3B30',
  };
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadMonthEvents();
  }, [currentDate]);

  const loadMonthEvents = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await CalendarAdapter.getEventsByRange(
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
      
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('calendar.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
  };

  const renderCalendarDay = (date: Date | null, index: number) => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const dayEvents = getEventsForDate(date);
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          { borderColor: colors.border },
          isSelected && { backgroundColor: colors.primary },
          isToday && { borderColor: colors.primary, borderWidth: 2 },
        ]}
        onPress={() => handleDatePress(date)}
      >
        <Text
          style={[
            styles.dayText,
            { color: colors.text },
            isSelected && { color: colors.card },
            isToday && { color: colors.primary, fontWeight: 'bold' },
          ]}
        >
          {date.getDate()}
        </Text>
        {dayEvents.length > 0 && (
          <View style={[styles.eventIndicator, { backgroundColor: colors.notification }]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;

    const dayEvents = getEventsForDate(selectedDate);
    
    return (
      <View style={[styles.selectedDateSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.selectedDateTitle, { color: colors.text }]}>
          {selectedDate.toLocaleDateString('ar', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        {dayEvents.length === 0 ? (
          <Text style={[styles.noEventsText, { color: colors.text }]}>
            {t('calendar.noEvents')}
          </Text>
        ) : (
          dayEvents.map((event, index) => (
            <View key={index} style={[styles.eventItem, { borderLeftColor: colors.primary }]}>
              <Text style={[styles.eventTime, { color: colors.text }]}>
                {new Date(event.startTime).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={[styles.eventTitle, { color: colors.text }]}>
                {event.title}
              </Text>
              {event.location && (
                <Text style={[styles.eventLocation, { color: colors.text }]}>
                  📍 {event.location}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
    },
    navButton: {
      padding: 8,
    },
    navButtonText: {
      fontSize: 18,
      color: colors.primary,
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    weekDaysHeader: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      paddingVertical: 8,
    },
    weekDayText: {
      flex: 1,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.text,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: colors.card,
    },
    calendarDay: {
      width: '14.28%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      position: 'relative',
    },
    emptyDay: {
      width: '14.28%',
      height: 50,
    },
    dayText: {
      fontSize: 16,
    },
    eventIndicator: {
      position: 'absolute',
      bottom: 4,
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    selectedDateSection: {
      margin: 16,
      padding: 16,
      borderRadius: 8,
    },
    selectedDateTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    noEventsText: {
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 20,
    },
    eventItem: {
      borderLeftWidth: 4,
      paddingStart: 12,
      paddingVertical: 8,
      marginBottom: 8,
    },
    eventTime: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    eventTitle: {
      fontSize: 14,
      marginTop: 2,
    },
    eventLocation: {
      fontSize: 12,
      marginTop: 2,
      opacity: 0.7,
    },
  });

  const weekDays = [t('calendar.sun'), t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat')];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth('prev')}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {currentDate.toLocaleDateString('ar', { year: 'numeric', month: 'long' })}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth('next')}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysHeader}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView>
        <View style={styles.calendarGrid}>
          {getDaysInMonth().map((date, index) => renderCalendarDay(date, index))}
        </View>
        
        {renderSelectedDateEvents()}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;