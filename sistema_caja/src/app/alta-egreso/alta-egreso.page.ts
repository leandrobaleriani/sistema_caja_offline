import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { Movimiento } from "../model/Movimiento";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-alta-egreso",
  templateUrl: "./alta-egreso.page.html",
  styleUrls: ["./alta-egreso.page.scss"],
})
export class AltaEgresoPage implements OnInit {
  egreso: FormGroup;
  key: string;

  constructor(
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {
    this.egreso = this.formBuilder.group({
      fecha: new Date().toISOString(),
      nombre: "",
      observaciones: "",
      monto: 0,
    });

    this.route.queryParams.subscribe((params) => {
      this.key = params["key"];
      if (this.key) {
        this.firebaseService.getByKey(this.key).subscribe((data) => {
          this.egreso = this.formBuilder.group({
            fecha: data.fecha,
            nombre: data.nombre,
            observaciones: data.observaciones,
            monto: data.monto,
          });
        });
      }
    });
  }

  ngOnInit() {}

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
    if (this.key) {
      await this.firebaseService.update(movimiento, this.key).then(
        (data) => {
          toast.present();
          loading.dismiss();
          this.navigateBack();
        },
        (error) => {
          console.log(error);
          loading.dismiss();
        }
      );
    } else {
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

  navigateBack() {
    this.navCtrl.back();
  }

  verListado() {
    this.navCtrl.navigateRoot("listado-egreso");
  }
}
