import {  Response } from "express";

export class ServiceWrapper {
  public static async executeWithErrorHandling(
    resp: Response,
    callback: Function
  ) {
    try {
      await callback();
      return;
    } catch (err: any) {
      console.log("CATCH ERROR",err)
      return resp.status(400).send({
        status: "failed",
        message: `${ err?.code || err?.message||'Server error'}`,
      });

      
    }
  }

}
