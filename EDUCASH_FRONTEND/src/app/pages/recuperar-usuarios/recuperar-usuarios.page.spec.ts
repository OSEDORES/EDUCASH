import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarUsuariosPage } from './recuperar-usuarios.page';

describe('RecuperarUsuariosPage', () => {
  let component: RecuperarUsuariosPage;
  let fixture: ComponentFixture<RecuperarUsuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
