import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, PatternValidator, Validators } from '@angular/forms';

import { Subscription, retry } from 'rxjs';
import { AuthService } from '../../../module/admin/login/service/auth.service';
import { CommonService } from '../../app.service/common.service';
import { UserRegistrationDTO } from '../../../module/admin/service/admin.domain';


@Component({
  selector: 'password-change',
  templateUrl: './password.change.component.html',
})
export class PasswordChangeComponent implements OnInit {
  passwordChangeForm: FormGroup
  display1 = false
  userTerminal: any

  userData: any
  userInfo: any;
  showLoginPage: boolean = false;
  subscription: Subscription
  @Input('formData') set formData(formData: any) {
    if (formData && Object.keys(formData).length) {
      this.userData = formData;
    }
  }
  @Output('onSave') onSave = new EventEmitter<any>();

  required_field: any = {
    existingPassword: 'Existing Password ',
    newPassword: 'New Passward ',
    confirmNewPassword: 'Confirm New Password'
  };




  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
  ) {

  }
  ngOnInit() {

    if (typeof window !== 'undefined' && this.authService.getUser().token == null) {
      this.display1 = true;
    }

    if (typeof window !== 'undefined') {
      const user = this.authService.getUser();
      this.userInfo = user !== null ? user : new UserRegistrationDTO();
    }
    this.prepareuserLoginForm()
  }

  prepareuserLoginForm() {
    this.passwordChangeForm = this.fb.group({
      existingPassword: [null, [Validators.required, Validators.pattern(this.userInfo?.password)]],
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [, [Validators.required]],
      updateOn: 'change'

    });
  }

  onSubmit() {

    let formValue = this.passwordChangeForm.value;
    console.log(formValue);

    if (this.commonService.isFormInvalid(this.passwordChangeForm, this.required_field)) {
      return;
    }
    // code for change password


  }
  newPasswordInput() {
    let newPassword = this.passwordChangeForm.value.newPassword;
    let confirmNewPassword = this.passwordChangeForm.value.confirmNewPassword;
    if (newPassword.length > 0) {
      this.passwordChangeForm.get('confirmNewPassword')?.setValidators([Validators.required, Validators.pattern(newPassword)])
      this.passwordChangeForm.updateValueAndValidity();
    }


    if (newPassword.length > 0 && newPassword == confirmNewPassword) {
      this.passwordChangeForm.get('confirmNewPassword')?.setErrors(null)
    }
    if (newPassword.length > 0 && newPassword != confirmNewPassword) {
      this.passwordChangeForm.get('confirmNewPassword')?.setErrors({ pattern: true })
    }

  }





}
