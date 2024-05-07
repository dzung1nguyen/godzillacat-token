import {
  AuthorityType,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  setAuthority,
} from "@solana/spl-token";
import { getConnection, getOrCreateWallet } from "../utils/web3";
import { Connection, Keypair } from "@solana/web3.js";

let connection: Connection;
let payerAccount: Keypair;
let mintAccount: Keypair;

const init = async () => {
  connection = await getConnection();
  payerAccount = await getOrCreateWallet("payerAccount");
  mintAccount = await getOrCreateWallet("mintAccount");
};

const main = async () => {
  await init();

  const txhash = await setAuthority(
    connection, // connection
    payerAccount, // payer
    mintAccount.publicKey, // mint account || token account
    payerAccount.publicKey, // current authority
    AuthorityType.MintTokens, // authority type
    null,
    undefined,
    undefined,
    TOKEN_PROGRAM_ID
  );

  console.log("txhash", txhash);

  // Disable Freeze Account
  let txhash2 = await setAuthority(
    connection, // connection
    payerAccount, // payer
    mintAccount.publicKey, // mint account || token account
    payerAccount.publicKey, // current authority
    AuthorityType.FreezeAccount, // authority type
    null,
    undefined,
    undefined,
    TOKEN_PROGRAM_ID
  );

  console.log("txhash", txhash2);
};

main();
