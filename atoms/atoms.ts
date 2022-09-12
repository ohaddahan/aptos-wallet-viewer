import {atom} from "recoil";
import {TokenData} from "aptos/dist/token_types";

export const modalAtom = atom<{open: boolean}>({
    key: "modalAtom",
    default: {open: false},
});

export const nftsAtoms = atom<TokenData[]>({
    key: "nftsAtoms",
    default: [],
});

export const addressAtom = atom<string|undefined>({
    key: "addressAtom",
    default: undefined
});