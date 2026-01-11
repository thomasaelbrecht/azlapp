export interface SignInRequest {
  Username: string;
  Password: string;
  Code?: string;
  Thrust?: string;
}

export interface WorkingYearResponse {
  IsSelected: boolean;
  OrganizationId: number;
  Id: number;
  StartDate: string;
  EndDate: string;
  Name: string;
  MoreInfo: string | null;
  FullYear: boolean;
}

export interface WorkingYear {
  isSelected: boolean;
  organizationId: number;
  id: number;
  startDate: Date;
  endDate: Date;
  name: string;
  moreInfo: string | null;
  fullYear: boolean;
}

export interface MemberFilterParams {
  $top?: number;
  $count?: boolean;
  $skip?: number;
  $orderby?: string;
  ViewType?: number;
  SearchTerm?: string;
  WorkingYearId?: number;
  IsContactPerson?: boolean;
  IsInvoiceContactPerson?: boolean;
  IgnoreAccessibilityCheck?: boolean;
  SearchFederationMembers?: boolean;
  IsDroppedOut?: boolean;
}

export interface Address {
  Id: number;
  ExternalId: string | null;
  Street: string;
  Nr: string | null;
  Bus: string | null;
  StreetWithNr: string;
  PostCode: string;
  Location: string;
  Province: string;
  Country: string;
  Latitude: number | null;
  Longitude: number | null;
}

export interface Person {
  Id: number;
  ExternalId: string | null;
  FirstName: string;
  LastName: string;
  AccessKey: string;
  Gsm: string | null;
  HomePhone: string | null;
  WorkPhone: string | null;
  HomeEmail: string | null;
  WorkEmail: string | null;
  Website: string | null;
  BirthDate: string | null;
  DeathDate: string | null;
  HasSocialDiscount: boolean;
  CallName: string | null;
  BirthPlace: string | null;
  GenderId: number | null;
  NationalityId: number | null;
  HomeAddressId: number | null;
  HomeAddress: Address | null;
  NumberFederation: string | null;
}

export interface Function {
  Id: number;
  Name: string;
}

export interface Team {
  Id: number;
  Name: string;
}

export interface AssignedFunction {
  Id: number;
  MemberId: number;
  FunctionId: number;
  Function: Function;
  TeamId: number;
  Team: Team;
  Disabled: boolean;
}

export interface MemberResponse {
  Person: Person;
  AssignedFunctions: AssignedFunction[];
  Products: unknown;
  ProductsForPerson: unknown;
  AllProductsPayed: unknown;
  Id: number;
  Number: number;
  LicenseNumber: string | null;
  NumberFederation: string | null;
  WorkingYearId: number;
  ExportCode: string | null;
  Saldo: number;
  FirstTeamName: string | null;
  FirstFunctionName: string | null;
  FamilyMemberNr: string | null;
  DroppedOut: boolean;
  DropOutHasBeenProcessed: boolean | null;
  MemberMoneyTeam1: number;
  MemberMoneyTeam2: number;
  MemberMoneyTeam3: number;
  MemberMoneyTeam4: number;
  MemberMoneyTeam5: number;
  FamilyDiscount: number;
  SocialDiscount: number;
  InvalidDiscount: number;
  OtherDiscount: number;
  InsuranceFee: number;
  Surplus: number;
  PayedAmount: number;
  AccessKey: string;
  PersonId: number;
  PublicSavedPersonId: string | null;
  MemberMoneySend: boolean;
  MemberMoneySendDate: string | null;
  StatusId: number | null;
  StatusModifiedDate: string | null;
  Remark: string | null;
}

export interface Member {
  person: {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    gsm: string | null;
    homePhone: string | null;
    birthDate: Date | null;
    deathDate: Date | null;
    homeAddress: {
      id: number;
      street: string;
      streetWithNr: string;
      postCode: string;
      location: string;
      province: string;
      country: string;
    } | null;
  };
  assignedFunctions: Array<{
    id: number;
    functionName: string;
    teamName: string;
    disabled: boolean;
  }>;
  id: number;
  number: number;
  licenseNumber: string | null;
  numberFederation: string | null;
  workingYearId: number;
  saldo: number;
  firstTeamName: string | null;
  firstFunctionName: string | null;
  droppedOut: boolean;
  payedAmount: number;
}

export interface MemberFilterResponseRaw {
  Items: MemberResponse[];
  NextPageLink: string | null;
  Count: number;
}

export interface MemberFilterResponse {
  items: Member[];
  nextPageLink: string | null;
  count: number;
}

export class AssistApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = "AssistApiError";
  }
}
