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
        },
        tags() {
            return postgres.getTags();
        }
    },
    
    Item: {
        itemowner(item, args, context) {
            return postgres.getUsersProfile(item.itemowner)
        },
        borrower(item, args, context) {
            if (!item.borrower) return null
            return postgres.getUsersProfile(item.borrower)
        },
        tags: (item, args) => {
            return postgres.getItemTags(item.id)
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
            return postgres.newItem(args)
        },
        addUser(root, args, context) {
            return postgres.createUser(args, context) 
        }
    }
};

export default resolveFunctions;
