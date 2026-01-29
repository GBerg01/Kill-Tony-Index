import type { NextAuthOptions, Provider } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const githubClientId = process.env.GITHUB_ID;
const githubClientSecret = process.env.GITHUB_SECRET;

const providers: Provider[] = [];

if (githubClientId && githubClientSecret) {
  providers.push(
    GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-key",
  session: {
    strategy: "jwt",
  },
};
