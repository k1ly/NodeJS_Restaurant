import axios, {HttpStatusCode} from "axios";
import {ConfigManager} from "@/util/config.manager";
import {BadRequestError} from "@/errors/bad-request.error";
import {UnauthorizedError} from "@/errors/unauthorized.error";
import {ForbiddenError} from "@/errors/forbidden.error";
import {NotFoundError} from "@/errors/not-found.error";
import {InternalServerError} from "@/errors/internal-server.error";
import {ConflictError} from "@/errors/conflict.error";

export class ApiManager {
    static async get(url: string, params?: any) {
        try {
            let config: any = {
                crossDomain: true,
                withCredentials: true,
                params,
                headers: {
                    "Authorization": sessionStorage.getItem("token") ? `Bearer ${sessionStorage.getItem("token")}` : null,
                    "Accept": "application/json"
                }
            }
            let {data} = await axios.get(`${await ConfigManager.get("API_URL")}${url}`, config);
            return data;
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case HttpStatusCode.BadRequest:
                        throw new BadRequestError(error.response.data);
                    case HttpStatusCode.Unauthorized:
                        sessionStorage.removeItem("token");
                        throw new UnauthorizedError(error.response.data);
                    case HttpStatusCode.Forbidden:
                        throw new ForbiddenError(error.response.data);
                    case HttpStatusCode.NotFound:
                        throw new NotFoundError(error.response.data);
                    case HttpStatusCode.InternalServerError:
                        throw new InternalServerError(error.response.data);
                    default:
                        throw new Error(error.response.data);
                }
            } else throw error;
        }
    }

    static async post(url: string, body?: any) {
        try {
            let config: any = {
                crossDomain: true,
                withCredentials: true,
                headers: {
                    "Authorization": sessionStorage.getItem("token") ? `Bearer ${sessionStorage.getItem("token")}` : null,
                    "Accept": "application/json"
                }
            }
            let {data} = await axios.post(`${await ConfigManager.get("API_URL")}${url}`, body, config);
            return data;
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case HttpStatusCode.BadRequest:
                        throw new BadRequestError(error.response.data);
                    case HttpStatusCode.Unauthorized:
                        sessionStorage.removeItem("token");
                        throw new UnauthorizedError(error.response.data);
                    case HttpStatusCode.Forbidden:
                        throw new ForbiddenError(error.response.data);
                    case HttpStatusCode.NotFound:
                        throw new NotFoundError(error.response.data);
                    case HttpStatusCode.Conflict:
                        throw new ConflictError(error.response.data);
                    case HttpStatusCode.InternalServerError:
                        throw new InternalServerError(error.response.data);
                    default:
                        throw new Error(error.response.data);
                }
            } else throw error;
        }
    }

    static async put(url: string, body?: any) {
        try {
            let config: any = {
                crossDomain: true,
                withCredentials: true,
                headers: {
                    "Authorization": sessionStorage.getItem("token") ? `Bearer ${sessionStorage.getItem("token")}` : null,
                    "Accept": "application/json"
                }
            }
            let {data} = await axios.put(`${await ConfigManager.get("API_URL")}${url}`, body, config);
            return data;
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case HttpStatusCode.BadRequest:
                        throw new BadRequestError(error.response.data);
                    case HttpStatusCode.Unauthorized:
                        sessionStorage.removeItem("token");
                        throw new UnauthorizedError(error.response.data);
                    case HttpStatusCode.Forbidden:
                        throw new ForbiddenError(error.response.data);
                    case HttpStatusCode.NotFound:
                        throw new NotFoundError(error.response.data);
                    case HttpStatusCode.Conflict:
                        throw new ConflictError(error.response.data);
                    case HttpStatusCode.InternalServerError:
                        throw new InternalServerError(error.response.data);
                    default:
                        throw new Error(error.response.data);
                }
            } else throw error;
        }
    }

    static async patch(url: string, body?: any) {
        try {
            let config: any = {
                crossDomain: true,
                withCredentials: true,
                headers: {
                    "Authorization": sessionStorage.getItem("token") ? `Bearer ${sessionStorage.getItem("token")}` : null,
                    "Accept": "application/json"
                }
            }
            let {data} = await axios.patch(`${await ConfigManager.get("API_URL")}${url}`, body, config);
            return data;
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case HttpStatusCode.BadRequest:
                        throw new BadRequestError(error.response.data);
                    case HttpStatusCode.Unauthorized:
                        sessionStorage.removeItem("token");
                        throw new UnauthorizedError(error.response.data);
                    case HttpStatusCode.Forbidden:
                        throw new ForbiddenError(error.response.data);
                    case HttpStatusCode.NotFound:
                        throw new NotFoundError(error.response.data);
                    case HttpStatusCode.Conflict:
                        throw new ConflictError(error.response.data);
                    case HttpStatusCode.InternalServerError:
                        throw new InternalServerError(error.response.data);
                    default:
                        throw new Error(error.response.data);
                }
            } else throw error;
        }
    }

    static async delete(url: string) {
        try {
            let config: any = {
                crossDomain: true,
                withCredentials: true,
                headers: {
                    "Authorization": sessionStorage.getItem("token") ? `Bearer ${sessionStorage.getItem("token")}` : null,
                    "Accept": "application/json"
                }
            }
            let {data} = await axios.delete(`${await ConfigManager.get("API_URL")}${url}`, config);
            return data;
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case HttpStatusCode.BadRequest:
                        throw new BadRequestError(error.response.data);
                    case HttpStatusCode.Unauthorized:
                        sessionStorage.removeItem("token");
                        throw new UnauthorizedError(error.response.data);
                    case HttpStatusCode.Forbidden:
                        throw new ForbiddenError(error.response.data);
                    case HttpStatusCode.NotFound:
                        throw new NotFoundError(error.response.data);
                    case HttpStatusCode.InternalServerError:
                        throw new InternalServerError(error.response.data);
                    default:
                        throw new Error(error.response.data);
                }
            } else throw error;
        }
    }

    static async send(url: string, formData: FormData) {
        try {
            let config: any = {
                crossDomain: true,
                withCredentials: true,
                headers: {
                    "Authorization": sessionStorage.getItem("token") ? `Bearer ${sessionStorage.getItem("token")}` : null,
                    "Accept": "text/plain",
                    "Content-Type": "multipart/form-data"
                }
            }
            let {data} = await axios.post(`${await ConfigManager.get("API_URL")}${url}`, formData, config);
            return data;
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case HttpStatusCode.BadRequest:
                        throw new BadRequestError(error.response.data);
                    case HttpStatusCode.Unauthorized:
                        sessionStorage.removeItem("token");
                        throw new UnauthorizedError(error.response.data);
                    case HttpStatusCode.Forbidden:
                        throw new ForbiddenError(error.response.data);
                    case HttpStatusCode.NotFound:
                        throw new NotFoundError(error.response.data);
                    case HttpStatusCode.InternalServerError:
                        throw new InternalServerError(error.response.data);
                    default:
                        throw new Error(error.response.data);
                }
            } else throw error;
        }
    }
}