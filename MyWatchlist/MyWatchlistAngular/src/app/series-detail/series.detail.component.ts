import { Component, OnInit } from '@angular/core';
import { Series } from "../models/series";
import { SeriesService } from "../_services/series.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { TokenStorageService } from "../_services/token-storage.service";
import { WatchlistService } from "../_services/watchlist.service";
import { SeriesForm } from "../models/series-form";
import {MessageService} from "../_services/message.service";
import {Genres} from "../models/genres";


@Component({
  selector: 'app-detail',
  templateUrl: './series.detail.component.html',
  styleUrls: ['./series.detail.component.css']
})
export class SeriesDetailComponent implements OnInit {

  serie?:Series;
  genresList = Genres.list;
  currentUser: any;
  isLoggedIn = false;
  showDeleteButton = false;
  showUpdateButton = false;
  watchlistAdded = false;
  update = false;
  model = new SeriesForm('', 0, '', []);

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private watchlistService: WatchlistService,
    private location: Location,
    private token: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getToken();
    if(this.isLoggedIn){
      this.currentUser = this.token.getUser();
      this.showDeleteButton = this.currentUser.roles.includes('ROLE_ADMIN');
      this.showUpdateButton = this.currentUser.roles.includes('ROLE_MODERATOR');
    }
    this.getSeries();
  }

  onSubmit() {
    const { episodes, plot, genres } = this.model;
    if(this.serie) {
      this.seriesService.updateSeries(this.serie.title, episodes, plot, genres )
        .subscribe(
        _ => { this.reloadPage() }
        )
    }
  }

  getSeries(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.seriesService.getSeriesById(id)
      .subscribe(serie => this.serie = serie);
  }

  addToWatchlist(): void {
    this.watchlistAdded = true;
    if(this.serie){
      this.watchlistService.addWatchlist(this.serie.title, this.currentUser.username)
        .subscribe(

        );
    }
  }

  deleteSeries(): void {
    if(this.serie) {
      this.seriesService.deleteSeries(this.serie.title).subscribe();
      this.goBack();
    }
  }

  updateButton(){
    this.update = !this.update;
  }

  goBack(): void {
    this.location.back();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
