import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, last, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
import { User, UserData, Vital, ConvData, Conv, File } from "../model/user-model";
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService { 

  downloadURL: any;
  private fetchSub: Subscription;
  
  userCollectionName = "users";
  roleCollectionName = "roles";
  vitalCollectionName = "vitals";
  convCollectionName = "conversations";

  userDb = this.firestore.collection(this.userCollectionName);
  roleDb = this.firestore.collection(this.roleCollectionName);
  vitalDb = this.firestore.collection(this.vitalCollectionName);
  convDb = this.firestore.collection(this.convCollectionName);

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
    ) {}

  fetchUsersbyField(fieldName: string, fieldValue: string, operator: any) {   
    let query: AngularFirestoreCollection<any>;
    if(fieldName.trim() == "id") {      
      query = this.firestore.collection(this.userCollectionName, ref => ref.where(firestore.FieldPath.documentId(), operator, fieldValue));
    } else {
      query = this.firestore.collection(this.userCollectionName, ref => ref.where(fieldName.trim(), operator, fieldValue.trim()));
    }
    return this.fetchUsersbyFieldExec(query);
  }

  fetchUsersbyFieldExec(query: AngularFirestoreCollection<any>): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      try {        
        this.fetchSub = query.get().pipe(
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
          if(this.fetchSub && !this.fetchSub.closed) {
            this.fetchSub.unsubscribe();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  fetchUserbyId(id: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      try {
        let query = this.firestore.doc<User>(this.userCollectionName+"/" + id);        
        this.fetchSub = query.get().pipe(
          map(snapshot => {
            const data: UserData = snapshot.data() as UserData;
            const id = snapshot.id;
            const ref = snapshot.ref as DocumentReference;
            return {id,ref,data};            
          })
        ).subscribe(async (user: User) => {
          resolve(user);
          if(this.fetchSub && !this.fetchSub.closed) {
            this.fetchSub.unsubscribe();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  fetchUserbyId$(id: string) {
    let query = this.firestore.doc(this.userCollectionName+"/" + id);
    return query.snapshotChanges().pipe(
      map(a => {
        const id = a.payload.id;
        const ref = a.payload.ref as DocumentReference;
        const data: UserData = a.payload.data() as UserData;
        return {id,ref,data};
      })
    );
  }  

  lookup(fnParams: any) {
    let query: AngularFirestoreCollection<any>;
    if(fnParams.query && fnParams.query.length > 0) {
      const queryArr = fnParams.query.split("|");                
      query = this.firestore.collection(fnParams.collection, ref => ref.where(queryArr[0], queryArr[1], queryArr[2]));
    } else {
      query = this.firestore.collection(fnParams.collection);
    }
    return query.snapshotChanges().pipe(
      map(snapshot => {
        return snapshot.map(a => {
          let value: string = "";
          let label: string = "";
          const data: UserData = a.payload.doc.data() as UserData;
          if (fnParams.value && fnParams.value == "id") {
            value = a.payload.doc.id;
          } else {
            value = a.payload.doc.data()[fnParams.value];
          }
          if (fnParams.label && fnParams.label == "id") {
            label = a.payload.doc.id;
          } else {
            if (fnParams.label.indexOf(",") > 0) {
              const labelArr = fnParams.label.split(",");
              labelArr.forEach((element: string) => {
                if (label && label.length == 0) {
                  label = a.payload.doc.data()[element];
                } else {
                  label = label + fnParams.separator + a.payload.doc.data()[element];
                }
              });
              label = label.trim();
            } else {              
              label = a.payload.doc.data()[fnParams.label];
            }
          }
          return {value,label,data};
        });
      })
    );
  }

  fetchUsers(userType: string, assignedTo: string) {
    let query = this.firestore.collection(this.userCollectionName, ref => ref.where("userType", "==", userType).
    orderBy("modifyDate","desc"));
    if(assignedTo) {
      query = this.firestore.collection(this.userCollectionName, ref => ref.where("userType", "==", userType)
      .where("assignedTo","array-contains",assignedTo)
      .where("status","==","Active").
      orderBy("modifyDate","desc"));
    }
    return query.snapshotChanges().pipe(
      map(snapshot => {
        return snapshot.map(a => {
          const id = a.payload.doc.id;
          const ref = a.payload.doc.ref as DocumentReference;
          const data: UserData = a.payload.doc.data() as UserData;
          return {id,ref,data};
        });
      })
    );
  }

  fetchRoles(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      try {
        this.fetchSub = this.roleDb.get().pipe(
          map(snapshot => {
            return snapshot.docs.map(a => a.id)
          })
        ).subscribe(async (roles: any[]) => {
          resolve(roles);
          if(this.fetchSub && !this.fetchSub.closed) {
            this.fetchSub.unsubscribe();
          }
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  fetchConversations(id: string) {
    let query = this.firestore.doc(this.convCollectionName+"/" + id);
    return query.snapshotChanges().pipe(
      map(a => {
        const id = a.payload.id;
        const ref = a.payload.ref as DocumentReference;
        const data: ConvData = a.payload.data() as ConvData;
        return {id,ref,data};
      })
    );
  } 

  addUser(record: UserData) {
    record.role = this.firestore.doc(this.roleCollectionName+"/"+record.role).ref;
    const timeStamp = new Date();
    record.creationDate = timeStamp;
    record.modifyDate = timeStamp;
    return this.userDb.add(record);
  }

  updateUser(recordId: string, record: UserData) {
    if(record.role) {
      record.role = this.firestore.doc(this.roleCollectionName+"/"+record.role).ref;
    }
    record.modifyDate = new Date();
    return this.firestore.doc(this.userCollectionName + '/' + recordId).update(record);
  }

  deleteUser(recordId: string) {
    return this.firestore.doc(this.userCollectionName + '/' + recordId).delete();
  }

  addVital(recordId: string, vital: Vital) {
    let doc = this.firestore.doc(this.userCollectionName + '/' + recordId);
    return doc.update({vitals: firestore.FieldValue.arrayUnion(vital),modifyDate:new Date()});
  }

  addConversation(recordId: string, conv: Conv) {
    let doc = this.firestore.doc(this.convCollectionName + '/' + recordId);
    return doc.set({conversations: firestore.FieldValue.arrayUnion(conv)},{merge: true});
  }

  uploadFile(file: File) {
    return new Promise<string>((resolve, reject) => {
    try{
      var metadata = {
        contentType: file.contentType,
      };
      const fileRef = this.storage.ref(`/users/${file.userId}/${file.name}`);
      const task = fileRef.putString(file.data,"data_url",metadata);
      task.snapshotChanges().pipe(
        last(),switchMap(() => fileRef.getDownloadURL())
        ).subscribe((url) =>{
          resolve(url);
        });
      } catch(err) {
        console.error(err);
        reject(err);
      }
    });
  };

}