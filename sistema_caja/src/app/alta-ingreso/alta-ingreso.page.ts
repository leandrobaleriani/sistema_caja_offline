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
  selector: "app-alta-ingreso",
  templateUrl: "./alta-ingreso.page.html",
  styleUrls: ["./alta-ingreso.page.scss"],
})
export class AltaIngresoPage implements OnInit {
  ingreso: FormGroup;
  key: string;

  constructor(
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {
    this.ingreso = this.formBuilder.group({
      fecha: new Date().toISOString(),
      nombre: "",
      observaciones: "",
      tipo: "CONTADO",
      monto: 0,
    });

    this.route.queryParams.subscribe((params) => {
      this.key = params["key"];
      if (this.key) {
        this.firebaseService.getByKey(this.key).subscribe((data) => {
          this.ingreso = this.formBuilder.group({
            fecha: data.fecha,
            nombre: data.nombre,
            observaciones: data.observaciones,
            tipo: data.tipo,
            monto: data.monto,
          });
        });
      }
    });
  }

  ngOnInit() {}

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

  navigateBack() {
    this.navCtrl.back();
  }

  verListado() {
    this.navCtrl.navigateRoot("listado-ingreso");
  }
}
