import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const interests = searchParams.get('interests') || '';
    const location = searchParams.get('location') || 'South Africa';
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    // Meetup API endpoint (GraphQL)
    const MEETUP_API_URL = 'https://api.meetup.com/gql';
    
    // Build the query based on interests and location
    const keywords = interests.split(',').filter(Boolean).join(' OR ');
    
    // GraphQL query for Meetup events
    const query = `
      query($lat: Float, $lon: Float, $radius: Int, $source: String) {
        rankedEvents(filter: {
          lat: $lat
          lon: $lon
          radius: $radius
          source: $source
          query: "${keywords}"
        }) {
          edges {
            node {
              id
              title
              dateTime
              endTime
              description
              venue {
                name
                address
                city
                state
                country
              }
              group {
                name
                urlname
              }
              going
              eventUrl
              imageUrl
            }
          }
        }
      }
    `;

    // Fallback: Use mock data if Meetup API is not available
    // or if you don't have API credentials
    const mockEvents = generateMockEvents(interests, location);

    // In production, you would make the actual API call:
    // const response = await fetch(MEETUP_API_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.MEETUP_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     query,
    //     variables: {
    //       lat: parseFloat(lat || '-26.2041'),
    //       lon: parseFloat(lon || '28.0473'),
    //       radius: 50,
    //       source: 'EVENTS'
    //     }
    //   })
    // });
    // const data = await response.json();

    return NextResponse.json({
      success: true,
      events: mockEvents,
      source: 'mock' // Change to 'meetup' when using real API
    });

  } catch (error) {
    console.error('Error fetching Meetup events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

function generateMockEvents(interests: string, location: string) {
  const interestList = interests.split(',').filter(Boolean);
  const eventTypes = [
    { type: 'Workshop', emoji: '🛠️' },
    { type: 'Meetup', emoji: '🤝' },
    { type: 'Conference', emoji: '🎤' },
    { type: 'Networking', emoji: '🌐' },
    { type: 'Seminar', emoji: '📚' }
  ];

  const venues = [
    'Innovation Hub',
    'Community Center',
    'Tech Campus',
    'Business Park',
    'University Auditorium',
    'Co-working Space'
  ];

  const cities = location === 'South Africa' 
    ? ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria']
    : [location];

  // Generate events based on user interests
  const events = [];
  const now = new Date();

  for (let i = 0; i < 8; i++) {
    const interest = interestList[i % interestList.length] || 'Technology';
    const eventType = eventTypes[i % eventTypes.length];
    const venue = venues[i % venues.length];
    const city = cities[i % cities.length];
    
    // Generate dates for next 30 days
    const eventDate = new Date(now);
    eventDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
    eventDate.setHours(9 + Math.floor(Math.random() * 9), 0, 0, 0);

    const endDate = new Date(eventDate);
    endDate.setHours(eventDate.getHours() + 2 + Math.floor(Math.random() * 3));

    const going = Math.floor(Math.random() * 100) + 10;

    events.push({
      id: `event-${i + 1}`,
      title: `${interest} ${eventType.type}`,
      description: `Join us for an exciting ${eventType.type.toLowerCase()} focused on ${interest}. Network with professionals, learn new skills, and discover opportunities in ${interest}.`,
      dateTime: eventDate.toISOString(),
      endTime: endDate.toISOString(),
      venue: {
        name: venue,
        address: `${Math.floor(Math.random() * 200) + 1} Main Street`,
        city: city,
        state: 'Gauteng',
        country: 'South Africa'
      },
      group: {
        name: `${interest} Enthusiasts ${city}`,
        urlname: `${interest.toLowerCase()}-${city.toLowerCase()}`
      },
      going: going,
      eventUrl: `https://www.meetup.com/${interest.toLowerCase()}-events`,
      imageUrl: null,
      type: Math.random() > 0.3 ? 'In-person' : 'Virtual',
      emoji: eventType.emoji
    });
  }

  // Sort events by date
  return events.sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );
}
