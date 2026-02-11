import { Role } from '../../user/types/role.type';

export interface ILoggedUser {
  id: number;
  name: string;
  accessToken: string;
  role: Role;
}
