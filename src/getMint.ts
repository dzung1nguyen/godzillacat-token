import { TOKEN_2022_PROGRAM_ID, getMint } from "@solana/spl-token";
import { getConnection } from "./utils/web3";
import { PublicKey } from "@solana/web3.js";
import { readFile } from "./utils";

const main = async () => {
  const connection = getConnection();
  const mintPubKey = readFile("mintAccountPublic.json");
  const mintAccountPublicKey = new PublicKey(mintPubKey);
  let mintAccount = await getMint(
    connection,
    mintAccountPublicKey,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  );

  console.log("mintAccount", mintAccount);
};

main();
