import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `
    
    type Item {
        id: ID!
        title: String!
        description: String!
        imageurl: String
        tags: [Tag!]
        itemOwner: User!
        createdOn: Int
        available: Boolean!
        borrower: User
    }

    type User {
        id: ID!
        email: String!
        fullname: String!
        bio: String
        items: [Item]
        borrowed: [Item]
    }

    type Tag {
        id: ID!
        title: String!
        items: [Item]
    }

    type Query {
        users: [User]
        user(id: ID!): User
        items: [Item]
        item(id:ID!): Item
        tags: [Tag]
        tag(id: ID!): Tag
    }

    type Mutation {
        addItem (
            title: String!
            imageurl: String
            itemowner: ID!
            description: String!
            tags: [String!]
        ) : Item

        addUser (
            fullname: String!
            email: String!
            bio: String
            password: String!
        ) : User
    }
`;

export default makeExecutableSchema({
    typeDefs,
    resolvers
});