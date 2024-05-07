import { readFile } from "./utils";
import { getBalance } from "./utils/web3";

const main = async () => {
  const payerAccountPublic = await readFile("payerAccountPublic.json");

  await getBalance(payerAccountPublic);
};

main();
