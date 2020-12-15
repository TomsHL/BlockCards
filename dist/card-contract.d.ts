import { Context, Contract } from 'fabric-contract-api';
export declare class CardContract extends Contract {
    cardExists(ctx: Context, cardId: string): Promise<boolean>;
    createCard(ctx: Context, cardId: string, namecard: string, owner: string): Promise<void>;
    updateCardOwner(ctx: Context, cardId: string, newowner: string): Promise<void>;
    deleteCard(ctx: Context, cardId: string): Promise<void>;
    queryAllCards(ctx: Context): Promise<string>;
    queryCard(ctx: Context, cardId: string): Promise<string>;
}
