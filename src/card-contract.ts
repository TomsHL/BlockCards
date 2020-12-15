/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Card } from './card';

@Info({title: 'CardContract', description: 'My Smart Contract' })
export class CardContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async cardExists(ctx: Context, cardId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(cardId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createCard(ctx: Context, cardId: string, namecard: string, owner: string): Promise<void> {
        const exists = await this.cardExists(ctx, cardId);
        if (exists) {
            throw new Error(`The card ${cardId} already exists`);
        }
        const card = new Card();
        card.owner = owner;
        const buffer = Buffer.from(JSON.stringify(card));
        await ctx.stub.putState(cardId, buffer);
        card.namecard = namecard;
        const buffer2 = Buffer.from(JSON.stringify(card));
        await ctx.stub.putState(cardId, buffer2);
    }

    @Transaction()
    public async updateCardOwner(ctx: Context, cardId: string, newowner: string): Promise<void> {
        const exists = await this.cardExists(ctx, cardId);
        if (!exists) {
            throw new Error(`The card ${cardId} does not exist`);
        }
        const card = new Card();
        card.owner = newowner;
        const buffer = Buffer.from(JSON.stringify(card));
        await ctx.stub.putState(cardId, buffer);
    }

    @Transaction()
    public async deleteCard(ctx: Context, cardId: string): Promise<void> {
        const exists = await this.cardExists(ctx, cardId);
        if (!exists) {
            throw new Error(`The card ${cardId} does not exist`);
        }
        await ctx.stub.deleteState(cardId);
    }
    @Transaction()
    public async queryAllCards(ctx: Context): Promise<string> {
        const startKey = '001';
        const endKey = '999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    @Transaction()
    public async queryCard(ctx: Context, cardId: string): Promise<string> {
        const cardAsBytes = await ctx.stub.getState(cardId);
        if (!cardAsBytes || cardAsBytes.length === 0) {
            throw new Error(`${cardId} does not exist`);
        }
        console.log(cardAsBytes.toString());
        return cardAsBytes.toString() ;
    }
}
