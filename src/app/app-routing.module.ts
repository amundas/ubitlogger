import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExampleComponent } from './example/example.component';
import { MonitorComponent } from './monitor/monitor.component';
import { IdentifyComponent } from './identify/identify.component';
import { SetupComponent } from './setup/setup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
    { path: '', redirectTo: '/monitor', pathMatch: 'full' },
    { path: 'monitor', component: MonitorComponent },
    { path: 'identify', component: IdentifyComponent },
    { path: 'setup', component: SetupComponent },
    { path: 'example', component: ExampleComponent },
    { path: 'info', component: InfoComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: '/not-found'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
