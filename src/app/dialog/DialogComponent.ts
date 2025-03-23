import {Component, Inject, Input} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-example',
  standalone: true,
  template: `
<div class="news-container" style="display: flex; flex-direction: column; align-items: start;">
  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
    <div>
      <h2 style="margin: 0;">{{ data.source }}</h2>
      <p class="news-date" style="margin: 0;">{{ data.datetime }}</p>
    </div>
    <button style="margin-left: auto; cursor: pointer;" (click)="closeDialog()">✖</button>
  </div>
  <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0; width: 100%;" />
  <p class="news-title" style="font-weight: bold; margin: 0;">{{ data.headline }}</p>
  <p class="news-summary" style="margin: 0;">{{ data.summary }}</p>
  <p style="margin: 0; margin-bottom: 10px;">For more details click <a href="{{ data.url }}" target="_blank">here</a>.</p>
  <p style="font-size: 15px; margin-right: 10px;" >Share</p>
  <div class="social-icons" style="display: flex; align-items: center;">
    <img src="assets/tw.pic.jpg" alt="Share on Twitter" style="cursor: pointer; margin-right: 10px; height: 40px; width: 40px;" (click)="shareOnSocialMedia('twitter', data.headline, data.url)" />
    <img src="assets/facebook.pic.jpg" alt="Share on Facebook" style="cursor: pointer; height: 40px; width: 40px;" (click)="shareOnSocialMedia('facebook', data.headline, data.url)" />
  </div>
</div>

  `
})
export class DialogComponent {
  headline: string;
  summary: string;
  constructor(public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
  this.headline = data.headline;
  this.summary = data.summary;
}
  closeDialog(): void {
    this.dialogRef.close();
  }

  shareOnSocialMedia(platform: string, title: string, url: string) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    let shareUrl = '';

    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    window.open(shareUrl, '_blank');
  }
}
