import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: false,
})
export class ConfigPage implements OnInit {


  constructor(
    private apiService: ApiService,
    private menu: MenuController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
  }
}