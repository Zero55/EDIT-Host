import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { retryWhen, delay } from "rxjs/operators";

const RETRY_TIME_INTERVAL = 5000;

@Injectable({
  providedIn: "root"
})
export class WebsocketService {
  private subject: WebSocketSubject<any>;

  constructor() {}

  public create(url: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      try {
        if (!this.subject) {
          this.subject = webSocket(url);
        }
        const subscription = this.subject
          .asObservable()
          .subscribe(
            message => observer.next(message),
            error => observer.error(error),
            () => observer.complete()
          );
        return () => {
          if (!subscription.closed) {
            subscription.unsubscribe();
          }
        };
      } catch (error) {
        observer.error(error);
      }
    }).pipe(retryWhen(errors => errors.pipe(delay(RETRY_TIME_INTERVAL))));
  }

  public send(message: any) {
    this.subject.next(message);
  }
}
