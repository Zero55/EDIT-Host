import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { WebSocketSubject, webSocket } from "rxjs/webSocket";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  public title = "EDIT 2019";
  public messages = [];

  private webSocketUrl = "ws://blueberry.comtrade.com:8081/";
  private webSocketSubject: WebSocketSubject<any>;
  private subscription: Subscription;

  private testClientWebSocketUrl = "ws://blueberry.comtrade.com:8080/";
  private testClientwebSocketSubject: WebSocketSubject<any>;
  private testClientSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.testClientwebSocketSubject = webSocket(this.testClientWebSocketUrl);
    this.testClientSubscription = this.testClientwebSocketSubject
      .asObservable()
      .subscribe(
        message => console.log(`WebSocket message: ${JSON.stringify(message)}`),
        error => console.error(`WebSocket error: ${JSON.stringify(error)}`),
        () => console.log("WebSocket connection closed.")
      );

    this.webSocketSubject = webSocket(this.webSocketUrl);
    this.subscription = this.webSocketSubject.asObservable().subscribe(
      message => {
        this.messages.push(message);
      },
      error => console.error(`WebSocket error: ${JSON.stringify(error)}`),
      () => console.log("WebSocket connection closed.")
    );
  }

  ngOnDestroy() {
    this.testClientSubscription.unsubscribe();

    this.subscription.unsubscribe();
  }

  send(command) {
    let message;
    switch (command) {
      case "commsOnLine":
        message = {
          command: "commsOnLine",
          name: "EGM_" + Date.now()
        };
        break;
      case "heartbeat":
        message = {
          command: "heartbeat",
          sessionId: "sessiodId"
        };
        break;
      case "reportMeter":
        message = {
          command: "reportMeter",
          name: "gameWon",
          value: "10"
        };
        break;
      case "reportEvent":
        message = {
          command: "reportEvent",
          name: "logicDoorOpen"
        };
        break;
      case "reportStatus":
        message = {
          command: "reportStatus",
          value: "enable"
        };
        break;
      default:
        return;
    }
    this.testClientwebSocketSubject.next(message);
  }
}
