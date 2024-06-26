import bcrypt from "bcrypt";
export class CredentialService {
    async comparePassword(userPassord: string, hashedPassword: string) {
        return await bcrypt.compare(userPassord, hashedPassword);
    }
}
