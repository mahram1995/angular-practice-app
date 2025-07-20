import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserRegistratonDTO } from '../service/admin.domain';

@Component({
    selector: 'app-user-registration',
    templateUrl: './create.user.component.html',

})
export class UserRegistrationComponent {
    userForm: FormGroup;
    message: string = '';

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.prepareForm(new UserRegistratonDTO)
    }

    prepareForm(data: UserRegistratonDTO) {
        this.userForm = this.fb.group({
            id: [data.id],
            userName: [data.userName, Validators.required],
            password: [data.password, Validators.required],
            firstName: [data.firstName, Validators.required],
            middleName: [data.middleName],
            lastName: [data.lastName, Validators.required],
            email: [data.email, [Validators.required, Validators.email]],
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

    save() { }
    back() { }

}
