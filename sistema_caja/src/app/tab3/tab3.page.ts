import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { Movimiento } from "../model/Movimiento";
import { FirebaseService } from "../services/firebase.service";
import { jsPDF } from "jspdf";
import domtoimage from "dom-to-image";
import { File, IWriteOptions } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { LoginPage } from "../login/login.page";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements OnInit {
  busqueda: FormGroup;
  movimientosEgresos: Movimiento[] = [];
  movimientosCuenta: Movimiento[] = [];
  movimientosContado: Movimiento[] = [];
  movimientosDebito: Movimiento[] = [];
  movimientosCredito: Movimiento[] = [];
  movimientosCheque: Movimiento[] = [];
  montoIngresos: number = 0;
  montoEgresos: number = 0;
  montoContado: number = 0;
  montoCheque: number = 0;
  montoDebito: number = 0;
  montoCredito: number = 0;
  montoCuenta: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private firebaseService: FirebaseService,
    private file: File,
    private fileOpener: FileOpener,
    private modalController: ModalController
  ) {
    this.busqueda = this.formBuilder.group({
      desde: new Date().toISOString(),
      hasta: new Date().toISOString(),
    });
  }

  ngOnInit() {
    this.login();
  }

  async login() {
    const loginFrm = await this.modalController.create({
      component: LoginPage,
      cssClass: "modal-login-class",
    });

    return await loginFrm.present();
  }

  async buscar() {
    let loading = await this.loadingController.create({
      message: "Espere...",
      spinner: "crescent",
    });

    const toast = await this.toastController.create({
      color: "danger",
      message: "Error al buscar los productos! Intente nuevamente",
      duration: 2000,
    });

    await loading.present();
    let fechaInicio = new Date(this.busqueda.controls.desde.value);
    let fechaFin = new Date(this.busqueda.controls.hasta.value);

    let desde = new Date(
      fechaInicio.getFullYear(),
      fechaInicio.getMonth(),
      fechaInicio.getDate(),
      0,
      0,
      0
    ).toISOString();
    let hasta = new Date(
      fechaFin.getFullYear(),
      fechaFin.getMonth(),
      fechaFin.getDate(),
      23,
      59,
      59
    ).toISOString();
    await this.firebaseService.getIngresosByDate(desde, hasta).subscribe(
      (data) => {
        this.reiniciarListados();
        data.forEach((m) => {
          if (m.payload.val().operacion == "INGRESO") {
            if (m.payload.val().tipo == "CONTADO") {
              this.montoContado += m.payload.val().monto;
              this.movimientosContado.push(m.payload.val());
              this.montoIngresos += m.payload.val().monto;
            } else if (m.payload.val().tipo == "CHEQUE") {
              this.montoCheque += m.payload.val().monto;
              this.movimientosCheque.push(m.payload.val());
            } else if (m.payload.val().tipo == "DEBITO") {
              this.montoDebito += m.payload.val().monto;
              this.movimientosDebito.push(m.payload.val());
              this.montoIngresos += m.payload.val().monto;
            } else if (m.payload.val().tipo == "CREDITO") {
              this.montoCredito += m.payload.val().monto;
              this.movimientosCredito.push(m.payload.val());
              this.montoIngresos += m.payload.val().monto;
            } else if (m.payload.val().tipo == "CUENTA_CORRIENTE") {
              this.montoCuenta += m.payload.val().monto;
              this.movimientosCuenta.push(m.payload.val());
            }
          } else {
            this.movimientosEgresos.push(m.payload.val());
            this.montoEgresos += m.payload.val().monto;
          }
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

  async exportPdf() {
    let loading = await this.loadingController.create({
      message: "Creando PDF",
      spinner: "crescent",
    });
    await loading.present();
    const div = document.getElementById("printable-area");
    let topMargin = 15;
    let PDF_WIDTH = div.clientWidth + topMargin * 2;
    let PDF_HEIGHT = PDF_WIDTH * 1.5 + topMargin * 2;
    let imageW = div.clientWidth;
    let imageH = div.clientHeight;
    let totalPages = Math.ceil(imageH / PDF_HEIGHT) - 1;

    const options = {
      background: "white",
      height: div.clientHeight,
      width: div.clientWidth,
    };

    domtoimage
      .toPng(div, options)
      .then((dataUrl) => {
        //Initialize JSPDF
        let doc = new jsPDF("p", "pt", [PDF_WIDTH, PDF_HEIGHT]);
        let width = doc.internal.pageSize.getWidth();
        let height = doc.internal.pageSize.getHeight();
        let imgHeight = (div.clientHeight * width) / div.clientWidth;
        let heightLeft = imgHeight;
        //Add image Url to PDF
        doc.addImage(dataUrl, "PNG", topMargin, topMargin, imageW, imageH);
        for (let i = 1; i <= totalPages; i++) {
          doc.addPage([width, height], "p");
          doc.addImage(
            dataUrl,
            "PNG",
            topMargin,
            -(PDF_HEIGHT * i) + topMargin * 4,
            imageW,
            imageH
          );
        }

        let pdfOutput = doc.output();
        // using ArrayBuffer will allow you to put image inside PDF
        let buffer = new ArrayBuffer(pdfOutput.length);
        let array = new Uint8Array(buffer);
        for (var i = 0; i < pdfOutput.length; i++) {
          array[i] = pdfOutput.charCodeAt(i);
        }

        //This is where the PDF file will stored , you can change it as you like
        // for more information please visit https://ionicframework.com/docs/native/file/
        const directory = this.file.dataDirectory;
        console.log(directory);
        const fileName = "reporte.pdf";
        let options: IWriteOptions = { replace: true };

        this.file
          .checkFile(directory, fileName)
          .then((success) => {
            //Writing File to Device
            this.file
              .writeFile(directory, fileName, buffer, options)
              .then((success) => {
                loading.dismiss();
                console.log("Archivo creado" + JSON.stringify(success));
                this.fileOpener
                  .open(this.file.dataDirectory + fileName, "application/pdf")
                  .then(() => console.log("Archivo abierto"))
                  .catch((e) => console.log("Error abriendo el archivo", e));
              })
              .catch((error) => {
                loading.dismiss();
                console.log(
                  "Error al crear el archivo " + JSON.stringify(error)
                );
              });
          })
          .catch((error) => {
            //Writing File to Device
            this.file
              .writeFile(directory, fileName, buffer)
              .then((success) => {
                loading.dismiss();
                console.log("Archivo creado" + JSON.stringify(success));
                this.fileOpener
                  .open(this.file.dataDirectory + fileName, "application/pdf")
                  .then(() => console.log("Archivo abierto"))
                  .catch((e) => console.log("Error abriendo el archivo", e));
              })
              .catch((error) => {
                loading.dismiss();
                console.log(
                  "Error al crear el archivo " + JSON.stringify(error)
                );
              });
          });
      })
      .catch(function (error) {
        loading.dismiss();
        console.error("oops, something went wrong!", error);
      });
  }

  reiniciarListados() {
    this.movimientosEgresos = [];
    this.movimientosCuenta = [];
    this.movimientosContado = [];
    this.movimientosDebito = [];
    this.movimientosCredito = [];
    this.movimientosCheque = [];
    this.montoIngresos = 0;
    this.montoEgresos = 0;
    this.montoContado = 0;
    this.montoCheque = 0;
    this.montoDebito = 0;
    this.montoCredito = 0;
    this.montoCuenta = 0;
  }
}
