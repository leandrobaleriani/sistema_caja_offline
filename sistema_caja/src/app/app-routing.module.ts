import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'alta-ingreso',
    loadChildren: () => import('./alta-ingreso/alta-ingreso.module').then( m => m.AltaIngresoPageModule)
  },
  {
    path: 'alta-egreso',
    loadChildren: () => import('./alta-egreso/alta-egreso.module').then( m => m.AltaEgresoPageModule)
  },
  {
    path: 'listado-egreso',
    loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'listado-ingreso',
    loadChildren: () => import('./tab1/tab1.module').then( m => m.Tab1PageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
