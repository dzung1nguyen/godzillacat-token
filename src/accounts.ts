import { getOrCreateAccount, requestAirdrop } from "./utils/web3";

const main = async () => {
  // Create a token account
  const payerAccount = await getOrCreateAccount("payerAccount");
  const mintAccount = await getOrCreateAccount("mintAccount");

  console.log('payerAccount', payerAccount);
  console.log('mintAccount', mintAccount);

  // Receive 1 SOL to account
  // await requestAirdrop(payerAccount.publicKey, 5);
};

main();
