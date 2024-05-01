// https://solana-labs.github.io/solana-program-library/token/js/
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { readFile, writeFileIfNotExists } from ".";
import { endpoint } from "../config";

export const getConnection = async () => {
  return await new Connection(endpoint, "confirmed");
};

export const getOrCreateAccount = async (name: string) => {
  const publicFileName = `${name}Public.json`;
  const privateFileName = `${name}Private.json`;
  const privateContent = readFile(privateFileName);

  if (!privateContent) {
    const keypair = await Keypair.generate();
    console.log(`---------------${name}---------------------`);
    console.log(`public key: ${keypair.publicKey.toString()}`);
    console.log(`private key: ${keypair.secretKey}`);
    console.log(`---------------END ${name}---------------------`);

    const secretArray = keypair.secretKey
      .toString()
      .split(",")
      .map((value) => Number(value));

    await writeFileIfNotExists(publicFileName, keypair.publicKey.toString());
    await writeFileIfNotExists(privateFileName, secretArray);

    return keypair;
  } else {
    const keypair = await Keypair.fromSecretKey(new Uint8Array(privateContent));

    return keypair;
  }
};

export const requestAirdrop = async (publicKey: PublicKey, sol = 10) => {
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
