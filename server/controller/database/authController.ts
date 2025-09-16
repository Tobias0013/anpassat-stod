import { Request, Response } from "express";
import { Account } from "../../resources/mongoose/accountModel";
import { signJwt } from "../../resources/jwt/jwtHandler";

import bcrypt from "bcrypt";
import { decryptField } from "../../resources/scripts/decryption";

/**
 * Registers a new account (Request body fields must be encrypted).
 * 
 * @param req - The request object.
 * @param res - The response object.
 */
export const registerAccount = async (req: Request, res: Response) => {
  try {
    const username = decryptField(req.body.username);
    const password = decryptField(req.body.password);
    const mail = decryptField(req.body.mail);

    const usernameAlreadyExists = await Account.findOne({ username: username });
    const mailAlreadyExists = await Account.findOne({ mail: mail });
    if (usernameAlreadyExists || mailAlreadyExists) {
      res.status(409).json({ message: "Account already exists" });
    } else {
      const newAccount = new Account({
        username,
        password,
        mail,
        individualsId: []
      });
      const savedAccount = await newAccount.save();
      res.status(201).json({ account: savedAccount });
    }
  } catch (err) {
    res.status(500).json({ message: "Error registering account", error: (err as Error).message});
  }
};

/**
 * Authenticates an account and returns JWT token upon correct credentials (Request body fields must be encrypted).
 * 
 * @param req - The request object.
 * @param res - The response object.
 */
export const authAccount = async (req: Request, res: Response) => {
  try {
    const username = decryptField(req.body.username);
    const password = decryptField(req.body.password);

    const accountToAuth = await Account.findOne({ username: username});
    if (!accountToAuth) {
      res.status(404).json({ message: "Incorrect credentials" });
    } else {
      const passwordMatch = await bcrypt.compare(password, accountToAuth.password);

      if(!passwordMatch) {
        res.status(404).json({ message: "Incorrect credentials" });
      }
        else {
          const token = signJwt({ id: accountToAuth._id, username: accountToAuth.username });
          res.status(200).json({ token });
      }
    }
  } catch(err){
    res.status(500).json({ message: "Error authenticating account", error: (err as Error).message});
  }
}
