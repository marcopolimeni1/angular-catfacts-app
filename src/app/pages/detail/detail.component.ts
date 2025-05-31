import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatFactsService } from '../../services/cat-facts.service';
import { CatFact } from '../../models/cat-fact.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false
})
export class DetailComponent implements OnInit {
  fact: CatFact | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catFactsService: CatFactsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fact = this.catFactsService.getFactById(id) ?? null;
    }
    this.loading = false;
    
    if (!this.fact) {
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  editFact(): void {
    if (this.fact?._id) {
      this.router.navigate(['/add', this.fact._id]);
    }
  }

  deleteFact(): void {
    if (this.fact?._id) {
      this.catFactsService.deleteFact(this.fact._id);
      this.router.navigate(['/']);
    }
  }
}