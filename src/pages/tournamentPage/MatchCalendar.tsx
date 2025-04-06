'use client';

import type React from 'react';
import { useState } from 'react';
import { Button, Card, Row, Col, Badge, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './match-calendar.css';

const { Title } = Typography;

// Define types
interface MatchEvent {
  type: 'match' | 'tournament' | 'your-match';
  title?: string;
  time?: string;
  details?: string;
}

interface CalendarDay {
  day: number;
  events: MatchEvent[];
}

// Custom styles to avoid any color imports
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
  },
  viewSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '1rem',
  },
  viewButton: {
    borderRadius: '20px',
  },
  calendarCard: {
    borderRadius: '8px',
  },
  monthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  monthTitle: {
    margin: 0,
  },
  navButtons: {
    display: 'flex',
    gap: '10px',
  },
  calendarHeader: {
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center' as const,
  },
  calendarWeek: {
    minHeight: '100px',
  },
  calendarCell: {
    border: '1px solid #f0f0f0',
    padding: 0,
  },
  calendarDay: {
    height: '100%',
    minHeight: '100px',
    padding: '8px',
    position: 'relative' as const,
  },
  emptyDay: {
    height: '100%',
    minHeight: '100px',
    padding: '8px',
    position: 'relative' as const,
    backgroundColor: '#fafafa',
  },
  dayNumber: {
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  matchLabel: {
    fontSize: '12px',
    color: '#666',
    backgroundColor: '#f9f9f9',
    padding: '2px 6px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  tournamentEvent: {
    marginTop: '4px',
  },
  tournamentBadge: {
    marginBottom: '4px',
  },
  tournamentTitle: {
    fontSize: '12px',
    color: '#ff8c00',
  },
  yourMatch: {
    backgroundColor: '#f0f0f0',
    padding: '6px',
    borderRadius: '4px',
    marginTop: '4px',
  },
  yourMatchBadge: {
    marginBottom: '4px',
    fontWeight: 'bold',
  },
  matchTime: {
    fontSize: '12px',
    color: '#333',
  },
};

const MatchCalendar: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('Monthly View');
  const [currentMonth, setCurrentMonth] = useState<string>('March 2025');

  // Sample data for March 2025
  const generateCalendarData = (): CalendarDay[][] => {
    // This represents the calendar grid (6 rows x 7 columns)
    const weeks: CalendarDay[][] = [];

    // First week with empty days and days 1-2
    weeks.push([
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
      { day: 1, events: [] },
      { day: 2, events: [] },
    ]);

    // Second week (days 3-9)
    weeks.push([
      { day: 3, events: [{ type: 'match' }] },
      { day: 4, events: [] },
      { day: 5, events: [] },
      { day: 6, events: [] },
      { day: 7, events: [{ type: 'match' }] },
      { day: 8, events: [] },
      { day: 9, events: [] },
    ]);

    // Third week (days 10-16)
    weeks.push([
      { day: 10, events: [] },
      { day: 11, events: [] },
      { day: 12, events: [{ type: 'match' }] },
      { day: 13, events: [] },
      { day: 14, events: [] },
      {
        day: 15,
        events: [{ type: 'tournament', title: 'Spring Open Tournament' }],
      },
      {
        day: 16,
        events: [{ type: 'tournament', title: 'Spring Open Tournament' }],
      },
    ]);

    // Fourth week (days 17-23)
    weeks.push([
      {
        day: 17,
        events: [{ type: 'tournament', title: 'Spring Open Tournament' }],
      },
      { day: 18, events: [] },
      {
        day: 19,
        events: [
          { type: 'your-match', time: '4:00 PM', details: 'Ranked Match' },
        ],
      },
      { day: 20, events: [] },
      { day: 21, events: [] },
      { day: 22, events: [{ type: 'match' }] },
      { day: 23, events: [] },
    ]);

    // Fifth week (days 24-30)
    weeks.push([
      { day: 24, events: [] },
      { day: 25, events: [{ type: 'match' }] },
      { day: 26, events: [] },
      { day: 27, events: [] },
      { day: 28, events: [{ type: 'match' }] },
      { day: 29, events: [] },
      { day: 30, events: [] },
    ]);

    // Sixth week (day 31)
    weeks.push([
      { day: 31, events: [] },
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
      { day: 0, events: [] }, // Empty cell
    ]);

    return weeks;
  };

  const calendarData = generateCalendarData();

  const handlePrevMonth = () => {
    // In a real app, this would change to the previous month
    setCurrentMonth('February 2025');
    console.log('Navigate to previous month');
  };

  const handleNextMonth = () => {
    // In a real app, this would change to the next month
    setCurrentMonth('April 2025');
    console.log('Navigate to next month');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const renderDayCell = (day: CalendarDay) => {
    if (day.day === 0) {
      return <div style={styles.emptyDay}></div>;
    }

    return (
      <div style={styles.calendarDay}>
        <div style={styles.dayNumber}>{day.day}</div>
        {day.events.map((event, index) => (
          <div key={index}>
            {event.type === 'match' && (
              <div style={styles.matchLabel}>Matches</div>
            )}
            {event.type === 'tournament' && (
              <div style={styles.tournamentEvent}>
                {index === 0 && (
                  <Badge
                    color="orange"
                    text="Tournament"
                    style={styles.tournamentBadge}
                  />
                )}
                <div style={styles.tournamentTitle}>{event.title}</div>
              </div>
            )}
            {event.type === 'your-match' && (
              <div style={styles.yourMatch}>
                <Badge
                  color="black"
                  text="Your Match"
                  style={styles.yourMatchBadge}
                />
                <div style={styles.matchTime}>
                  {event.time} - {event.details}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <Title level={2} style={styles.title}>
        Match Calendar
      </Title>

      <div style={styles.viewSelector}>
        {['Monthly View', 'Weekly View', 'Daily View', 'Tournaments'].map(
          (view) => (
            <Button
              key={view}
              type={activeView === view ? 'primary' : 'default'}
              style={styles.viewButton}
              onClick={() => handleViewChange(view)}
            >
              {view}
            </Button>
          )
        )}
      </div>

      <Card style={styles.calendarCard}>
        <div style={styles.monthHeader}>
          <Title level={3} style={styles.monthTitle}>
            {currentMonth}
          </Title>
          <div style={styles.navButtons}>
            <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
            <Button icon={<RightOutlined />} onClick={handleNextMonth} />
          </div>
        </div>

        <div>
          <Row>
            <Col span={3} style={styles.calendarHeader}>
              Sun
            </Col>
            <Col span={3} style={styles.calendarHeader}>
              Mon
            </Col>
            <Col span={3} style={styles.calendarHeader}>
              Tue
            </Col>
            <Col span={3} style={styles.calendarHeader}>
              Wed
            </Col>
            <Col span={3} style={styles.calendarHeader}>
              Thu
            </Col>
            <Col span={3} style={styles.calendarHeader}>
              Fri
            </Col>
            <Col span={3} style={styles.calendarHeader}>
              Sat
            </Col>
          </Row>

          {calendarData.map((week, weekIndex) => (
            <Row key={weekIndex} style={styles.calendarWeek}>
              {week.map((day, dayIndex) => (
                <Col key={dayIndex} span={3} style={styles.calendarCell}>
                  {renderDayCell(day)}
                </Col>
              ))}
            </Row>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MatchCalendar;
