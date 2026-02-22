export type TicketType = 'Complaint' | 'Data Change' | 'Consultation' | 'Claim' | 'App Failure' | 'Fraudulent Activity' | 'Spam';
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';
export type Language = 'KZ' | 'ENG' | 'RU';
export type TicketStatus = 'New' | 'In Progress' | 'Resolved';
export type Segment = 'Mass' | 'VIP' | 'Priority';

export interface Office {
  id: number;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export interface Manager {
  id: number;
  full_name: string;
  position: string;
  skills: string;
  business_unit: string;
  current_workload: number;
  office_id: number;
  office?: Office;
}

export interface Ticket {
  id: number;
  client_guid: string;
  gender: string;
  date_of_birth: string;
  segment: Segment;
  description: string;
  attachments: string;
  country: string;
  region: string;
  city: string;
  street: string;
  house: string;

  // AI fields
  ticket_type: TicketType;
  sentiment: Sentiment;
  priority: number;
  language: Language;
  summary: string;
  recommended_action: string;
  ai_attachment_placeholder: string;

  // Geo
  client_lat: number;
  client_lng: number;
  nearest_office: Office;

  // Assignment
  assigned_manager: Manager;
  status: TicketStatus;

  created_at: string;
  processed_at: string;
}

export interface Stats {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
  urgent: number;
}

export interface TicketFilters {
  status?: string;
  segment?: string;
  ticket_type?: string;
  sentiment?: string;
  language?: string;
  min_priority?: number;
}