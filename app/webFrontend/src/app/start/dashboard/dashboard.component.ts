import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {CourseService} from '../../shared/data.service';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {IUser} from '../../../../../../shared/models/IUser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  allCourses: ICourse[];
  // UserService for HTML page
  constructor(public userService: UserService,
              private courseService: CourseService,
              private router: Router,
              public snackBar: MdSnackBar) {
    this.getCourses();
  }

  ngOnInit() {

  }

  isDisabled(course: ICourse): boolean {
    const students: IUser[] = course.students;
    const user = this.userService.user._id;
    return students.filter(student => student._id === user).length > 0;
  }

  getCourses() {
    this.courseService.readItems().then(courses => {
      this.allCourses = courses;
    });
  }

  editCourse(id: string) {
    const url = '/course/edit/' + id;
    this.router.navigate([url]);
  }

  apply(courseId: string) {
    this.courseService.enrollStudent(courseId, this.userService.user);
    this.snackBar.open('Successfully enrolled.', '', { duration: 3000 });
  }

  goToInfo(course: string) {
    const url = '/course/detail/' + course;
    this.router.navigate([url]);
  }

}
