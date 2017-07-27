import DataLoader from 'dataloader';
import {
    getUsersProfile, 
    getUserOwnedItems, 
    borrowedItems, 
    getItem }
from './postgres';

export default function() {
    return {
        UserOwnedItems: new DataLoader(ids => (
            Promise.all(ids.map(id => getUserOwnedItems(id)))
        )),
        BorrowedItems: new DataLoader(ids => (
            Promise.all(ids.map(id => borrowedItems(id)))
        )),
        IndividualUser: new DataLoader(ids => (
            Promise.all(ids.map(id => getUsersProfile(id)))
        )),
        IndividualItem: new DataLoader(ids => (
            Promise.all(ids.map(id => getItem(id)))
        )),
    };
}