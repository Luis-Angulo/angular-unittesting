import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
      imports: [FormsModule], // its fine to use this since it has no dependencies that affect the test
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: HeroService, useValue: mockHeroSvc },
        { provide: Location, useValue: mockLocation },
      ],
    });
    fixture = TestBed.createComponent(HeroDetailComponent);
  });

  it('Should render hero name in an h2 tag', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('h2').textContent;
    expect(text).toContain('SUPERDUDE'); // component capitalizes name
  });

  // wrapping async tests in fakeAsync
  it('Should call updateHero when save is called', fakeAsync(() => {
    mockHeroSvc.updateHero.and.returnValue(of({})); // don't check the return
    fixture.detectChanges();

    fixture.componentInstance.save();
    // tick(250); // fake awaits 250 ms by fast forwarding the clock inside zone.js
    flush(); // automatically resolve any awaiting tasks by manipulating zone.js

    expect(mockHeroSvc.updateHero).toHaveBeenCalled();
  }));
});
