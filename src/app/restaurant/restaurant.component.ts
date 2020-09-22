import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ApiService} from '../api.service';
import {RestaurantList} from './model/Restaurant';
import {HttpErrorResponse} from '@angular/common/http';
import {ReviewList} from './model/Review';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  restaurantForm: any = {
    'name': '',
    'ownerName': '',
    'rate': 0,
  };

  answerForm: any = {
    'ownerAnswer': '',
    'restaurantId': '',
    'reviewId': ''
  };

  alert: any = {
    'type': 'danger',
    'message': ''
  };

  success: any = {
    'type': 'success',
    'message': ''
  };

  public restaurantList;
  public reviewList;
  public restaurantPage = 0;
  public reviewPage = 0;
  public apiRequest = {};
  public restaurantName;
  public selectedRestaurantId;
  public isDetail = false;

  modalRef: BsModalRef;

  constructor(private api: ApiService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getMyRestaurants(this.restaurantPage);
  }


  getMyRestaurants(page: any) {
    this.api.post('restaurant/list-restaurant', this.apiRequest = {page: page , isOwner : true})
      .then((item: RestaurantList) => this.restaurantList = item.restaurants);
  }

  prevPage() {
    this.restaurantPage -= 1;
    this.getMyRestaurants(this.restaurantPage);
  }

  nextPage() {
    this.restaurantPage += 1;
    this.getMyRestaurants(this.restaurantPage);
  }

  openRestaurantCreateModal(template: TemplateRef<any>) {
    this.restaurantForm = {};
    this.alert.message = '';
    this.getModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.restaurantForm = {};
    this.alert.message = '';
    this.getModal(template);
  }

  private getModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  createRestaurant() {
    this.api.post('restaurant/create-restaurant',
      this.restaurantForm
    ).then((res: any) => {
      if (res.code === 100) {
        this.getMyRestaurants(0);
        this.modalService.hide(1);
      } else {
        this.alert.message = res.message;
      }
    }).catch((error: HttpErrorResponse) => {
      this.alert.message = error.error.message;
    });
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  FadeOutLink() {
    setTimeout( () => {
      this.success.message = '';
      this.alert.message = '';
    }, 2000);
  }

  openReviewPage(template: TemplateRef<any>, id , name) {
    this.restaurantName = name;
    this.selectedRestaurantId = id;
    this.getReviews(0);
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  getReviews(page: any) {
    this.api.post('review/list', this.apiRequest = {page: page , restaurantId : this.selectedRestaurantId})
      .then((item: ReviewList) => this.reviewList = item.reviews);
  }

  prevPageReview() {
    this.reviewPage -= 1;
    this.getReviews(this.reviewPage);
  }

  nextPageReview() {
    this.reviewPage += 1;
    this.getReviews(this.reviewPage);
  }

  createAnswer() {
    this.api.post('answer/create',
      this.answerForm
    ).then((res: any) => {
      if (res.code === 100) {
        this.getReviews(this.reviewPage);
        this.modalService.hide(2);
      } else {
        this.alert.message = res.message;
      }
    }).catch((error: HttpErrorResponse) => {
      this.alert.message = error.error.message;
    });
  }

  openAnswerCreateModal(template: TemplateRef<any>, reviewId) {
    this.isDetail = false;
    this.answerForm = {};
    this.answerForm.reviewId = reviewId;
    this.answerForm.restaurantId = this.selectedRestaurantId;
    this.alert.message = '';
    this.getModal(template);
  }


  showAnswer(template: TemplateRef<any>, id) {
    this.isDetail = true;
    this.api.post('answer/detail', this.apiRequest = {reviewId: id}).then((res: any) => {
      if (res.code === 100) {
        this.answerForm = {
          ownerAnswer: res.answer.ownerAnswer
        };
        this.getModal(template);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }


}
