import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { HeroesComponent } from './heroes.component';

describe('HeroesComponent (deep)', () => {
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
      declarations: [HeroesComponent, HeroComponent],
      providers: [{ provide: HeroService, useValue: mockHeroSvc }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('Should render each hero as a Hero component', () => {
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // to run change detection on all children
    // Gets the debug DOM elements, not the component instance
    const childrenDE = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    expect(childrenDE.length).toEqual(HEROES.length);
    for (let i = 0; i < childrenDE.length; i++) {
      const hero = childrenDE[i].componentInstance.hero;
      expect(hero.name).toEqual(HEROES[i].name);
    }
  });
});
