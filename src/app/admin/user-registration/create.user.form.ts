import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { UserRegistrationDTO } from '../service/admin.domain';
import { CommonService } from '../../app.service/common.service';
import { AdminService } from '../service/admin.service';
import { NotificationService } from '../../app.service/notification.service';

@Component({
    selector: 'app-user-registration',
    templateUrl: './create.user.component.html',

})
export class UserRegistrationComponent {
    required_field: any = {
        userName: 'User Name',
        password: 'Password',
        email: 'Email',
        lastName: 'Last Name',
    };

    userForm: FormGroup;
    message: string = '';

    constructor(private fb: FormBuilder,
        protected location: Location,
        private notificationService: NotificationService,
        private adminService: AdminService,
        private commonService: CommonService) {
        this.prepareForm(new UserRegistrationDTO)
    }

    prepareForm(data: UserRegistrationDTO) {
        this.userForm = this.fb.group({
            id: [data.id],
            userName: [data.userName, Validators.required],
            password: [data.password, Validators.required],
            firstName: [data.firstName],
            middleName: [data.middleName],
            lastName: [data.lastName, Validators.required],
            email: [data.email, [Validators.email]],
            phone: [data.phone],
            employeeId: [data.employeeId],
            userStatus: [data.userStatus],
            activeReason: [data.activeReason],
            disableReason: [data.disableReason],
            lockReason: [data.lockReason],
            departmentId: [data.departmentId],
            groupId: [data.groupId],
            userBranchId: [data.userBranchId],
            title: [data.userBranchId],
            userPhoto: this.fb.array([
                this.fb.control('')
            ]) // array to hold photo URLs
        });
    }

    get userPhotoControls() {
        return this.userForm.get('userPhoto') as FormArray;
    }

    save() {
        let formData = this.userForm.value
        if (this.commonService.isFormInvalid(this.userForm, this.required_field)) {
            return;
        }
        this.adminService.createUser(formData).subscribe(
            (response) => {
                this.notificationService.sendSuccess(response.message);
                this.prepareForm(new UserRegistrationDTO)
            },
            (error) => {

            }
        )
    }
    back() {

        this.location.back()
    }

}
