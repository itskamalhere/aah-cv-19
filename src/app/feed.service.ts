import {Injectable} from '@angular/core';

import {AngularFirestore, AngularFirestoreCollection, DocumentReference, QueryDocumentSnapshot} from '@angular/fire/firestore';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import { take,map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private itemsSubject: BehaviorSubject<Item[] | undefined> = new BehaviorSubject(undefined);
  private lastPageReached: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private nextQueryAfter: QueryDocumentSnapshot<ItemData>;

  private paginationSub: Subscription;
  private findSub: Subscription;

  constructor(private fireStore: AngularFirestore) {
  }
  destroy() {
    this.unsubscribe();
  }

  private unsubscribe() {
    if (this.paginationSub) {
      this.paginationSub.unsubscribe();
    }

    if (this.findSub) {
      this.findSub.unsubscribe();
    }
  }

  watchItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  watchLastPageReached(): Observable<boolean> {
    return this.lastPageReached.asObservable();
  }

  find() {
    try {
      const collection: AngularFirestoreCollection<ItemData> = this.getCollectionQuery();  
      this.unsubscribe();  
      this.paginationSub = collection.get().subscribe(async (first) => {
        this.nextQueryAfter = first.docs[first.docs.length - 1] as QueryDocumentSnapshot<ItemData>;  
        await this.query(collection);
      });
    } catch (err) {
      throw err;
    }
  }
  
  private getCollectionQuery(): AngularFirestoreCollection<ItemData> {
    if (this.nextQueryAfter) {
      return this.fireStore.collection<ItemData>('/users/', ref =>
             ref.orderBy('firstName', 'desc')
               .startAfter(this.nextQueryAfter)
               .limit(10));
    } else {
      return this.fireStore.collection<ItemData>('/users/', ref =>
             ref.orderBy('firstName', 'desc')
               .limit(10));
    }
  }

  private query(collection: AngularFirestoreCollection<any>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.findSub = collection.snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data: ItemData = a.payload.doc.data() as ItemData;
              const id = a.payload.doc.id;
              const ref = a.payload.doc.ref;  
              return {id,ref,data};
            });
          })
        ).subscribe(async (items: Item[]) => {
          await this.addItems(items);
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  
  private addItems(items: Item[]): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!items || items.length <= 0) {
        this.lastPageReached.next(true);
  
        resolve();
        return;
      }
      this.itemsSubject.asObservable().pipe(take(1)).subscribe((currentItems: Item[]) => {
        this.itemsSubject.next(currentItems !== undefined ? [...currentItems, ...items] : [...items]);  
        resolve();
      });
    });
  }

}

export interface ItemData {
  firstName: string;
  lastName: string;
  aadharNo: string;
}

export interface Item {
  id: string;
  ref: DocumentReference;
  data: ItemData;
}