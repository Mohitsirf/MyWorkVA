/**
 * Created by jatinverma on 9/12/17.
 */

export interface CtaAnalytics {
  event_type:    string;
  cta_type:      string;
  cta_namespace: string;
  location: {
    country:   string;
    city:      string;
    latitude:  string;
    longitude: string;
  };
  times:         string;
  timestamp:     string;
}
