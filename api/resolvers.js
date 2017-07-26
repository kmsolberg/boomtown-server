import fetch from 'node-fetch';
import * as json from './jsonServer';
import pool from '../database/index';
import * as psql from './postgres';

const resolveFunctions = {
    Query: {
        users() {
            return psql.getUsers();
            // return json.getUsers();
        },
        user(root, {id}, context) {
            return context.loaders.IndividualUser.load(id);
            // return json.getUser(id);
        },
        items() {
            return psql.getItems()
            // return json.getItems()
        },
        item(root, { id }, context) {
            return context.loaders.IndividualItem.load(id)
        }
    },
    
    Item: {
        itemOwner(item, args, context) {
            return context.loaders.IndividualUser.load(item.itemowner)
            // return json.getUser(item.itemOwner)
        },
        borrower(item) {
            if (!item.borrower) return null
            return json.getUser(item.borrower)
        }
    },

    User: {
        items: (user, args, context) => {
            return context.loaders.UserOwnedItems.load(user);
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
        addUser(root, args) {
            return psql.createUser(args) 
        }
    }
};

// pool.query('SELECT NOW() as now', (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//   }
// })

// pool.query('SELECT NOW() as now')
//   .then(res => console.log(res.rows[0]))
//   .catch(e => console.error(e.stack))

export default resolveFunctions;
