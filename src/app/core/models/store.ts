import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '@environments/environment';

export class Store<T> {
  state$: Observable<T>;
  private _state$: BehaviorSubject<T>;
  private _storeName: string;

  protected constructor(initialState: T, storeName: string) {
    this._state$ = new BehaviorSubject(initialState);
    this.state$ = this._state$.asObservable();
    this._storeName = storeName;
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
        store: this._storeName,
        after,
        before,
      });
    }
  }
}
