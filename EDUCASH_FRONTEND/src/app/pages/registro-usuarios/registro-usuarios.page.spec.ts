import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroUsuariosPage } from './registro-usuarios.page';

describe('RegistroUsuariosPage', () => {
  let component: RegistroUsuariosPage;
  let fixture: ComponentFixture<RegistroUsuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
