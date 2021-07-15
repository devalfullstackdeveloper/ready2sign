import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/data/service/user.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { DocumentService } from 'src/app/core/service/document.service';
import { TemplateService } from 'src/app/core/service/template.service';
import { SettingsService } from 'src/app/core/service/settings.service';
import { PropertyMeService } from 'src/app/core/service/property-me.service';
import { AlertService } from '../../../core/service/alert.service';
import { v4 as uuidv4 } from 'uuid';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import FroalaEditor from 'froala-editor';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import {
  DatePickerComponent,
  DatePickerDirective,
  IDatePickerConfig,
} from 'ng2-date-picker';
import { CONSTANTS } from 'src/common/constants';
declare var $: any;
@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css'],
})
export class EditDocumentComponent implements OnInit, OnDestroy {
  constant = CONSTANTS;
  @ViewChild('froalaEditor') froalaEditor: ElementRef;
  @ViewChild('iframe') iframe: ElementRef;
  selectedSection: string = 'parties';
  selectedSubSection: string = 'partyList';
  propertyMeDisable = false;

  currentUser: any = {};

  title: boolean = false;
  loginUser: any = '';

  documentId;

  // For Flag Object
  mobileFlagEvent;

  closePopup = false;
  YY_MM_DD_config: IDatePickerConfig = {
    format: 'YYYY-MM-DD',
    openOnFocus: true,
    // openOnClick : true
  };

  MM_DD_YY_config: IDatePickerConfig = {
    format: 'MM-DD-YYYY',
    openOnFocus: true,
    // openOnClick : true
  };

  DD_MM_YY_config: IDatePickerConfig = {
    format: 'DD-MM-YYYY',
    openOnFocus: true,
    // openOnClick : true
  };

