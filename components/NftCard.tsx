import {TokenData} from "aptos/dist/token_types";
import {useEffect, useState} from "react";

interface NftCardProps {
    token: TokenData;
}

const NftCard = (props: NftCardProps) => {
    const [image, setImage] = useState<string>("");
    const [metadata, setMetadata] = useState<object>({});

    async function getMetadata() {
        try {
            const response = await fetch(props.token.uri);
            const json = await response.json();
            setMetadata(json);
            if (json.image) {
                setImage(json.image);
            }
        } catch (e: any) {
            console.log(`error ${e.message}\n${props.token.uri}`)
        }
    }

    useEffect(() => {
        (async () => {
            await getMetadata();
        })()
    }, [props])

    return (
        <div
            className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 m-2">
            <a href={props.token.uri} target={"_blank"} rel={"noreferrer"}>
                <img className="rounded-t-lg" src={image} alt="NFT Image"/>
                <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {props.token.name}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {props.token.description}
                    </p>
                </div>
            </a>
        </div>

    )
}

export default NftCard;