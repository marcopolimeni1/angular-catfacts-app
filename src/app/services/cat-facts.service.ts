import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { CatFact } from '../models/cat-fact.model';

@Injectable({ providedIn: 'root' })
export class CatFactsService {
  private baseUrl = 'https://catfact.ninja/facts';
  private userFacts: CatFact[] = [];

  constructor(private http: HttpClient) {}

  getFacts(): Observable<CatFact[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => {
        console.log('API Response:', res);
        // L'API restituisce { current_page: 1, data: [...], ... }
        const apiFacts = res.data || [];
        // Mappiamo i dati per uniformare la struttura
        const mappedFacts = apiFacts.map((fact: any) => ({
          _id: fact._id || Math.random().toString(36).substring(2),
          fact: fact.fact || fact.text || '',
          text: fact.fact || fact.text || '',
          length: fact.length
        }));
        return [...mappedFacts, ...this.userFacts];
      }),
      catchError(error => {
        console.error('Errore nella richiesta API:', error);
        // In caso di errore, restituisci solo fatti di test
        const testFacts: CatFact[] = [
          { _id: 'test1', fact: 'I gatti dormono 12-16 ore al giorno', text: 'I gatti dormono 12-16 ore al giorno' },
          { _id: 'test2', fact: 'I gatti hanno 5 dita nelle zampe anteriori e 4 in quelle posteriori', text: 'I gatti hanno 5 dita nelle zampe anteriori e 4 in quelle posteriori' }
        ];
        return of([...testFacts, ...this.userFacts]);
      })
    );
  }

  addFact(fact: CatFact): void {
    this.userFacts.push({ 
      ...fact, 
      _id: Math.random().toString(36).substring(2),
      fact: fact.fact || fact.text,
      text: fact.fact || fact.text
    });
  }

  updateFact(id: string, updated: CatFact): void {
    const index = this.userFacts.findIndex(f => f._id === id);
    if (index !== -1) {
      this.userFacts[index] = {
        ...updated,
        fact: updated.fact || updated.text,
        text: updated.fact || updated.text
      };
    }
  }

  deleteFact(id: string): void {
    this.userFacts = this.userFacts.filter(f => f._id !== id);
  }

  getUserFact(id: string): CatFact | undefined {
    return this.userFacts.find(f => f._id === id);
  }

  getFactById(id: string): CatFact | undefined {
    return this.getUserFact(id);
  }
}