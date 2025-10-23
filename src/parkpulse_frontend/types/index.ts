export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
  action?: string;
}

export interface ParkFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: {
    id: string;
    name?: string;
    [key: string]: any;
  };
}

export interface ParkFeatureCollection {
  type: 'FeatureCollection';
  features: ParkFeature[];
}

export interface ProposalData {
  parkName: string;
  parkId: string;
  description: string;
  endDate: string;
  endDateNs: number;
  analysisData?: {
    ndviBefore?: number;
    ndviAfter?: number;
    pm25Before?: number;
    pm25After?: number;
    pm25IncreasePercent?: number;
    demographics?: {
      kids?: number;
      adults?: number;
      seniors?: number;
    };
  };
  demographics?: {
    population?: number;
  };
}

export interface ParkResponseData {
  featureCollection?: ParkFeatureCollection;
  [key: string]: any;
}

export type AgentResponse =
  | {
      sessionId: string;
      action: 'render_parks';
      reply: string;
      data?: ParkResponseData;
    }
  | {
      sessionId: string;
      action: 'submit_to_icp';
      reply: string;
      data: ProposalData;
    }
  | {
      sessionId: string;
      action: Exclude<string, 'render_parks' | 'submit_to_icp'>;
      reply: string;
      data?: any;
    };
