import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContextPackListComponent } from './contextpacks/contextpack-list.component';
import { ContextPackInfoComponent } from './contextpacks/contextpack-info.component';
import { AddContextpacksComponent } from './contextpacks/add-contextpacks.component';


const routes: Routes = [
  {path: '', component: ContextPackListComponent},
  {path: 'contextpacks', component: ContextPackListComponent},
  {path: 'contextpacks/:id', component: ContextPackInfoComponent},
  {path: 'edit', component: AddContextpacksComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
