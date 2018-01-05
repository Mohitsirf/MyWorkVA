export interface IContactList {
  lists: [{
   id: number;
   name: string;
  }];
  campaigns: [{
   id: number;
   name: string;
   from_name: string;
   from_email: string;
  }];
}
