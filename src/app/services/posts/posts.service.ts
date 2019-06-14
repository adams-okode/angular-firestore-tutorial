import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Posts } from 'src/app/models/posts/posts.model';
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private firestore: AngularFirestore) {

  }

  getPosts() {
    return this.firestore.collection('posts').valueChanges();
  }

  createPost(posts: Posts) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let autoId = ''

    for (let i = 0; i < 5; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    let ny = "NY-"
    let key = ny.concat(autoId)
    const id = key
    return this.firestore.collection('posts').doc(id).set(Object.assign({}, posts))
  }

  updatePost(posts: Posts) {
    delete posts.id;
    this.firestore.doc('posts/' + posts.id).update(posts);
  }

  deletePost(policyId: string) {
    this.firestore.doc('posts/' + policyId).delete();
  }

  storeFiles(files) {
    // this.firestore.
  }
}
