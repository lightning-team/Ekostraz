export interface User {
  email: string;
  name: string;
  surname?: string;
  picture?: string;
}

const NAME_CLAIM_KEY = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname';
const SURNAME_CLAIM_KEY = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname';

export interface RawUserResponse {
  access_token: string;
  expires_on: string; // ISO DateTime
  id_token: string;
  provider_name: string;
  user_claims: [{ typ: string; val: string }];
  user_id: string;
}

export class AzureUser implements User {
  email: string;
  name: string;
  surname?: string;
  picture?: string;

  constructor(rawUser: RawUserResponse) {
    const claimsMap = this.getClaimsMap(rawUser.user_claims);

    this.email = rawUser.user_id;
    this.name = claimsMap[NAME_CLAIM_KEY] || 'Inspektorze';
    this.surname = claimsMap[SURNAME_CLAIM_KEY];
    this.picture = claimsMap['picture']; /* tslint:disable-line */
  }

  private getClaimsMap(claims: RawUserResponse['user_claims']): { [key: string]: string } {
    return claims.reduce((acc, currentClaim) => {
      acc[currentClaim.typ] = currentClaim.val;
      return acc;
    }, {});
  }
}
