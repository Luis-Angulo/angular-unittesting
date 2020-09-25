import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroesComponent } from './heroes.component';

describe('HeroesComponent (shallow)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let HEROES: Hero[];
  let mockHeroSvc;

  beforeEach(() => {
    // ensure there's a new copy of the data before every test
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'Wonderful woman', strength: 24 },
      { id: 3, name: 'SuperDude', strength: 55 },
    ];
    // mock the service and use the longform provider syntax to use it instead of the real one
    mockHeroSvc = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      providers: [{ provide: HeroService, useValue: mockHeroSvc }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('Should set heroes correctly using the service', () => {
    // defining what the mocksvc should return
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // starts the lifecycle

    expect(fixture.componentInstance.heroes.length).toEqual(HEROES.length);
  });
});
