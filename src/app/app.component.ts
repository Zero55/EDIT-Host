import { Component, OnInit, OnDestroy } from "@angular/core";
import { WebsocketService } from "./services/websocket.service";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "EDIT 2019";
  messages = [];
  messages$: Observable<any>;
  subscription: Subscription;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.messages$ = this.websocketService.create(
      "ws://blueberry.comtrade.com:8080/"
    );
    this.subscription = this.messages$.subscribe(message => {
      this.messages.push(message);
      this.websocketService.send("HELOOOOOOOOO");
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
