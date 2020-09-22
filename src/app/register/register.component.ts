import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    'firstName': '',
    'lastName': '',
    'mail': '',
    'password': '',
    'repeatedPassword': '',
  };

  success = false;
  registerError = false;
  errorMessage = '';

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.form).then((res: any) => {
      if (res.code === 100) {
        this.success = true;
      } else {
        this.registerError = true;
        this.errorMessage = res.message;
      }
    }).catch((err1: HttpErrorResponse) => {
      this.registerError = true;
      this.errorMessage = err1.message;
    });
  }

  goToLoginPage() {
    this.router.navigateByUrl('/login');
  }


}
