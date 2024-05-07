// https://solana-labs.github.io/solana-program-library/token/js/
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { readFile, writeFileIfNotExists } from ".";
import { endpoint } from "../config";
import base58 from "bs58";

export const getConnection = async () => {
  return await new Connection(endpoint, "confirmed");
};

export const getOrCreateWallet = async (name: string) => {
  const publicFileName = `${name}Public.json`;
  const privateFileName = `${name}Private.json`;
  const privateKeyFileName = `${name}PrivateKey.json`;

  const privateContent = readFile(privateFileName);

  if (!privateContent) {
    const keypair = await Keypair.generate();
    const privateKey = base58.encode(keypair.secretKey);

    console.log(`---------------${name}---------------------`);
    console.log(`publicKey: ${keypair.publicKey.toString()}`);
    console.log(`secretKey: ${keypair.secretKey}`);
    console.log(`privateKey: ${privateKey}`);
    console.log(`---------------END ${name}---------------------`);

    const secretArray = keypair.secretKey
      .toString()
      .split(",")
      .map((value) => Number(value));

    await writeFileIfNotExists(publicFileName, keypair.publicKey.toString());
    await writeFileIfNotExists(privateFileName, secretArray);
    await writeFileIfNotExists(privateKeyFileName, privateKey);

    return keypair;
  } else {
    const keypair = await Keypair.fromSecretKey(new Uint8Array(privateContent));

    const privateKey = base58.encode(keypair.secretKey);
    await writeFileIfNotExists(privateKeyFileName, privateKey);

    return keypair;
  }
};

export const requestAirdrop = async (publicKey: PublicKey, sol = 5) => {
  const connection = await getConnection();

  const airdropSignature = await connection.requestAirdrop(
    publicKey,
    sol * LAMPORTS_PER_SOL
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  console.log(`${publicKey.toString()} received ${sol} SOL`);
};

/**
 * Check the Balance of a Solana SPL Token Account
 * @param tokenAccount
 * @returns
 */
export const getBalance = async (pubKey: string) => {
  const connection = await getConnection();
  const balance = await connection.getBalance(new PublicKey(pubKey));
  console.log(`Wallet Balance: ${balance / LAMPORTS_PER_SOL}`);
  return balance;
};

export const getPrivateKey = async (name: string) => {};
