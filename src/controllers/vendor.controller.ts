import { Request, Response } from "express";
import { VendorService } from "../services/vendor.service";
import { CreateVendorInput } from "../dto";

export const CreateVendor = async (req: Request, res: Response): Promise<any> => {
    try {
        // await VendorService.createVendor(req);
        const { name, phone, address, email, password, pincode, foodTypes } = <CreateVendorInput>req.body;
        return res.json({ name, phone, address, email, password, pincode, foodTypes })

    } catch (error) {

    }
};

export const GetVendors = async (req: Request, res: Response): Promise<any> => {
    try {

    } catch (error) {

    }
};

export const GetVendorById = async (req: Request, res: Response): Promise<any> => {
    try {

    } catch (error) {

    }
};