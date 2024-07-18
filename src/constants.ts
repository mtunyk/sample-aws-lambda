export const DATE_FORMAT: string = 'yyyy-MM-dd'
export const AWS_REGION: string = 'us-east-1'

export const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET'
}

/* Project */
export enum ProjectStatus {
  Unpaid = 'Unpaid',
  Completed = 'Completed',
  Canceled = 'Canceled',
  Refunded = 'Refunded',
}

export enum ServiceName {
  Appraisal = 'Appraisal',
  VirtualTour = 'Virtual Home Tour',
  FloorPlan = '2D&3D Floor Plan',
  FloodDetermination = 'Certified Flood Determination',
}

export enum AppraisalService {
  Purchase = 'Purchase',
  Refinance = 'Refinance',
  Estate = 'Estate',
  Divorce = 'Divorce',
  PreListing = 'Pre-Listing',
  HomeEquity = 'Home Equity',
  PMIRemoval = 'PMI Removal',
  TaxAssessmentAppeal = 'Tax Assessment Appeal',
  Litigation = 'Litigation',
  HomeImprovement = 'Home Improvement'
}
