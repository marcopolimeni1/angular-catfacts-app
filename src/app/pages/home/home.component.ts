import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatFactsService } from '../../services/cat-facts.service';
import { CatFact } from '../../models/cat-fact.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  facts: CatFact[] = [];
  loading = true;
  error: string | null = null;

  private catEmojis = ['🐱', '😸', '😺', '😻', '🙀', '😿', '😾', '🐈', '🐈‍⬛', '🦁'];

  constructor(private catFactsService: CatFactsService, private router: Router) {
    console.log('HomeComponent constructor - Router injected:', !!this.router);
  }

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.loadFacts();
  }

  loadFacts(): void {
    this.loading = true;
    this.error = null;
    
    this.catFactsService.getFacts().subscribe({
      next: (facts) => {
        console.log('Facts received:', facts);
        facts.forEach((fact, index) => {
          console.log(`Fact ${index}:`, fact._id ? `ID: ${fact._id}` : 'NO ID');
        });
        this.facts = facts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error in component:', error);
        this.error = 'Errore nel caricamento dei fatti sui gatti 😿';
        this.loading = false;
      }
    });
  }

  goToDetail(fact: CatFact): void {
    console.log('goToDetail called with:', fact);
    console.log('Fact ID:', fact._id);
    
    if (fact._id) {
      console.log('Navigating to:', ['/fact', fact._id]);
      this.router.navigate(['/fact', fact._id]).then(
        success => console.log('Navigation success:', success),
        error => console.error('Navigation error:', error)
      );
    } else {
      console.error('No ID found for fact:', fact);
    }
  }

  deleteFact(id: string | undefined): void {
    if (id && confirm('Sei sicuro di voler eliminare questo fatto felino? 🐱')) {
      this.catFactsService.deleteFact(id);
      this.loadFacts();
    }
  }

  trackByFn(index: number, item: CatFact): string {
    return item._id || index.toString();
  }

  getCatEmoji(index: number): string {
    return this.catEmojis[index % this.catEmojis.length];
  }
}