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

interface Address {
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

interface Person {
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

interface Function {
  Id: number;
  Name: string;
}

interface Team {
  Id: number;
  Name: string;
}

interface AssignedFunction {
  Id: number;
  MemberId: number;
  FunctionId: number;
  Function: Function;
  TeamId: number;
  Team: Team;
  Disabled: boolean;
}

interface MemberResponse {
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

interface Member {
  person: {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    gsm: string | null;
    homePhone: string | null;
    birthDate: Date | null;
    deathDate: Date | null;
    genderId: number | null;
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
    teamId: number;
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

export interface MemberTeamResponse {
  Id: number;
  FollowNumber: number;
  Name: string;
  CannotDeleteMessage: string;
  HasChildren: boolean;
  Children: MemberTeamResponse[];
}

export interface MemberTeamsResponseRaw {
  Items: MemberTeamResponse[];
  NextPageLink: string | null;
  Count: number;
}

export interface MemberTeam {
  id: number;
  followNumber: number;
  name: string;
  cannotDeleteMessage: string;
  hasChildren: boolean;
  children: MemberTeam[];
}

export interface MemberTeamsResponse {
  items: MemberTeam[];
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
