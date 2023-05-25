import axios from "axios";
import {ApiManager} from "@/util/api.manager";
import {ConfigManager} from "@/util/config.manager";
import {HttpStatusCode} from "axios";
import {UnauthorizedError} from "@/errors/unauthorized.error";
import {InternalServerError} from "@/errors/internal-server.error";
import {BadRequestError} from "@/errors/bad-request.error";

export class AuthManager {
    static async authenticate() {
        if (!sessionStorage.getItem("token")) {
            try {
                let config: any = {
                    crossDomain: true,
                    withCredentials: true,
                    headers: {"Accept": "text/plain"}
                }
                let {data} = await axios.post(`${await ConfigManager.get("API_URL")}/auth/refresh`, null, config);
                sessionStorage.setItem("token", data);
            } catch (error: any) {
                if (error.response) {
                    switch (error.response.status) {
                        case HttpStatusCode.Unauthorized:
                            throw new UnauthorizedError(error.response.data);
                        case HttpStatusCode.InternalServerError:
                            throw new InternalServerError(error.response.data);
                        default:
                            throw new Error(error.response.data);
                    }
                } else throw error;
            }
        }
        return await ApiManager.get("/auth/user");
    }

    static async login(login: string, password: string, remember?: boolean) {
        try {
            let config: any = {
                crossDomain: true,
                withCredentials: true,
                headers: {
                    "Accept": "text/plain",
                    "Content-Type": "application/json"
                }, params: {
                    "remember-me": remember ? "on" : undefined
                },
            }
            let {data} = await axios.post(`${await ConfigManager.get("API_URL")}/auth/login`, {
                login,
                password
            }, config);
            sessionStorage.setItem("token", data);
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case HttpStatusCode.BadRequest:
                        throw new BadRequestError(error.response.data);
                    case HttpStatusCode.Unauthorized:
                        throw new UnauthorizedError(error.response.data);
                    case HttpStatusCode.InternalServerError:
                        throw new InternalServerError(error.response.data);
                    default:
                        throw new Error(error.response.data);
                }
            } else throw error;
        }
    }

    static async logout() {
        try {
            let config: any = {
                crossDomain: true,
                withCredentials: true,
                headers: {
                    "Authorization": sessionStorage.getItem("token") ? `Bearer ${sessionStorage.getItem("token")}` : null
                }
            }
            await axios.post(`${await ConfigManager.get("API_URL")}/auth/logout`, null, config);
            sessionStorage.removeItem("token");
        } catch (error: any) {
            switch (error.response.status) {
                case HttpStatusCode.Unauthorized:
                    throw new UnauthorizedError(error.response.data);
                case HttpStatusCode.InternalServerError:
                    throw new InternalServerError(error.response.data);
                default:
                    throw new Error(error.response.data);
            }
        }
    }
}