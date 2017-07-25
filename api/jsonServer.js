import fetch from 'node-fetch';

export function getUser(id) {
    return fetch(`http://localhost:3001/users/${id}`)
    .then(response => response.json())
    .catch(errors => console.log(errors));
};

export function getUsers() {
    return fetch(`http://localhost:3001/users/`)
    .then(response => response.json())
    .catch(errors => console.log(errors));
}

export function getItems() {
    return fetch(`http://localhost:3001/items`)
    .then(response => response.json())
    .catch(errors => console.log(errors));
}

export function getItem(id) {
    return fetch(`http://localhost:3001/items/${id}`)
    .then(response => response.json())
    .catch(errors => console.log(errors));
}

export function getUserOwnedItems(user) {
    return fetch(`http://localhost:3001/items/?itemOwner=${user.id}`)
    .then(response => response.json())
    .catch(errors => console.log(errors));
}

export function borrowedItems(user) {
    return fetch(`http://localhost:3001/items/?borrower=${user.id}`)
    .then(response => response.json())
    .catch(errors => console.log(errors));
}

export function newItem(newItem) {
    return fetch(`http://localhost:3001/items/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        })
        .then(response => response.json())
        .catch(errors => console.log(errors));
        return addItem;
}