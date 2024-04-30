import {
  TOKEN_2022_PROGRAM_ID,
  createAccount,
  mintTo,
  transferChecked,
} from "@solana/spl-token";
import { getConnection, getOrCreateAccount } from "./utils/web3";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

let connection:Connection;
let payerAccount:Keypair;
let mintAccount:Keypair;
let ownerAccount:Keypair;
let sourceTokenAccount:PublicKey;
const decimals = 4;
const amount = Math.pow(10, decimals + 10);
const totalToken = BigInt(amount);
const totalPresaleToken = BigInt(amount * 0.5);
const totalLiquidityToken = BigInt(amount * 0.3);
const totalAirdropToken = BigInt(amount * 0.1);
const totalTeamToken = BigInt(amount * 0.05);
const totalmarketingToken = BigInt(amount * 0.05);

const init = async () => {
  connection = await getConnection();
  payerAccount = await getOrCreateAccount("payerAccount");
  mintAccount = await getOrCreateAccount("mintAccount");
  ownerAccount = await getOrCreateAccount("payerAccount");

  sourceTokenAccount = await createAccount(
    connection,
    payerAccount, // Payer to create Token Account
    mintAccount.publicKey, // Mint Account address
    ownerAccount.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  console.log("sourceTokenAccount", sourceTokenAccount.toString());
};

const transfer = async (name: string, amountToken: bigint) => {
  const keypair = await getOrCreateAccount(name);

  const tokenAccount = await createAccount(
    connection,
    payerAccount, // Payer to create Token Account
    mintAccount.publicKey, // Mint Account address
    keypair.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  const transactionSignature = await transferChecked(
    connection,
    payerAccount, // Transaction fee payer
    sourceTokenAccount, // Source Token Account
    mintAccount.publicKey, // Mint Account address
    tokenAccount, // Destination Token Account
    payerAccount, // Owner of Source Account
    amountToken, // Amount to transfer
    decimals, // Mint Account decimals
    undefined, // Additional signers
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID)
  );
  console.log(`transferChecked (${name}): ${transactionSignature.toString()}`);
};

const main = async () => {
  await init();

  const transactionSignature = await mintTo(
    connection,
    payerAccount, // Transaction fee payer
    mintAccount.publicKey, // Mint Account address
    sourceTokenAccount, // Mint to
    ownerAccount.publicKey, // Mint Authority address
    totalToken, // Amount
    undefined, // Additional signers
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  console.log(
    `transactionSignature (mintTo): ${transactionSignature.toString()}`
  );

  await transfer("presaleAccount", totalPresaleToken);
  await transfer("liquidityAccount", totalLiquidityToken);
  await transfer("airdropAccount", totalAirdropToken);
  await transfer("teamAccount", totalTeamToken);
  await transfer("marketingAccount", totalmarketingToken);
};

main();
