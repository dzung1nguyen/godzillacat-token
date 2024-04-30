import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  getMint,
  getMetadataPointerState,
  getTokenMetadata,
  TYPE_SIZE,
  LENGTH_SIZE,
  mintTo,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import { getConnection, getOrCreateAccount } from "./utils/web3";

const main = async () => {
  const payer = await getOrCreateAccount("payerAccount");
  const connection = getConnection();

  // Transaction to send
  let transaction: Transaction;

  // Transaction signature returned from sent transaction
  let transactionSignature: string;

  // Create a token account
  const mintKeypair = await getOrCreateAccount("mintAccount");
  const ownerAccount = await getOrCreateAccount("payerAccount"); // await getOrCreateAccount("ownerAccount");

  // Address for Mint Account
  const mint = mintKeypair.publicKey;
  // Decimals for Mint Account
  const decimals = 4;

  // Authority that can mint new tokens
  const mintAuthority = ownerAccount.publicKey; // owner
  // Authority that can update the metadata pointer and token metadata
  const updateAuthority = ownerAccount.publicKey;

  // Metadata to store in Mint Account
  const metaData: TokenMetadata = {
    updateAuthority: updateAuthority,
    mint: mint,
    name: "Godzilla Cat",
    symbol: "godCat",
    uri: "https://plum-worthwhile-limpet-629.mypinata.cloud/ipfs/QmSGXHaBHJfENJfNmXtHW7jCc8UHK2nx7xrb3h19HUAcqz",
    additionalMetadata: [
      ["description", "The Next Meme Coin Leader On Solana"],
    ],
  };

  const metadataExtension = TYPE_SIZE + LENGTH_SIZE;

  const metadataLen = pack(metaData).length;

  // Size of Mint Account with extension
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);

  // Minimum lamports required for Mint Account
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataExtension + metadataLen
  );

  // Instruction to invoke System Program to create new account
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
    newAccountPubkey: mint, // Address of the account to create
    space: mintLen, // Amount of bytes to allocate to the created account
    lamports, // Amount of lamports transferred to created account
    programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
  });

  console.log("createAccountInstruction", createAccountInstruction.keys);

  // Instruction to initialize the MetadataPointer Extension
  const initializeMetadataPointerInstruction =
    createInitializeMetadataPointerInstruction(
      mint, // Mint Account address
      updateAuthority, // Authority that can set the metadata address
      mint, // Account address that holds the metadata
      TOKEN_2022_PROGRAM_ID
    );

  // Instruction to initialize Mint Account data
  const initializeMintInstruction = createInitializeMintInstruction(
    mint, // Mint Account Address
    decimals, // Decimals of Mint
    mintAuthority, // Designated Mint Authority
    mintAuthority, // Optional Freeze Authority
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  // Instruction to initialize Metadata Account data
  const initializeMetadataInstruction = createInitializeInstruction({
    programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
    metadata: mint, // Account address that holds the metadata
    updateAuthority: updateAuthority, // Authority that can update the metadata
    mint: mint, // Mint Account address
    mintAuthority: mintAuthority, // Designated Mint Authority
    name: metaData.name,
    symbol: metaData.symbol,
    uri: metaData.uri,
  });

  // Add instructions to new transaction
  transaction = new Transaction().add(
    createAccountInstruction,
    initializeMetadataPointerInstruction,
    // note: the above instructions are required before initializing the mint
    initializeMintInstruction,
    initializeMetadataInstruction
  );

  // Send transaction
  transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mintKeypair] // Signers
  );

  console.log("transactionSignature", transactionSignature);

  console.log(
    `https://explorer.solana.com/tx/${transactionSignature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
  );
};

main();
