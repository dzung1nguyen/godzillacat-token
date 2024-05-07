import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { getConnection } from "../utils/web3";
import { readFile } from "../utils";

(async () => {
  const connection = await getConnection();

  const payerAccountPublic = await readFile("payerAccountPublic.json");

  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey(payerAccountPublic),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  console.log("Token                                         Balance");
  console.log("------------------------------------------------------------");
  tokenAccounts.value.forEach((tokenAccount) => {
    const accountData = AccountLayout.decode(tokenAccount.account.data);
    console.log(`${new PublicKey(accountData.mint)}   ${accountData.amount}`);
  });
})();
