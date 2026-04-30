import type { VariantValues, PropertyValues } from '@jf/app-elements'

export interface PresetElement {
  componentId: string
  variants?: Partial<VariantValues>
  properties?: Partial<PropertyValues>
}

export interface PresetPage {
  id: string
  name: string
  icon?: string
  elements: PresetElement[]
}

export interface AppPreset {
  id: string
  name: string
  appTitle: string
  appSubtitle: string
  pages: PresetPage[]
  headerActions: PresetElement[]
}

export const EMPTY_PRESET_ID = 'empty'

export const APP_PRESETS: AppPreset[] = [
  {
    id: EMPTY_PRESET_ID,
    name: 'Empty App',
    appTitle: 'App Title',
    appSubtitle: '',
    pages: [{ id: 'page-1', name: 'Home', icon: 'House', elements: [] }],
    headerActions: [],
  },
  {
    id: 'camp-registration',
    name: 'Camp Registration',
    appTitle: 'Summer Camp',
    appSubtitle: 'Sign up for the 2026 season',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        icon: 'House',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Center' },
            properties: {
              Heading: 'Summer of a Lifetime',
              Subheading: 'Adventures, friendships, memories — all in one place.',
            },
          },
          {
            componentId: 'image',
            variants: { 'Has Image': 'Yes', Alignment: 'Center', Size: 'Large' },
            properties: {
              'Image URL': 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=900&h=500&fit=crop',
              'Alt Text': 'Campers around a campfire',
            },
          },
          {
            componentId: 'paragraph',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: {
              Text: 'Eight weeks. Twenty programs. Hundreds of friends in the making. Open to ages 8 – 16.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 24 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Left' },
            properties: { Heading: 'Featured Programs', Subheading: 'Pick the track that excites you most.' },
          },
          {
            componentId: 'list',
            variants: {
              Layout: 'Card',
              'Card Image Style': 'Square',
              'Card Layout': 'Vertical',
              'Card Size': 'Medium',
              'Card Action': 'Button',
            },
            properties: {
              'Show Header': false,
              'Button Label': 'Explore',
              Items: JSON.stringify([
                { title: 'Adventure Trail', description: 'Hiking · Climbing · Kayaking', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop' },
                { title: 'Arts & Crafts', description: 'Painting · Pottery · Theater', image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop' },
                { title: 'Sports League', description: 'Soccer · Tennis · Basketball', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop' },
                { title: 'Music & Drama', description: 'Band · Choir · Stage', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 24 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: { Heading: 'Why Choose Us', Subheading: 'Trusted by thousands of families.' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Safe & Certified', Description: 'CPR-certified, background-checked staff.', Icon: 'ShieldCheck', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Expert Counselors', Description: 'Coaches, artists, and educators.', Icon: 'GraduationCap', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Daily Adventures', Description: 'A new highlight every single day.', Icon: 'Compass', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Lifelong Friends', Description: 'Bonds that last beyond the summer.', Icon: 'Heart', Shrinked: true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 24 },
          },
          {
            componentId: 'button',
            variants: { Type: 'Standard', Variant: 'Default', Corner: 'Rounded' },
            properties: {
              Label: 'Reserve Your Spot',
              'Left Icon': 'Plus',
              'Full Width': true,
            },
          },
          {
            componentId: 'button',
            variants: { Type: 'Standard', Variant: 'Outlined', Corner: 'Rounded' },
            properties: {
              Label: 'Download Brochure',
              'Left Icon': 'Download',
              'Full Width': true,
            },
          },
        ],
      },
      {
        id: 'page-2',
        name: 'Schedule',
        icon: 'Calendar',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Left' },
            properties: {
              Heading: 'Camp Schedule',
              Subheading: 'Tuesday, July 7 · Week 2',
            },
          },
          {
            componentId: 'daily-task-manager',
          },
          {
            componentId: 'spacer',
            properties: { Height: 24 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'This Week at a Glance', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Square', Size: 'Regular', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Mon · Hiking Trail', description: 'Pine Ridge Loop · 4 hrs', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=200&fit=crop' },
                { title: 'Tue · Pottery Workshop', description: 'Studio · 2 hrs', image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop' },
                { title: 'Wed · Lake Day', description: 'Kayak · Swim · 5 hrs', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=200&fit=crop' },
                { title: 'Thu · Sports League', description: 'Soccer Finals · 3 hrs', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop' },
                { title: 'Fri · Talent Show', description: 'Main Hall · 7 PM', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 24 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Featured Events', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Annual Talent Show',
              Description: 'Music, comedy, magic — Friday at 7 PM in the Main Hall.',
              'Button Label': 'Sign Up to Perform',
              'Image URL': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=350&fit=crop',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Lakeside Bonfire',
              Description: 'Stories, songs, s’mores — Saturday at 8 PM by the lake.',
              'Button Label': 'Add to Calendar',
              'Image URL': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=350&fit=crop',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 24 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Last Year’s Highlights', Subheading: '' },
          },
          {
            componentId: 'image-gallery',
            variants: { Layout: '8' },
            properties: {
              Images: JSON.stringify([
                'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=600&fit=crop',
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1530563885674-66db50a1af19?w=400&h=400&fit=crop',
              ]),
            },
          },
        ],
      },
      {
        id: 'page-3',
        name: 'My Campers',
        icon: 'Users',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Left' },
            properties: {
              Heading: 'My Campers',
              Subheading: 'Children registered under your account.',
            },
          },
          {
            componentId: 'button',
            properties: {
              Label: 'Add new camper',
              'Left Icon': 'Plus',
              'Right Icon': 'none',
              'Full Width': true,
              Action: 'Open Form',
              'Form Title': 'Add a Camper',
              'Form Description': 'Register a new camper.',
              'Form Submit Label': 'Register Camper',
              'Form Fields': JSON.stringify([
                { name: 'name', label: 'Camper Name', type: 'text', placeholder: 'e.g. Alex Johnson' },
                { name: 'details', label: 'Age & Group', type: 'text', placeholder: 'e.g. Age 12 · Adventure Group' },
                { name: 'email', label: 'Parent Email', type: 'email', placeholder: 'parent@example.com' },
                { name: 'notes', label: 'Allergies / Notes', type: 'textarea', placeholder: 'Any allergies or special needs' },
              ]),
              'Submits To': 'campers',
            },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Circle', Size: 'Compact', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Source: 'campers',
              'Title Field': 'name',
              'Description Field': 'details',
              'Empty Title': 'No campers yet',
              'Empty Description': 'Tap "Add new camper" to register your first one.',
            },
          },
        ],
      },
      {
        id: 'page-4',
        name: 'Info',
        icon: 'Info',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Camp Resources',
              Subheading: 'Forms, FAQs, and ways to support our mission.',
            },
          },
          {
            componentId: 'paragraph',
            variants: { Size: 'Medium', Alignment: 'Left' },
            properties: {
              Text: 'Everything you need before, during, and after camp — all in one place.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Required Documents', Subheading: '' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Parent Handbook.pdf', Description: 'Policies, daily flow, and FAQs.' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Packing Checklist.pdf', Description: 'What to pack — and what to leave home.' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Large', Alignment: 'Left' },
            properties: { 'File Name': 'Health & Consent Forms.pdf', Description: 'Required medical and emergency forms.' },
          },
          {
            componentId: 'spacer',
            properties: { Height: 32 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: { Heading: 'Send a Camper to Camp', Subheading: 'Help families who cannot afford to attend.' },
          },
          {
            componentId: 'donation-box',
            variants: { Alignment: 'Center', Size: 'Mobile' },
            properties: {
              Title: 'Scholarship Fund 2026',
              Description: 'Every dollar gives a child their first summer adventure.',
              'Show Goal': true,
              'Raised Amount': '$3,420',
              'Goal Amount': '$8,000',
              'Goal Progress': 43,
              'Show Custom Amount': true,
              'Currency Symbol': '$',
              'Button Label': 'Donate Now',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 32 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: { Heading: 'What Parents Say', Subheading: '' },
          },
          {
            componentId: 'testimonial',
            properties: { 'Show Avatars': true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 32 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Center' },
            properties: { Heading: 'Stay Connected', Subheading: '' },
          },
          {
            componentId: 'social-follow',
            variants: { Layout: 'Wrap', Variant: 'Secondary', Filled: 'No' },
          },
        ],
      },
    ],
    headerActions: [],
  },
  {
    id: 'education',
    name: 'Parent Portal',
    appTitle: 'Maple Park',
    appSubtitle: 'Your family’s connection to school',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        icon: 'House',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Today',
              Subheading: 'Emma · Grade 3 · Mrs. Johnson',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'None' },
            properties: {
              Title: 'A note from Mrs. Johnson',
              Description: 'Today we read chapter 4 of "Charlotte’s Web." Ask Emma about Wilbur’s big day at the fair!',
              'Image URL': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&h=380&fit=crop',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Quick Actions', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Pickup', Description: '3:15 PM · Bus 42', Icon: 'BusFront', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Lunch', Description: 'Pasta + salad', Icon: 'Apple', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Attendance', Description: 'Present · On time', Icon: 'CircleCheck', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Message Teacher', Description: 'Reach Mrs. Johnson', Icon: 'MessageCircle', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Report Absence', Description: 'If staying home today', Icon: 'CalendarX', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Pay Lunch', Description: 'Add to balance', Icon: 'Wallet', Shrinked: true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Horizontal', Action: 'None' },
            properties: {
              Title: 'Tomorrow’s homework',
              Description: 'Spelling test prep · Workbook page 24',
              Icon: 'BookOpen',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'This Week', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Square', Size: 'Regular', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Parent–Teacher Meet', description: 'Tue · 4:00 PM · Room 12', image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=200&h=200&fit=crop' },
                { title: 'Art Showcase', description: 'Wed · 5:30 PM · Gym', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop' },
                { title: 'Field Day', description: 'Sat · 10:00 AM · Sports Field', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop' },
              ]),
            },
          },
        ],
      },
      {
        id: 'page-2',
        name: 'Events',
        icon: 'Calendar',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Calendar',
              Subheading: 'Events for Grade 3 and school-wide.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Spring Concert',
              Description: 'Friday · 7:00 PM · Main Hall. Reserved seating for two adults per family.',
              'Button Label': 'RSVP',
              'Image URL': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&h=380&fit=crop',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Coming Up', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Square', Size: 'Regular', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Spring Picnic', description: 'Sat May 18 · 11:00 AM · Lawn', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=200&fit=crop' },
                { title: 'Library Open House', description: 'Wed May 22 · 4:00 PM', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&h=200&fit=crop' },
                { title: 'Class Field Trip', description: 'Fri May 24 · All Day', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=200&fit=crop' },
                { title: 'STEM Fair', description: 'Tue May 28 · 5:30 PM', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop' },
                { title: 'End-of-Year Concert', description: 'Fri June 7 · 7:00 PM', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop' },
              ]),
            },
          },
        ],
      },
      {
        id: 'page-3',
        name: 'Photos',
        icon: 'Image',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Mrs. Johnson’s Class',
              Subheading: 'Recent moments from Emma’s school days.',
            },
          },
          {
            componentId: 'image-gallery',
            variants: { Layout: '2' },
            properties: {
              Images: JSON.stringify([
                'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop',
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Albums', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: {
              Layout: 'Card',
              'Card Image Style': 'Square',
              'Card Layout': 'Vertical',
              'Card Size': 'Medium',
              'Card Action': 'None',
            },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Class Trip', description: '32 photos', image: 'https://images.unsplash.com/photo-1546074177-31bfa593f731?w=400&h=400&fit=crop' },
                { title: 'Art Day', description: '24 photos', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop' },
                { title: 'Sports Day', description: '41 photos', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop' },
                { title: 'Music Recital', description: '18 photos', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
              ]),
            },
          },
        ],
      },
      {
        id: 'page-4',
        name: 'Forms',
        icon: 'FileText',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Forms & Documents',
              Subheading: 'Quick access to school paperwork.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Action Required', Subheading: '' },
          },
          {
            componentId: 'form',
            variants: { 'Layout Type': 'Card', Alignment: 'Left', Size: 'Normal' },
            properties: {
              Label: 'Emma · Field Trip Permission',
              Description: 'Due Friday — sign for May 24 trip.',
              Required: true,
              'Show Icon': true,
              Icon: 'BusFront',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'All Forms', Subheading: '' },
          },
          {
            componentId: 'form',
            variants: { 'Layout Type': 'Card', Alignment: 'Left', Size: 'Normal' },
            properties: {
              Label: 'Volunteer Sign-Up',
              Description: 'Help out at upcoming school events.',
              Required: false,
              'Show Icon': true,
              Icon: 'HeartHandshake',
            },
          },
          {
            componentId: 'form',
            variants: { 'Layout Type': 'Card', Alignment: 'Left', Size: 'Normal' },
            properties: {
              Label: 'Spring Picnic RSVP',
              Description: 'Let us know if your family is attending.',
              Required: false,
              'Show Icon': true,
              Icon: 'UtensilsCrossed',
            },
          },
          {
            componentId: 'form',
            variants: { 'Layout Type': 'Card', Alignment: 'Left', Size: 'Normal' },
            properties: {
              Label: 'Emma · Photo Release',
              Description: 'Update your photo permission preferences.',
              Required: false,
              'Show Icon': true,
              Icon: 'Camera',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 24 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Documents', Subheading: '' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Parent Handbook.pdf', Description: 'Policies and contact info.' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Academic Calendar.pdf', Description: 'Important dates for the year.' },
          },
        ],
      },
    ],
    headerActions: [],
  },
  {
    id: 'healthcare',
    name: 'Healthcare Clinic',
    appTitle: 'HealthCare Clinic',
    appSubtitle: 'Quality healthcare you can trust',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        icon: 'House',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Center' },
            properties: {
              Heading: 'Welcome to Our Clinic',
              Subheading: '',
            },
          },
          {
            componentId: 'paragraph',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: {
              Text: 'Delivering high-quality care with skilled and trusted professionals — focused on your comfort and confidence at every step.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'button',
            variants: { Type: 'Standard', Variant: 'Default' },
            properties: {
              Label: 'Book Appointment',
              'Left Icon': 'CalendarPlus',
              'Full Width': true,
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'image-gallery',
            variants: { Layout: '4' },
            properties: {
              Images: JSON.stringify([
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: { Heading: 'Why Choose Us', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Trusted Doctors', Description: 'Board-certified specialists', Icon: 'Stethoscope', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Quick Care', Description: 'Same-day visits available', Icon: 'Zap', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Modern Facilities', Description: 'State-of-the-art equipment', Icon: 'Building2', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Family Friendly', Description: 'All ages welcome', Icon: 'HeartHandshake', Shrinked: true },
          },
        ],
      },
      {
        id: 'page-2',
        name: 'Appointments',
        icon: 'Calendar',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'My Appointments',
              Subheading: '',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Next Visit', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Dr. Sarah Patel · Cardiology',
              Description: 'Mon Apr 6 · 10:30 AM · Suite 204. Annual check-up.',
              'Button Label': 'View Details',
              'Image URL': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&h=380&fit=crop',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Upcoming', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Circle', Size: 'Regular', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Dr. Marcus Lee', description: 'Dermatology · Wed Apr 22 · 2:00 PM', image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop' },
                { title: 'Dr. Anna Rivera', description: 'Internal Medicine · Mon May 5 · 9:00 AM', image: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=200&h=200&fit=crop' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Past Visits', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Circle', Size: 'Compact', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Dr. Sarah Patel', description: 'Mar 5 · Routine check-up', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
                { title: 'Dr. James Chen', description: 'Feb 18 · Lab review', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop' },
                { title: 'Dr. Marcus Lee', description: 'Jan 12 · Skin consultation', image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop' },
              ]),
            },
          },
        ],
      },
      {
        id: 'page-3',
        name: 'Patients',
        icon: 'Users',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Center' },
            properties: { Heading: 'Profile', Subheading: '' },
          },
          {
            componentId: 'image',
            variants: { 'Has Image': 'Yes', Alignment: 'Center', Size: 'Large' },
            properties: {
              'Image URL': 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=400&h=400&fit=crop',
              'Alt Text': 'John Reed',
            },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: {
              Heading: 'John Reed',
              Subheading: 'Patient ID #JR-1042 · Member since 2021',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Quick Info', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Apr 21, 1985', Description: 'Date of Birth', Icon: 'Cake', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'O+', Description: 'Blood Type', Icon: 'Droplet', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Mar 5, 2026', Description: 'Last Visit', Icon: 'ClipboardCheck', Shrinked: true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Family Members', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Circle', Size: 'Regular', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Emma Reed', description: 'Spouse · 39 · Patient since 2022', image: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=200&h=200&fit=crop' },
                { title: 'Lily Reed', description: 'Daughter · 8 · Patient since 2024', image: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=200&h=200&fit=crop' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'button',
            variants: { Type: 'Standard', Variant: 'Outlined' },
            properties: {
              Label: 'Add Family Member',
              'Left Icon': 'Plus',
              'Full Width': true,
            },
          },
        ],
      },
      {
        id: 'page-4',
        name: 'Services',
        icon: 'Stethoscope',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Services',
              Subheading: 'Browse specialties and meet our team.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Specialties', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: {
              Layout: 'Card',
              'Card Image Style': 'Square',
              'Card Layout': 'Vertical',
              'Card Size': 'Medium',
              'Card Action': 'None',
            },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Cardiology', description: '4 specialists', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop' },
                { title: 'Dermatology', description: '3 specialists', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop' },
                { title: 'Pediatrics', description: '5 specialists', image: 'https://images.unsplash.com/photo-1574701148212-8518049c7b2c?w=400&h=400&fit=crop' },
                { title: 'Internal Medicine', description: '6 specialists', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Our Doctors', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Circle', Size: 'Regular', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Dr. Sarah Patel', description: 'Cardiology · 12 yrs experience', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
                { title: 'Dr. Marcus Lee', description: 'Dermatology · 8 yrs experience', image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop' },
                { title: 'Dr. Anna Rivera', description: 'Internal Medicine · 15 yrs', image: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=200&h=200&fit=crop' },
                { title: 'Dr. James Chen', description: 'Pediatrics · 10 yrs experience', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop' },
              ]),
            },
          },
        ],
      },
    ],
    headerActions: [],
  },
  {
    id: 'online-store',
    name: 'Online Store',
    appTitle: 'Shop',
    appSubtitle: 'Curated products, delivered fast',
    pages: [
      {
        id: 'page-1',
        name: 'Shop',
        icon: 'ShoppingBag',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large' },
            properties: {
              Heading: 'New Arrivals',
              Subheading: 'Fresh picks for the season.',
            },
          },
          {
            componentId: 'product-list',
            variants: { Layout: 'Grid' },
            properties: {
              Title: 'Featured Products',
              Subtitle: 'Hand-selected favorites',
              Currency: '$',
              Products: JSON.stringify([
                { name: 'Classic Tote Bag', price: '48.00' },
                { name: 'Linen Shirt', price: '72.00' },
                { name: 'Ceramic Mug Set', price: '36.00' },
                { name: 'Wool Throw Blanket', price: '120.00' },
              ]),
            },
          },
        ],
      },
      {
        id: 'page-2',
        name: 'Cart',
        icon: 'ShoppingCart',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Medium' },
            properties: { Heading: 'Your Cart' },
          },
          {
            componentId: 'button',
            properties: { Label: 'Checkout', 'Full Width': true },
          },
        ],
      },
    ],
    headerActions: [],
  },
  {
    id: 'student-management',
    name: 'Student Management',
    appTitle: 'Maple Park Roster',
    appSubtitle: 'Grade 4 · Mrs. Johnson',
    pages: [
      {
        id: 'page-1',
        name: 'My Class',
        icon: 'Users',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'My Class',
              Subheading: 'Grade 4 · 24 Students',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Quick Actions', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Take Attendance', Description: 'Mark today’s presence', Icon: 'UserCheck', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Add Note', Description: 'Quick observation', Icon: 'PencilLine', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Message Parents', Description: 'Send a class update', Icon: 'MessageSquare', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Today’s Plan', Description: 'Lesson schedule', Icon: 'CalendarClock', Shrinked: true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Students', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Circle', Size: 'Compact', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Sarah Miller', description: 'ID #2453 · Present', image: 'https://images.unsplash.com/photo-1574701148212-8518049c7b2c?w=200&h=200&fit=crop' },
                { title: 'Liam Chen', description: 'ID #2461 · Present', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop' },
                { title: 'Olivia Patel', description: 'ID #2470 · Present', image: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=200&h=200&fit=crop' },
                { title: 'Noah Garcia', description: 'ID #2478 · Absent', image: 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=200&h=200&fit=crop' },
                { title: 'Mia Thompson', description: 'ID #2485 · Present', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'button',
            variants: { Type: 'Standard', Variant: 'Outlined' },
            properties: {
              Label: 'View All Students',
              'Right Icon': 'ArrowRight',
              'Full Width': true,
            },
          },
        ],
      },
      {
        id: 'page-2',
        name: 'Students',
        icon: 'Users',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Students',
              Subheading: 'Grade 4 · 24 in class',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Circle', Size: 'Regular', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Sarah Miller', description: 'ID #2453 · Present', image: 'https://images.unsplash.com/photo-1574701148212-8518049c7b2c?w=200&h=200&fit=crop' },
                { title: 'Liam Chen', description: 'ID #2461 · Present', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop' },
                { title: 'Olivia Patel', description: 'ID #2470 · Present', image: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=200&h=200&fit=crop' },
                { title: 'Noah Garcia', description: 'ID #2478 · Absent', image: 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=200&h=200&fit=crop' },
                { title: 'Mia Thompson', description: 'ID #2485 · Present', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop' },
                { title: 'Ethan Reyes', description: 'ID #2491 · Present', image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=200&h=200&fit=crop' },
                { title: 'Ava Brooks', description: 'ID #2498 · Present', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&h=200&fit=crop' },
                { title: 'Lucas Wright', description: 'ID #2502 · Absent', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=200&h=200&fit=crop' },
              ]),
            },
          },
        ],
      },
      {
        id: 'page-3',
        name: 'Profile',
        icon: 'IdCard',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Center' },
            properties: {
              Heading: 'Sarah Miller',
              Subheading: 'Grade 4 · Mrs. Johnson · Student ID #2453',
            },
          },
          {
            componentId: 'image',
            variants: { 'Has Image': 'Yes', Alignment: 'Center', Size: 'Large' },
            properties: {
              'Image URL': 'https://images.unsplash.com/photo-1574701148212-8518049c7b2c?w=400&h=400&fit=crop',
              'Alt Text': 'Sarah Miller',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Quick Info', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Mar 14, 2015', Description: 'Date of Birth', Icon: 'Cake', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Sept 2022', Description: 'Joined', Icon: 'CalendarDays', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Room 12', Description: 'Homeroom', Icon: 'School', Shrinked: true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Family Contact', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Circle', Size: 'Regular', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Rachel Miller', description: 'Mother · (555) 123-4567', image: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=200&h=200&fit=crop' },
                { title: 'David Miller', description: 'Father · (555) 987-6543', image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Latest Note', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Horizontal', Action: 'None' },
            properties: {
              Title: 'Strong reading progress',
              Description: 'Sarah moved up a reading level this month — Apr 22.',
              Icon: 'BookOpen',
            },
          },
        ],
      },
      {
        id: 'page-4',
        name: 'Documents',
        icon: 'FileText',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Documents',
              Subheading: 'Sarah Miller · Grade 4',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Enrollment', Subheading: '' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Enrollment Form.pdf', Description: 'Signed Sept 2, 2022.' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Birth Certificate.pdf', Description: 'On file.' },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Academic', Subheading: '' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Q3 Report Card.pdf', Description: 'Issued April 2026.' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Standardized Test Results.pdf', Description: 'Spring 2026 assessment.' },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Permissions', Subheading: '' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Photo Release.pdf', Description: 'Signed by parent — valid this year.' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Field Trip Consent.pdf', Description: 'Signed for May 24 trip.' },
          },
        ],
      },
      {
        id: 'page-5',
        name: 'Health',
        icon: 'HeartPulse',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Health Profile',
              Subheading: 'Sarah Miller · Grade 4',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Horizontal', Action: 'None' },
            properties: {
              Title: 'Allergies',
              Description: 'Peanuts, dairy. Action plan on file.',
              Icon: 'TriangleAlert',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Horizontal', Action: 'None' },
            properties: {
              Title: 'Medications',
              Description: 'Albuterol inhaler · As needed for asthma.',
              Icon: 'Pill',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Horizontal', Action: 'None' },
            properties: {
              Title: 'Emergency Contact',
              Description: 'Mother — Rachel Miller · (555) 123-4567',
              Icon: 'PhoneCall',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Horizontal', Action: 'None' },
            properties: {
              Title: 'Primary Doctor',
              Description: 'Dr. Patel · Maple Family Medicine',
              Icon: 'Stethoscope',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Records', Subheading: '' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Vaccination Record.pdf', Description: 'Up to date.' },
          },
          {
            componentId: 'document',
            variants: { 'Has File': 'Yes', Size: 'Normal', Alignment: 'Left' },
            properties: { 'File Name': 'Annual Physical.pdf', Description: 'Completed Sept 2025.' },
          },
        ],
      },
      {
        id: 'page-6',
        name: 'My Profile',
        icon: 'User',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Center' },
            properties: { Heading: 'My Profile', Subheading: '' },
          },
          {
            componentId: 'image',
            variants: { 'Has Image': 'Yes', Alignment: 'Center', Size: 'Large' },
            properties: {
              'Image URL': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
              'Alt Text': 'Mrs. Sarah Johnson',
            },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: {
              Heading: 'Mrs. Sarah Johnson',
              Subheading: '4th Grade Teacher · Maple Park',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'About', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: '12 yrs', Description: 'Teaching', Icon: 'GraduationCap', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Room 12', Description: 'Homeroom', Icon: 'School', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: '2025–26', Description: 'School Year', Icon: 'CalendarDays', Shrinked: true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Account', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'None', Size: 'Compact', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Account Settings', description: 'Email, password, profile' },
                { title: 'Notifications', description: 'Daily summary at 7:00 AM' },
                { title: 'Help & Support', description: 'Contact district IT' },
                { title: 'Sign Out', description: '' },
              ]),
            },
          },
        ],
      },
    ],
    headerActions: [],
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    appTitle: 'Sightglass',
    appSubtitle: 'Seasonally sourced coffee',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        icon: 'House',
        elements: [
          {
            componentId: 'image',
            variants: { 'Has Image': 'Yes', Alignment: 'Center', Size: 'Large' },
            properties: {
              'Image URL': 'https://sightglasscoffee.com/cdn/shop/files/SG_SpringEquinox_Hero1-Wide-Mobile-opt.jpg?v=1770064099&width=1200',
              'Alt Text': 'Sightglass cafe interior',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Center' },
            properties: {
              Heading: 'Open up your mornings',
              Subheading: '',
            },
          },
          {
            componentId: 'paragraph',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: {
              Text: 'Seasonally sourced coffee, roasted fresh in San Francisco for a better cup every day.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'button',
            variants: { Type: 'Standard', Variant: 'Default' },
            properties: {
              Label: 'Shop Coffee',
              'Right Icon': 'ArrowRight',
              'Full Width': true,
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Featured This Season', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Spring Equinox · $25',
              Description: 'A bright, layered blend with notes of citrus blossom and stone fruit. Light–medium roast.',
              'Button Label': 'Add to Bag',
              'Image URL': 'https://sightglasscoffee.com/cdn/shop/files/Sightglass-Spring-Equinox-Seasonal-Blend.png?crop=center&height=1200&v=1770068101&width=1200',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Our Promise', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Direct Trade', Description: 'Relationships with growers', Icon: 'HeartHandshake', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Small Batch', Description: 'Roasted to order', Icon: 'Flame', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Seasonal', Description: 'Coffees at peak flavor', Icon: 'Leaf', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: '4.9 / 5', Description: '2,000+ reviews', Icon: 'Star', Shrinked: true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'What People Are Saying', Subheading: '' },
          },
          {
            componentId: 'testimonial',
            properties: { 'Show Avatars': true },
          },
        ],
      },
      {
        id: 'page-2',
        name: 'Shop',
        icon: 'ShoppingBag',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Shop Coffee',
              Subheading: 'Roasted fresh, shipped weekly.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 8 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Blends', Subheading: '' },
          },
          {
            componentId: 'product-list',
            variants: { Layout: 'Grid' },
            properties: {
              Title: '',
              'Show Toolbar': false,
              'Show Images': true,
              'Add New Card': false,
              Currency: '$',
              'Button Label': 'Add to Bag',
              Products: JSON.stringify([
                { name: 'Owl’s Howl Espresso', price: '21.00', image: 'https://sightglasscoffee.com/cdn/shop/files/Bag-12oz-ESPRESSO-Organic-Owls_Howl.png?crop=center&height=1000&v=1768455335&width=1000' },
                { name: 'Grizzly Peak', price: '22.50', image: 'https://sightglasscoffee.com/cdn/shop/files/Grizzly-Peak-Regenerative-Organic-Bag.png?crop=center&height=1200&v=1776818408&width=1200' },
                { name: 'Spring Equinox', price: '25.00', image: 'https://sightglasscoffee.com/cdn/shop/files/Sightglass-Spring-Equinox-Seasonal-Blend.png?crop=center&height=1200&v=1770068101&width=1200' },
                { name: 'Banner Dark', price: '22.00', image: 'https://sightglasscoffee.com/cdn/shop/files/Bag-12oz-BLENDS-Organic-Banner_Dark.png?crop=center&height=1000&v=1758137225&width=1000' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Single Origins', Subheading: '' },
          },
          {
            componentId: 'product-list',
            variants: { Layout: 'Grid' },
            properties: {
              Title: '',
              'Show Toolbar': false,
              'Show Images': true,
              'Add New Card': false,
              Currency: '$',
              'Button Label': 'Add to Bag',
              Products: JSON.stringify([
                { name: 'Colombia, La Granada', price: '27.50', image: 'https://sightglasscoffee.com/cdn/shop/files/2026_SO_MAR_Colombia_FincaLaGranada.png?crop=center&height=1200&v=1775503815&width=1200' },
                { name: 'Honduras, Nueva Esperanza', price: '28.00', image: 'https://sightglasscoffee.com/cdn/shop/files/Honduras-David-Munoz-Nueva-Esperanza.png?crop=center&height=1200&v=1775522199&width=1200' },
                { name: 'Women of Coffee, Peru', price: '25.00', image: 'https://sightglasscoffee.com/cdn/shop/files/Women-of-Coffee-Peru.png?crop=center&height=1200&v=1772761483&width=1200' },
                { name: 'Guatemala, El Sendero', price: '27.50', image: 'https://sightglasscoffee.com/cdn/shop/files/Sightglass-Guatemala-El-Sendero-Renardo-Ovalle-Single-Origin.png?crop=center&height=1200&v=1770070866&width=1200' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Subscriptions', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Single Origin Series · $22 / mo',
              Description: 'A new seasonally sourced coffee delivered to your door each month. Skip or cancel anytime.',
              'Button Label': 'Start Subscription',
              'Image URL': 'https://sightglasscoffee.com/cdn/shop/files/Sightglass-Single-Origin-Series-Subscription.jpg?crop=center&height=1000&v=1761198590&width=1000',
            },
          },
        ],
      },
      {
        id: 'page-3',
        name: 'Cafes',
        icon: 'MapPin',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Left' },
            properties: {
              Heading: 'Visit Us',
              Subheading: 'Four cafes — three in San Francisco, one in Los Angeles.',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'SoMa · 7th Street',
              Description: '270 7th Street, San Francisco · Mon–Fri 7a–6p · Sat–Sun 8a–6p',
              'Button Label': 'Get Directions',
              'Image URL': 'https://sightglasscoffee.com/cdn/shop/files/7th_Street-min.jpg?crop=center&height=1360&v=1757985881&width=1360',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Mission · 20th Street',
              Description: '3014 20th Street, San Francisco · Mon–Sun 7a–6p',
              'Button Label': 'Get Directions',
              'Image URL': 'https://sightglasscoffee.com/cdn/shop/files/20th-min.jpg?crop=center&height=1360&v=1757985881&width=1360',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Divisadero',
              Description: '500 Divisadero Street, San Francisco · Mon–Sun 7a–6p',
              'Button Label': 'Get Directions',
              'Image URL': 'https://sightglasscoffee.com/cdn/shop/files/Divisadero-min.jpg?crop=center&height=1360&v=1757985881&width=1360',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Hollywood',
              Description: '1801 N Highland Ave, Los Angeles · Mon–Sun 7a–6p',
              'Button Label': 'Get Directions',
              'Image URL': 'https://sightglasscoffee.com/cdn/shop/files/Sycamore-min.jpg?crop=center&height=1360&v=1757985881&width=1360',
            },
          },
        ],
      },
      {
        id: 'page-4',
        name: 'Account',
        icon: 'User',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large', Alignment: 'Center' },
            properties: { Heading: 'Hi, Maya', Subheading: '' },
          },
          {
            componentId: 'image',
            variants: { 'Has Image': 'Yes', Alignment: 'Center', Size: 'Large' },
            properties: {
              'Image URL': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
              'Alt Text': 'Maya',
            },
          },
          {
            componentId: 'paragraph',
            variants: { Size: 'Medium', Alignment: 'Center' },
            properties: {
              Text: 'Member since 2023 · maya@example.com',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Your Sightglass', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: '12', Description: 'Orders', Icon: 'Package', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: '240', Description: 'Points', Icon: 'Star', Shrinked: true },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Vertical', Action: 'None' },
            properties: { Title: 'Gold', Description: 'Tier', Icon: 'Trophy', Shrinked: true },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Active Subscription', Subheading: '' },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Square', Layout: 'Vertical', Action: 'Button' },
            properties: {
              Title: 'Single Origin Series',
              Description: 'Next ship: May 12 · $22 / mo. You can skip or pause from your dashboard.',
              'Button Label': 'Manage Subscription',
              'Image URL': 'https://sightglasscoffee.com/cdn/shop/files/Sightglass-Single-Origin-Series-Subscription.jpg?crop=center&height=1000&v=1761198590&width=1000',
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Left' },
            properties: { Heading: 'Recent Orders', Subheading: '' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic', 'Image Style': 'Square', Size: 'Compact', Action: 'Icon' },
            properties: {
              'Show Header': false,
              Items: JSON.stringify([
                { title: 'Owl’s Howl · 12oz', description: 'Apr 2 · $21.00 · Delivered', image: 'https://sightglasscoffee.com/cdn/shop/files/Bag-12oz-ESPRESSO-Organic-Owls_Howl.png?crop=center&height=1000&v=1768455335&width=1000' },
                { title: 'Spring Equinox · 12oz', description: 'Mar 18 · $25.00 · Delivered', image: 'https://sightglasscoffee.com/cdn/shop/files/Sightglass-Spring-Equinox-Seasonal-Blend.png?crop=center&height=1200&v=1770068101&width=1200' },
                { title: 'Colombia La Granada · 12oz', description: 'Mar 4 · $27.50 · Delivered', image: 'https://sightglasscoffee.com/cdn/shop/files/2026_SO_MAR_Colombia_FincaLaGranada.png?crop=center&height=1200&v=1775503815&width=1200' },
              ]),
            },
          },
          {
            componentId: 'spacer',
            properties: { Height: 16 },
          },
          {
            componentId: 'heading',
            variants: { Size: 'Small', Alignment: 'Center' },
            properties: { Heading: 'Stay Connected', Subheading: '' },
          },
          {
            componentId: 'social-follow',
            variants: { Layout: 'Wrap', Variant: 'Secondary', Filled: 'No' },
          },
        ],
      },
    ],
    headerActions: [],
  },
]

export function getPresetById(id: string): AppPreset {
  return APP_PRESETS.find((p) => p.id === id) ?? APP_PRESETS[0]
}
