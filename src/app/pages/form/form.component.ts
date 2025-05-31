import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatFactsService } from '../../services/cat-facts.service';
import { CatFact } from '../../models/cat-fact.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent implements OnInit {
  factForm: FormGroup;
  isEditMode = false;
  factId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private catFactsService: CatFactsService
  ) {
    this.factForm = this.fb.group({
      fact: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.factId = id;
      this.loadFact(id);
    }
  }

  loadFact(id: string): void {
    const fact = this.catFactsService.getUserFact(id);
    if (fact) {
      this.factForm.patchValue({
        fact: fact.fact || fact.text
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.factForm.valid) {
      const factText = this.factForm.value.fact;
      const newFact: CatFact = {
        fact: factText,
        text: factText,
        length: factText.length
      };

      if (this.isEditMode && this.factId) {
        newFact._id = this.factId;
        this.catFactsService.updateFact(this.factId, newFact);
      } else {
        this.catFactsService.addFact(newFact);
      }

      this.router.navigate(['/']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  getErrorMessage(): string {
    const factControl = this.factForm.get('fact');
    if (factControl?.hasError('required')) {
      return 'Il fatto è obbligatorio';
    }
    if (factControl?.hasError('minlength')) {
      return 'Il fatto deve essere di almeno 10 caratteri';
    }
    if (factControl?.hasError('maxlength')) {
      return 'Il fatto non può superare i 500 caratteri';
    }
    return '';
  }
}