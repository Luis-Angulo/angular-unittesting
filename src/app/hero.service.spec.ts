import { inject, TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MessageService } from './message.service';

describe('HeroService', () => {
  let mockMessageService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService },
      ],
    });
  });

  it('Should call get with the correct URL', inject(
    [HeroService, HttpTestingController],
    (heroSvc: HeroService, controller: HttpTestingController) => {
      heroSvc.getHero(4).subscribe();
      // the expected endpoint call
      // This is bugged in Jasmine, it can fail if the endpoint is never called or called more than once
      // but if it succeeds, the reporter thinks there are no expectations
      const req = controller.expectOne('api/heroes/4');

      // the expected return
      const returnHero = { id: 4, name: 'SuperDude', strength: 100 };
      // the request is executed here, the event is emitted and caught by the subscription after flush
      req.flush(returnHero);
      controller.verify();

      expect().nothing(); // introduced as a workaround for expectOne not being recognized by jasmine
    }
  ));
});
