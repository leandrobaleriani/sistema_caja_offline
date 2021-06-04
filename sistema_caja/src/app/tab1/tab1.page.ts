import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NavigationExtras } from "@angular/router";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { Movimiento } from "../model/Movimiento";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  movimientos: Movimiento[] = [];
  datos: Movimiento[] = [];

  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.buscar();
  }

  async buscar() {
    let loading = await this.loadingController.create({
      message: "Espere...",
      spinner: "crescent",
    });

    const toast = await this.toastController.create({
      color: "danger",
      message: "Error al buscar los ingresos! Intente nuevamente",
      duration: 2000,
    });

    await loading.present();
    await this.firebaseService.getAll("INGRESO").subscribe(
      (data) => {
        this.reiniciarListados();
        let i = 0;
        data.forEach((m) => {
          if(m.payload.val().operacion == "INGRESO") {
            this.datos.push(m.payload.val());
            this.datos[i].key = m.key;
            i++;
          }

          this.movimientos = this.datos.slice().reverse();

        });
        loading.dismiss();
      },
      (error) => {
        console.log(error);
        toast.present();
        loading.dismiss();
      }
    );
  }

  reiniciarListados() {
    this.movimientos = [];
    this.datos = [];
  }

  alta() {
    this.navCtrl.navigateRoot("alta-ingreso");
  }

  async editar(key) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        key: key,
      },
    };
    this.navCtrl.navigateRoot("alta-ingreso", navigationExtras);
  }

  async eliminar(key) {
    let loading = await this.loadingController.create({
      message: "Espere...",
      spinner: "crescent",
    });

    await loading.present();
    await this.firebaseService.delete(key).then(
      () => {
        this.buscar();
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
      }
    );
  }

  async eliminarMessage(key) {
    let detalle = "<b>¿Desea eliminar el registro?</b>";

    const alert = await this.alertController.create({
      header: "Eliminar",
      subHeader: "",
      message: detalle,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Eliminar",
          cssClass: "primary",
          handler: () => {
            this.eliminar(key);
            alert.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }

  navigateBack() {
    this.navCtrl.back();
  }
}
