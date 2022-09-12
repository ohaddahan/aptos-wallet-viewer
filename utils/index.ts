import {AptosClient, FaucetClient, MaybeHexString, TokenClient} from "aptos";
import {MoveStructTag} from "aptos/src/generated/models/MoveStructTag";
import {MoveStructValue} from "aptos/src/generated/models/MoveStructValue";
import * as fs from "fs";
import * as Gen from "aptos/src/generated";

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

async function getTokenCreation(client: AptosClient, address: MaybeHexString): Promise<Gen.Event[]> {
    return await client.getEventsByEventHandle(address,
        Resources.Tokens,
        Events.deposit_events)
}

async function main() {

    const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
    const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";

    const client = new AptosClient(NODE_URL);
    const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
    const tokenClient = new TokenClient(client);
    const address: MaybeHexString = "0x11360676feb4c93469e0f6cdaad4add1b23fbc0154f2822737555ce371b8436d";

    const resources = await client.getAccountResources(address);
    const resourcesByType: { [key: MoveStructTag]: MoveStructValue[] } = {};

    for (const resource of resources) {
        if (!(resource.type in resourcesByType)) {
            resourcesByType[resource.type] = [];
        }
        resourcesByType[resource.type].push(resource.data);
    }

    fs.writeFileSync("resources.json", JSON.stringify(resourcesByType, null, 2));

    const collections = [];

    for (const collection of resourcesByType[Resources.Collections]) {
        const createEvents = await getCreateCollectionData(client, address);
        for (const event of createEvents) {
            const collectionData = await tokenClient.getCollectionData(address, event.data.collection_name);
            const mintEvents = await getCollectionMints(client, address);
            console.log(`event: ${JSON.stringify(event, null, 2)}`);
            console.log(`collectionData: ${JSON.stringify(collectionData, null, 2)}`);
            console.log(`mintEvents: ${JSON.stringify(mintEvents, null, 2)}`);

            for (const mintEvent of mintEvents) {
                const tokenData = await tokenClient.getTokenData(address, collectionData.name, mintEvent.data.id.name);
                console.log(`tokenData: ${JSON.stringify(tokenData, null, 2)}`);
            }
        }
        // const createEvents = await client.getEventsByEventHandle(address,
        //     Resources.Collections,
        //     Events.mint_token_events)
        //
        // for (const event of createEvents) {
        //     console.log(`event: ${JSON.stringify(event, null, 2)}`);
        //     const token = await tokenClient.getTokenForAccount(address, {
                // property_version: event?.version,
                // token_data_id: {
                //     creator: event.data.id.creator,
                //     collection: event.data.id.collection,
                //     name: event.data.id.name
                // }
            // })
            // console.log(`token: ${JSON.stringify(token, null, 2)}`);
        // }
    }
}


main()
    .then(() => {
        console.log('done');
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });