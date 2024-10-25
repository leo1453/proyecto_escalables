import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from "./components/inicio/inicio.component";
import { IniciarSesionComponent } from "./components/iniciar-sesion/iniciar-sesion.component";
import { NotasComponent } from './components/notas/notas.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { AsignacionesComponent } from './components/asignaciones/asignaciones.component';

export const routes: Routes = [

    { path: '', component: InicioComponent },  
    { path: 'login', component: IniciarSesionComponent },  
    { path: 'register', component: RegistrarseComponent },  
    { path: 'inicio', component: InicioComponent }, 
    { path: 'notas', component: NotasComponent },  
    { path: 'asignaciones', component: AsignacionesComponent },  


  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }