import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {UserDataService} from '../../shared/data.service';
import {UserService} from '../../shared/user.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/show-progress.service';
import {IUser} from '../../../../../../shared/models/IUser';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  id: string;
  user: IUser;
  userForm: FormGroup;

  constructor(private router: Router,
              private userService: UserService,
              private userDataService: UserDataService,
              private showProgress: ShowProgressService,
              private formBuilder: FormBuilder,
              public snackBar: MdSnackBar) {
    this.generateForm();
    this.getUserData();
  }

  ngOnInit() {
  }

  getUserData() {
    this.id = this.userService.user._id;
    this.userDataService.readSingleItem(this.id).then(
      (val: any) => {
        this.user = val;
        this.userForm.patchValue({
          profile: {
            firstName: this.user.profile.firstName,
            lastName: this.user.profile.lastName
          },
          username: this.user.username,
          email: this.user.email,
          password: this.user.password
        });
      },
      (error) => {
        console.log(error);
        this.snackBar.open(error);
      });
  }

  onSubmit() {
    this.user = this.prepareSaveUser();
    this.updateUser();
  }

  onCancel() {
    this.navigateBack();
  }

  prepareSaveUser(): IUser {
    const userFormModel = this.userForm.value;

    const saveUser: any = {};
    const saveIUser: IUser = saveUser;
    for (const key in userFormModel) {
      if (userFormModel.hasOwnProperty(key)) {
        saveIUser[key] = userFormModel[key];
      }
    }

    for (const key in this.user) {
      if (typeof saveIUser[key] === 'undefined') {
        saveIUser[key] = this.user[key];
      }
    }

    return saveIUser;
  }

  updateUser() {
    this.showProgress.toggleLoadingGlobal(true);
    this.userDataService.updateItem(this.user).then(
      (val) => {
        console.log(val);
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open('Profile successfully updated.', '', { duration: 3000 });
        this.navigateBack();
      },
      (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open(error, '', { duration: 3000 });
      });
  }

  generateForm() {
    this.userForm = this.formBuilder.group({
      profile: this.formBuilder.group({
        firstName : ['', Validators.required],
        lastName : ['', Validators.required],
      }),
      username: [''],
      email: ['', Validators.required],
      password: ['']
    });
  }

  private navigateBack() {
    this.router.navigate(['/profile']);
  }
}
