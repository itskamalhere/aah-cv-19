import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { map,tap, shareReplay, flatMap } from 'rxjs/operators';
import { User, UserData } from "../model/user-model";
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private fetchUserbyNoSub: Subscription;
  
  userCollectionName = "users";
  vitalCollectionName = "vitals";
  commentCollectionName = "comments";

  userDb = this.firestore.collection(this.userCollectionName);
  vitalDb = this.firestore.collection(this.vitalCollectionName);
  commentDb = this.firestore.collection(this.commentCollectionName);

  constructor(private firestore: AngularFirestore) { }

  createUser(record) {
    //return this.userDb.doc(record.uhid).set(record);
    return this.userDb.add(record);
  }

  fetchUserbyNo(mobileNo: string) {
    let query = this.firestore.collection(this.userCollectionName, ref => ref.where("mobileNumber", '==', mobileNo));
    return this.fetchUserbyField(query);
  }

  fetchUserbyField(query: AngularFirestoreCollection<any>): Promise<User[]> {    
    return new Promise<User[]>((resolve, reject) => {
      try {        
        this.fetchUserbyNoSub = query.get().pipe(
          map(snapshot => {
            return snapshot.docs.map(a => {
              const data: UserData = a.data() as UserData;              
              const id = a.id;
              const ref = a.ref as DocumentReference;
              return {id,ref,data};
            });
          })
        ).subscribe(async (users: User[]) => {
          resolve(users);
          if(this.fetchUserbyNoSub && !this.fetchUserbyNoSub.closed) {
            this.fetchUserbyNoSub.unsubscribe();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  fetchUsers() {
    return this.userDb.snapshotChanges().pipe(
      map(snapshot => {
        return snapshot.map(a => {
          // const data: ItemData = a.payload.doc.data() as ItemData;
          // const id = a.payload.doc.id;
          // const ref = a.payload.doc.ref;  
          // return {id,ref,data};
          const id = a.payload.doc.id;
          const isEdit = false;
          const firstName = a.payload.doc.data()['firstName'];
          const lastName = a.payload.doc.data()['lastName'];
          const age = a.payload.doc.data()['age'];          
          return {id,isEdit,firstName,lastName,age};
        });
      })
    );
  }

  updateUser(recordID, record) {
    return this.firestore.doc(this.userCollectionName + '/' + recordID).update(record);    
  }

  deleteUser(recordID) {
    return this.firestore.doc(this.userCollectionName + '/' + recordID).delete();
  }

}