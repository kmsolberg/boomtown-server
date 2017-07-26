import pool from '../database/index';

export function getUsers() {
    return pool.query(`SELECT * FROM user_profiles`)
    .then(response => {
        return renameID(response.rows);
    })
    .catch(errors => console.log(errors))
}


export function getUsersProfile(id) {
    return pool.query(`SELECT * FROM user_profiles WHERE userid='${id}'`)
    .then(response => {
    //    return response.rows[0]
        return renameID(response.rows)[0]
    })
    .catch(errors =>{
        console.log(errors)
    })
}

function renameID(rows) {
    return rows.map((row) => Object.keys(row).reduce((acc, user) => {
        acc = {...row, id:row.userid}
        delete acc.userid;
        return acc
    }), {})
}