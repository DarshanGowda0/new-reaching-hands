import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Item } from '../models/item';

@Injectable()
export class DataService {

  constructor(private firestore: AngularFirestore) { }

  private generateId() {
    return this.firestore.createId();
  }

  addItem(item: Item) {
    item.itemId = this.generateId();
    return this.firestore.collection(`items`).doc(item.itemId).set(item);
  }

  getTimeStamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

}
