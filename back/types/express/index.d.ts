import { Users } from 'src/schemas/users.schema';

declare global {
  namespace Express {
    class User extends Users {}
  }
}
