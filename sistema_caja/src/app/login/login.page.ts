import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
		private formBuilder: FormBuilder,
		private navCtrl: NavController,
    private modalController: ModalController
	) {

		this.login = this.formBuilder.group({
			pass: ''
		});
	}

  ngOnInit() {
  }

  login: FormGroup;
	
	async validateLogin() {

	}

	navigateBack() {
    this.modalController.dismiss();
    this.navCtrl.back();
  }

}
