import { Room, Booking } from '../types';
import { addHours } from 'date-fns';

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Conference Room A',
    capacity: 12,
    location: 'Floor 1',
    amenities: ['Projector', 'Whiteboard', 'Video Conference'],
    imageUrl: 'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color:'',
    factory:'YPT'
  },
  {
    id: '2',
    name: 'Meeting Room B',
    capacity: 6,
    location: 'Floor 2',
    amenities: ['Whiteboard', 'TV Screen'],
    imageUrl: 'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color:'',
    factory:'YPT'
  },
  {
    id: '3',
    name: 'Board Room',
    capacity: 20,
    location: 'Floor 3',
    amenities: ['Projector', 'Video Conference', 'Coffee Machine'],
    imageUrl: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color:'',
    factory:'YPT'
  },
  {
    id: '4',
    name: 'Huddle Space',
    capacity: 4,
    location: 'Floor 2',
    amenities: ['Whiteboard'],
    imageUrl: 'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color:'',
    factory:'YPT'
  },
  {
    id: '5',
    name: 'Training Room',
    capacity: 30,
    location: 'Floor 1',
    amenities: ['Projector', 'Whiteboards', 'Computers'],
    imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color:'',
    factory:'YPT'
  },
  {
    id: '6',
    name: 'Training Room 6',
    capacity: 30,
    location: 'Floor 1',
    amenities: ['Projector', 'Whiteboards', 'Computers'],
    imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color:'',
    factory:'YPT'
  }
];

// Create some example bookings
const today = new Date();
today.setHours(0, 0, 0, 0);

export const bookings: Booking[] = [
  {
    id: '101',
    roomId: '1',
    title: 'Product Team Sync',
    start: addHours(today, 10),
    end: addHours(today, 11),
    userId: 'user1',
    description: 'Weekly sync meeting for the product team',
    attendees: ['John', 'Sarah', 'Mike']
  },
  {
    id: '102',
    roomId: '2',
    title: 'UX Design Review',
    start: addHours(today, 14),
    end: addHours(today, 15.5),
    userId: 'user2',
    description: 'Review latest design mockups',
    attendees: ['Lisa', 'David']
  },
  {
    id: '103',
    roomId: '3',
    title: 'Quarterly Planning',
    start: addHours(today, 9),
    end: addHours(today, 12),
    userId: 'user3',
    description: 'Q3 planning session',
    attendees: ['Executive Team']
  },
  {
    id: '104',
    roomId: '1',
    title: 'Client Meeting',
    start: addHours(today, 16),
    end: addHours(today, 17),
    userId: 'user4',
    description: 'Meeting with ACME Corp',
    attendees: ['Sales Team', 'Client Reps']
  }
];