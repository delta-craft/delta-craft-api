import { Response } from "express";
import { IApiPluginResponse } from "src/types/ApiResponse";

export const createResponse = <T = any>(res: Response<IApiPluginResponse<T>>, serviceRes: IApiPluginResponse<T>) => {
    const status = serviceRes.error ? 400 : 200;
    res.status(status).json(serviceRes)
}

export const createBoolResponse = (res: Response<IApiPluginResponse<boolean>>, serviceRes: IApiPluginResponse<boolean>) => {
    const status = serviceRes.content ? 200 : 400;
    res.status(status).json(serviceRes)
}
