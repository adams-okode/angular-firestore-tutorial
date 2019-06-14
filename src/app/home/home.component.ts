import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Posts } from '../models/posts/posts.model';
import { AngularFireStorage } from 'angularfire2/storage';
import { PostsService } from '../services/posts/posts.service';
import { Observable } from 'rxjs';

interface DialogData {
  post: Posts
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'my-app';
  public loadedPosts: Observable<any[]>


  constructor(public dialog: MatDialog, public postService: PostsService) {
    this.loadedPosts = this.postService.getPosts()

  }

  ngOnInit() {
  }

  openModalCreate() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = <DialogData>{
      post: <Posts>{

      }
    }

    console.log(dialogConfig)

    let dialogRef = this.dialog.open(CreatePostDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}

@Component({
  selector: 'create-post-dialog',
  templateUrl: 'create-post-dialog.html',
})
export class CreatePostDialog {
  public ref: any
  public task: any
  public uploadProgress: number = 0
  public downloadURL: any
  public datum: DialogData = <DialogData>{}
  // public post: Posts
  constructor(
    private afStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<CreatePostDialog>,
    public postService: PostsService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.datum = data
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  upload(event) {
    const randomId = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(`/uploads/${event.target.files[0].name}`);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.then((result) => {
      const downloadURL = this.ref.getDownloadURL().subscribe(url => {
        this.datum.post.cover = url
      });
    })
  }

  saveDetails() {
    this.postService.createPost(this.datum.post).then((result) => {
      this.close()
    }).catch((err) => {
      console.log(err)
    })
  }

  close() {
    this.dialogRef.close();
  }

}
