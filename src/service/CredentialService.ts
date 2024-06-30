import bcrypt from "bcryptjs";
class CredentialService {
    async comparePassword(userPassord: string, hashedPassword: string) {
        return await bcrypt.compare(userPassord, hashedPassword);
    }
}

export default CredentialService;
