import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../module/admin/login/service/auth.service';


@Component({
  selector: 'branch-change',
  templateUrl: './branch.change.component.html',
})
export class BranchSwitchComponent implements OnInit {
  branchChangeForm: FormGroup
  branchs: any[]
  userData: any
  @Input('formData') set formData(formData: any) {
    if (formData && Object.keys(formData).length) {
      this.userData = formData;
    }
  }
  @Input('display') display: boolean;


  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.prepareuserLoginForm()
    this.branchs = [

      { label: 'Select a branch', value: null },
      { label: 'Gulshan Corporate Branch (105)', value: 'AU' },
      { label: 'Barishal Branch (103)', value: 'BR' },
      { label: 'Motijeel Branch (102)', value: 'CN' },
      { label: 'Agrabad  Corporate Branch (801)', value: 'CN' },
      { label: 'Rajshahi branch (104)', value: 'EG' },
      { label: 'Brahmanbaria branch (101)', value: 'FR' },
      { label: 'Sylhet Branch (106)', value: 'DE' },
      { label: 'Norshingi Branch(107)', value: 'IN' },
      { label: 'Dhanmondi Branch(108)', value: 'JP' },
      { label: 'Mogbazar Branch(109)', value: 'ES' },



    ];



  }

  prepareuserLoginForm() {
    this.branchChangeForm = this.fb.group({
      existingPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [, [Validators.required]],

    });
  }

  onSubmit() {

    let formValue = this.branchChangeForm.value;
    console.log(formValue);

    if (this.branchChangeForm.invalid) {
      this.branchChangeForm.markAllAsTouched();
      //   this.toast.error({ summary: "Please provise user credential", duration: 3000 });
      return;
    }




  }


}
