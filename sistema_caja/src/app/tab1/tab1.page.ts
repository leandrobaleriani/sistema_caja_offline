import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController, ToastController } from "@ionic/angular";
import { Movimiento } from "../model/Movimiento";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  ingreso: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private firebaseService: FirebaseService
  ) {
    this.ingreso = this.formBuilder.group({
      fecha: new Date().toISOString(),
      nombre: "",
      observaciones: "",
      tipo: "CONTADO",
      monto: 0,
    });
  }

  async save() {
    let movimiento = new Movimiento();
    movimiento.fecha = this.ingreso.controls.fecha.value;
    movimiento.monto = this.ingreso.controls.monto.value;
    movimiento.nombre = this.ingreso.controls.nombre.value;
    movimiento.observaciones = this.ingreso.controls.observaciones.value;
    movimiento.operacion = "INGRESO";
    movimiento.tipo = this.ingreso.controls.tipo.value;

    let loading = await this.loadingController.create({
      message: "Espere...",
      spinner: "crescent",
    });

    const toast = await this.toastController.create({
      color: "primary",
      message: "Se registró el movimiento!",
      duration: 2000,
    });

    await loading.present();
    await this.firebaseService.save(movimiento).then(
      (data) => {
        toast.present();
        loading.dismiss();
        this.ingreso.reset({
          fecha: new Date().toISOString(),
          nombre: "",
          observaciones: "",
          tipo: "CONTADO",
          monto: 0,
        });
      },
      (error) => {
        console.log(error);
        loading.dismiss();
      }
    );
  }
}
