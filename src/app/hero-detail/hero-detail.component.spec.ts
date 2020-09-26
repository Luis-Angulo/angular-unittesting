import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { Location } from '@angular/common';
import { of } from 'rxjs';

describe('HeroDetailComponent', () => {
  let mockRoute, mockHeroSvc, mockLocation;
  let fakeHero;
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(() => {
    mockHeroSvc = jasmine.createSpyObj(['getHero', 'updateHero']);
    fakeHero = { id: 3, name: 'SuperDude', strength: 100 };
    mockHeroSvc.getHero.and.returnValue(of(fakeHero));
    mockLocation = jasmine.createSpyObj(['back']);
    mockRoute = { snapshot: { paramMap: { get: () => '3' } } };
    TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: HeroService, useValue: mockHeroSvc },
        { provide: Location, useValue: mockLocation },
      ],
    });
    fixture = TestBed.createComponent(HeroDetailComponent);
  });

  
});
