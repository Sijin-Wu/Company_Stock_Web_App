import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'ngbd-modal-content',
  standalone: true,
  template: `
		<div class="modal-header">
			<h4 class="modal-title">SeekingAlpha</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<div><b>{{articleName}}</b></div>
      <div>{{articleSummary}}</div>
      <div style ="color:grey;">For more details click here</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModalContent {
  activeModal = inject(NgbActiveModal);

  @Input()
  articleName: string | undefined;
  articleSummary: string | undefined;
  articleLink: string | undefined;

}
