import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
      declarations: [HeroesComponent, FakeHeroComponent],
      providers: [{ provide: HeroService, useValue: mockHeroSvc }],
      // Now that all children are mocked, we don't need to squelch schema errors
      // schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('Should set heroes correctly using the service', () => {
    // defining what the mocksvc should return
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // starts the lifecycle

    expect(fixture.componentInstance.heroes.length).toEqual(HEROES.length);
  });

  it('Should write the heroes list to the template', () => {
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const listElements = fixture.debugElement.queryAll(By.css('li'));

    expect(listElements.length).toBe(HEROES.length);
  });
  

});

// mock child component
@Component({
  selector: '<app-hero>', // must have the same selector as the real one
  template: '<div><div>',
})
class FakeHeroComponent {
  @Input() hero: Hero;
}
