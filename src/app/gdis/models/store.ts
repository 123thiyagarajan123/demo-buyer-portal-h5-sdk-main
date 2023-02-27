import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '@environments/environment';

export class Store<T> {
  state$: Observable<T>;
  private _state$: BehaviorSubject<T>;

  protected constructor(initialState: T) {
    this._state$ = new BehaviorSubject(initialState);
    this.state$ = this._state$.asObservable();
  }

  get state(): T {
    return this._state$.getValue();
  }

  setState(nextState: T): void {
    this.logState(this.state, nextState);
    this._state$.next(nextState);
  }

  logState(currentState: T, nextState: T): void {
    if (!environment.production) {
      const after = nextState;
      const before = currentState;

      console.log({
        store: 'GDIS',
        after,
        before,
      });
    }
  }
}
