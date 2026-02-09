export interface ISetForSupplier {
  set: {
    id: number;
    name: string;
    client: {
      id: number;
      company: string;
      firstName: string;
      lastName: string;
    } | null;
  };
  supplier: {
    id: number;
    company: string;
    firstName: string;
    lastName: string;
  };
}
