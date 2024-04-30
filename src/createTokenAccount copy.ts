import {
  TOKEN_2022_PROGRAM_ID,
  createAccount,
  mintTo,
  transferChecked,
} from "@solana/spl-token";
import { getConnection, getOrCreateAccount } from "./utils/web3";
import { PublicKey } from "@solana/web3.js";
import { readFile } from "./utils";

let connection;
let payerAccount;
let mintAccount;
let ownerAccount;

const init = async () => {
  connection = await getConnection();
  payerAccount = await getOrCreateAccount("payerAccount");
  mintAccount = await getOrCreateAccount("mintAccount");
  ownerAccount = await getOrCreateAccount("payerAccount");
};

const main = async () => {
  await init();

  const connection = getConnection();

  const payerAccount = await getOrCreateAccount("payerAccount");
  const mintAccount = await getOrCreateAccount("mintAccount");
  const ownerAccount = await getOrCreateAccount("payerAccount");

  const sourceTokenAccount = await createAccount(
    connection,
    payerAccount, // Payer to create Token Account
    mintAccount.publicKey, // Mint Account address
    ownerAccount.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  console.log("sourceTokenAccount", sourceTokenAccount.toString());

  const amount = BigInt(1000000000000);
  const transactionSignature = await mintTo(
    connection,
    payerAccount, // Transaction fee payer
    mintAccount.publicKey, // Mint Account address
    sourceTokenAccount, // Mint to
    ownerAccount.publicKey, // Mint Authority address
    amount, // Amount
    undefined, // Additional signers
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  console.log("transactionSignature", transactionSignature.toString());

  // transfer to presale
  // Random keypair to use as owner of Token Account
  const presaleKeypair = await getOrCreateAccount("presaleAccount");
  const liquidityKeypair = await getOrCreateAccount("liquidityAccount");
  const airdropKeypair = await getOrCreateAccount("airdropAccount");
  const teamKeypair = await getOrCreateAccount("teamAccount");
  const marketingKeypair = await getOrCreateAccount("marketingAccount");

  // Create Token Account for presale keypair
  const presaleTokenAccount = await createAccount(
    connection,
    payerAccount, // Payer to create Token Account
    mintAccount.publicKey, // Mint Account address
    presaleKeypair.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  // Create Token Account for presale keypair
  const liquidityTokenAccount = await createAccount(
    connection,
    payerAccount, // Payer to create Token Account
    mintAccount.publicKey, // Mint Account address
    liquidityKeypair.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  // Create Token Account for presale keypair
  const airdropTokenAccount = await createAccount(
    connection,
    payerAccount, // Payer to create Token Account
    mintAccount.publicKey, // Mint Account address
    airdropKeypair.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  // Create Token Account for presale keypair
  const teamTokenAccount = await createAccount(
    connection,
    payerAccount, // Payer to create Token Account
    mintAccount.publicKey, // Mint Account address
    teamKeypair.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  // Create Token Account for presale keypair
  const marketingTokenAccount = await createAccount(
    connection,
    payerAccount, // Payer to create Token Account
    mintAccount.publicKey, // Mint Account address
    marketingKeypair.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  console.log("presaleTokenAccount", presaleTokenAccount.toString());
  const presaleAmount = BigInt(1000000000000 * 0.5);
  const liquidityAmount = BigInt(1000000000000 * 0.3);
  const airdropAmount = BigInt(1000000000000 * 0.1);
  const teamAmount = BigInt(1000000000000 * 0.05);
  const marketingAmount = BigInt(1000000000000 * 0.05);

  {
    const log = await transferChecked(
      connection,
      payerAccount, // Transaction fee payer
      sourceTokenAccount, // Source Token Account
      mintAccount.publicKey, // Mint Account address
      presaleTokenAccount, // Destination Token Account
      payerAccount.publicKey, // Owner of Source Account
      presaleAmount, // Amount to transfer
      2, // Mint Account decimals
      undefined, // Additional signers
      undefined, // Confirmation options
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID)
    );
    console.log("log1", log.toString());
  }

  await transferChecked(
    connection,
    payerAccount, // Transaction fee payer
    sourceTokenAccount, // Source Token Account
    mintAccount.publicKey, // Mint Account address
    presaleTokenAccount, // Destination Token Account
    payerAccount.publicKey, // Owner of Source Account
    presaleAmount, // Amount to transfer
    2, // Mint Account decimals
    undefined, // Additional signers
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID)
  );
};

main();
