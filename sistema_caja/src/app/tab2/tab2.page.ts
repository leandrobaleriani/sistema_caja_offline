import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController, ToastController } from "@ionic/angular";
import { Movimiento } from "../model/Movimiento";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  egreso: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private firebaseService: FirebaseService
  ) {
    this.egreso = this.formBuilder.group({
      fecha: new Date().toISOString(),
      nombre: "",
      observaciones: "",
      monto: 0,
    });
  }

  async save() {
    let movimiento = new Movimiento();
    movimiento.fecha = this.egreso.controls.fecha.value;
    movimiento.monto = this.egreso.controls.monto.value;
    movimiento.nombre = this.egreso.controls.nombre.value;
    movimiento.observaciones = this.egreso.controls.observaciones.value;
    movimiento.operacion = "EGRESO";
    movimiento.tipo = "";

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
        this.egreso.reset({
          fecha: new Date().toISOString(),
          nombre: "",
          observaciones: "",
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
