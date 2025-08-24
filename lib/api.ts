import { IAccount } from "@/database/account.model";
import { IUser } from "@/database/user.model";

import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:3000/api";

export const api = {
  users: {
    getAll: async () =>
      fetchHandler({
        url: `${API_BASE_URL}/users`,
      }),

    getById: async ({ id }: { id: string }) =>
      fetchHandler({
        url: `${API_BASE_URL}/users/${id}`,
      }),

    getByEmail: async ({ email }: { email: string }) =>
      fetchHandler({
        url: `${API_BASE_URL}/users/email/${email}`,
        options: {
          method: "POST",
          body: JSON.stringify({ email }),
        },
      }),

    create: async ({ userData }: { userData: IUser }) =>
      fetchHandler({
        url: `${API_BASE_URL}/users`,
        options: {
          method: "POST",
          body: JSON.stringify(userData),
        },
      }),

    update: async ({ id, userData }: { id: string; userData: IUser }) =>
      fetchHandler({
        url: `${API_BASE_URL}/users/${id}`,
        options: {
          method: "PUT",
          body: JSON.stringify(userData),
        },
      }),

    delete: async ({ id }: { id: string }) =>
      fetchHandler({
        url: `${API_BASE_URL}/users/${id}`,
        options: {
          method: "DELETE",
        },
      }),
  },

  accounts: {
    getAll: async () =>
      fetchHandler({
        url: `${API_BASE_URL}/accounts`,
      }),

    getById: async ({ id }: { id: string }) =>
      fetchHandler({
        url: `${API_BASE_URL}/accounts/${id}`,
      }),

    getByProvider: async ({
      providerAccountId,
    }: {
      providerAccountId: string;
    }) =>
      fetchHandler({
        url: `${API_BASE_URL}/accounts/provider`,
        options: {
          method: "POST",
          body: JSON.stringify({ providerAccountId }),
        },
      }),

    create: async ({ accountData }: { accountData: IAccount }) =>
      fetchHandler({
        url: `${API_BASE_URL}/accounts`,
        options: {
          method: "POST",
          body: JSON.stringify(accountData),
        },
      }),

    update: async ({
      id,
      accountData,
    }: {
      id: string;
      accountData: IAccount;
    }) =>
      fetchHandler({
        url: `${API_BASE_URL}/accounts/${id}`,
        options: {
          method: "PUT",
          body: JSON.stringify(accountData),
        },
      }),

    delete: async ({ id }: { id: string }) =>
      fetchHandler({
        url: `${API_BASE_URL}/accounts/${id}`,
        options: {
          method: "DELETE",
        },
      }),
  },

  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }: SignInWithOAuthParams) =>
      fetchHandler({
        url: `${API_BASE_URL}/auth/signin-with-oauth`,
        options: {
          method: "POST",
          body: JSON.stringify({ user, provider, providerAccountId }),
        },
      }),
  },
};
