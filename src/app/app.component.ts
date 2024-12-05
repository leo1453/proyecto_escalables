import { Component, NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { IniciarSesionComponent } from "./components/iniciar-sesion/iniciar-sesion.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { NotasComponent } from "./components/notas/notas.component";
import { matDialogAnimations, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, MatSidenavModule, MatButtonModule, RouterLink, RouterLinkActive, IniciarSesionComponent, InicioComponent, NotasComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {




}
