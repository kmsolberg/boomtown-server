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
            context.response.set('Firebase-Token', context.token)
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
}