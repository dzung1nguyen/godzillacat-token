import { env } from "../config";
import { getBalance, getOrCreateWallet, requestAirdrop } from "../utils/web3";

const main = async () => {
  // Create a token account
  const payerAccount = await getOrCreateWallet("payerAccount");
  const mintAccount = await getOrCreateWallet("mintAccount");

  console.log("payerAccount", payerAccount);
  console.log("mintAccount", mintAccount);

  // Receive 1 SOL to account
  if (env !== "prod") {
    await requestAirdrop(payerAccount.publicKey, 1);
  }

  getBalance(payerAccount.publicKey.toString());
};

main();
