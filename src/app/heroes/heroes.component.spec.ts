import { of } from 'rxjs';
import { Hero } from '../hero';
import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES: Hero[];
  let mockHeroSvc;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'Wonderful woman', strength: 24 },
      { id: 3, name: 'SuperDude', strength: 55 },
    ];
    // mocking the svc with jasmine requires the methods to mock as strings
    mockHeroSvc = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    component = new HeroesComponent(mockHeroSvc);
  });

  it('Should remove the correct hero from its list', () => {
    mockHeroSvc.deleteHero.and.returnValue(of(true));
    component.heroes = HEROES;

    component.delete(HEROES[2]);

    expect(component.heroes.length).toBe(2);
  });

  // "collaborative test" tests interclass interactions
  it('Should call deleteHero with correct hero', () => {
    mockHeroSvc.deleteHero.and.returnValue(of(true));
    component.heroes = HEROES;

    component.delete(HEROES[2]);

    expect(mockHeroSvc.deleteHero).toHaveBeenCalledWith(HEROES[2]);
  });
});
