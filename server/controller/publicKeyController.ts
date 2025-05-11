import { Request, Response } from "express";
import { readFileSync } from "fs";
import { join } from "path";

export const getPublicKey = async (req: Request, res: Response) => {
    try{
        const publicKeyPath = join(__dirname, "..", "..", "server", "keys", "public.pem");
        const publicKey = readFileSync(publicKeyPath, "utf-8").replace(/\n/g, "");
    
        res.status(200).json({ publicKey });
    }catch(err){
        res.status(500).json({ message: "Error reading public key", error: (err as Error).message });
    }
    
}