import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from '../app-routing.module';
import { HeroComponent } from './hero.component';

// Its not normal convention to have shallow and deep tests together
describe('HeroComponent (shallow)', () => {
  let fixture: ComponentFixture<HeroComponent>; // fixture is a wrapper around the component, for testing

  beforeEach(() => {
    // the testbed sorta makes a dummy angular environment to test the unit in
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA], // squelches template errors
    });
    fixture = TestBed.createComponent(HeroComponent);
  });

  it('Should have the correct hero', () => {
    fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };

    expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
  });

  it('Should render the hero name in an anchor tag', () => {
    fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };
    fixture.detectChanges(); // must trigger change detection manually

    const aTag = fixture.nativeElement.querySelector('a');
    expect(aTag.textContent).toContain('SuperDude'); // less brittle
  });
});
