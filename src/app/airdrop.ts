import { getConnection } from "../utils/web3";
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  Account,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import walletsTo from "../airdropAddresses.json";
import { readFile } from "../utils";
import { decimals } from "../config";

let connection: Connection;
let mintToken: string;
let fromWallet: Keypair;
const transferAmount = 30000;
const numberDecimals = decimals;
const batchSize = 50;
let fromWalletSecretPassphrase;

const getBatchInstructions = async (
  batch: string[],
  fromTokenAccount: Account
) => {
  const instructions = await Promise.all(
    batch.map(async (addressTo: string) => {
      const toWallet = new PublicKey(addressTo);
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        new PublicKey(mintToken),
        toWallet
      );

      return createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        transferAmount * Math.pow(10, numberDecimals)
      );
    })
  );

  return instructions;
};

const main = async () => {
  connection = await getConnection();
  mintToken = await readFile("mintAccountPublic.json");
  fromWalletSecretPassphrase = await readFile("payerAccountPrivate.json");
  fromWallet = Keypair.fromSecretKey(
    new Uint8Array(fromWalletSecretPassphrase)
  );

  const batches: TransactionInstruction[][] = [];

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    new PublicKey(mintToken),
    fromWallet.publicKey
  );

  console.log('fromTokenAccount', fromTokenAccount);


  console.log(
    `Sending ${transferAmount} ${mintToken} from ${fromWallet.publicKey.toString()}`
  );

  for (let i = 0; i < walletsTo.length; i += batchSize) {
    const batch = walletsTo.slice(i, i + batchSize);
    const instructions = await getBatchInstructions(batch, fromTokenAccount);
    batches.push(instructions);
  }

  const secretKey = new Uint8Array(fromWalletSecretPassphrase);

  for (const batch of batches) {
    const transaction = new Transaction().add(...batch);
    transaction.feePayer = fromWallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    transaction.sign({
      publicKey: fromWallet.publicKey,
      secretKey: secretKey,
    });

    const txid = await connection.sendRawTransaction(transaction.serialize());

    console.log("Batch transaction:", txid);
  }
};

main();
