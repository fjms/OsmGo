import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { TagsService } from '../../../services/tags.service';
import { ConfigService } from '../../../services/config.service';




@Component({
    templateUrl: 'modal.primaryTag.html',
    selector: 'modal-primary-tag',
})
export class ModalPrimaryTag {
    _primaryKey;
    selectedKey: string;
    tagsOfselectedKey;
    loading = true;
    primaryKeys = [];
    allTags;
    searchText = '';
    currentListOfTags = [];
    typeFiche = 'list';
    customValue = '';


    constructor(
        public params: NavParams,
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
        public tagsService: TagsService,
        public platform: Platform,
        public configService: ConfigService


    ) {
        this._primaryKey = this.params.data.primaryKey;

        // backButton
        this.platform.registerBackButtonAction(e => {
            this.dismiss();
        });

    }

    ngOnInit() {
        this.tagsService.getAllTags().subscribe(allTags => {
            this.allTags = allTags;

            for (let key in allTags) {
                this.primaryKeys.push({ lbl: allTags[key].lbl, key: key });
            }
            if (this.configService.getDefaultPrimarykeyWindows() == 'allTags') {

                this.selectedKey = 'full'
            } else if (this.configService.getDefaultPrimarykeyWindows() == 'bookmarks') {

                this.selectedKey = 'bookmarks'
            } else {
                this.selectedKey = this._primaryKey.key;
            }
            if (this.selectedKey == 'full') {
                this.currentListOfTags = this.tagsService.getFullTags();
            } else if (this.selectedKey == 'bookmarks') {
                this.currentListOfTags = this.tagsService.getBookMarks();
            } else {
                this.currentListOfTags = allTags[this.selectedKey].values;
            }
            this.loading = false;
        });
    }

    dismiss(data = null) {
        this.viewCtrl.dismiss(data);
    }

    summit(typeFiche) {
        if (typeFiche == 'custom') {
            this._primaryKey = { key: this.selectedKey, value: this.customValue }
        }
        this.dismiss(this._primaryKey);
    }
    cancel() {
        this.dismiss();
    }

    selected(e) {
        this._primaryKey = { key: e.primaryKey, value: e.key };
        this.summit(this.typeFiche)
    }

    addRemoveToBookmarks(tag) {
        this.tagsService.addRemoveBookMark(tag);
    }
    isBookMarked(tag) {
        let bM: any = this.tagsService.getBookMarks();
        for (let i = 0; i < bM.length; i++) {
            if (bM[i].primaryKey == tag.primaryKey && bM[i].key == tag.key) {
                return true
            }
        }
        return false;
    }

    updateSelectedValue(key) {
        if (key == 'full') {
            this.currentListOfTags = this.tagsService.getFullTags();
        } else if (key == "bookmarks") {
            this.currentListOfTags = this.tagsService.getBookMarks();
        }
        else {
            this.currentListOfTags = this.allTags[key].values;
        }

    }
}