import { Component, model, OnInit } from '@angular/core';
import { MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-action-bar',
  imports: [
    MatIconModule,
     MatButtonModule,
     CommonModule
    ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss'
})
export class ActionBarComponent implements OnInit{

  date = model<Date | null>(null);

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.matIconRegistry.addSvgIcon(
      'calendar',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/google-calendar.svg')
    );
  }

  ngOnInit(): void {
    this.route.firstChild?.params.subscribe(params => {
      console.log('Child route params:', params);
      this.date.set(new Date(+params['year'], +params['month'], +params['day']));
    });
  }
}