  @HostListener('window:scroll', [])
  onWindowScroll(event: Event) {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById('leftfixheader').classList.add('sticky');
      document.getElementById('rightfixheader').classList.add('sticky');
    } else {
      document.getElementById('leftfixheader').classList.remove('sticky');
      document.getElementById('rightfixheader').classList.remove('sticky');
    }
  }

  @ViewChild('dayPicker') datePicker: DatePickerComponent;
  // open() { this.datePicker.api.open(); }
  // close() { this.datePicker.api.close(); }
  // accountNumber : Number = (<any>window).activeAcountNumber;
  accountNumber: Number = Number(
    JSON.parse(localStorage.getItem('acccountNumber'))
  );

  companyProfileData: any = {};

  preview: boolean = false;
  previewContent = '';

  documentEdit = false;

  clickedNewContact = false;

  documentData: any = {};
  documentContent : any = ""
  templateData: any = {};
  templateId;

  createDoc: any = {};
  editor;

  selectedPartyIndex = 0;
  contactList: any = [];

  // Property-me List and Tenancy List
  propertyFocus = false;
  propertyMeListMain: any = [];
  propertyMeList: any = [];

  propertyMeData : any;

  tenancyFocus = false;
  tenancyListMain: any = [];
  tenancyList: any = [];

  mandatoryPercentage = 0;
  mandatoryRemain = 0;
  mandatoryRemainCustomField = 0;

  //For Label In Partys
  tenantLabelExist = false;
  ownerLabelExist = false;

  //user list data
  allUsersMain: any = [];
  allUsers: any = [];

  clauseEditor;
  emailBuilderEditor;
  dragData: any;
  sendDoc: Boolean = false;
  emailPlaceholder = '';
  emailBuildorConfig: Object = {
    key: 'cJC7bD6A2E2C2G2D2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5C4C4E3E3D4F2C2==',
    toolbarSticky: false,
    dragInline: false,
    fontFamily: {
      'Arial,Helvetica,sans-serif': 'Arial',
      'Georgia,serif': 'Georgia',
      'Impact,Charcoal,sans-serif': 'Impact',
      'Tahoma,Geneva,sans-serif': 'Tahoma',
      "'Times New Roman',Times,serif": 'Times New Roman',
      'Verdana,Geneva,sans-serif': 'Verdana',
      "Roboto,sans-serif": 'Roboto',
      "Oswald,sans-serif": 'Oswald',
      "Montserrat,sans-serif": 'Montserrat',
      "'Open Sans Condensed',sans-serif": 'Open Sans Condensed'
    },
    fontFamilySelection: false,
    toolbarButtons: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 3,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 3,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 4,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help',
          'pageBreaker'
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsMD: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 3,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 3,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 4,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help',
          'pageBreaker'
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsSM: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 3,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 3,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 4,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help',
          'pageBreaker'
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsXS: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 3,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 3,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 4,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help',
          'pageBreaker'
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },

    events: {
      focus: function () {
        // console.log("Focus called")
      },
      initialized: () => {
        var _this = this;
        let builderEditor = _this.emailBuilderEditor;
        builderEditor.events.on(
          'drop',
          function (dropEvent) {
            builderEditor.markers.insertAtPoint(dropEvent.originalEvent);
            var $marker = builderEditor.$el.find('.fr-marker');
            $marker.replaceWith(FroalaEditor.MARKERS);
            builderEditor.selection.restore();

            // Save into undo stack the current position.
            if (!builderEditor.undo.canDo()) builderEditor.undo.saveStep();

            let data = _this.dragData.data;
            if (
              _this.dragData.id &&
              dropEvent.originalEvent.dataTransfer.getData('emailBuilderId') ==
                _this.dragData.id
            ) {
              builderEditor.html.insert(
                '<span class="emailBuilder" id="' +
                  data.name +
                  '" draggable="true" dir="' +
                  data.name +
                  '">[' +
                  data.name +
                  ']</span>&nbsp;&nbsp;'
              );
              builderEditor.events.focus();
              // builderEditor.html.insert(_this.dragData.outerHTML)
              _this.dragData = {};
            }
            // builderEditor.html.insert("Hello")
            // return false
          },
          true
        );
      },
      drop: () => {
        // console.log("drop-----",this);
      },
    },
  };
  //email builder
  emailField: any = {
    Subject: '',
    Body: '',
  };

  sentDocField: any = {
    to: '',
    from: '',
    Subject: '',
    Body: '',
  };

  // clauses

  searchText: '';
  focus: boolean = false;
  clauseList: any;
  clauseListMain: any;

  editClause = false;
  addClause: any = {
    Id: 0,
    UUID: uuidv4(),
    Name: '',
    Description: '',
    Index: 1,
    IsSenderEdit: false,
    indexMax: 1,
    prevSection: null,
  };

  allApps: any = [];
  propertyFilter: any = {
    filterOn: 'Id',
    order: 'Asc',
    app_srt: false,
    status_srt: false,
    search: '',
    status: '',
  };

  clauseConfig: Object = {
    key: 'cJC7bD6A2E2C2G2D2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5C4C4E3E3D4F2C2==',
    toolbarSticky: false,
    dragInline: false,
    fontFamily: {
      'Arial,Helvetica,sans-serif': 'Arial',
      'Georgia,serif': 'Georgia',
      'Impact,Charcoal,sans-serif': 'Impact',
      'Tahoma,Geneva,sans-serif': 'Tahoma',
      "'Times New Roman',Times,serif": 'Times New Roman',
      'Verdana,Geneva,sans-serif': 'Verdana',
      "Roboto,sans-serif": 'Roboto',
      "Oswald,sans-serif": 'Oswald',
      "Montserrat,sans-serif": 'Montserrat',
      "'Open Sans Condensed',sans-serif": 'Open Sans Condensed'
    },
    fontFamilySelection: false,
    toolbarButtons: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
        ],
        buttonsVisible: 3,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
        ],
        buttonsVisible: 3,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
          'pageBreaker',
        ],
        buttonsVisible: 3,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help',
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsMD: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
        ],
        buttonsVisible: 3,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
        ],
        buttonsVisible: 3,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
          'pageBreaker',
        ],
        buttonsVisible: 3,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help',
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsSM: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
        ],
        buttonsVisible: 2,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
        ],
        buttonsVisible: 2,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
          'pageBreaker',
        ],
        buttonsVisible: 2,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help',
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsXS: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
        ],
        buttonsVisible: 2,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
        ],
        buttonsVisible: 2,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          'insertFile',
          'insertHR',
          'pageBreaker',
        ],
        buttonsVisible: 2,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help',
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    events: {
      contentChanged: () => {
        // console.log("Clause Content from event---",this.clauseEditor.html.get())
        // console.log("Clause Content from ng-Model---",this.addClause.Description)
        this.addClause.Description = this.clauseEditor.html.get();
      },
    },
  };
  //files upload
  fileDrag: boolean = false;
  public files: NgxFileDropEntry[] = [];

  attachedFileSize = 0;

  IsExpired = false;

  //------Main Froala editor

  //config : Object = {
  //  key : 'cJC7bD6A2E2C2G2D2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5C4C4E3E3D4F2C2==',

  config: Object = {
    key: 'cJC7bD6A2E2C2G2D2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5C4C4E3E3D4F2C2==',
    // height: 100
    toolbarSticky: false,
    dragInline: true,
    // focus : true,
    heightMin: 600,
    fontFamily: {
      'Arial,Helvetica,sans-serif': 'Arial',
      'Georgia,serif': 'Georgia',
      'Impact,Charcoal,sans-serif': 'Impact',
      'Tahoma,Geneva,sans-serif': 'Tahoma',
      "'Times New Roman',Times,serif": 'Times New Roman',
      'Verdana,Geneva,sans-serif': 'Verdana',
      "Roboto,sans-serif": 'Roboto',
      "Oswald,sans-serif": 'Oswald',
      "Montserrat,sans-serif": 'Montserrat',
      "'Open Sans Condensed',sans-serif": 'Open Sans Condensed'
    },
    fontFamilySelection: false,
    toolbarButtons: [
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'fontFamily',
      'fontSize',
      'textColor',
      'backgroundColor',
      'clearFormatting',
      'alignLeft',
      'alignCenter',
      'formatOLSimple',
      'alignRight',
      'alignJustify',
      'formatOL',
      'formatUL',
      'paragraphFormat',
      'paragraphStyle',
      'lineHeight',
      'outdent',
      'indent',
      'quote',
      'insertLink',
      'insertImage',
      'insertTable',
      'fontAwesome',
      'specialCharacters',
      'embedly',
      'insertFile',
      'insertHR',
      'undo',
      'redo',
      'fullscreen',
      'spellChecker',
      'selectAll',
      'html',
      'help',
      'pageBreaker'
    ],
    events: {
      focus: function () {
        // console.log("Focus called")
      },
      initialized: () => {
        var _this = this;
        let editor = this.editor;
        editor.events.on(
          'drop',
          function (dropEvent) {
            // console.log('drop init');
            // Focus at the current posisiton.
            editor.markers.insertAtPoint(dropEvent.originalEvent);
            var $marker = editor.$el.find('.fr-marker');
            $marker.replaceWith(FroalaEditor.MARKERS);
            editor.selection.restore();

            // Save into undo stack the current position.
            if (!editor.undo.canDo()) editor.undo.saveStep();

            let data = _this.dragData.data;
            if (
              _this.dragData.id &&
              dropEvent.originalEvent.dataTransfer.getData('Id') ==
                _this.dragData.id
            ) {
              editor.html.insert(
                '<span class="' +
                  data.className +
                  '" id="' +
                  data.partyName +
                  '-' +
                  data.fieldName +
                  '" draggable="true" dir="' +
                  data.index +
                  '-%n%-' +
                  data.subIndex +
                  '">' +
                  data.partyName +
                  '_' +
                  data.fieldName +
                  '</span>&nbsp;&nbsp;'
              );
              editor.events.focus();
              // editor.html.insert(_this.dragData.outerHTML)
              _this.dragData = {};
            }
            // else{
            //   console.log("In Else drop---");
            //   editor.html.insert('')
            //   editor.events.focus();
            // }

            if (
              _this.dragData.id &&
              dropEvent.originalEvent.dataTransfer.getData('sectionId') ==
                _this.dragData.id
            ) {
              var doc = new DOMParser().parseFromString(editor.html.get(), 'text/html');

              // editor.html.insert("<span class=\""+data.className+"\" id=\""+data.fieldName+"-"+data.uuid+"\" draggable=\"true\" dir=\""+data.uuid+"\">"+data.fieldName+"</span>&nbsp;&nbsp")

              // let data = {index,className,fieldName,uuid}

              let Clauses = _this.documentData.Sections[data.index].Clauses;

              for(var rm = 0; rm < Clauses.length; rm++){
                if(doc.getElementById(data.uuid+"-"+Clauses[rm].UUID)){
                  _this.removeClauseFromFroala(data.uuid, Clauses[rm].UUID);
                }
              }

              setTimeout(() => {
                let section = _this.documentData.Sections[data.index];
                _this.documentData.Sections[data.index].IsAdded = true;
                var content = '';
                for (let i = 0; i < section.Clauses.length; i++) {
                  content +=
                    '<div><span class="clauses" id="' +
                    section.UUID +
                    '-' +
                    section.Clauses[i].UUID +
                    '" dir="' +
                    section.UUID +
                    '-' +
                    section.Clauses[i].UUID +
                    '">' +
                    `<span class="clause-num">${section.Index}.${section.Clauses[i].Index}</span>`+
                    `<div class="clause-desc">${section.Clauses[i].Description}</div>`+
                    '</span></div>';
                  section.Clauses[i].IsAdded = true;
                }

                editor.html.insert(content);
                editor.events.focus();
                _this.dragData = {};
              }, 500)
            }

            if (
              _this.dragData.id &&
              dropEvent.originalEvent.dataTransfer.getData('clauseId') ==
                _this.dragData.id
            ) {
              let sectionData = _this.documentData.Sections[data.i];
              let clauseData =
                _this.documentData.Sections[data.i].Clauses[data.j];
              // let clause = "<span class=\""+data.className+"\" id=\""+data.sectionUUID+"-"+data.clauseUUID+"\" draggable=\"true\" style='background:#EAFADD;' dir=\""+data.sectionUUID+"-"+data.clauseUUID+"\">["+data.secName+"-"+data.clauseName+"] &nbsp;&nbsp; </span>";
              let clause =
                '<div><span class="' +
                data.className +
                '" id="' +
                data.sectionUUID +
                '-' +
                data.clauseUUID +
                '" draggable="true" dir="' +
                data.sectionUUID +
                '-' +
                data.clauseUUID +
                '">' +
                `<span class="clause-num">${sectionData.Index}.${clauseData.Index}</span>` +
                `<div class="clause-desc">${clauseData.Description}</div>`+
                ' &nbsp; </span></div>';
              editor.html.insert(clause);
              editor.events.focus();

              _this.dragData = {};
            }

            // Save into undo stack the changes.
            editor.undo.saveStep();

            // Stop event propagation.
            dropEvent.preventDefault();
            dropEvent.stopPropagation();
            return false;
          },
          true
        );
      },
      contentChanged: () => {
        // this is only For check
        this.documentData.Content = this.editor.html.get();

        setTimeout(() => {
          var $marker = this.editor.$el.find('.fr-marker');
        }, 100);
      },
      drop: () => {},
    },
  };

  calFooterFldIntervalId;
  Roles: any = [];

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  constructor(
    private alertService: AlertService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private settings: SettingsService,
    private documentService: DocumentService,
    private templateService: TemplateService,
    private propertyMeService: PropertyMeService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    // this.accountNumber = this.authenticationService.selectedAccountNumberValue
    // this.getAllUsers();
    this.Roles = this.route.snapshot.data['roles'];

    this.getAllClauses(this.accountNumber);
    this.getAccount(this.accountNumber);
    this.getAllApps();

    // this.authenticationService.getActiveAccountNumber().subscribe(data => {
    //   this.currentUser = this.authenticationService.currentUserValue;
    //   this.getAccount(data);
    //   this.getAllClauses(data);

    //   let roleExist = this.Roles.find(role => role === this.currentUser.role);
    //   if(!roleExist){
    //     this.router.navigate(['/admin/home']);
    //   }

    //   this.route.params.subscribe(params => {
    //     console.log("Router params",params)
    //     if(params['id'] == 'create'){
    //       this.documentEdit = false
    //       console.log("Doc service Data::----",this.documentService.docData)
    //       this.documentData = this.documentService.docData;
    //       this.templateId = this.documentData.TemplateId
    //       this.setDocumentData();
    //     }else{
    //       // call get document API
    //       this.documentId = params['id']
    //       this.documentEdit = true
    //       this.getDocumentData();
    //     }
    //   })
    // })

    this.route.params.subscribe((params) => {
      if (params['id'] == 'create') {
        this.documentEdit = false;
        this.documentData = this.documentService.docData;
        this.templateId = this.documentData.TemplateId;
        this.setDocumentData();
      } else {
        // call get document API
        this.documentId = params['id'];
        this.documentEdit = true;
        this.getDocumentData();
      }
    });
  }

  ngOnInit(): void {
    this.authenticationService.getActiveAccountNumber().subscribe((data) => {
      this.accountNumber = data;
      this.currentUser = this.authenticationService.currentUserValue;
      // this.insertPageBreaker();
      this.getAccount(data);
      this.getAllClauses(data);
      let roleExist = this.Roles.find((role) => role === this.currentUser.role);
      if (!roleExist) {
        this.router.navigate(['/admin/home']);
      }

      this.route.params.subscribe((params) => {
        if (params['id'] == 'create') {
          this.documentEdit = false;
          this.documentData = this.documentService.docData;
          this.templateId = this.documentData.TemplateId;
          this.setDocumentData();
        } else {
          // call get document API
          this.documentId = params['id'];
          this.documentEdit = true;

          // New Api for content
          // this.getDocumentContent();
          this.getDocumentData();
        }
      });
    });

    this.documentService.docData$.subscribe((data) => {
    });
    this.documentService.getUserProfile().subscribe((res) => {
      this.loginUser = res;
    });
  }

  ngOnDestroy() {
    if (this.calFooterFldIntervalId) {
      clearInterval(this.calFooterFldIntervalId);
    }
  }

  getTemplateById() {
    if (this.templateId) {
      this.templateService.getTemplateById(this.templateId).subscribe((res) => {
        this.templateData = res;
      });
    }
  }

  async setDocumentData() {

    // this.propertyMeData = await this.getPropertyDetailUsingLotId(this.documentData.LotId);

    if (this.documentData.AccountId !== this.accountNumber) {
      this.router.navigate(['/admin/home']);
      return;
    } else {
      this.createDoc = {
        Title: this.documentData.Title,
        Property: this.documentData.Property,
        LotId: this.documentData.LotId,
        TenantId: this.documentData.TenantId,
        Tenancy: this.documentData.Tenancy,
        Groups: this.documentData.Groups ? this.documentData.Groups : [],
        EmailBuilder: this.documentData.EmailBuilder
          ? this.documentData.EmailBuilder
          : { Subject: '', Body: '' },
        IsLinked: this.documentData.Property ? true : false,
        PartyTypeId : this.documentData.PartyTypeId,
        PropertyMeTypeId: this.documentData.PropertyMeTypeId,
      };

      for (let i = 0; i < this.documentData.Parties.length; i++) {
        // this.createDoc[this.documentData.Parties[i].PartyName] = this.documentData.DocumentPartyContact[0]
        if (this.documentData.Parties[i].DocumentPartyContact[0]) {
          if (
            this.documentData.Parties[i].DocumentPartyContact[0].FirstName &&
            this.documentData.Parties[i].DocumentPartyContact[0].LastName
          ) {
            this.createDoc[this.documentData.Parties[i].PartyName] =
              this.documentData.Parties[i].DocumentPartyContact[0].FirstName +
              ' ' +
              this.documentData.Parties[i].DocumentPartyContact[0].LastName;
          } else {
            this.createDoc[this.documentData.Parties[i].PartyName] = '';
          }

          this.createDoc[`${this.documentData.Parties[i].PartyName}-details`] =
            this.documentData.Parties[i].DocumentPartyContact[0];

          if(this.documentData.Parties[i].SMSVerificationRequired){
            this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]['PhoneRequired'] = true
          }else{
            this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]['PhoneRequired'] = false
          }

          let partyDetails =
            this.createDoc[`${this.documentData.Parties[i].PartyName}-details`];
          if (
            !partyDetails.FirstName ||
            !partyDetails.LastName ||
            !partyDetails.Email ||
            (!partyDetails.Phone && partyDetails.PhoneRequired)
          ) {
            this.createDoc[
              `${this.documentData.Parties[i].PartyName}-details`
            ].detailAdded = false;
          } else {
            this.createDoc[
              `${this.documentData.Parties[i].PartyName}-details`
            ].detailAdded = true;
          }
        } else {
          this.createDoc[this.documentData.Parties[i].PartyName] = '';

          this.createDoc[`${this.documentData.Parties[i].PartyName}-details`] =
            {
              FirstName: '',
              LastName: '',
              Email: '',
              CountryCode: 'au',
              Phone: '',
              Position: '',
              Company: '',
              detailAdded: false,
              PhoneRequired: false,
              PropertyMeContactId: null,
              HomePhone : '',
              WorkPhone : '',
              PhysicalAddress : '',
              PostalAddress : ''
            };
        }

        if (this.documentData.Parties[i].PartyTypeId == 14) {
          this.tenantLabelExist = true;
        }

        if (this.documentData.Parties[i].PartyTypeId == 13) {
          this.ownerLabelExist = true;
        }

        for (
          var j = 0;
          j < this.documentData.Parties[i].CustomFields.length;
          j++
        ) {
          if (
            this.documentData.Parties[i].CustomFields[j] &&
            this.documentData.Parties[i].CustomFields[j].Value
          ) {
            this.createDoc[
              `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
            ] = this.documentData.Parties[i].CustomFields[j].Value;
          } else {
            this.createDoc[
              `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
            ] = '';
          }
        }
      }

      // Get Users
      this.getAllUsers();

      // Get Template Data
      this.getTemplateById();

      // Disable propertyMe Off and propertyMeTemplate
      var propertyMeApp = this.allApps.find(app => {
        if(app.Id == 1){
          return app
        }
      });

      if(propertyMeApp && this.documentData.IsLinked){
        if(propertyMeApp.Active){
          this.propertyMeDisable = false
        }else{
          this.propertyMeDisable = true
        }
      }else {
        this.propertyMeDisable = false
      }

      if(this.propertyMeDisable){
        this.editor.edit.off();
      }


      //Get Propertyme Field Value
      if(this.documentData.LotId){
        this.propertyMeData = await this.getPropertyDetailUsingLotId(this.documentData.LotId);
      }

      //Set Froala Content
      setTimeout(() => {
        this.editor.edit.off();

        this.setFieldInFroala();
        this.updatePartyData();
      }, 300);

      // calculate Attachment Size
      this.calculateAttechmentSize();

      // Interval for calculate ready 2 send document
      // this.calFooterFldIntervalId = setInterval(() => {
      //Calculate Footer value
      // this.updatePartyData();
      // }, 1000)
    }
  }

  // For Froala editor
  initializeLink(controls) {
    controls.initialize();
    this.editor = controls.getEditor();
    this.insertPageBreaker();
  }

  selectSection(section) {
    this.selectedSection = section;

    if (section == 'parties') {
      this.selectedSubSection = 'partyList';
    }

    if (section == 'editParty') {
      setTimeout(() => {
      }, 300);
      this.selectedSubSection = 'fieldList';
      this.loadScript();
    }
  }

  //------------------------ Party Field
  partyFocusIn(index) {
    this.documentData.Parties[index]['focus'] = true;
  }

  partyFocusOut(index) {
    // this.documentData.TemplateParties[index]['focus'] = false
    // this.searchText = '';
    setTimeout(() => {
      this.documentData.Parties[index]['focus'] = false;
    }, 300);
  }

  setPartyIndex(index, partyName) {
    this.selectedPartyIndex = index;

    this.clickedNewContact = false;

    if (index) {
      let partyContact = this.createDoc[partyName + '-details'];

      setTimeout(() => {
        if (this.mobileFlagEvent && partyContact.CountryCode) {
          this.mobileFlagEvent.setCountry(partyContact.CountryCode);
        }
      }, 300);
    }
  }

  changeApprover(value, index, partyName) {
    // console.log("type value----",value)
    if (!value) {
      this.allUsers = this.allUsersMain;

      // text box clean update clear partyData
      this.clearPartyData(index, partyName);
    } else {

      let activeUser = [];
      this.allUsersMain.forEach(element => {
        if (element.UserStatus == "Active") {
          element.FullName = element.FirstName.concat(" ",element.LastName);
          activeUser.push(element);
        }
      });

      var searchUsers = activeUser.filter(
        (x) =>
          x.FirstName.trim()
            .toLowerCase()
            .includes(value.trim().toLowerCase()) ||
          x.LastName.trim()
            .toLowerCase()
            .includes(value.trim().toLowerCase()) ||
          x.Email.trim().toLowerCase().includes(value.trim().toLowerCase()) ||
          x.FullName.trim().toLowerCase().includes(value.trim().toLowerCase())
      );

      this.allUsers = [...new Set([...searchUsers,...activeUser])]
    }

    // if(value.length > 2){
    //   this.getAllUsers(value)
    // }else{
    //   this.allUsers = [];

    //   // text box clean update clear partyData
    //   this.clearPartyData(index, partyName)
    // }
  }

  changePartyName(value, index, partyName) {
    this.documentData.Parties[index]['EnterName'] = value;
    if (value.length > 2) {
      this.getContacts(value);
    } else {
      this.contactList = [];
    }

    if (!value) {
      // text box clean update clear partyData
      let nwContact = {
        FirstName: '',
        LastName: '',
        Email: '',
        CountryCode: 'au',
        Phone: '',
        Position: '',
        Company: '',
        detailAdded: false,
        PhoneRequired: false,
        PropertyMeContactId: null,
        HomePhone : '',
        WorkPhone : '',
        PhysicalAddress : '',
        PostalAddress : ''
      };

      this.createDoc[partyName] = '';
      this.createDoc[partyName + '-details'] = nwContact;

      // text box clean update clear partyData
      this.clearPartyData(index, partyName);
    }
  }

  clearPartyData(index, partyName) {
    this.documentData.Parties[index].UserId = '';
    let nwContact = {
      FirstName: '',
      LastName: '',
      Email: '',
      CountryCode: 'au',
      Phone: '',
      Position: '',
      Company: '',
      detailAdded: false,
      PhoneRequired: false,
      PropertyMeContactId: null,
      HomePhone : '',
      WorkPhone : '',
      PhysicalAddress : '',
      PostalAddress : ''
    };

    this.createDoc[partyName] = '';
    this.createDoc[partyName + '-details'] = nwContact;

    this.selectedPartyIndex = 0;

    // Add First and Last name in Document title Of First Recipient.
    this.updateTitleWhenFirstRecipientSelect(index, nwContact);

    // update partydata
    this.updatePartyData();
  }

  cancelFormValidCheck(valid, partyName){
    if(valid){
      this.createDoc[partyName + '-details'].detailAdded = true
    } else {
      this.createDoc[partyName + '-details'].detailAdded = false
      this.createDoc[partyName] = "";
    }

  }

  partyContactSelected(contact, index, partyName, PartyTypeId) {
    var exist = false;
    if (PartyTypeId == 8 || PartyTypeId == 9) {
      let selectedUsers = this.documentData.Parties.filter((x) => {
        if (x.PartyTypeId == 8 || x.PartyTypeId == 9) {
          return x;
        }
      });

      let selectExist = selectedUsers.find((x) => {
        if (x.UserId == contact.Id) {
          return x;
        }
      });

      if (selectExist) {
        exist = true;
        this.alertService.error('This user already selected');
      } else {
        exist = false;
      }
    }

    if (!exist) {
      this.clickedNewContact = false;
      // this.selectedPartyIndex = index + 1;

      let nwContact = {
        FirstName: contact.FirstName ? contact.FirstName : '',
        LastName: contact.LastName ? contact.LastName : '',
        Email: contact.Email ? contact.Email : '',
        CountryCode: contact.CountryCode ? contact.CountryCode : 'au',
        Phone: contact.MobileNumber
          ? contact.MobileNumber
          : contact.PhoneNumber
          ? contact.PhoneNumber
          : contact.Phone
          ? contact.Phone
          : contact.CellPhone
          ? contact.CellPhone
          : '',
        Position: contact.Position ? contact.Position : '',
        Company: contact.Company ? contact.Company : '',
        detailAdded: true,
        PhoneRequired: false,
        PropertyMeContactId: null,
        HomePhone : contact.HomePhone ? contact.HomePhone : '',
        WorkPhone : contact.WorkPhone ? contact.WorkPhone : '',
        PhysicalAddress : contact.PhysicalAddress ? contact.PhysicalAddress : '',
        PostalAddress : contact.PostalAddress ? contact.PostalAddress : ''
      };

      if(this.createDoc[partyName + '-details'].PhoneRequired){
        nwContact.PhoneRequired = true
      } else {
        nwContact.PhoneRequired = false
      }

      if (
        nwContact.FirstName &&
        nwContact.LastName &&
        nwContact.Email
      ) {
        if(nwContact.PhoneRequired && !nwContact.Phone){
          nwContact.detailAdded = false
        }
        this.createDoc[partyName] = contact.FirstName + ' ' + contact.LastName;
        this.createDoc[partyName + '-details'] = nwContact;
        this.documentData.Parties[index].UserId = contact.Id;

        // Add First and Last name in Document title Of First Recipient.
        this.updateTitleWhenFirstRecipientSelect(index, nwContact);
      } else {
        this.createDoc[partyName] = null;
        this.documentData.Parties[index].UserId = null;

        let err_message = 'This user/contact does not have ';
        let f_name = !nwContact.FirstName ? 'FirstName' : '';
        let l_name = !nwContact.LastName
          ? f_name
            ? ', LastName'
            : 'LastName'
          : '';
        let email = !nwContact.Email
          ? f_name || l_name
            ? ', Email'
            : 'Email'
          : '';
        let number = !nwContact.Phone
          ? f_name || l_name || email
            ? ', PhoneNumber'
            : 'PhoneNumber'
          : '';

        this.alertService.error(err_message + f_name + l_name + email + number);
      }

      //Set users list as it is
      // this.allUsers = this.allUsersMain
      this.allUsers = this.allUsersMain;
      // this.contactList = []

      // Update Data and set value in Froala
      this.updatePartyData();
    }
  }

  // For Mobile Flag
  telInputObject(event) {
    this.mobileFlagEvent = event;
  }

  onCountryChange(event, partyName) {
    this.createDoc[partyName + '-details'].CountryCode = event.iso2;
  }

  assignMeAsSender(index, partyName) {
    this.authenticationService.getUserProfile().subscribe(
      (userProfile) => {
        let nwContact = {
          FirstName: userProfile.FirstName ? userProfile.FirstName : '',
          LastName: userProfile.LastName ? userProfile.LastName : '',
          Email: userProfile.Email ? userProfile.Email : '',
          CountryCode: userProfile.CountryCode ? userProfile.CountryCode : 'au',
          Phone: userProfile.PhoneNumber
            ? userProfile.PhoneNumber
            : userProfile.Phone
            ? userProfile.Phone
            : '',
          Position: userProfile.Position ? userProfile.Position : '',
          Company: userProfile.Company ? userProfile.Company : '',
          detailAdded: true,
          PhoneRequired: false,
          PropertyMeContactId: null,
          HomePhone : userProfile.HomePhone ? userProfile.HomePhone : '',
          WorkPhone : userProfile.WorkPhone ? userProfile.WorkPhone : '',
          PhysicalAddress : userProfile.PhysicalAddress ? userProfile.PhysicalAddress : '',
          PostalAddress : userProfile.PostalAddress ? userProfile.PostalAddress : ''
        };

        if(this.createDoc[partyName + '-details'].PhoneRequired){
          nwContact.PhoneRequired = true
        } else {
          nwContact.PhoneRequired = false
        }

        if (
          nwContact.FirstName &&
          nwContact.LastName &&
          nwContact.Email &&
          (nwContact.PhoneRequired && nwContact.Phone || !nwContact.PhoneRequired)
        ) {
          this.createDoc[partyName] =
            userProfile.FirstName + ' ' + userProfile.LastName;
          this.createDoc[partyName + '-details'] = nwContact;
          this.documentData.Parties[index].UserId = userProfile.Id;
        } else {
          this.createDoc[partyName] = null;
          this.documentData.Parties[index].UserId = null;

          let err_message = 'This user/contact does not have ';
          let f_name = !nwContact.FirstName ? 'FirstName' : '';
          let l_name = !nwContact.LastName
            ? f_name
              ? ', LastName'
              : 'LastName'
            : '';
          let email = !nwContact.Email
            ? f_name || l_name
              ? ', Email'
              : 'Email'
            : '';
          let number = !nwContact.Phone
            ? f_name || l_name || email
              ? ', PhoneNumber'
              : 'PhoneNumber'
            : '';

          this.alertService.error(
            err_message + f_name + l_name + email + number
          );
        }

        // Update Data and set value in Froala
        this.updatePartyData();
      },
      (error) => {
        // console.log('User Profile Error---', error);
      }
    );
  }

  // Update Template Title as First recipient select
  updateTitleWhenFirstRecipientSelect(index, nwContact) {
    // Add First and Last name in Document title Of First Recipient.
    var recipients = this.documentData.Parties.filter((x) => {
      if (x.PartyTypeId !== 8 && x.PartyTypeId !== 9) {
        return x;
      }
    });

    if (recipients.length > 0) {
      if (recipients[0].Order == index) {
        let title = this.documentData.Title.split(' - ');
        let nx_title = title.length > 0 ? title[0] : this.documentData.Title;

        var propertyAddress = this.createDoc.Property
          ? this.createDoc.Property
          : '';
        var recipentNameWithAddress = propertyAddress
          ? propertyAddress +
            ' - ' +
            nwContact.FirstName +
            ' ' +
            nwContact.LastName
          : nwContact.FirstName + ' ' + nwContact.LastName;
        if (nwContact && nwContact.FirstName && nwContact.LastName) {
          if (propertyAddress) {
            this.createDoc.Title =
              nx_title +
              ' - ' +
              propertyAddress +
              ' - ' +
              nwContact.FirstName +
              ' ' +
              nwContact.LastName;
          } else {
            this.createDoc.Title =
              nx_title + ' - ' + nwContact.FirstName + ' ' + nwContact.LastName;
          }
        } else {
          this.createDoc.Title = nx_title + ' - ' + propertyAddress;
        }
      }
    }
  }

  checkOwnerTenantValidation(partyName) {
    let detailForm = this.createDoc[partyName + '-details'];
    if (detailForm.FirstName && detailForm.LastName && detailForm.Email) {
      return true;
    } else {
      return false;
    }
  }

  cancelPartyDetailForm(partyName, index) {

    this.documentData.Parties[index - 1].UserId = '';
    let nwContact = {
      FirstName: '',
      LastName: '',
      Email: '',
      CountryCode: 'au',
      Phone: '',
      Position: '',
      Company: '',
      detailAdded: false,
      PhoneRequired: false,
      PropertyMeContactId: null,
      HomePhone : '',
      WorkPhone : '',
      PhysicalAddress : '',
      PostalAddress : ''
    };

    this.createDoc[partyName] = '';
    this.createDoc[partyName + '-details'] = nwContact;
  }

  partyDetailForm(partyName, index) {
    if (this.clickedNewContact) {
      let partyDetail = this.createDoc[partyName + '-details'];
      partyDetail.Accountid = this.accountNumber;
      this.spinner.show();
      this.documentService.createContact(partyDetail).subscribe(
        (res) => {
          this.spinner.hide();

          this.createDoc[partyName] =
            partyDetail.FirstName + ' ' + partyDetail.LastName;

          // this.documentData.Parties[this.selectedPartyIndex-1].UserId= contact.Id
          this.createDoc[partyName + '-details'].detailAdded = true;

          this.alertService.successPage(res.Messages);

          this.selectedPartyIndex = 0;
          this.clickedNewContact = false;
          // Update Data and set value in Froala
          this.updatePartyData();

          // Add First and Last name in Document title Of First Recipient.
          this.updateTitleWhenFirstRecipientSelect(index, partyDetail);
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error.Message);
        }
      );
    } else {
      this.createDoc[partyName + '-details'].detailAdded = true;
      let partyData = this.createDoc[partyName + '-details'];
      partyData['Id'] = this.documentData.Parties[this.selectedPartyIndex - 1].UserId
      this.documentService.updateContact(partyData).subscribe(res => {
        let firstName = partyData.FirstName ? partyData.FirstName : '';
        let lastName = partyData.LastName ? partyData.LastName : '';
        this.createDoc[partyName] = firstName + ' ' + lastName;
        this.selectedPartyIndex = 0;

        // Update Data and set value in Froala
        this.updatePartyData();

        // Add First and Last name in Document title Of First Recipient.
        this.updateTitleWhenFirstRecipientSelect(index, partyData);
      },error =>{
        this.alertService.error(error.Messages);
      })

    }
  }

  updatePartyData() {
    let latestDoc = {
      TemplateId: this.documentData.TemplateId,
      Id: this.documentData.Id ? this.documentData.Id : 0,
      DocumentNumber: this.documentData.DocumentNumber
        ? this.documentData.DocumentNumber
        : '',
      AccountId: this.accountNumber,
      Title: this.createDoc.Title,
      Property: this.createDoc.Property,
      LotId: this.createDoc.LotId,
      TenantId: this.createDoc.TenantId,
      Tenancy: this.createDoc.Tenancy,
      ExpiryDays: this.documentData.ExpiryDays,
      ExpiryDate: this.documentData.ExpiryDate
        ? this.documentData.ExpiryDate
        : '',
      PartyTypeId : this.documentData.PartyTypeId,
      PropertyMeTypeId: this.documentData.PropertyMeTypeId,
      IsDraft: !this.documentData.IsDraft ? !this.documentData.IsDraft : true,
      IsLinked: this.documentData.IsLinked ? this.documentData.IsLinked : false,
      Reminders: this.documentData.Reminders,
      Content: this.documentData.Content,
      Attachments: this.documentData.Attachments,
      EmailBuilder: this.documentData.EmailBuilder
        ? this.documentData.EmailBuilder
        : null,
      Sections: this.documentData.Sections,
      Parties: [],
    };

    for (var i = 0; i < this.documentData.Parties.length; i++) {
      // let party = this.documentData.Parties[i]
      let PartyFields = this.documentData.Parties[i].PartyFields;
      let TemplateFields = this.documentData.Parties[i].TemplateFields;

      for (
        var j = 0;
        j < this.documentData.Parties[i].CustomFields.length;
        j++
      ) {
        if (
          this.createDoc[
            `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
          ]
        ) {
          this.documentData.Parties[i].CustomFields[j].Value =
            this.createDoc[
              `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
            ];
        }
      }

      let CustomFields = this.documentData.Parties[i].CustomFields;

      let party = this.documentData.Parties[i];
      delete party.PartyFields;
      delete party.TemplateFields;
      delete party.CustomFields;

      party.Fields = [];
      party.CustomFields = CustomFields;
      party.DocumentPartyContact = [];
      if (this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]) {
        party.DocumentPartyContact.push(
          this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]
        );
      }

      latestDoc.Parties.push(party);
    }

    this.documentData = latestDoc;
    this.setFieldInFroala();

    //claculate Footer value
    this.calculateFooterFields();
  }

  changeCustomCheckValue(
    partyName,
    customFieldName,
    checkedValue,
    checkBoxName
  ) {
    var checkedList = JSON.parse(
      this.createDoc[partyName + '-' + customFieldName]
    );

    if (checkedValue) {
      checkedList.push(checkBoxName);
      this.createDoc[partyName + '-' + customFieldName] =
        JSON.stringify(checkedList);
    } else {
      let existIndex = checkedList.findIndex((x) => x == checkBoxName);
      checkedList.splice(existIndex, 1);
      this.createDoc[partyName + '-' + customFieldName] =
        JSON.stringify(checkedList);
    }

    this.calculateFooterFields();
  }

  checkCheckBoxExist(partyName, customFieldName, checkBoxName) {
    const checkedList = JSON.parse(
      this.createDoc[partyName + '-' + customFieldName]
    );

    var checkExist = checkedList.find((x) => {
      if (x == checkBoxName) {
        return x;
      }
    });

    return checkExist ? true : false;
  }

  updateCustomFieldData() {
    // this.alertService.success("Party's Data Update Successfully")
    let latestDoc = {
      TemplateId: this.documentData.TemplateId,
      Id: this.documentData.Id ? this.documentData.Id : 0,
      DocumentNumber: this.documentData.DocumentNumber
        ? this.documentData.DocumentNumber
        : '',
      AccountId: this.accountNumber,
      Title: this.createDoc.Title,
      Property: this.createDoc.Property,
      LotId: this.createDoc.LotId,
      TenantId: this.createDoc.TenantId,
      Tenancy: this.createDoc.Tenancy,
      ExpiryDays: this.documentData.ExpiryDays,
      ExpiryDate: this.documentData.ExpiryDate
        ? this.documentData.ExpiryDate
        : '',
      PartyTypeId : this.documentData.PartyTypeId,
      PropertyMeTypeId: this.documentData.PropertyMeTypeId,
      IsDraft: !this.documentData.IsDraft ? !this.documentData.IsDraft : true,
      IsLinked : this.documentData.IsLinked ? this.documentData.IsLinked : false,
      Reminders: this.documentData.Reminders,
      Content: this.documentData.Content,
      Attachments: this.documentData.Attachments,
      EmailBuilder: this.documentData.EmailBuilder
        ? this.documentData.EmailBuilder
        : null,
      Sections: this.documentData.Sections,
      Parties: [],
    };

    for (var i = 0; i < this.documentData.Parties.length; i++) {
      // let party = this.documentData.Parties[i]
      let PartyFields = this.documentData.Parties[i].PartyFields;
      let TemplateFields = this.documentData.Parties[i].TemplateFields;

      for (
        var j = 0;
        j < this.documentData.Parties[i].CustomFields.length;
        j++
      ) {
        if (
          this.createDoc[
            `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
          ]
        ) {
          this.documentData.Parties[i].CustomFields[j].Value =
            this.createDoc[
              `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
            ];
        }
      }

      let CustomFields = this.documentData.Parties[i].CustomFields;

      let party = this.documentData.Parties[i];
      delete party.PartyFields;
      delete party.TemplateFields;
      delete party.CustomFields;

      party.Fields = [];
      party.CustomFields = CustomFields;
      party.DocumentPartyContact = [];
      if (this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]) {
        party.DocumentPartyContact.push(
          this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]
        );
      }

      latestDoc.Parties.push(party);
    }

    this.documentData = latestDoc;
    this.setFieldInFroala();

    //
    this.calculateFooterFields();
    this.alertService.success('CustomField Update Successfully');
  }

  //new contact clicked
  clickNewContact(index) {
    this.clickedNewContact = true;
    this.selectedPartyIndex = index + 1;
  }

  //add new Contact
  newContact() {}

  //------------------------------------ Email Builder ----------------
  emailFroalaInit(controls) {
    controls.initialize();
    this.emailBuilderEditor = controls.getEditor();

    setTimeout(() => {
      if (this.IsExpired) {
        this.emailBuilderEditor.edit.off();
      }

      if(this.propertyMeDisable){
        this.emailBuilderEditor.edit.off();
      }
    }, 300);
  }

  builderDragStart(event: DragEvent, name) {
    let data = { name };
    this.dragData = event.target;
    this.dragData.data = data;
    event.dataTransfer.setData('emailBuilderId', this.dragData.id);
  }

  addToEmailBuilder(name) {

    if(!this.IsExpired && !this.propertyMeDisable){
      if (name !== 'null') {
        let builderEditor = this.emailBuilderEditor;
        builderEditor.html.insert(
          '<span &nbsp;&nbsp;class="emailBuilder" id="' +
            name +
            '" draggable="true" dir="' +
            name +
            '">[' +
            name +
            ']</span>&nbsp;&nbsp;'
        );
        builderEditor.events.focus();
      }
    }
  }

  // ------------------------- send Document----------------------------

  getAllClauses(accountNumber) {
    this.templateService.getCluses(accountNumber).subscribe((res) => {
      this.clauseListMain = res;
      this.clauseList = res;
    });
  }

  // Get Account Details
  getAccount(accNumber) {
    if (accNumber) {
      this.settings.getAccount(accNumber).subscribe(
        (res) => {
          this.companyProfileData = res;
        },
        (error) => {
          this.companyProfileData = {};
        }
      );
    }
  }

  // Get All Connected Apps
  getAllApps() {
    this.settings.getAllApps(this.accountNumber, this.propertyFilter).subscribe(
      (res) => {
        if(res.Data){
          this.allApps = res.Data
        }
      },
      (error) => {
        // console.log('Error ::----', error);
      }
    );
  }

  sendDocument() {
    this.selectedSection = 'mail';

    setTimeout(() => {
      this.sendDoc = !this.sendDoc;
      let party = [];
      var toEmail = '';
      var toUserData: any = {};
      let partyList = this.documentData.Parties;
      var count = 0;
      var toExist = false;
      for (let i = 0; i < partyList.length; i++) {
        if (i == count) {
          if (partyList[i].PartyTypeId == 9) {
            count += 1;
          } else {
            // party.push(partyList[i])
            if (
              partyList[i].DocumentPartyContact &&
              partyList[i].DocumentPartyContact[0] &&
              partyList[i].DocumentPartyContact[0].Email
            ) {
              toUserData = partyList[i].DocumentPartyContact[0];
              toEmail = partyList[i].DocumentPartyContact[0].Email;
            } else {
              count += 1;
            }
          }
        }
      }
      this.sentDocField.to = toEmail;
      this.sentDocField.from = this.loginUser.Email;
      this.sentDocField.Subject = this.createDoc.EmailBuilder.Subject;
      this.sentDocField.Body = this.createDoc.EmailBuilder.Body;

      // console.log("Html----",this.emailBuilderEditor.html.get())

      // var doc = new DOMParser().parseFromString(this.emailBuilderEditor.html.get(), "text/html");
      // let emailBuilderData = doc.getElementsByClassName("emailBuilder");

      // console.log("Sender Name---",emailBuilderData);

      // for(var i=0; i < emailBuilderData.length; i++){
      //   let dir_str = emailBuilderData[i].attributes['dir'].value;
      //   console.log("Attribute Value----",dir_str)

      //   if(dir_str == "Sender name"){
      //     doc.getElementById(dir_str).innerHTML = ""
      //   }
      // }
    }, 500);
  }

  closeDocument() {
    this.closePopup = true;
  }

  saveDocument() {
    let latestDoc = {
      TemplateId: this.documentData.TemplateId,
      Id: this.documentData.Id ? this.documentData.Id : 0,
      DocumentNumber: this.documentData.DocumentNumber
        ? this.documentData.DocumentNumber
        : '',
      AccountId: this.accountNumber,
      Title: this.createDoc.Title,
      Property: this.createDoc.Property,
      LotId: this.createDoc.LotId,
      TenantId: this.createDoc.TenantId,
      IsLinked: this.documentData.IsLinked ? this.documentData.IsLinked : false,
      Tenancy: this.createDoc.Tenancy,
      Groups: this.createDoc.Groups,
      ExpiryDays: this.documentData.ExpiryDays,
      // ExpiryDate : this.documentData.ExpiryDate ? this.documentData.ExpiryDate : '',
      PartyTypeId : this.documentData.PartyTypeId,
      PropertyMeTypeId: this.documentData.PropertyMeTypeId,
      IsDraft: !this.documentData.IsDraft ? !this.documentData.IsDraft : true,
      Reminders: this.documentData.Reminders,
      Content: this.documentData.Content,
      Attachments: this.documentData.Attachments,
      // EmailBuilder : this.documentData.EmailBuilder ? this.documentData.EmailBuilder : null,
      EmailBuilder: this.createDoc.EmailBuilder
        ? this.createDoc.EmailBuilder
        : { Subject: '', Body: '' },
      Sections: this.documentData.Sections,
      Parties: [],
    };

    for (var i = 0; i < this.documentData.Parties.length; i++) {
      // let party = this.documentData.Parties[i]
      let PartyFields = this.documentData.Parties[i].PartyFields;
      let TemplateFields = this.documentData.Parties[i].TemplateFields;

      for (
        var j = 0;
        j < this.documentData.Parties[i].CustomFields.length;
        j++
      ) {
        if (
          this.createDoc[
            `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
          ]
        ) {
          this.documentData.Parties[i].CustomFields[j].Value =
            this.createDoc[
              `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
            ];
        }
      }

      let CustomFields = this.documentData.Parties[i].CustomFields;

      let party = this.documentData.Parties[i];
      delete party.PartyFields;
      delete party.TemplateFields;
      delete party.CustomFields;

      party.Fields = [];
      party.CustomFields = CustomFields;
      party.DocumentPartyContact = [];
      if (this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]) {
        let docCustomPartyContactDetails =
          this.createDoc[`${this.documentData.Parties[i].PartyName}-details`];
        if (
          !docCustomPartyContactDetails.FirstName ||
          !docCustomPartyContactDetails.LastName ||
          !docCustomPartyContactDetails.Email
        ) {
        } else {
          party.DocumentPartyContact.push(
            this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]
          );
        }
      }

      latestDoc.Parties.push(party);
    }

    // Caling Api To Create And Update
    if (!this.documentEdit) {
      // Create API
      this.spinner.show();
      this.documentService.createDocument(latestDoc).subscribe(
        (res) => {
          this.spinner.hide();
          if (res.WasSuccessful) {
            this.alertService.successPage(
              res.Messages || 'Document is saved successfully'
            );
            this.router.navigate(['/admin/home']);
          }
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error.Message);
        }
      );
    } else {
      // Edit API
      this.spinner.show();
      this.documentService.editDocument(latestDoc).subscribe(
        (res) => {
          this.spinner.hide();
          if (res.WasSuccessful) {
            this.alertService.successPage(
              res.Messages || 'Document is updated successfully'
            );
            this.router.navigate(['/admin/home']);
          }
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error.Message);
        }
      );
    }
  }

  closeSentModel() {
    this.sendDoc = !this.sendDoc;
  }

  searchClause(event) {
    let searchString = event.target.value;
    this.clauseList = this.clauseListMain.filter((x) =>
      x.Name.trim().toLowerCase().includes(searchString.trim().toLowerCase())
    );
  }

  // --------------------------------------clauses--------------------------------

  initializeClauseLink(controls) {
    controls.initialize();
    this.clauseEditor = controls.getEditor();
  }

  checkfocus() {
    this.focus = true;
  }
  checkFocusOut() {
    this.searchText = '';
    setTimeout(() => {
      this.focus = false;
    }, 500);
  }

  clauseDropTable(i, event: CdkDragDrop<[]>) {
    const prevIndex = this.documentData.Sections[i].Clauses.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(
      this.documentData.Sections[i].Clauses,
      prevIndex,
      event.currentIndex
    );
  }

  sectionDragStart(event: DragEvent, index, className, fieldName, uuid) {
    let data = { index, className, fieldName, uuid };
    this.dragData = event.target;
    this.dragData.data = data;
    event.dataTransfer.setData('sectionId', this.dragData.id);
  }

  addsectionInFroala(index, className, section, fieldName, uuid) {
    let editor = this.editor;
    var doc = new DOMParser().parseFromString(editor.html.get(), 'text/html');
    if (section.Clauses.length > 0 && !this.IsExpired) {
      let editor = this.editor;
      // editor.html.insert("<span class=\""+className+"\" id=\""+fieldName+"-"+uuid+"\" draggable=\"true\" dir=\""+uuid+"\">"+fieldName+"</span>&nbsp;&nbsp;")

      for(var rm = 0; rm < section.Clauses.length; rm++){
        if(doc.getElementById(section.UUID+"-"+section.Clauses[rm].UUID)){
          this.removeClauseFromFroala(section.UUID, section.Clauses[rm].UUID);
        }
      }

      setTimeout(() => {
        var content = '';
        for (let i = 0; i < section.Clauses.length; i++) {
          // content += section.Clauses[i].Description

          content +=
            '<div><span class="clauses" id="' +
            section.UUID +
            '-' +
            section.Clauses[i].UUID +
            '" dir="' +
            section.UUID +
            '-' +
            section.Clauses[i].UUID +
            '">' +
            `<span class="clause-num">${section.Index}.${section.Clauses[i].Index}</span>`+
            `<div class="clause-desc">${section.Clauses[i].Description}</div>` +
            '</span> </div>';
        }
        editor.html.insert(content);
        editor.events.focus();
        this.alertService.successPage('Section Added in froala');
      }, 300);
    }
  }

  closeClause() {
    this.editClause = false;
  }

  editClauseFromSearch(clause) {
    this.editClause = true;
    // this.newClause();
    this.addClause.Name = clause.Name;
    this.addClause.Id = clause.Id;
    this.addClause.Description = clause.Description ? clause.Description : '';
  }

  editClauseByIndex(i, j) {
    this.editClause = true;
    this.documentData.Sections[i].Clauses[j].section = i;
    this.documentData.Sections[i].Clauses[j].clauseIndex = j;

    const data = this.documentData.Sections[i].Clauses[j];
    this.addClause = data;
    this.addClause.Index = j + 1;
    this.addClause.prevSection = i;
    if (this.documentData.Sections[i].Clauses.length == 0) {
      this.addClause.indexMax = 1;
    } else {
      this.addClause.indexMax = this.documentData.Sections[i].Clauses.length;
    }
  }

  // Add perticular clause in Froala
  addClauseInFroala(
    i,
    j,
    className,
    sectionUUID,
    clauseUUID,
    secName,
    clauseName
  ) {
    let editor = this.editor;
    let Section = this.templateData.TemplateSections[i]
    let Clause =
      this.templateData.TemplateSections[i].TemplateClauses[j];

    let clause =
      '<div><span class="' +
      className +
      '" id="' +
      sectionUUID +
      '-' +
      clauseUUID +
      '" draggable="true" dir="' +
      sectionUUID +
      '-' +
      clauseUUID +
      '">' +
      `<span class="clause-num">${Section.Index}.${Clause.Index}</span>`+
      `<div class="clause-desc">${Clause.Description}</div>`+
      ' &nbsp; </span> </div>';

    editor.html.insert(clause);
    editor.events.focus();
    this.alertService.successPage('Clause Added in froala');
  }

  clauseDragStart(
    event: DragEvent,
    i,
    j,
    className,
    sectionUUID,
    clauseUUID,
    secName,
    clauseName
  ) {
    let data = {
      i,
      j,
      className,
      sectionUUID,
      clauseUUID,
      secName,
      clauseName,
    };
    this.dragData = event.target;
    this.dragData.data = data;
    event.dataTransfer.setData('clauseId', this.dragData.id);
  }

  sectionChange(sectionIndex) {
    // console.log("section change--",sectionIndex);
    // if(this.clauseEdit){
    if (this.documentData.Sections[sectionIndex].Clauses.length == 0) {
      this.addClause.indexMax = 1;
    } else {
      this.addClause.indexMax =
        this.documentData.Sections[sectionIndex].Clauses.length;
    }
    // }else{
    //   this.addClause.indexMax = this.templateData.TemplateSections[sectionIndex].TemplateClauses.length + 1
    // }
  }

  async editClauseSubmit() {
    let clauseIndex = this.addClause.clauseIndex;
    let sectionIndex = this.addClause.section;
    if (this.addClause.prevSection == sectionIndex) {
      let inSameClauseNameExist = await this.checkClauseNameExist(
        sectionIndex,
        clauseIndex,
        this.addClause.Name,
        true
      );

      if (inSameClauseNameExist) {
        this.alertService.error('This Clause Name Already Taken');
      } else {
        delete this.addClause.clauseIndex;
        delete this.addClause.section;
        delete this.addClause.indexMax;
        delete this.addClause.prevSection;

        this.documentData.Sections[sectionIndex].Clauses.splice(clauseIndex, 1);
        let InsertIndex = this.addClause.Index - 1;
        this.documentData.Sections[sectionIndex].Clauses.splice(
          InsertIndex,
          0,
          this.addClause
        );

        // this.documentData.Sections[sectionIndex].Clauses[clauseIndex] = this.addClause
        setTimeout(() => {
          this.setFieldInFroala();
        }, 500);
        this.alertService.successPage('Clause updated successfully');
        this.closeClause();
      }
    } else {
      let inDifferentClauseNameExist = await this.checkClauseNameExist(
        sectionIndex,
        clauseIndex,
        this.addClause.Name,
        false
      );

      if (inDifferentClauseNameExist) {
        this.alertService.error('This Clause Name Already Taken');
      } else {
        let previousIndex = this.addClause.prevSection;
        if (
          previousIndex > 0 ||
          previousIndex !== null ||
          previousIndex !== undefined
        ) {
          this.documentData.Sections[previousIndex].Clauses.splice(
            clauseIndex,
            1
          );
        }
        delete this.addClause.clauseIndex;
        delete this.addClause.section;
        delete this.addClause.indexMax;
        delete this.addClause.prevSection;

        this.documentData.Sections[sectionIndex].Clauses.push(this.addClause);
        this.alertService.successPage('Clause updated successfully');
        this.setFieldInFroala();
        this.closeClause();
      }
    }
  }

  // check Clause Name is Exist or not
  checkClauseNameExist(secIndex, clauseIndex, newClauseName, InSameSection) {
    let clauses = this.documentData.Sections[secIndex].Clauses;

    let exist = false;

    let clauseName = newClauseName.split(' ').join('');

    for (var i = 0; i < clauses.length; i++) {
      let lpClauseName = clauses[i].Name.split(' ').join('');
      if (InSameSection && i == clauseIndex) {
      } else {
        if (lpClauseName == clauseName) {
          exist = true;
        }
      }
    }

    return exist;
  }

  sectionCheckboxChange(value, index, section) {
    this.documentData.Sections[index].IsAdded = value;

    for (let i = 0; i < section.Clauses.length; i++) {
      this.documentData.Sections[index].Clauses[i].IsAdded = value;
    }
    if (value == true) {
      this.addsectionInFroala(
        index,
        'sections',
        section,
        section.Name,
        section.UUID
      );
    } else {
      this.removeSectionFromFroala(index, section.Name, section.UUID);
    }
  }

  clauseCheckboxChange(value, secIndex, clauseIndex, section, clause) {
    this.documentData.Sections[secIndex].Clauses[clauseIndex].IsAdded = value;

    let xyz = this.documentData.Sections[secIndex].Clauses.filter(
      (xx) => xx.IsAdded == true
    );

    if (xyz.length == this.documentData.Sections[secIndex].Clauses.length) {
      this.documentData.Sections[secIndex].IsAdded = true;
    }
    if (xyz.length !== this.documentData.Sections[secIndex].Clauses.length) {
      this.documentData.Sections[secIndex].IsAdded = false;
    }

    if (value) {
      this.addClauseInFroala(
        secIndex,
        clauseIndex,
        'clauses',
        section.UUID,
        clause.UUID,
        section.Name,
        clause.Name
      );
    } else {
      this.removeClauseFromFroala(section.UUID, clause.UUID);
    }
  }

  setDifaultClause() {
    var secIndex = this.addClause.section;
    var clauseIndex = this.addClause.clauseIndex;
    var clauseId = this.addClause.Id;

    let clauseData = this.templateData.TemplateSections[
      secIndex
    ].TemplateClauses.find((c) => {
      if (c.Id == clauseId) {
        return c;
      }
    });

    if (clauseData) {
      this.addClause.Description = clauseData.Description;
      this.clauseEditor.html.set(this.addClause.Description);

    }
  }

  removeSectionFromFroala(index, secName, secUUID) {
    let editor = this.editor;
    var doc = new DOMParser().parseFromString(editor.html.get(), 'text/html');
    // console.log("Section id exist::---",doc.getElementById(secName+"-"+secUUID));

    if (doc.getElementById(secName + '-' + secUUID)) {
      doc.getElementById(secName + '-' + secUUID).remove();
      this.documentData.Content = doc.body.outerHTML;
    }

    let Clauses = this.documentData.Sections[index].Clauses;

    for (var i = 0; i < Clauses.length; i++) {
      if (doc.getElementById(secUUID + '-' + Clauses[i].UUID)) {
        doc.getElementById(secUUID + '-' + Clauses[i].UUID).remove();

        // var rmCls = doc.getElementById(secUUID + "-" + Clauses[i].UUID)
        // rmCls.parentNode.removeChild(rmCls)
      }
    }

    this.documentData.Content = doc.body.outerHTML;
  }

  removeClauseFromFroala(secUUID, ClauseUUID) {
    let editor = this.editor;
    var doc = new DOMParser().parseFromString(editor.html.get(), 'text/html');
    // console.log("caluse id exist::---",doc.getElementById(secUUID+"-"+ClauseUUID));

    if (doc.getElementById(secUUID + '-' + ClauseUUID)) {
      doc.getElementById(secUUID + '-' + ClauseUUID).remove();

      // var rmCls = doc.getElementById(secUUID+"-"+ClauseUUID)
      // rmCls.parentNode.removeChild(rmCls)

      this.documentData.Content = doc.body.outerHTML;
    }
  }

  //------------------------------------ Attach Section ------------------------------------

  fileOver(event) {
    this.fileDrag = true;
    $('.drag-file-sec').addClass('border');
  }

  fileLeave(event) {
    if ($('.drag-file-sec').hasClass('border')) {
      $('.drag-file-sec').removeClass('border');
    }
  }

  public async dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    //set class
    if ($('.drag-file-sec').hasClass('border')) {
      $('.drag-file-sec').removeClass('border');
      $('.drag-file-sec').addClass('uploading-bg');
    } else {
      $('.drag-file-sec').addClass('uploading-bg');
    }

    var formData: any = new FormData();
    let multiple = false;
    if (files.length > 1) {
      multiple = true;
    }

    //calculate uploaded File less than 10MB
    var up_fileSize = 0;

    for (var c = 0; c < files.length; c++) {
      const up_File = files[c];

      if (up_File.fileEntry.isFile) {
        const up_FileEntry = (await up_File.fileEntry) as FileSystemFileEntry;
        up_FileEntry.file(async (file: File) => {
          up_fileSize += file.size / 1024;
        });
      }
    }


    // check total File less than 10MB
    if (this.attachedFileSize + up_fileSize >= 10240) {
      this.alertService.error('Files size greater than 10 MB');
      if ($('.drag-file-sec').hasClass('uploading-bg')) {
        $('.drag-file-sec').removeClass('uploading-bg');
      }
    } else {
      // for (const droppedFile of files) {
      for (var i = 0; i < files.length; i++) {
        const droppedFile = files[i];

        // Is it a file?
        if (droppedFile.fileEntry.isFile) {
          const fileEntry =
            (await droppedFile.fileEntry) as FileSystemFileEntry;
          let fileDd: any = await this.getFile(fileEntry);
          if (fileDd.success) {
            if (i == 0) {
              formData.append('file', fileDd.file);
            } else {
              formData.append(`file${i}`, fileDd.file);
            }
          }
        } else {
          // It was a directory (empty directories are added, otherwise only files)
          const fileEntry =
            (await droppedFile.fileEntry) as FileSystemDirectoryEntry;
        }
      }
      this.spinner.show();
      this.templateService.uploadFile(formData).subscribe(
        (res) => {
          this.spinner.hide();
          this.alertService.successPage(
            `${multiple ? 'Files' : 'File'} added sucessfully`
          );
          for (var i = 0; i < res.length; i++) {
            // res[i].Id = 0
            let fileRes = {
              Id: 0,
              FileName: res[i].FileName,
              FilePath: res[i].Url,
              Size: res[i].FileSize,
            };
            this.documentData.Attachments.push(fileRes);
          }

          // calculate Attachment Size
          this.calculateAttechmentSize();
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );

      //remove
      if ($('.drag-file-sec').hasClass('uploading-bg')) {
        $('.drag-file-sec').removeClass('uploading-bg');
      }
    }
  }

  async getFile(fileEntry) {
    return new Promise(async (resolve) => {
      fileEntry.file(async (file: File) => {
        let validFileType = await this.isFileTypeAllowed(file.name);
        if (validFileType) {
          let dd = {
            success: true,
            file: file,
            message: '',
          };
          resolve(dd);
        } else {
          let fileTypeError = {
            success: false,
            message: `${file.name} file is not pdf`,
          };
          resolve(fileTypeError);
        }
      });
    });
  }

  isFileTypeAllowed(fileName: string) {
    let isFileAllowed = false;
    const allowedFiles = ['.pdf'];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      for (const ext of allowedFiles) {
        if (ext === extension[0]) {
          isFileAllowed = true;
        }
      }
    }
    return isFileAllowed;
  }

  deleteFile(index) {
    let file = this.documentData.Attachments[index].FilePath;
    let request = {
      Url: file,
    };

    // this.spinner.show()
    // this.templateService.deleteFile(request).subscribe(res => {
    //   this.spinner.hide()
    this.documentData.Attachments.splice(index, 1);

    // calculate Attachment Size
    this.calculateAttechmentSize();

    //   this.alertService.successPage(res)
    // },error => {
    //   this.spinner.hide()
    //   this.alertService.error(error.Message)
    // })
  }

  calculateAttechmentSize() {
    var size = 0;
    for (var i = 0; i < this.documentData.Attachments.length; i++) {

      size += parseFloat(this.documentData.Attachments[i].Size);
    }

    this.attachedFileSize = size;
  }

  calculateKbToMb(size) {
    var mb = size / 1024;
    return mb.toFixed(2);
  }

  //------------------------Update Field Value In Froala Content ----------------------------
  setFieldInFroala() {
    var doc = new DOMParser().parseFromString(
      this.editor.html.get(),
      'text/html'
    );
    // var doc = this.editor.html.get()
    let froalaPartysFields = doc.getElementsByClassName('partyFields');
    let froalaCustomPartysFields = doc.getElementsByClassName('customFields');
    var froalasectionFields = Array.from(doc.getElementsByClassName('sections')) ;
    froalasectionFields.slice(0)
    let froalaClauseFields = doc.getElementsByClassName('clauses');
    let froalaPropertyMeFields = doc.getElementsByClassName('propertyMeFields');
    // console.log("Froala Partys Fields---",froalaPartysFields);
    // console.log("Froala Custom Partys Fields---",froalaCustomPartysFields);

    // --------- Delete Clause
    let del_temp_Clause = doc.getElementsByClassName('delete_clause');

    // while(doc.getElementsByClassName("delete_clause")[0]){
    //   // del_temp_Clause[0].parentNode.removeChild(del_temp_Clause[0]);
    //   console.log("Remove clause:---  ",doc.getElementsByClassName("delete_clause")[0])
    //   doc.getElementsByClassName("delete_clause")[0].parentNode.removeChild(doc.getElementsByClassName("delete_clause")[0]);
    //   doc.getElementsByClassName("delete_clause")[0]
    // }

    for (var i = 0; i < froalaPartysFields.length; i++) {
      let dir_str = froalaPartysFields[i].attributes['dir'].value;
      let spl_dir = dir_str.split('-%n%-');

      if (spl_dir[0] && spl_dir[1]) {
        let partyData = this.documentData.Parties.find((p_field) => {
          if (p_field.UUID == spl_dir[0]) {
            return p_field;
          }
        });
        if (partyData) {
          let froalaFieldId = '';
          let fieldValue = '';
          let isImage = false

          // First Name
          if (spl_dir[1] == 12) {
            froalaFieldId = partyData.PartyName + '-' + 'First Name';
            fieldValue = partyData.DocumentPartyContact[0]
              ? partyData.DocumentPartyContact[0].FirstName
              : '';
          }

          // Last Name
          if (spl_dir[1] == 13) {
            froalaFieldId = partyData.PartyName + '-' + 'Last Name';
            fieldValue = partyData.DocumentPartyContact[0]
              ? partyData.DocumentPartyContact[0].LastName
              : '';
          }

          // Email
          if (spl_dir[1] == 14) {
            froalaFieldId = partyData.PartyName + '-' + 'Email';
            fieldValue = partyData.DocumentPartyContact[0]
              ? partyData.DocumentPartyContact[0].Email
              : '';
          }

          // Mobile
          if (spl_dir[1] == 15) {
            froalaFieldId = partyData.PartyName + '-' + 'Mobile';
            fieldValue = partyData.DocumentPartyContact[0]
              ? partyData.DocumentPartyContact[0].Phone
              : '';
          }

          //Company
          if (spl_dir[1] == 16) {
            froalaFieldId = partyData.PartyName + '-' + 'Company';
            fieldValue = partyData.DocumentPartyContact[0] && partyData.DocumentPartyContact[0].Company ? partyData.DocumentPartyContact[0].Company : '';
          }

          //Position
          if (spl_dir[1] == 17) {
            froalaFieldId = partyData.PartyName + '-' + 'Position';
            fieldValue = partyData.DocumentPartyContact[0].Position;
          }

          //Phone
          if (spl_dir[1] == 18) {
            froalaFieldId = partyData.PartyName + '-' + 'Phone';
            fieldValue = '';
          }

          // Signature
          if (spl_dir[1] == 19) {
            froalaFieldId = partyData.PartyName + '-' + 'Signature';
            fieldValue = '';
          }

          // Home Phone
          if (spl_dir[1] == 20) {
            froalaFieldId = partyData.PartyName + '-' + 'Home Phone';
            fieldValue = partyData.DocumentPartyContact[0] && partyData.DocumentPartyContact[0].HomePhone ? partyData.DocumentPartyContact[0].HomePhone : '';
          }

          // Work Phone
          if (spl_dir[1] == 21) {
            froalaFieldId = partyData.PartyName + '-' + 'Work Phone';
            fieldValue = partyData.DocumentPartyContact[0] && partyData.DocumentPartyContact[0].HomePhone ? partyData.DocumentPartyContact[0].HomePhone : '';
          }

          // Physical Address
          if (spl_dir[1] == 22) {
            froalaFieldId = partyData.PartyName + '-' + 'Physical Address';
            fieldValue = partyData.DocumentPartyContact[0] && partyData.DocumentPartyContact[0].PhysicalAddress ? partyData.DocumentPartyContact[0].PhysicalAddress : '';
          }

          //Update Value In Froala
          if (froalaFieldId && fieldValue) {
            // doc.getElementById(froalaFieldId).innerHTML = fieldValue;

            //new implementation
            // var elms = document.querySelectorAll("[id='duplicateID']");
            var elms = doc.querySelectorAll(`[id='${froalaFieldId}']`);
            for(var f = 0; f < elms.length; f++){
              elms[f].innerHTML = fieldValue;
            }
          }
        }
      }
    }

    for (var j = 0; j < froalaCustomPartysFields.length; j++) {
      let dir_str = froalaCustomPartysFields[j].attributes['dir'].value;
      let spl_dir = dir_str.split('-%n%-');

      if (spl_dir[0] && spl_dir[1]) {
        // console.log('spl_dir[0]---', spl_dir[0]);
        let partyData = this.documentData.Parties.find((p_field) => {
          if (p_field.UUID == spl_dir[0]) {
            return p_field;
          }
        });
        if (partyData) {
          let froalaFieldId = '';
          let fieldValue = '';
          let isImage = false

          let customPartys = partyData.CustomFields.find((c_field) => {
            if (c_field.FieldTypeId == spl_dir[1]) {
              return c_field;
            } else if (c_field.UUID == spl_dir[1]) {
              return c_field;
            } else {
              return undefined;
            }
          });
          // console.log("---------- Custom Party -----------", customPartys);
          if (customPartys) {
            froalaFieldId = partyData.PartyName + '-' + customPartys.Name;
            fieldValue = customPartys.Value;

            if(customPartys.FieldTypeId == this.constant.ImageFieldTypeId){
              isImage = true
            }
          }

          if (froalaFieldId && fieldValue) {
            // console.log('Froala custome field', fieldValue);

            if(!isImage){
              // doc.getElementById(froalaFieldId).innerHTML = fieldValue;

              var cust_elms = doc.querySelectorAll(`[id='${froalaFieldId}']`);
              for(var ce = 0; ce < cust_elms.length; ce++){
                cust_elms[ce].innerHTML = fieldValue;
              }
            } else {
              // var imageTag = `<img style="height: 15%; width: 20%;" src="${fieldValue}" />`
              // doc.getElementById(froalaFieldId).style.padding = '0px';
              // doc.getElementById(froalaFieldId).style.border = '0px'
              // doc.getElementById(froalaFieldId).innerHTML = imageTag

              var imageTag = `<img style="height: 105px; width: 273px; object-fit:cover;" src="${fieldValue}" />`;
              var cust_elms_i : NodeListOf<Element> = doc.querySelectorAll(`[id='${froalaFieldId}']`);
              for(var cei = 0; cei < cust_elms_i.length; cei++){
                cust_elms_i[cei].setAttribute('style', 'padding: 0px; border: 0px');
                cust_elms_i[cei].innerHTML = imageTag;
              }
            }

          }
        }
      }
    }

    for (var k = 0; k < froalasectionFields.length; k++) {
      // let clauses_content = '';
      // let dir_str = froalasectionFields[k].attributes['dir'].value;
      // // let spl_dir = dir_str.split("-%n%-");
      // // console.log("custom_SectionId--"+spl_dir[0]+".  custom_ClauseId----"+spl_dir[1]);
      // let temp_sect_cls;
      // if(this.documentData.Sections[dir_str].Clauses){
      //   temp_sect_cls = this.documentData.Sections[dir_str].Clauses;
      // }else{
      //   temp_sect_cls = this.documentData.Sections[dir_str].TemplateClauses;
      // }
      // console.log("temp_sect_cls---",temp_sect_cls);
      // for(let j= 0;j<temp_sect_cls.length;j++){
      //   clauses_content += temp_sect_cls[j].Description+'<br>';
      // }

      // let secId = this.documentData.Sections[dir_str].Name+'-'+dir_str
      // doc.getElementById(secId).innerHTML = clauses_content;

      let dir_str = froalasectionFields[k].attributes['dir'].value;
      // console.log('Section dir---', dir_str);
      let section = this.documentData.Sections.find((sec) => {
        if (sec.UUID == dir_str) {
          return sec;
        }
      });

      if (section) {
        // let clauses_content = '';
        // if(section.Clauses && section.Clauses.length > 0){
        //   for(var s=0 ; s < section.Clauses.length;s++){
        //     clauses_content += section.Clauses[s].Description+ '<br>';
        //     // clauses_content += "<span class=\"clauses\" id=\""+section.UUID+"-"+section.Clauses[s].UUID+"\" dir=\""+section.UUID+"-"+section.Clauses[s].UUID+"\"> "+section.Clauses[s].Description+" </span> </br>"
        //   }

        //   let secId = section.Name+'-'+section.UUID
        //   doc.getElementById(secId).innerHTML = clauses_content;
        // }

        doc.getElementById(section.Name + '-' + section.UUID).remove();
      }
    }

    // console.log('Clauses fields ::---', froalaClauseFields);
    for (var l = 0; l < froalaClauseFields.length; l++) {
      let dir_str = froalaClauseFields[l].attributes['dir'].value;
      // console.log('Clause dir str :----', dir_str);
      let spl_dir = dir_str.split('-%n%-');

      if (spl_dir[0] && spl_dir[1]) {
        let section = this.documentData.Sections.find((sec) => {
          if (sec.UUID == spl_dir[0]) {
            return sec;
          }
        });
        // console.log('Split dir::---' + spl_dir[0] + ' - ' + spl_dir[1]);

        if (section) {
          let clause = section.Clauses.find((cls) => {
            if (cls.UUID == spl_dir[1]) {
              return cls;
            }
          });

          // console.log('Clause Exist:-----', clause.Description);
          if (clause) {
            // console.log("Clause Exist with"+spl_dir[0] + " - "+ spl_dir[1])
            //var clauses_content = "<span class=\"clauses\" id=\"" + spl_dir[0] + "-" + spl_dir[1] + "\" dir=\"" + spl_dir[0] + "-%n%-" + spl_dir[1] + "\"> " + clause.Description + " </span> </br>"
            //doc.getElementById(spl_dir[0] + "-" + spl_dir[1]).outerHTML = clauses_content;

            doc.getElementById(spl_dir[0] + '-' + spl_dir[1]).innerHTML = `<span class="clause-num">${section.Index}.${clause.Index}</span> <div class="clause-desc">${clause.Description}</div>` ;

            // let spn = doc.getElementById(spl_dir[0] + "-" + spl_dir[1])
            // spn.appendChild(clause.Description);
          }
        }
      }
    }
    // console.log("Updated Document----",doc.body.outerHTML);
    // this.editor.html = doc.body
    // this.documentData.Content = doc.body

    for(var m = 0; m < froalaPropertyMeFields.length; m++){
      let prop_dir_str = froalaPropertyMeFields[m].attributes['dir'].value;
      // console.log('PropertyMe dir str :----', prop_dir_str);
      let prop_spl_dir = prop_dir_str.split('-%n%-');

      var rmSpace = prop_spl_dir[0].replace(/ /g,'');
      rmSpace = rmSpace.trim()
      // console.log("rmSpace - "+rmSpace+"--"+prop_spl_dir[0])

      if(rmSpace && rmSpace in this.propertyMeData){
        // console.log("rm space value ::---",this.propertyMeData[rmSpace]);

        var prop_field_elms = doc.querySelectorAll(`[id='${prop_spl_dir[0]}-${prop_spl_dir[1]}']`);
        for(var f = 0; f < prop_field_elms.length; f++) {
          // prop_field_elms[f].innerHTML = fieldValue;

          prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace]

          if(rmSpace == 'Address'){
            prop_field_elms[f].innerHTML = this.propertyMeData['AddressText']
          }

          if(rmSpace == 'AgreementEndDate'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'AgreementStartDate'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'ContractExchangeDate'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'CreatedOn'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'DepositDueDate'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'SettlementDate'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          //----------- for tenant

          if(rmSpace == 'AgreementEnd'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'AgreementStart'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'EffectivePaidTo'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'NextReviewDate'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'PaidTo'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'TenancyEnd'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          if(rmSpace == 'TenancyStart'){
            prop_field_elms[f].innerHTML = this.propertyMeData[rmSpace] ? moment(this.propertyMeData[rmSpace]).format('DD MMM YYYY') : this.propertyMeData[rmSpace]
          }

          //---------------------- For Price/Amount ----------------------------------
          if(rmSpace == 'AskingPrice'){
            // console.log("Asking Price :---------",this.propertyMeData[rmSpace])
            let price = Number(this.propertyMeData[rmSpace])
            prop_field_elms[f].innerHTML = this.formatter.format(price)
          }

          if(rmSpace == 'CommissionAmount'){
            let price = Number(this.propertyMeData[rmSpace])
            prop_field_elms[f].innerHTML = this.formatter.format(price)
          }

          if(rmSpace == 'PurchasePrice'){
            let price = Number(this.propertyMeData[rmSpace])
            prop_field_elms[f].innerHTML = this.formatter.format(price)
          }

          //---------- for tenant

          if(rmSpace == 'BondAmount'){
            let price = Number(this.propertyMeData[rmSpace])
            prop_field_elms[f].innerHTML = this.formatter.format(price)
          }

          if(rmSpace == 'PartPaid'){
            let price = Number(this.propertyMeData[rmSpace])
            prop_field_elms[f].innerHTML = this.formatter.format(price)
          }

          if(rmSpace == 'RentAmount'){
            let price = Number(this.propertyMeData[rmSpace])
            prop_field_elms[f].innerHTML = this.formatter.format(price)
          }
        }
      }else{
        if(rmSpace == 'PropertyType' && 'PropertySubtype' in this.propertyMeData){
          var prop_field_propSubType_elms = doc.querySelectorAll(`[id='${prop_spl_dir[0]}-${prop_spl_dir[1]}']`);
          for(var pr_s = 0; pr_s < prop_field_propSubType_elms.length; pr_s++) {
            prop_field_propSubType_elms[pr_s].innerHTML = this.propertyMeData['PropertySubtype']
          }
          // doc.getElementById(prop_spl_dir[0] + '-' + prop_spl_dir[1]).innerHTML = this.propertyMeData['PropertySubtype']
        }

        if(rmSpace == 'CategoryRural'){
          var prop_field_cat_rule_elms = doc.querySelectorAll(`[id='${prop_spl_dir[0]}-${prop_spl_dir[1]}']`);
          for(var pr_cat = 0; pr_cat < prop_field_cat_rule_elms.length; pr_cat++) {
            prop_field_cat_rule_elms[pr_cat].innerHTML = this.propertyMeData['PropertySubtype']
          }

          // doc.getElementById(prop_spl_dir[0] + '-' + prop_spl_dir[1]).innerHTML = this.propertyMeData['RuralCategory']
        }

        if(rmSpace == 'PricePurchasePrice'){

          var prop_field_p_price_elms = doc.querySelectorAll(`[id='${prop_spl_dir[0]}-${prop_spl_dir[1]}']`);
          for(var p_p = 0; p_p < prop_field_p_price_elms.length; p_p++) {
            let price = Number(this.propertyMeData['PurchasePrice'])
            prop_field_p_price_elms[p_p].innerHTML = this.formatter.format(price)
          }

          // let price = Number(this.propertyMeData['PurchasePrice'])
          // doc.getElementById(prop_spl_dir[0] + '-' + prop_spl_dir[1]).innerHTML = this.formatter.format(price)
        }
      }

    }

    this.editor.html.set(doc.body.outerHTML);

    return true;
  }

  // Set Footer required Field percentage
  calculateFooterFields() {
    let totalRequiredFields = 0;
    let fillFields = 0;
    let remainingFields = 0;
    let percentage = 100;

    //For CustomFields
    let totalCustomFields = 0;
    let fillCustomFields = 0;
    let remainingCustomFields = 0;
    for (var i = 0; i < this.documentData.Parties.length; i++) {
      if (
        this.documentData.Parties[i].PartyTypeId == 8 ||
        this.documentData.Parties[i].PartyTypeId == 9
      ) {
        totalRequiredFields += 1;

        if (
          this.documentData.Parties[i].DocumentPartyContact[0] &&
          this.documentData.Parties[i].DocumentPartyContact[0].FirstName &&
          this.documentData.Parties[i].DocumentPartyContact[0].LastName
        ) {
          fillFields += 1;
        }
      }

      if (
        this.documentData.Parties[i].PartyTypeId !== 8 &&
        this.documentData.Parties[i].PartyTypeId !== 9 &&
        this.documentData.Parties[i].Mandatory
      ) {
        totalRequiredFields += 1;

        if (
          this.documentData.Parties[i].DocumentPartyContact[0] &&
          this.documentData.Parties[i].DocumentPartyContact[0].FirstName &&
          this.documentData.Parties[i].DocumentPartyContact[0].LastName
        ) {
          fillFields += 1;
        }
      }

      // Calculation of custom field For sender only
      if (this.documentData.Parties[i].PartyTypeId == 9) {
        for (
          var j = 0;
          j < this.documentData.Parties[i].CustomFields.length;
          j++
        ) {
          if (this.documentData.Parties[i].CustomFields[j].Mandatory) {
            totalCustomFields += 1;

            if (
              this.createDoc[
                this.documentData.Parties[i].PartyName +
                  '-' +
                  this.documentData.Parties[i].CustomFields[j].Name
              ]
            ) {
              fillCustomFields += 1;
            }
          }
        }
      }
    }


    remainingFields = totalRequiredFields - fillFields;
    remainingCustomFields = totalCustomFields - fillCustomFields;
    if (fillFields == 0 && fillCustomFields == 0) {
      percentage = 0;
    } else {
      // percentage = (fillFields * 100) / totalRequiredFields;

      let totalFieldAndParty = totalRequiredFields + totalCustomFields;
      let totalFillFieldAndParty = fillFields + fillCustomFields;

      percentage = (totalFillFieldAndParty * 100) / totalFieldAndParty;
    }


    this.mandatoryPercentage = Number(percentage.toFixed(2));
    this.mandatoryRemain = remainingFields;
    this.mandatoryRemainCustomField = remainingCustomFields;
  }

  // preview
  showPreview() {
    var doc = new DOMParser().parseFromString(
      this.editor.html.get(),
      'text/html'
    );
    // var doc = this.editor.html.get()
    let froalaPartysFields = doc.getElementsByClassName('partyFields');
    let froalaCustomPartysFields = doc.getElementsByClassName('customFields');
    let froalasectionFields = doc.getElementsByClassName('sections');
    let froalaClauseFields = doc.getElementsByClassName('clauses');

    for (var i = 0; i < froalaPartysFields.length; i++) {
      let dir_str = froalaPartysFields[i].attributes['dir'].value;
      let spl_dir = dir_str.split('-%n%-');

      if (spl_dir[0] && spl_dir[1]) {
        let partyData = this.documentData.Parties.find((p_field) => {
          if (p_field.UUID == spl_dir[0]) {
            return p_field;
          }
        });
        if (partyData) {
          let froalaFieldId = '';
          let fieldValue = '';

          // First Name
          if (spl_dir[1] == 12) {
            froalaFieldId = partyData.PartyName + '-' + 'First Name';
            fieldValue = partyData.DocumentPartyContact[0].FirstName;
          }

          // Last Name
          if (spl_dir[1] == 13) {
            froalaFieldId = partyData.PartyName + '-' + 'Last Name';
            fieldValue = partyData.DocumentPartyContact[0].LastName;
          }

          // Email
          if (spl_dir[1] == 14) {
            froalaFieldId = partyData.PartyName + '-' + 'Email';
            fieldValue = partyData.DocumentPartyContact[0].Email;
          }

          // Mobile
          if (spl_dir[1] == 15) {
            froalaFieldId = partyData.PartyName + '-' + 'Mobile';
            fieldValue = partyData.DocumentPartyContact[0].Phone;
          }

          //Company
          if (spl_dir[1] == 16) {
            froalaFieldId = partyData.PartyName + '-' + 'Company';
            fieldValue = partyData.DocumentPartyContact[0] && partyData.DocumentPartyContact[0].Company ? partyData.DocumentPartyContact[0].Company : '';
          }

          //Position
          if (spl_dir[1] == 17) {
            froalaFieldId = partyData.PartyName + '-' + 'Position';
            fieldValue = partyData.DocumentPartyContact[0].Position;
          }

          //Phone
          if (spl_dir[1] == 18) {
            froalaFieldId = partyData.PartyName + '-' + 'Phone';
            fieldValue = '';
          }

          // Signature
          if (spl_dir[1] == 19) {
            froalaFieldId = partyData.PartyName + '-' + 'Signature';
            fieldValue = '';
          }

          // Home Phone
          if (spl_dir[1] == 20) {
            froalaFieldId = partyData.PartyName + '-' + 'Home Phone';
            fieldValue = partyData.DocumentPartyContact[0] && partyData.DocumentPartyContact[0].HomePhone ? partyData.DocumentPartyContact[0].HomePhone : '';
          }

          // Work Phone
          if (spl_dir[1] == 21) {
            froalaFieldId = partyData.PartyName + '-' + 'Work Phone';
            fieldValue = partyData.DocumentPartyContact[0] && partyData.DocumentPartyContact[0].HomePhone ? partyData.DocumentPartyContact[0].HomePhone : '';
          }

          // Physical Address
          if (spl_dir[1] == 22) {
            froalaFieldId = partyData.PartyName + '-' + 'Physical Address';
            fieldValue = partyData.DocumentPartyContact[0] && partyData.DocumentPartyContact[0].PhysicalAddress ? partyData.DocumentPartyContact[0].PhysicalAddress : '';
          }

          //Update Value In Froala
          if (froalaFieldId && fieldValue) {
            // doc.getElementById(froalaFieldId).innerHTML = fieldValue;

            //new implementation
            // var elms = document.querySelectorAll("[id='duplicateID']");
            var elms = doc.querySelectorAll(`[id='${froalaFieldId}']`);
            for(var f = 0; f < elms.length; f++){
              elms[f].innerHTML = fieldValue;
            }
          }
        }
      }
    }

    for (var j = 0; j < froalaCustomPartysFields.length; j++) {
      let dir_str = froalaCustomPartysFields[j].attributes['dir'].value;
      let spl_dir = dir_str.split('-%n%-');

      if (spl_dir[0] && spl_dir[1]) {
        let partyData = this.documentData.Parties.find((p_field) => {
          if (p_field.UUID == spl_dir[0]) {
            return p_field;
          }
        });
        if (partyData) {
          let froalaFieldId = '';
          let fieldValue = '';
          let isImage = false

          let customPartys = partyData.CustomFields.find((c_field) => {
            if (c_field.FieldTypeId == spl_dir[1]) {
              return c_field;
            } else if (c_field.UUID == spl_dir[1]) {
              return c_field;
            } else {
              return undefined;
            }
          });
          if (customPartys) {
            froalaFieldId = partyData.PartyName + '-' + customPartys.Name;
            fieldValue = customPartys.Value;

            if(customPartys.FieldTypeId == this.constant.ImageFieldTypeId){
              isImage = true
            }
          }

          if(!isImage){
            // doc.getElementById(froalaFieldId).innerHTML = fieldValue;

            var cust_elms = doc.querySelectorAll(`[id='${froalaFieldId}']`);
            for(var ce = 0; ce < cust_elms.length; ce++){
              cust_elms[ce].innerHTML = fieldValue;
            }
          } else {
            // var imageTag = `<img style="height: 15%; width: 20%;" src="${fieldValue}" />`
            // doc.getElementById(froalaFieldId).style.padding = '0px';
            // doc.getElementById(froalaFieldId).style.border = '0px'
            // doc.getElementById(froalaFieldId).innerHTML = imageTag

            var imageTag = `<img style="height: 105px; width: 273px; object-fit:cover;" src="${fieldValue}" />`;
            var cust_elms_i : NodeListOf<Element> = doc.querySelectorAll(`[id='${froalaFieldId}']`);
            for(var cei = 0; cei < cust_elms_i.length; cei++){
              cust_elms_i[cei].setAttribute('style', 'padding: 0px; border: 0px');
              cust_elms_i[cei].innerHTML = imageTag;
            }
          }
        }
      }
    }

    for (var k = 0; k < froalasectionFields.length; k++) {
      let dir_str = froalasectionFields[k].attributes['dir'].value;
      // console.log("Section dir---",dir_str)
      let section = this.documentData.Sections.find((sec) => {
        if (sec.UUID == dir_str) {
          return sec;
        }
      });

      if (section) {
        let clauses_content = '';
        if (section.Clauses && section.Clauses.length > 0) {
          // for (var s = 0; s < section.Clauses.length; s++) {
          //   clauses_content += section.Clauses[s].Description + '<br>';
          // }

          let secId = section.Name + '-' + section.UUID;
          doc.getElementById(secId).innerHTML = clauses_content;
        }
      }
    }

    for (var l = 0; l < froalaClauseFields.length; l++) {
      let dir_str = froalaClauseFields[l].attributes['dir'].value;
      // console.log("Clause dir str :----",dir_str);
      let spl_dir = dir_str.split('-%n%-');

      if (spl_dir[0] && spl_dir[1]) {
        let section = this.documentData.Sections.find((sec) => {
          if (sec.UUID == spl_dir[0]) {
            return sec;
          }
        });
        // console.log("Split dir::---"+spl_dir[0] + " - "+ spl_dir[1])

        if (section) {
          let clause = section.Clauses.find((cls) => {
            if (cls.UUID == spl_dir[1]) {
              return cls;
            }
          });

          // console.log("Clause Exist:-----",clause.Description)
          if (clause) {
            doc.getElementById(spl_dir[0] + '-' + spl_dir[1]).innerHTML = `<span class="clause-num">${section.Index}.${clause.Index}</span> <div class="clause-desc">${clause.Description}</div>` ;
          }
        }
      }
    }

    // let section = document.getElementById('testDiv');
    let section = this.froalaEditor.nativeElement;
    // let section = doc.getElementsByTagName('BODY')[0] as any

    var selector: any = doc.querySelectorAll('*');

    var allTag = [];
    for (var sl = 0; sl < selector.length; sl++) {
      allTag.push(selector[sl].localName);
    }

    var fliterAllTags = allTag.filter((v, i, a) => a.indexOf(v) === i);

    for (var fTag = 0; fTag < fliterAllTags.length; fTag++) {
      doc.querySelectorAll(fliterAllTags[fTag]).forEach((tag) => {
        if (tag.style.textAlign == 'justify') {
          tag.style.textAlign = 'left';
        }
      });
    }

    this.preview = true;
    setTimeout(() => {
      this.previewContent = doc.body.outerHTML;
      let pdf = new jsPDF('p', 'pt', 'letter');
      // let pdf = new jsPDF('p','pt', [612, 792]);
      // let pdf = new jsPDF({
      //   orientation: "landscape",
      //   unit: "pt",
      //   format: [500,550]
      // });

      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.fromHTML(doc.body.outerHTML, 15, 0, {
        width: width - 20,
        height: height - 15,
        retina: true,
        pagesplit: true,
        margin: {
          top: 15,
          right: 15,
          bottom: 15,
          left: 15,
          useFor: 'page',
        },
      });

      var blobPDF = new Blob([pdf.output('blob')], { type: 'application/pdf' });
      var blobUrl = URL.createObjectURL(blobPDF);
      document.getElementById('convertToPdf').setAttribute('src', blobUrl);

      // ---------- new changes start
      // var iframe=document.createElement('iframe');
      // document.body.append(iframe);

      // var iframedoc=iframe.contentDocument||iframe.contentWindow.document;
      // $('body',$(iframedoc)).html(doc.body.outerHTML);

      // console.log("Body---",iframedoc.body)
      // html2canvas(iframedoc.body, {allowTaint : true}).then(_canvas => {
      //   let pdf = new jsPDF('p','pt','letter');
      //   var width = pdf.internal.pageSize.getWidth();
      //   var height = pdf.internal.pageSize.getHeight();

      //   console.log("Canvas:::::---",_canvas);
      //   var imgData = _canvas.toDataURL("image/png",0.9);
      //   pdf.addImage(imgData, 'JPEG',0, 0, width, height);

      //   console.log("PDF:-:-:-",pdf)

      //   var blobPDF = new Blob([pdf.output('blob')], { type : 'application/pdf'});
      //   var blobUrl = URL.createObjectURL(blobPDF);
      //   console.log("Blob Url::::----",blobUrl);
      //   document.getElementById('convertToPdf').setAttribute("src",blobUrl);

      // })

      // ------------------- Re new -----------

      // var iframe : any = document.getElementById('convertToPdf');
      // iframe.src = "data:text/html;charset=utf-8," + escape(doc.body.outerHTML)

      // var iframedoc = iframe.contentWindow.document.getElementsByTagName('body')[0];

      // console.log("Body---",iframedoc)
      // html2canvas(iframedoc.innerHTML, {allowTaint : true}).then(_canvas => {
      //   let pdf = new jsPDF('p','pt','letter');
      //   var width = pdf.internal.pageSize.getWidth();
      //   var height = pdf.internal.pageSize.getHeight();

      //   console.log("Canvas:::::---",_canvas);
      //   var imgData = _canvas.toDataURL("image/png",0.9);
      //   pdf.addImage(imgData, 'JPEG',0, 0, width, height);

      //   console.log("PDF:-:-:-",pdf)

      //   var blobPDF = new Blob([pdf.output('blob')], { type : 'application/pdf'});
      //   var blobUrl = URL.createObjectURL(blobPDF);
      //   console.log("Blob Url::::----",blobUrl);
      //   document.getElementById('convertToPdf').setAttribute("src",blobUrl);

      // })

      // -------------- Re new End ------------------

      // ---------- new changes end

      // scroll top
      window.scrollTo(0, 0);
    }, 300);
  }

  closePreview() {
    this.preview = false;
    this.previewContent = '';

    setTimeout(() => {
      this.setFieldInFroala();
    }, 500);
  }

  //Load script
  loadScript() {
    setTimeout(() => {
      $(document).ready(() => {
        $('.acc-expand').click(function (e) {
          e.preventDefault();
          var $this = $(this);
          if ($this.next().hasClass('show')) {
            $this.next().removeClass('show');
            $this.next().slideUp(350);
            $this.removeClass('open');
          } else {
            $('.acc-expand').removeClass('open');
            $('.acc-child').slideUp(350);
            $this.next().toggleClass('show');
            $this.next().slideDown(350);
            $this.addClass('open');
          }
        });
      });
    }, 100);
  }

  //------------- API functions -------
  getAllUsers() {
    let Groups = this.documentData.Groups;
    var groups = '';
    if (Groups && Groups.length > 0) {
      for (var i = 0; i < Groups.length; i++) {
        if (i == Groups.length - 1) {
          groups += Groups[i];
        } else {
          groups += Groups[i] + ',';
        }
      }
    } else {
      groups = null;
    }

    this.documentService.getAllUsers(this.accountNumber, '', groups).subscribe(
      (userData) => {
        var allUsersList = userData.Data;
        var MainAllUsersList = userData.Data;
        this.allUsersMain = MainAllUsersList.slice(0);
        this.allUsers = allUsersList;
      },
      (error) => {
        // console.log('Get Users Error---', error);
      }
    );
  }

  getAllUsers1(searchText) {
    let Groups = this.documentData.Groups;
    let groups = '';
    if (Groups && Groups.length > 0) {
      for (var i = 0; i < Groups.length; i++) {
        if (i == Groups.length - 1) {
          groups += Groups[i];
        } else {
          groups += Groups[i] + ',';
        }
      }
    } else {
    }

    // this.spinner.show();

    this.documentService
      .getAllUsers(this.accountNumber, searchText, groups)
      .subscribe(
        (userData) => {
          // this.spinner.hide();
          var allUsersList = userData.Data;
          var MainAllUsersList = userData.Data;
          this.allUsersMain = MainAllUsersList.slice(0);
          this.allUsers = allUsersList;
        },
        (error) => {
          // this.spinner.hide();
          // console.log('Get Users Error---', error);
        }
      );
  }

  getContacts(searchText) {
    this.documentService.getContacts(this.accountNumber, searchText).subscribe(
      (res) => {
        this.contactList = res;
      },
      (error) => {
        // console.log('Error In Get Contacts----', error);
      }
    );
  }

  async getDocumentData() {
    this.spinner.show();
    this.documentService.getDocumentDetailById(this.documentId).subscribe(
      async (data) => {
        this.spinner.hide();
        // this.documentData = data

        // this.propertyMeData = await this.getPropertyDetailUsingLotId(data.LotId);
        if (data.IsExpired) {
          this.IsExpired = true;
          this.editor.edit.off();
          this.alertService.error('This document has been expired');
        }


        //Set Partys In Order
        let partys = data.Parties.sort((a, b) => {
          if (a.Order > b.Order) {
            return 1;
          } else if (a.Order < b.Order) {
            return -1;
          } else {
            return 0;
          }
        });

        data.Parties = partys;
        this.documentData = data;
        // this.documentData.Content = this.documentContent
        this.documentData.Content = await this.getDocumentContent();
        this.templateId = this.documentData.TemplateId;

        if (
          this.documentData &&
          this.documentData.IsDraft &&
          this.documentData.IsDraft == true
        ) {
          this.title = true;
        } else {
          this.title = false;
        }

        this.setDocumentData();
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  getPropertyDetailUsingLotId(LotId){
    return new Promise((resolve) => {
      // this.propertyMeService.getPropertyDetailUsingLotId(this.accountNumber, LotId).subscribe(property => {
      //   resolve(property)
      // },error => {
      //   resolve(null)
      // })
      // console.log("PropertyMETypeID::---",this.documentData.PropertyMeTypeId)
      if(this.documentData.PropertyMeTypeId && this.documentData.PropertyMeTypeId == this.constant.PropertyMeTypeId_Rentals){
        this.propertyMeService.rentalPropertyMe(this.accountNumber).subscribe(rental_res => {
          if (rental_res.length > 0) {
            var rentalData = rental_res.find(rental => {
              if(rental.Id == LotId){
                return rental
              }
            });

            if(rentalData){
              // resolve(rentalData)

              //Checking Tenant is exist or not
              if(this.documentData.PartyTypeId == (this.constant.PartyTypeId_Rentals || this.constant.PartyTypeId_Rentals_Tenant)){

              } else {

              }

              this.propertyMeService.tenancyPropertyMe(this.accountNumber, LotId).subscribe(tenant_res => {
                if(tenant_res.length > 0){
                  var tenantData = tenant_res.find(tenant => {
                    if(tenant.ContactId == this.documentData.TenantId){
                      return tenant
                    }
                  })

                  if(tenantData){
                    const newItem = Object.assign({}, rentalData, tenantData);
                    resolve(newItem)
                  }else{
                    resolve(rentalData)
                  }
                }else{
                  resolve(rentalData)
                }
              },error => {
                resolve(rentalData)
              })

            }else{
              resolve(null)
            }
          } else {
            resolve(null)
          }
        })
      }

      if(this.documentData.PropertyMeTypeId && this.documentData.PropertyMeTypeId == this.constant.PropertyMeTypeId_Sales){
        this.propertyMeService.salerPropertyMe(this.accountNumber).subscribe(seller_res => {

          if(seller_res.length > 0){
            var sellerData = seller_res.find(seller => {
              if(seller.Id == LotId){
                return seller
              }
            })

            if(sellerData){
              resolve(sellerData)
            }else{
              resolve(null)
            }
          }else{
            resolve(null)
          }
        })
      }

      if(!this.documentData.PropertyMeTypeId){
        resolve(null)
      }
    })
  }

  getDocumentContent(){
    return new Promise((resolve) => {
      this.documentService.getDocumentContent(this.documentId).subscribe(res => {
        this.documentContent = res.Content

        // if(this.documentData){
        //   this.documentData.Content = res.Content
        // }
        // resolve(res)

        if (res.Content) {
          resolve(res.Content)
        } else {
          resolve('');
        }
      },error => {
        resolve('')
      })
    })
  }

  async sendDocumentData() {
    await this.setFieldInFroala();

    let latestDoc = {
      TemplateId: this.documentData.TemplateId,
      Id: this.documentData.Id ? this.documentData.Id : 0,
      DocumentNumber: this.documentData.DocumentNumber
        ? this.documentData.DocumentNumber
        : '',
      AccountId: this.accountNumber,
      Title: this.createDoc.Title,
      Property: this.createDoc.Property,
      LotId: this.createDoc.LotId,
      TenantId: this.createDoc.TenantId,
      Groups: this.createDoc.Groups,
      Tenancy: this.createDoc.Tenancy,
      ExpiryDays: this.documentData.ExpiryDays,
      // ExpiryDate : this.documentData.ExpiryDate ? this.documentData.ExpiryDate : '',
      // IsDraft : !this.documentData.IsDraft ? !this.documentData.IsDraft : true,
      IsLinked: this.documentData.IsLinked ? this.documentData.IsLinked : false,
      PartyTypeId : this.documentData.PartyTypeId,
      PropertyMeTypeId: this.documentData.PropertyMeTypeId,
      Reminders: this.documentData.Reminders,
      // Content : this.documentData.Content,
      Content: this.editor.html.get(),
      Attachments: this.documentData.Attachments,
      EmailBuilder: this.createDoc.EmailBuilder
        ? this.createDoc.EmailBuilder
        : { Subject: '', Body: '' },
      Sections: this.documentData.Sections,
      Parties: [],
    };
    for (var i = 0; i < this.documentData.Parties.length; i++) {
      // let party = this.documentData.Parties[i]
      let PartyFields = this.documentData.Parties[i].PartyFields;
      let TemplateFields = this.documentData.Parties[i].TemplateFields;

      for (
        var j = 0;
        j < this.documentData.Parties[i].CustomFields.length;
        j++
      ) {
        if (
          this.createDoc[
            `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
          ]
        ) {
          this.documentData.Parties[i].CustomFields[j].Value =
            this.createDoc[
              `${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`
            ];
        }
      }

      let CustomFields = this.documentData.Parties[i].CustomFields;

      let party = this.documentData.Parties[i];
      delete party.PartyFields;
      delete party.TemplateFields;
      delete party.CustomFields;

      party.Fields = [];
      party.CustomFields = CustomFields;
      party.DocumentPartyContact = [];
      if (this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]) {
        let docCustomPartyContactDetails =
          this.createDoc[`${this.documentData.Parties[i].PartyName}-details`];
        if (
          !docCustomPartyContactDetails.FirstName ||
          !docCustomPartyContactDetails.LastName ||
          !docCustomPartyContactDetails.Email
        ) {
          // Nothing to push
        } else {
          party.DocumentPartyContact.push(
            this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]
          );
        }
      }

      if(this.documentData.PropertyMeTypeId || this.documentData.IsLinked){
        // console.log("Document Party contact is there",party.DocumentPartyContact[0]);
        if(party.DocumentPartyContact[0]){
          latestDoc.Parties.push(party);
        }
      } else{
        latestDoc.Parties.push(party);
      }

    }

    var sendFieldData = this.sentDocField;

    latestDoc['SendDetail'] = this.sentDocField;

    // console.log('latest doc stringify ::----', JSON.stringify(latestDoc));
    this.spinner.show();

    let partys = latestDoc.Parties.sort((a, b) => {
      if (a.Order > b.Order) {
        return 1;
      } else if (a.Order < b.Order) {
        return -1;
      } else {
        return 0;
      }
    });

    for(var t=0; t < partys.length; t++){
      partys[t].Order = t;
    }

    // console.log(partys);
    // console.log("Latest Doc::---",latestDoc);

    this.documentService.sendDocuments(latestDoc).subscribe(
      (data) => {
        this.spinner.hide();
        if (data.WasSuccessful) {
          this.alertService.successPage(data.Messages);
          this.router.navigate(['/admin/home']);
        } else {
          this.sentDocField = sendFieldData;
          this.alertService.error(data.Messages);
        }
      },
      (error) => {
        this.spinner.hide();
        this.sentDocField = sendFieldData;
        this.alertService.error(error.Message);
      }
    );
  }

  toggleSidebar() {
    $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.page-content').toggleClass('page-expanded page-collapsed');
  }

  datePickerChange1(event, PartyName, customField, format) {
    // setTimeout(() => {
    //   console.log('date event 1:---', event.date);
    //   if(event !== 'Invalid date'){
    //     let nwDate = moment(event.date).format(format);
    //     // console.log("nW Date :: ",nwDate);
    //     this.createDoc[PartyName+'-'+customField] = nwDate
    //   }else{
    //     let nwDate = moment(this.createDoc[PartyName+'-'+customField]).format(format);
    //     this.createDoc[PartyName+'-'+customField] = nwDate
    //   }
    // }, 300)

    let nwDate = moment(event.date).format(format);

    this.createDoc[PartyName + '-' + customField] = nwDate;

    this.datePicker.api.close();

    this.calculateFooterFields();
  }

  datePickerChange2(event, PartyName, customField, format) {
    // setTimeout(() => {
    //   console.log('date event 2:---',event.date,"=-=",this.createDoc[PartyName+'-'+customField]);

    //   if(event !== 'Invalid date'){
    //     let nwDate = moment(event.date).format(format);
    //     this.createDoc[PartyName+'-'+customField] = nwDate
    //   }else {
    //     let nwDate = moment(this.createDoc[PartyName+'-'+customField]).format(format);
    //     console.log("Picker 2 :-::--",nwDate);
    //     this.createDoc[PartyName+'-'+customField] = nwDate
    //   }
    //   // console.log("nW Date :: ",nwDate);
    // }, 300)

    let nwDate = moment(event.date).format(format);

    this.createDoc[PartyName + '-' + customField] = nwDate;

    this.datePicker.api.close();

    this.calculateFooterFields();
  }
  datePickerChange3(event, PartyName, customField, format) {
    // setTimeout(() => {
    //   console.log('date event 3:---',event.date,"=-=",this.createDoc[PartyName+'-'+customField]," ("+format+")");
    //   // let nwDate = moment(event).format(format);
    //   // // var string = moment(event, 'DD/MM/YYYY').format(format)

    //   // // console.log("nW Date :: ",string);
    //   // this.createDoc[PartyName+'-'+customField] = nwDate
    //   if(event !== 'Invalid date'){
    //     let nwDate = moment(event.date).format(format);
    //     this.createDoc[PartyName+'-'+customField] = nwDate
    //   }
    //   else{
    //     let nwDate = moment(this.createDoc[PartyName+'-'+customField]).format(format);
    //     console.log("Picker 3 :-::--",nwDate);
    //     this.createDoc[PartyName+'-'+customField] = nwDate
    //   }
    // }, 300)

    let nwDate = moment(event.date).format(format);

    this.createDoc[PartyName + '-' + customField] = nwDate;

    this.datePicker.api.close();

    this.calculateFooterFields();
  }

  parseInJSON(data) {
    return JSON.parse(data);
  }

  insertPageBreaker() {
    FroalaEditor.DefineIcon('pageBreaker', { NAME: 'pageBreaker', SVG_KEY: 'pageBreaker' });
    FroalaEditor.RegisterCommand('pageBreaker', {
      title: 'Insert Page Break',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: function () {
        this.html.insert(`<p style="page-break-before: always"></p>`);
      },
    });
  }

  onImageChange(event, partyName, customFieldName, i, j){
    if(event.target.files[0]){
      var file = event.target.files[0];

      var size = file.size / 1024

      if(size > 2048){
        this.alertService.error('File size greater than 2 MB');
      } else {
        var formData: any = new FormData();
        formData.append('file', file);

        this.spinner.show();
        this.templateService.uploadFile(formData).subscribe((res) => {
          this.spinner.hide();
          if(res[0]) {
            this.createDoc[partyName+'-'+customFieldName] = res[0].Url
            this.documentData.Parties[i].CustomFields[j].Format = file.name
          }
        },error => {
          this.spinner.hide();
        })
      }
    }
  }
}
