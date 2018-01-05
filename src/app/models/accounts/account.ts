export interface Account {
  id: number;
  type_id: number;
  source_account_id: string;
  title: string;
  is_connected: boolean;
  type: {
    id: number;
    title: string;
    description: string;
    slug: string;
  };
  token: {
    api_key: string;
    app_id: string;
    app_password: string;
    app_username: string;
  };
  updated_at: string;
}

export enum AccountType {
  MAILCHIMP = 'mailchimp',
  GETRESPONSE = 'getresponse',
  CONSTANT_CONTACT = 'constant_contact',
  ICONTACT = 'icontact',
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
  AWEBER = 'aweber'
}

export interface AccountTypes {
  id: number;
  title: string;
  slug: string;
  description: string;
}

export const getAccountTitle = (type: AccountType): string => {
  switch (type) {
    case AccountType.MAILCHIMP:
      return 'MailChimp';
    case AccountType.GETRESPONSE:
      return 'GetResponse';
    case AccountType.CONSTANT_CONTACT:
      return 'Constant Contact';
    case AccountType.ICONTACT:
      return 'iContact';
    case AccountType.GOOGLE:
      return 'Google';
    case AccountType.OUTLOOK:
      return 'Outlook';
    case AccountType.AWEBER:
      return 'AWeber';
    default:
      return '';
  }
}

export const getAccountTitleById = (typeId: number): string => {
  switch (typeId) {
    case 1:
      return 'MailChimp';
    case 2:
      return 'Constant Contact';
    case 3:
      return 'iContact';
    case 4:
      return 'AWeber';
    case 5:
      return 'GetResponse';
    case 6:
      return 'Google';
    case 7:
      return 'Outlook';
    default:
      return '';
  }
}

