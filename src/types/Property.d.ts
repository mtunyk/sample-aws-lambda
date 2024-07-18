export type Property = {
  id: string;
  owners?: string[];
  mailingAddress?: string;
  cityStateZip?: string;
  salePrice?: number | string;
  saleDate?: string;
  squareFootage?: number;
  ownerFor?: string;
  absentee?: boolean;
  corporateOwned?: boolean;
}
