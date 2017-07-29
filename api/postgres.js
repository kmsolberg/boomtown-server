import pool from '../database/index';
import admin from '../database/firebase';

export function getUsers() {
    return pool.query(`SELECT * FROM user_profiles`)
    .then(response => {
        return renameID(response.rows);
    })
    .catch(errors => console.log(errors))
}

export function getUsersProfile(id) {
    return new Promise(async (resolve, reject)=> {
        try {
            let userPostgres = await pool.query(`SELECT * FROM user_profiles WHERE userid='${id}'`)
            const userFB = await admin.auth().getUser(id)
            userPostgres = renameID(userPostgres.rows)[0];
            userPostgres = {...userPostgres, email: userFB.email};
            resolve(userPostgres);
        } catch (error) {
            reject(error);
        }
    })
}

function renameID(rows) {
    return rows.map((row) => Object.keys(row).reduce((acc, user) => {
        acc = {...row, id:row.userid}
        delete acc.userid;
        return acc
    }), {})
}

export function getItems() {
    return pool.query(`SELECT * FROM items`)
    .then(response => {
        return response.rows
    })
    .catch(errors => console.log(errors))    
}

export function getItem(id) {
    return pool.query(`SELECT * FROM items`)
    .then(response => {
        return response.rows
    })
    .catch(errors => console.log(errors))    
}

export function getItemOwner(id) {
    return pool.query(`SELECT * FROM users WHERE userid='${id}'`)
    .then(response => {
        return response.rows[0];
    })
    .catch(errors => console.log(errors))
}

export function getUserOwnedItems(id) {
    return pool.query(`SELECT * FROM items WHERE itemowner='${id}'`)
    .then(response => {
        return response.rows;
    })
    .catch(errors => console.log(errors))
}

export function borrowedItems(id) {
    return pool.query(`SELECT * FROM items WHERE borrowerid='${id}'`)
    .then(response => {
        return renameID(response.rows);
    })
    .catch(errors => console.log(errors))
}

export function getTags() {
    return pool.query(`SELECT * FROM tags`)
    .then(response => {
        return response.rows
    })
    .catch(errors => console.log(errors))    
}

export function getItemTags(id) {
    return pool.query(`
        SELECT * from tags
        INNER JOIN itemtags
        ON tags.id = itemtags.tagid
        WHERE itemtags.itemid = ${id}
    `)
    .then(response => {
        return response.rows
    })
    .catch(errors => console.log(errors))
}

export function getAllTaggedItems(id) {
    return pool.query(`
        SELECT * FROM items
        INNER JOIN itemtags
        ON items.id = itemtags.itemid
        where itemtags.tagid = ${id}
    `)
    .then(response => {
        return response.rows
    })
    .catch(errors => console.log(errors))
}

export function createUser(args, context) {
    return new Promise(async (resolve, reject)=> {
        try {
            let fbUser = await admin.auth().createUser({
                email: args.email,
                password: args.password
            })
            const query = {
                text: 'INSERT INTO user_profiles(fullname, bio, userid) VALUES($1, $2, $3) RETURNING *',
                values: [args.fullname, args.bio, fbUser.uid],
            }
            let pgUser = await pool.query(query)
            let user = {...pgUser.rows[0], email: fbUser.email, id: fbUser.uid}
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
}

export function newItem(args, context) {
    return new Promise(async (resolve, reject) => {
        try {
            const itemQuery = {
                text: 'INSERT INTO items(title, description, imageurl, itemowner) VALUES($1, $2, $3, $4) RETURNING *',
                values: [args.title, args.description, args.imageurl, args.itemowner],
            }
            const newItem = await pool.query(itemQuery)
            function insertTag(tags) {
                return tags.map(tag => {
                return `(${newItem.rows[0].id}, ${tag.id})`
                }).join(',')
            }
            const tagQuery = {
                text: `INSERT INTO itemtags(itemid, tagid) VALUES ${insertTag(args.tags)}`
            }
            const tags = await pool.query(tagQuery)
            resolve({id: newItem.rows[0].id})
        } catch (error) {
            reject(error)
        }
    })
}
