import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Item } from '../models/item';
import { AuthService } from './auth.service';
import { ItemLog, ItemLog1, ItemLog3, ItemLog2, ItemAbstract } from '../models/item-log';
import { tap, map } from 'rxjs/operators';
import { User } from './user';
//import * as moment from 'moment';

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
  addLog1(log: ItemLog1) {
    return this.firestore.collection<ItemLog1>(`logs`).doc(log.logId).set(log);
  }
  addLog2(log: ItemLog2) {
    return this.firestore.collection<ItemLog2>(`logs`).doc(log.logId).set(log);
  }
  addLog3(log: ItemLog3) {
    return this.firestore.collection<ItemLog3>(`logs`).doc(log.logId).set(log);
  }

  getLogsOfItem(itemId: string) {
    return this.firestore.collection<ItemLog>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }

  getLogsOfItemAsce(itemId: string, startDate: any, endDate: any) {
    return this.firestore.collection<ItemLog>(`logs`, ref => ref.where('itemId', '==', itemId)
      .where('date', '>=', startDate).where('date', '<=', endDate).orderBy('date')).valueChanges();
  }

  getLogsOfItem1(itemId: string) {
    return this.firestore.collection<ItemLog1>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }
  getLogsOfItem2(itemId: string) {
    return this.firestore.collection<ItemLog2>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }
  getLogsOfItem3(itemId: string) {
    return this.firestore.collection<ItemLog3>(`logs`, ref => ref.where('itemId', '==', itemId).orderBy('date', 'desc')).valueChanges();
  }

  addAuth(uid: string) {

  }

  // getLogsOfSubCat

  // getLogsOfCat

  deleteLogById(logId: string) {
    return this.firestore.collection<ItemLog>(`logs`).doc(logId).delete();
  }
  deleteLogById1(logId: string) {
    return this.firestore.collection<ItemLog1>(`logs`).doc(logId).delete();
  }
  deleteLogById2(logId: string) {
    return this.firestore.collection<ItemLog2>(`logs`).doc(logId).delete();
  }
  deleteLogById3(logId: string) {
    return this.firestore.collection<ItemLog3>(`logs`).doc(logId).delete();
  }

  getSummary() {
    return this.firestore.collection<ItemAbstract>(`logs`).valueChanges();
  }

  getSummaryCat(cat: string) {
    return this.firestore.collection<ItemAbstract>(`logs`, ref => ref.where('category', '==', cat).orderBy('date', 'desc')).valueChanges();
  }

  getSummarysubCat(subCat: string) {
    return this.firestore.collection<ItemAbstract>(`logs`, ref => ref.where('subCategory', '==', subCat)
      .orderBy('date', 'desc')).valueChanges();
  }

  getAllItems() {
    return this.firestore.collection<Item>('items').valueChanges();
  }

  getAllItemsCat(cat: string) {
    return this.firestore.collection<Item>('items', ref => ref.where('category', '==', cat)).valueChanges();
  }

  // save the permission token in firestore
  saveToken(user, token): void {

    const currentTokens = user.fcmTokens || {};
    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.firestore.collection('users').doc(user.uid);
      const tokens = { ...currentTokens, [token]: true };
      userRef.update({ fcmTokens: tokens });
    }
  }

}
