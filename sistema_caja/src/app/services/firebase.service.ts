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
      .snapshotChanges();
  }

  update(movimiento: Movimiento, key: String) {
    return this.afdb.object("movimientos/" + key).update(movimiento);
  }

  delete(key: string) {
    return this.afdb.object("movimientos/" + key).remove();
  }

  getAll(operacion: string) {
    return this.afdb
      .list<Movimiento>("movimientos/", (ref) =>
        ref.orderByChild("fecha")
      )
      .snapshotChanges();
  }

  getByKey(key: string) {
    return this.afdb
      .object<Movimiento>("movimientos/" + key)
      .valueChanges();
  }
}
