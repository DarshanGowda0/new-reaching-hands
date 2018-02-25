import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Item } from '../models/item';
import { AuthService } from './auth.service';
import { ItemLog } from '../models/item-log';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class DataService {

  uid: string;

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.authService.user.subscribe(user => {
      this.uid = user.uid;
    });
  }

  generateId() {
    return this.firestore.createId();
  }

  getTimeStamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  addItem(item: Item) {
    item.itemId = this.generateId();
    item.addedBy = this.uid;
    return this.firestore.collection(`items`).doc(item.itemId).set(item);
  }

  getItemById(itemId: string) {
    return this.firestore.doc<Item>(`items/${itemId}`).valueChanges();
  }

  getItems(subCategory: string, queryString: string) {
    return this.firestore.collection<Item>(`items`, ref => ref.where('subCategory', '==', subCategory)
      .where('itemName', '>', `${queryString}`).where('itemName', '<', `${queryString}z`)
      .orderBy('itemName')).valueChanges();
  }

  deleteItemById(itemId) {
    return this.firestore.collection<Item>(`items`).doc(itemId).delete();
    // delete all logs related to item
  }

  addLog(log: ItemLog) {
    return this.firestore.collection<ItemLog>(`logs`).doc(log.logId).set(log);
  }

  getLogsOfItem(itemId: string) {
    return this.firestore.collection<ItemLog>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }

  // getLogsOfSubCat

  // getLogsOfCat

  deleteLogById(logId: string) {
    return this.firestore.collection<ItemLog>(`logs`).doc(logId).delete();
  }
}
