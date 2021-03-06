import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';


@Injectable()
export class TagsService {
    lastTagAdded = {};
    bookMarks = [];
    tags;
    Presets = [];
    primaryKeys = [];
    localStorage = new Storage();

    constructor(private http: Http) {
        this.loadLastTagAdded();
        this.loadBookMarks();
        this.loadPrimaryKeys();

    }

//bookMarks
    getBookMarks() {
        return this.bookMarks;
    }
    setBookMarks(bookMarks) {
        this.localStorage.set('bookMarks', bookMarks);
        this.bookMarks = bookMarks;
    }
    addRemoveBookMark(tag){

        let ind = -1;
        for (let i =0; i < this.bookMarks.length; i++){
            if (this.bookMarks[i].key == tag.key && this.bookMarks[i].primaryKey == tag.primaryKey){
                 ind = i; 
            } 
        }

        if (ind === -1){
            this.bookMarks.push(tag);
        } else {
            this.bookMarks.splice(ind,1);
        }
        this.localStorage.set('bookMarks', this.bookMarks);
    }

    loadBookMarks() {
        this.localStorage.get('bookMarks').then(d => {
            if (d) {
                this.bookMarks = d;
            } else {
               this.bookMarks = [];
            }
        });
    }


//LastTagAdded
     getLastTagAdded() {
        return this.lastTagAdded;
    }
    setLastTagAdded(lastTag) {
        this.localStorage.set('lastTagAdded', lastTag);
        this.lastTagAdded = lastTag;
    }
    loadLastTagAdded() {
        this.localStorage.get('lastTagAdded').then(d => {
            if (d) {
                this.lastTagAdded = d;
            } else {
               this.lastTagAdded = null;
            }
        });
    }

    loadPrimaryKeys(){
         this.getAllTags().subscribe(allTags => {
            for (let key in allTags) {
                this.primaryKeys.push({ lbl: allTags[key].lbl, key: key });
            }
         });
    }
    
    getPrimaryKeys(){
        return this.primaryKeys;
    }

    getAllTags(): Observable<any> {
        return this.http.get('assets/tags/tags.json')
            .map(res => {

                let tags = res.json();
                for (let tagsObject in tags) {
                    for (let i = 0; i < tags[tagsObject].values.length; i++) {
                        tags[tagsObject].values[i]['primaryKey'] = tagsObject;
                    }
                }
                this.tags = tags;
                return tags;
            });
    }


    loadTags() {
        this.http.get('assets/tags/tags.json')
            .map((res) => {

                // this.tags = res;
                return res;
            })
            .subscribe(data => {
                let tags = JSON.parse(data.text());
                for (let tagsObject in tags) {
                    for (let i = 0; i < tags[tagsObject].values.length; i++) {
                        tags[tagsObject].values[i]['primaryKey'] = tagsObject;
                    }

                }
                this.tags = tags;
                this.getListOfPrimaryKey();
                return tags;
            })
            ;
        // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    };


    getTags() {
        return JSON.parse(JSON.stringify(this.tags));
    }

    getFullTags() {
        let res = [];
        let tags = this.getTags();
        for (let tagsObject in tags) {
            for (let i = 0; i < tags[tagsObject].values.length; i++) {
                let currentTag = JSON.parse(JSON.stringify(tags[tagsObject].values[i]));
                res.push(currentTag);
            }
        }
        return res;
    }

    getPresets(presetsList: string[]) {
        return this.http.get('assets/tags/presets.json')
            .map((p) => {
                p = p.json();
                let res = {};
                for (let i = 0; i < presetsList.length; i++) {
                    res[presetsList[i]] = p[presetsList[i]];
                }
                return res;
            });
    }



    // liste des clés principales => ["shop", "amenity", "public_transport", "emergency",...]
    getListOfPrimaryKey() {
        let tags = this.tags;
        let listeOfPrimaryKey = [];
        for (let key in tags) {
            listeOfPrimaryKey.push(key);
        }
        return listeOfPrimaryKey;
    }

    getPrimaryKeyOfObject(tags) {
        let types_liste = this.getListOfPrimaryKey();
        let kv = { k: '', v: '' };
        for (let k in tags) {
            if (types_liste.indexOf(k) !== -1) {
                kv = { k: k, v: tags[k] };
                return kv
            }
        }
        return null;
    }

    getPrimaryKeyOfArray(tags) {
        let types_liste = this.getListOfPrimaryKey();
        let kv = { key: '', value: '' };
        for (let i = 0; i < tags.length; i++) {
            if (types_liste.indexOf(tags[i].key) !== -1) {
                kv = { key: tags[i].key, value: tags[i].value };
                break;
            }
        }
        return null;
    }

    getConfigMarkerByKv(k, v) {
        let tags = this.getTags();
        if (tags[k]) {
            for (let i in tags[k].values) {
                if (tags[k].values[i].key === v) {
                    return tags[k].values[i]
                }
            }
        }
    }
}