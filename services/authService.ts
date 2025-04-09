import http from "@/http";
import axios from "axios";
import { constants } from "../constants";

interface UserData {
  id: string;
  name: string;
  email: string;
  token: string;
}

export namespace AuthService {
  export async function login(
    email: string,
    password: string
  ): Promise<UserData> {
    return http
      .post(`/auth/login`, {
        email,
        password,
      })
      .then((response: any) => {
        const data = response.data;

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          token: data.token,
        } as UserData;
      });
  }

  export async function me(token: string) {
    return axios.get(`${constants.baseAPI}/public/token/get/${token}`);
  }

  export async function companies(token: string) {
    return axios.get(
      `${constants.baseAPI}/api/public/token/organizations/${token}`
    );
  }
}
