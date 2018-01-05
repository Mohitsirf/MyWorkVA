export interface GetResponseList {
  campaigns: [{
    id: string;
    name: string;
  }];
  from_fields: [{
    id: string;
    name: string;
    email: string;
  }];
}
