import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css']
})
export class FolderViewComponent implements OnInit {

  url;
  folderId;

  constructor(private route: ActivatedRoute, public sanitizer: DomSanitizer) {
    this.route.params.subscribe(params => {
      this.folderId = params['id'];
      this.url = `https://drive.google.com/embeddedfolderview?id=${params['id']}#grid`;
      console.log('url ', this.url);
    });
  }

  ngOnInit() {
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  openDrive() {
    const driveUrl = `https://drive.google.com/drive/u/0/folders/${this.folderId}`;
    window.open(driveUrl);
  }

}
