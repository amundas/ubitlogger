import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExampleComponent } from './example/example.component';
import { MonitorComponent } from './monitor/monitor.component';
import { IdentifyComponent } from './identify/identify.component';

const routes: Routes = [
    { path: '', redirectTo: '/monitor', pathMatch: 'full' },
    { path: 'monitor', component: MonitorComponent },
    { path: 'identify', component: IdentifyComponent },
    { path: 'example', component: ExampleComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
