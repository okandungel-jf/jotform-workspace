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
    appSubtitle: 'Register for our 2026 season',
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
              Heading: 'Welcome to Summer Camp',
              Subheading: 'Adventure, friends, and memories await.',
            },
          },
          {
            componentId: 'paragraph',
            properties: {
              Text: 'Join us for an unforgettable summer of outdoor activities, creative workshops, and team-building games. Open to ages 8-16.',
            },
          },
          {
            componentId: 'form',
            variants: { 'Layout Type': 'Card' },
            properties: {
              Label: 'Camper Registration',
              Description: 'Fill out the form to reserve your spot.',
            },
          },
          {
            componentId: 'button',
            properties: { Label: 'Register Now', 'Full Width': true },
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
            variants: { Size: 'Medium' },
            properties: { Heading: 'Weekly Schedule' },
          },
          {
            componentId: 'list',
            variants: { Layout: 'Basic' },
          },
        ],
      },
    ],
    headerActions: [],
  },
  {
    id: 'education',
    name: 'Education',
    appTitle: 'Online Academy',
    appSubtitle: 'Learn at your own pace',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        icon: 'House',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large' },
            properties: {
              Heading: 'Start Learning Today',
              Subheading: 'Courses designed by experts.',
            },
          },
          {
            componentId: 'paragraph',
            properties: {
              Text: 'Access on-demand video lessons, track your progress, and earn certificates as you complete each module.',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Horizontal', Action: 'Button' },
            properties: {
              Title: 'Introduction to Design',
              Description: '12 lessons · 4 hours',
              'Button Label': 'Start',
            },
          },
          {
            componentId: 'card',
            variants: { 'Image Style': 'Icon', Layout: 'Horizontal', Action: 'Button' },
            properties: {
              Title: 'Advanced Typography',
              Description: '8 lessons · 3 hours',
              'Button Label': 'Start',
            },
          },
        ],
      },
      {
        id: 'page-2',
        name: 'Resources',
        icon: 'Book',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Medium' },
            properties: { Heading: 'Learning Resources' },
          },
          {
            componentId: 'document',
            properties: { 'File Name': 'Course Syllabus.pdf', Description: 'Full curriculum overview' },
          },
          {
            componentId: 'document',
            properties: { 'File Name': 'Reading List.pdf', Description: 'Recommended books' },
          },
        ],
      },
    ],
    headerActions: [],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    appTitle: 'Wellness Clinic',
    appSubtitle: 'Your health, our priority',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        icon: 'House',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Large' },
            properties: {
              Heading: 'Book an Appointment',
              Subheading: 'Trusted care from licensed professionals.',
            },
          },
          {
            componentId: 'paragraph',
            properties: {
              Text: 'Schedule visits, complete intake forms, and access your records — all in one place.',
            },
          },
          {
            componentId: 'form',
            variants: { 'Layout Type': 'Card' },
            properties: {
              Label: 'Patient Intake',
              Description: 'Tell us about your symptoms before your visit.',
            },
          },
          {
            componentId: 'sign-document',
            properties: {
              Label: 'Consent Form',
              Description: 'Sign required HIPAA consent.',
            },
          },
        ],
      },
      {
        id: 'page-2',
        name: 'Records',
        icon: 'FileText',
        elements: [
          {
            componentId: 'heading',
            variants: { Size: 'Medium' },
            properties: { Heading: 'Medical Records' },
          },
          {
            componentId: 'document',
            properties: { 'File Name': 'Lab Results.pdf', Description: 'Updated 2026-04-15' },
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
]

export function getPresetById(id: string): AppPreset {
  return APP_PRESETS.find((p) => p.id === id) ?? APP_PRESETS[0]
}
