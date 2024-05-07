export const env: "local" | "test" | "dev" | "prod" = "dev";

const endpointUrls: Record<"local" | "test" | "dev" | "prod", string> = {
  local: "http://127.0.0.1:8899",
  test: "https://api.testnet.solana.com",
  dev: "https://api.devnet.solana.com",
  prod: "https://go.getblock.io/bfe45237d5204324a821996b54ed4bed",
};

export const endpoint = endpointUrls[env];

export const decimals = 4;
export const totalSupply = 10 ** (10 + decimals); // 10B
export const metadatURL =
  "https://plum-worthwhile-limpet-629.mypinata.cloud/ipfs/QmcTqKjkzFtPA3mvipq81fLEBcaimSynV4rVb7behJeasv";

export const rootPath = "/home/alex/www/godzillacat_token";
export const storagePath = `${rootPath}/src/storage`;
