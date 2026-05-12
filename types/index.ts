export interface Report {
  id: string
  user_id: string
  file_name: string
  file_url: string
  status: 'processing' | 'complete' | 'error'
  brief: Brief | null
  created_at: string
  updated_at: string
}

export interface Brief {
  id: string
  report_id: string
  summary: string
  scores: ScoreSection[]
  services: string[]
  accommodations: AccommodationCategory[]
  questions: MeetingQuestion[]
  watchFor: WatchForSection
  rights: RightsSection
  created_at: string
}

export interface ScoreSection {
  testName: string
  whatItMeasures: string
  childScore: string
  plainEnglishMeaning: string
  dailyImpact: string
}

export interface AccommodationCategory {
  category: string
  accommodations: Accommodation[]
}

export interface Accommodation {
  name: string
  whyItApplies: string
}

export interface MeetingQuestion {
  question: string
  purpose: string
}

export interface WatchForSection {
  strongIEP: string[]
  weakIEP: string[]
  vagueLanguage: string[]
}

export interface RightsSection {
  state: string
  meetingTerminology: string
  keyRights: string[]
  timelines: string[]
  ieeRight: string
}
