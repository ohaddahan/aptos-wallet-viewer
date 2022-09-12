import {AptosClient, MaybeHexString, TokenClient} from "aptos";
import {MoveStructTag} from "aptos/src/generated/models/MoveStructTag";
import {MoveStructValue} from "aptos/src/generated/models/MoveStructValue";
import * as Gen from "aptos/src/generated";
import {TokenData} from "aptos/dist/token_types";


export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
// export const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";

enum Resources {
    Collections = "0x3::token::Collections",
    Tokens = "0x3::token::TokenStore"
}

enum Events {
    create_collection_events = "create_collection_events",
    mint_token_events = "mint_token_events",
    deposit_events = "deposit_events"
}

async function getCreateCollectionData(client: AptosClient, address: MaybeHexString): Promise<Gen.Event[]> {
    return await client.getEventsByEventHandle(address,
        Resources.Collections,
        Events.create_collection_events)
}

async function getCollectionMints(client: AptosClient, address: MaybeHexString): Promise<Gen.Event[]> {
    return await client.getEventsByEventHandle(address,
        Resources.Collections,
        Events.mint_token_events)
}

// async function getTokenCreation(client: AptosClient, address: MaybeHexString): Promise<Gen.Event[]> {
//     return await client.getEventsByEventHandle(address,
//         Resources.Tokens,
//         Events.deposit_events)
// }

export async function fetchWalletNfts(addressString: MaybeHexString): Promise<TokenData[]>{
    const address = addressString as MaybeHexString;
    const output: TokenData[] = [];
    const client = new AptosClient(NODE_URL);
    const tokenClient = new TokenClient(client);

    const resources = await client.getAccountResources(address);
    const resourcesByType: { [key: MoveStructTag]: MoveStructValue[] } = {};

    for (const resource of resources) {
        if (!(resource.type in resourcesByType)) {
            resourcesByType[resource.type] = [];
        }
        resourcesByType[resource.type].push(resource.data);
    }

    for (const collection of resourcesByType[Resources.Collections]) {
        const createEvents = await getCreateCollectionData(client, address);
        for (const event of createEvents) {
            const collectionData = await tokenClient.getCollectionData(address, event.data.collection_name);
            const mintEvents = await getCollectionMints(client, address);
            for (const mintEvent of mintEvents) {
                try {
                    const tokenData = await tokenClient.getTokenData(address, collectionData.name, mintEvent.data.id.name);
                    output.push(tokenData);
                } catch (e: any) {
                    console.log(`e: ${e}`);
                }
            }
        }
    }
    return output;
}
