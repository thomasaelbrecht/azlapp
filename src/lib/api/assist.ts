import env from "@/lib/env/server";
import {
  AssistApiError,
  type MemberFilterParams,
  type MemberFilterResponse,
  type MemberFilterResponseRaw,
  type SignInRequest,
  type WorkingYear,
  type WorkingYearResponse,
} from "@/types/api/assist";

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
}

const ASSIST_BASE_URL = env.ASSIST_API_BASE_URL;
const ASSIST_API_KEY = env.ASSIST_API_KEY;
const ASSIST_API_TIMEOUT = 30000;

export class AssistApi {
  private jwtToken: string | null = null;

  private getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: this.jwtToken ? `Bearer ${this.jwtToken}` : ASSIST_API_KEY,
    };
  }

  private async request<T>(method: string, endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = new URL(`${ASSIST_BASE_URL}${endpoint}`);

    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        url.searchParams.append(key, String(value));
      }
    }

    if (!this.isSignedIn() && endpoint !== "/user/signin") {
      await this.signIn({
        Username: env.ASSIST_USERNAME,
        Password: env.ASSIST_PASSWORD,
      });
    }

    const headers = {
      ...this.getHeaders(),
      ...options?.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ASSIST_API_TIMEOUT);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: options?.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      const xToken = response.headers.get("X-Token");
      if (xToken) {
        this.jwtToken = xToken;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new AssistApiError(
          errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData,
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }

      return (await response.text()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof AssistApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new AssistApiError("Request timeout");
        }
        throw new AssistApiError(error.message);
      }

      throw new AssistApiError("Unknown error occurred");
    }
  }

  private isSignedIn(): boolean {
    return this.jwtToken !== null;
  }

  async signIn(credentials: SignInRequest): Promise<void> {
    await this.request("POST", "/user/signin", {
      Username: credentials.Username,
      Password: credentials.Password,
      Code: credentials.Code || "",
      Thrust: credentials.Thrust || "",
    });
  }

  async getWorkingYears(): Promise<WorkingYear[]> {
    const response = await this.request<WorkingYearResponse[]>("GET", "/workingYear/fed");
    return response.map(year => ({
      isSelected: year.IsSelected,
      organizationId: year.OrganizationId,
      id: year.Id,
      startDate: new Date(year.StartDate),
      endDate: new Date(year.EndDate),
      name: year.Name,
      moreInfo: year.MoreInfo,
      fullYear: year.FullYear,
    }));
  }

  async filterMembers(params?: MemberFilterParams): Promise<MemberFilterResponse> {
    const queryParams: Record<string, string | number | boolean> = {};

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          queryParams[key] = value;
        }
      }
    }

    const response = await this.request<MemberFilterResponseRaw>("GET", "/member/filter", undefined, {
      params: queryParams,
    });

    return {
      items: response.Items.map(member => ({
        person: {
          id: member.Person.Id,
          firstName: member.Person.FirstName,
          lastName: member.Person.LastName,
          email: member.Person.HomeEmail || member.Person.WorkEmail,
          gsm: member.Person.Gsm,
          homePhone: member.Person.HomePhone,
          birthDate: member.Person.BirthDate ? new Date(member.Person.BirthDate) : null,
          deathDate: member.Person.DeathDate ? new Date(member.Person.DeathDate) : null,
          genderId: member.Person.GenderId,
          homeAddress: member.Person.HomeAddress
            ? {
                id: member.Person.HomeAddress.Id,
                street: member.Person.HomeAddress.Street,
                streetWithNr: member.Person.HomeAddress.StreetWithNr,
                postCode: member.Person.HomeAddress.PostCode,
                location: member.Person.HomeAddress.Location,
                province: member.Person.HomeAddress.Province,
                country: member.Person.HomeAddress.Country,
              }
            : null,
        },
        assignedFunctions: member.AssignedFunctions.map(func => ({
          id: func.Id,
          functionName: func.Function.Name,
          teamName: func.Team.Name,
          disabled: func.Disabled,
        })),
        id: member.Id,
        number: member.Number,
        licenseNumber: member.LicenseNumber,
        numberFederation: member.NumberFederation,
        workingYearId: member.WorkingYearId,
        saldo: member.Saldo,
        firstTeamName: member.FirstTeamName,
        firstFunctionName: member.FirstFunctionName,
        droppedOut: member.DroppedOut,
        payedAmount: member.PayedAmount,
      })),
      nextPageLink: response.NextPageLink,
      count: response.Count,
    };
  }

  signOut(): void {
    this.jwtToken = null;
  }
}
