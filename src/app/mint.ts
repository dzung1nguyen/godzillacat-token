import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import "@solana/web3.js";
import { decimals, endpoint, metadatURL, totalSupply } from "../config";
import { readFile } from "../utils";
import { getOrCreateWallet } from "../utils/web3";
import token from "../token.json";

const main = async () => {
  const umi = createUmi(endpoint);

  const payerAccountPrivate = readFile("payerAccountPrivate.json");
  const mintAccountPrivate = readFile("mintAccountPrivate.json");

  const payer = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(payerAccountPrivate)
  );

  const mintWallet = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(mintAccountPrivate)
  );

  const payerSigner = await createSignerFromKeypair(umi, payer);
  const mintSigner = await createSignerFromKeypair(umi, mintWallet);

  const metadata = {
    ...token,
    uri: metadatURL,
  };

  console.log("metadata", metadata);

  // const mint = await generateSigner(umi);
  umi.use(signerIdentity(payerSigner));
  umi.use(mplCandyMachine());

  console.log("mint", mintSigner);

  createAndMint(umi, {
    mint: mintSigner,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: decimals,
    amount: totalSupply,
    tokenOwner: payer.publicKey,
    tokenStandard: TokenStandard.Fungible,
  })
    .sendAndConfirm(umi)
    .then(() => {
      console.log(
        "Successfully minted 1 million tokens (",
        mintSigner.publicKey,
        ")"
      );
    });
};

main();
