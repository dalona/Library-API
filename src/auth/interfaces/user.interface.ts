import { Role } from "src/common/enums/role.enum";

export interface Guest {
    id: number;
    email: string;
    role: Role;
}