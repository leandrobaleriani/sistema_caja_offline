import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
//Import AngularFirestore to make Queries.
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Movimiento } from "../model/Movimiento";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  constructor(
    private firestore: AngularFirestore,
    private afdb: AngularFireDatabase
  ) {}

  save(movimiento: Movimiento) {
    return this.afdb
      .object("movimientos/" + this.firestore.createId())
      .set(movimiento);
  }

  getIngresosByDate(desde: string, hasta: string) {
    return this.afdb
      .list<Movimiento>("movimientos/", (ref) =>
        ref.orderByChild("fecha").startAt(desde).endAt(hasta)
      )
      .valueChanges();
    /*return this.firestore
      .collection<Movimiento>("movimientos", (ref) =>
        ref.orderBy("fecha").startAt(desde).endAt(hasta)
      )
      .snapshotChanges();*/
  }
}
