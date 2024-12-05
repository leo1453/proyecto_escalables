import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from "./components/inicio/inicio.component";
import { IniciarSesionComponent } from "./components/iniciar-sesion/iniciar-sesion.component";
import { NotasComponent } from './components/notas/notas.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { AsignacionesComponent } from './components/asignaciones/asignaciones.component';
import { HorarioComponent } from './components/horario/horario.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuard } from './components/admin/adminGuard';

export const routes: Routes = [

    { path: '', component: InicioComponent },  
    { path: 'login', component: IniciarSesionComponent },  
    { path: 'register', component: RegistrarseComponent },  
    { path: 'inicio', component: InicioComponent }, 
    { path: 'notas', component: NotasComponent, canActivate: [AuthGuard] },
    { path: 'asignaciones', component: AsignacionesComponent, canActivate: [AuthGuard] },
    { path: 'horario', component: HorarioComponent, canActivate: [AuthGuard] },
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
    {
      path: 'admin',
      component: AdminComponent, // Componente de la página de administrador
      canActivate: [AdminGuard], // Usa el guard para restringir acceso
    },

  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }