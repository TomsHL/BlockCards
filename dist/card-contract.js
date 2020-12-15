"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const card_1 = require("./card");
let CardContract = class CardContract extends fabric_contract_api_1.Contract {
    async cardExists(ctx, cardId) {
        const buffer = await ctx.stub.getState(cardId);
        return (!!buffer && buffer.length > 0);
    }
    async createCard(ctx, cardId, namecard, owner) {
        const exists = await this.cardExists(ctx, cardId);
        if (exists) {
            throw new Error(`The card ${cardId} already exists`);
        }
        const card = new card_1.Card();
        card.owner = owner;
        const buffer = Buffer.from(JSON.stringify(card));
        await ctx.stub.putState(cardId, buffer);
        card.namecard = namecard;
        const buffer2 = Buffer.from(JSON.stringify(card));
        await ctx.stub.putState(cardId, buffer2);
    }
    async updateCardOwner(ctx, cardId, newowner) {
        const exists = await this.cardExists(ctx, cardId);
        if (!exists) {
            throw new Error(`The card ${cardId} does not exist`);
        }
        const card = new card_1.Card();
        card.owner = newowner;
        const buffer = Buffer.from(JSON.stringify(card));
        await ctx.stub.putState(cardId, buffer);
    }
    async deleteCard(ctx, cardId) {
        const exists = await this.cardExists(ctx, cardId);
        if (!exists) {
            throw new Error(`The card ${cardId} does not exist`);
        }
        await ctx.stub.deleteState(cardId);
    }
    async queryAllCards(ctx) {
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
                }
                catch (err) {
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
    async queryCard(ctx, cardId) {
        const cardAsBytes = await ctx.stub.getState(cardId);
        if (!cardAsBytes || cardAsBytes.length === 0) {
            throw new Error(`${cardId} does not exist`);
        }
        console.log(cardAsBytes.toString());
        return cardAsBytes.toString();
    }
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], CardContract.prototype, "cardExists", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], CardContract.prototype, "createCard", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], CardContract.prototype, "updateCardOwner", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], CardContract.prototype, "deleteCard", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], CardContract.prototype, "queryAllCards", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], CardContract.prototype, "queryCard", null);
CardContract = __decorate([
    fabric_contract_api_1.Info({ title: 'CardContract', description: 'My Smart Contract' })
], CardContract);
exports.CardContract = CardContract;
//# sourceMappingURL=card-contract.js.map