import fetch from 'node-fetch';
import * as json from './jsonServer';

const resolveFunctions = {
    Query: {
        users() {
            return json.getUsers();
        },
        user(root, {id}, context) {
            return context.loaders.IndividualUser.load(id)
        },
        items() {
            return json.getItems()
        },
        item(root, { id }, context) {
            return context.loaders.IndividualItem.load(id)
        }
    },
    
    Item: {
        itemOwner(item) {
            return json.getUser(item.itemOwner)
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
            return json.newItem()
        // return fetch(`http://localhost:3001/items/`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(newItem)
        // })
        // .then(response => response.json())
        // .catch(errors => console.log(errors));
        // return addItem;
        }
    }
};

export default resolveFunctions;
