import {Injectable} from '@angular/core';

import {AngularFirestore, AngularFirestoreCollection, DocumentReference, QueryDocumentSnapshot} from '@angular/fire/firestore';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import { take,map, filter } from 'rxjs/operators';
import { User, UserData } from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private usersSubject: BehaviorSubject<User[] | undefined> = new BehaviorSubject(undefined);
  private lastPageReached: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private nextQueryAfter: QueryDocumentSnapshot<UserData>;

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

  watchItems(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  watchLastPageReached(): Observable<boolean> {
    return this.lastPageReached.asObservable();
  }

  find() {
    try {
      const collection: AngularFirestoreCollection<UserData> = this.getCollectionQuery();
      this.unsubscribe();
      this.paginationSub = collection.get().subscribe(async (first) => {
        this.nextQueryAfter = first.docs[first.docs.length - 1] as QueryDocumentSnapshot<UserData>;
        await this.query(collection);
      });
    } catch (err) {
      throw err;
    }
  }
  
  private getCollectionQuery(): AngularFirestoreCollection<UserData> {
    if (this.nextQueryAfter) {
      return this.fireStore.collection<UserData>('/users/', ref =>
             ref.orderBy('firstName', 'desc')
               .startAfter(this.nextQueryAfter)
               .limit(10));
    } else {
      return this.fireStore.collection<UserData>('/users/', ref =>
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
              let user: User = {} as User;
              const data: UserData = a.payload.doc.data() as UserData;
              const id = a.payload.doc.id;
              const ref = a.payload.doc.ref;
              return {id,ref,data};
            });
          })          
        ).subscribe(async (items: User[]) => {
          await this.addItems(items);
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  
  private addItems(users: User[]): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!users || users.length <= 0) {
        this.lastPageReached.next(true);
        resolve();
        return;
      }
      this.usersSubject.asObservable().pipe(take(1)).subscribe((currentItems: User[]) => {
        this.usersSubject.next(currentItems !== undefined ? [...currentItems, ...users] : [...users]);  
        resolve();
      });
    });
  }

}