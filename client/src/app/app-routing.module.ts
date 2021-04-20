import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContextPackListComponent } from './contextpacks/contextpack-list/contextpack-list.component';
import { ContextPackInfoComponent } from './contextpacks/contextpack-card/contextpack-info.component';
import { AddContextpacksComponent } from './contextpacks/add-contextpacks/add-contextpacks.component';
import { LearnerListComponent } from './learners/learner-list/learner-list.component';
import { LearnerInfoComponent } from './learners/learner-info/learner-info.component';


const routes: Routes = [
  {path: '', component: ContextPackListComponent},
  {path: 'contextpacks', component: ContextPackListComponent},
  {path: 'contextpacks/:id', component: ContextPackInfoComponent},
  {path: 'edit', component: AddContextpacksComponent},
  {path: 'learner', component: LearnerListComponent},
  {path: 'learner/:id', component: LearnerInfoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
