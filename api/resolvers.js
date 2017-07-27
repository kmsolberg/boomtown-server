import fetch from 'node-fetch';
import * as json from './jsonServer';
import pool from '../database/index';
import * as postgres from './postgres';

const resolveFunctions = {
    Query: {
        users() {
            return postgres.getUsers();
        },
        user(root, {id}, context) {
            return context.loaders.IndividualUser.load(id);
        },
        items() {
            return postgres.getItems()
        },
        item(root, { id }, context) {
            return context.loaders.IndividualItem.load(id)
        }
    },
    
    Item: {
        itemOwner(item, args, context) {
            return postgres.getUsersProfile(item.itemowner)
        },
        borrower(item, args, context) {
            if (!item.borrower) return null
            return postgres.getUsersProfile(item.borrower)
        }
    },

    User: {
        items: (user, args, context) => {
            return context.loaders.UserOwnedItems.load(user.id);
        },
        borrowed: (user, args, context) => {
            return context.loaders.BorrowedItems.load(user);
        }
    },

    Mutation: {
        addItem(root, args) {
            const newItem = {
                title: args.title,
                imageUrl: args.imageUrl,
                itemOwner: args.itemOwner,
                description: args.description,
                tags: args.tags,
                createdOn: Math.floor(Date.now() / 1000),
                available: true,
                borrower: null
            }
            return json.newItem(newItem)
        },
        addUser(root, args, context) {
            return postgres.createUser(args, context) 
        }
    }
};

export default resolveFunctions;
