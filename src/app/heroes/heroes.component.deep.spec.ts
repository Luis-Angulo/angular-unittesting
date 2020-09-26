import {
  Component,
  DebugElement,
  Directive,
  Input,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
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
      declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
      providers: [{ provide: HeroService, useValue: mockHeroSvc }],
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

  it('Should call heroService.deleteHero when the HeroComponent delete button is clicked', () => {
    spyOn(fixture.componentInstance, 'delete'); // watch the delete method
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    // emit the event by activating the button on the template
    /*
    heroComponents[0]
      .query(By.css('button'))
      .triggerEventHandler('click', { stopPropagation: () => {} });
    */
    // emit the event by calling the delete method on the component directly
    heroComponents[0].componentInstance.delete.emit(undefined); // the template binding is keeping the reference to the right hero

    // can also use the triggerEventHandler fn from the debugElement wrapper
    // heroComponents[0].triggerEventHandler('delete', null);
    // Check that delete was called with the first hero
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('Should add a new hero to the list when the add button is clicked', () => {
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    // mocking the return of the service to simulate backend response
    const name = 'Mr. Ice';
    mockHeroSvc.addHero.and.returnValue(of({ id: 5, name, strength: 4 }));
    // simulate filling in the name input
    const inputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;
    inputElement.value = name;
    // trigger the add function call using the button
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // By this point the template should be rendering the list of heroes, including the one we just added
    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement
      .textContent;
    expect(heroText).toContain(name);
  });

  it('Should have the correct route for the first hero', () => {
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub)) // get the debug element for the anchor tag
      .injector.get(RouterLinkDirectiveStub); // get the actual directive from the debug element

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/1');
  });
});

@Directive({
  selector: '[routerLink]', // brackets ensure it binds to the attribute
  host: { '(click)': 'onClick()' }, // host ensures onClick is called when a click event is fired off
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    // allows checking if it were clicked, and with what values passed in
    this.navigatedTo = this.linkParams;
  }
}
