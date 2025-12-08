import { Role } from '../../user/types/role';

export interface ILoggedUser {
  id: number;
  name: string;
  accessToken: string;
  role: Role;
}
