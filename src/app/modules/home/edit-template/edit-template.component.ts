import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../../core/service/template.service';
import { SettingsService } from '../../../core/service/settings.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import FroalaEditor from 'froala-editor';
import { v4 as uuidv4 } from 'uuid';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { transition, style, animate, trigger } from '@angular/animations';
import { AlertService } from '../../../core/service/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CONSTANTS } from 'src/common/constants';
declare var $: any;

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class EditTemplateComponent implements OnInit {
  constant = CONSTANTS;
  @ViewChild('table') table;
  @ViewChild('froalaEditor') froalaEditor: ElementRef;
  @ViewChild('myDiv', { static: false }) public myDiv: ElementRef;
  pdfSrc: any;
  currentUser: any = {};

  // dateFormat: string[] = ["dd/mm/yyyy", "mm/dd/yyyy", "yyyy/mm/dd"];
  dateFormat: any = [
    {
      label: 'DD/MM/YYYY',
      value: 'dd/mm/yyyy',
    },
    {
      label: 'MM/DD/YYYY',
      value: 'mm/dd/yyyy',
    },
    {
      label: 'YYYY/MM/DD',
      value: 'yyyy/mm/dd',
    },
  ];
  // accountNumber : Number = (<any>window).activeAcountNumber;
  accountNumber: Number = Number(
    JSON.parse(localStorage.getItem('acccountNumber'))
  );

  companyProfileData: any = {};

  dragData: any;
  uploding: Boolean = false;
  editor;
  clauseEditor;
  allRoles = [];
  emailPlaceholder = '';
  emailBuilderEditor;
  editorContent: any = '';
  clauseContent = '';
  preview: boolean = false;
  previewContent = '';
  allPartyStatus: any;
  allPropertyMeTypes: any;
  clickedUpdateTemp: Boolean = false;
  clickedUpdateTemp_anim: Boolean = false;
  statusSet: any = 1;
  activeGroupsArray: Array<any> = [];
  propertyMeStatus: Boolean = true;
  disableEditTemplate: Boolean = false;
  disableField: any = 0;
  //------Main Froala editor
  config: Object = {
    key: 'cJC7bD6A2E2C2G2D2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5C4C4E3E3D4F2C2==',
    // height: 100
    // toolbarSticky: false,
    // dragInline: true,
    listAdvancedTypes: true,
    focus : true,
    autofocus: true,
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
      // 'subscript',
      // 'superscript',
      'fontFamily',
      'fontSize',
      'textColor',
      'backgroundColor',
      // 'inlineClass',
      // 'inlineStyle',
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
      // 'insertVideo',
      'insertTable',
      // 'emoticons',
      'fontAwesome',
      'specialCharacters',
      'embedly',
      'insertFile',
      'insertHR',
      'undo',
      'redo',
      'fullscreen',
      // 'print',
      // 'getPDF',
      'spellChecker',
      'selectAll',
      'html',
      'help',
      'pageBreaker',
    ],
    // heightMin: 1000

    // 'moreText': {
    //   'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
    // },
    // 'moreParagraph': {
    //   'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
    // },
    // 'moreRich': {
    //   'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
    // },
    // 'moreMisc': {
    //   'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
    //   'align': 'right',
    //   'buttonsVisible': 2
    // },

    // imageInsertingStrategy: "url | upload | both",
    // imageAllowDragAndDrop: "false | true",
    // imageButtons: ['display', 'align', 'linkImage', 'info', 'removeImage'],
    // pluginsEnabled :['image','link','draggable'],
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
              // editor.html.insert("<div class=\""+data.className+"\" id=\""+data.partyName+"-"+data.fieldName+"\" draggable=\"true\" dir=\""+data.index+"-%n%-"+data.subIndex+"\" style='color:#"+data.colorCode+";'>"+data.partyName+data.fieldName+"</div>")

              if(data.subIndex == 19){
                editor.html.insert('&nbsp;<span class="sign-wrap ' + data.className + '" id="' + data.partyName + '-' + data.fieldName + '" draggable="true" dir="' + data.index + '-%n%-' + data.subIndex + '" style=\'background:' + data.colorCode + ";text-align:center;padding:13px 20px;'>[" + data.partyName + '_' + data.fieldName + ']</span> &nbsp;&nbsp;');
              }else if(data.fieldTypeId && data.fieldTypeId == _this.constant.ImageFieldTypeId){
                editor.html.insert('&nbsp;<span class="sign-wrap ' + data.className + '" id="' + data.partyName + '-' + data.fieldName + '" draggable="true" dir="' + data.index + '-%n%-' + data.subIndex + '" style=\'background:' + data.colorCode + ";padding:41px 77px;border: 1px solid;text-align:center;\' >[" + data.partyName + '_' + data.fieldName + ']</span> &nbsp;&nbsp;');
              }else{
                editor.html.insert(
                  '&nbsp;<span class="' +
                  data.className +
                  '" id="' +
                  data.partyName +
                  '-' +
                  data.fieldName +
                  '" draggable="true" dir="' +
                  data.index +
                  '-%n%-' +
                  data.subIndex +
                  '" style=\'background:' +
                  data.colorCode +
                  ";'>[" +
                  data.partyName +
                  '_' +
                  data.fieldName +
                  ']</span>&nbsp;&nbsp;'
                );
              }

              // editor.html.insert("<span class=\""+data.className+"\" id=\""+data.partyName+"-"+data.fieldName+"\" draggable=\"true\" dir=\""+data.index+"-%n%-"+data.subIndex+"\" >["+data.partyName+' '+data.fieldName+"]</span>&nbsp;&nbsp;");
              editor.events.focus();
              // editor.html.insert(_this.dragData.outerHTML)
              _this.dragData = {};
            }

            // For Property Me Field Drop

            if (
              _this.dragData.id &&
              dropEvent.originalEvent.dataTransfer.getData(
                'PropertyMeFields'
              ) == _this.dragData.id
            ) {
              editor.html.insert(
                '&nbsp;<span class="' +
                data.className +
                '" id="' +
                data.propertyFieldName +
                '-' +
                data.propertyFieldId +
                '" draggable="true" dir="' +
                data.propertyFieldName +
                '-%n%-' +
                data.propertyFieldId +
                '" style=\'background:' +
                data.colorCode +
                ' >[' +
                data.propertyFieldName +
                ']</span>&nbsp;&nbsp;'
              );
              // editor.html.insert("<span class=\""+data.className+"\" id=\""+data.propertyFieldName+"-"+data.propertyFieldId+"\" draggable=\"true\" dir=\""+data.propertyFieldId+"\" >["+data.propertyFieldName+"]</span>&nbsp;&nbsp;");
              editor.events.focus();
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
              // editor.html.insert("<span class=\""+data.className+"\" id=\""+data.fieldName+"-"+data.uuid+"\" draggable=\"true\" dir=\""+data.uuid+"\">"+data.fieldName+"</span>&nbsp;&nbsp;")

              let Clauses =
                _this.templateData.TemplateSections[data.index].TemplateClauses;

              for(var rm = 0; rm < Clauses.length; rm++){
                if(doc.getElementById(data.uuid+"-"+Clauses[rm].UUID)){
                  _this.removeClauseFromFroala(data.uuid, Clauses[rm].UUID);
                }
              }

              setTimeout(() => {
                var first_content =
                  '&nbsp;<span class="' +
                  data.className +
                  '" id="' +
                  data.fieldName +
                  '-' +
                  data.uuid +
                  '" draggable="true" style=\'background:#EAFADD;\' dir="' +
                  data.uuid +
                  '">[' +
                  data.fieldName +
                  ']</span>&nbsp;';
                var content = '';

                //---------------- Working code to display clause content

                // _this.templateData.TemplateSections[data.index].IsAdded = true
                // for(var i=0; i < Clauses.length; i++){
                //   console.log("Clauses::----",Clauses[i]);
                //   content += Clauses[i].Description;
                //   Clauses[i].IsAdded = true
                // }

                // content = first_content + "<div class=delete_clause>"+ content +"</div>";
                // console.log("content---",content)
                // ---------------------- END ---------------

                //------------------- New change to display clause without content ---
                _this.templateData.TemplateSections[data.index].IsAdded = true;
                for (var i = 0; i < Clauses.length; i++) {
                  var clauseContent =
                    '<div><span class="clauses" id="' +
                    data.uuid +
                    '-' +
                    Clauses[i].UUID +
                    '" dir="' +
                    data.uuid +
                    '-%n%-' +
                    Clauses[i].UUID +
                    '">[' +
                    Clauses[i].Name +
                    ']</span> </div>';
                  content += clauseContent;
                  Clauses[i].IsAdded = true;
                }

                var nxContent =
                  first_content +
                  '<div class=delete_clause>' +
                  content +
                  '</div> </br>';
                //------------------- END -------------

                editor.html.insert(nxContent);

                editor.events.focus();
                _this.dragData = {};
              }, 500);
            }

            if (
              _this.dragData.id &&
              dropEvent.originalEvent.dataTransfer.getData('clauseId') ==
              _this.dragData.id
            ) {

              let clause =
                '<div><span class="' +
                data.className +
                '" id="' +
                data.sectionUUID +
                '-' +
                data.clauseUUID +
                '" draggable="true" style=\'background:#EAFADD;\' dir="' +
                data.sectionUUID +
                '-%n%-' +
                data.clauseUUID +
                '">[' +
                data.clauseName +
                '] &nbsp; </span> </div>';
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
        // console.log("content changed---",this);

        this.templateData.Content = this.editor.html.get();

        setTimeout(() => {
          // console.log("Editor content----",this.editorContent);
          // console.log("Editor content----",this.editor.html.get());
          var $marker = this.editor.$el.find('.fr-marker');
          // console.log("Marker---",$marker)
        }, 100);
      },
      drop: () => {
        // console.log("drop-----",this);
      },
    },
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
  //----- clause Editor
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
      initialized: () => {
        var _this = this;
        let clauseEditor = _this.clauseEditor;
        clauseEditor.events.on(
          'drop',
          function (dropEvent) {
            clauseEditor.markers.insertAtPoint(dropEvent.originalEvent);
            var $marker = clauseEditor.$el.find('.fr-marker');
            $marker.replaceWith(FroalaEditor.MARKERS);
            clauseEditor.selection.restore();

            // Save into undo stack the current position.
            if (!clauseEditor.undo.canDo()) clauseEditor.undo.saveStep();
          },true)
      },
      contentChanged: () => {
        // console.log("Clause Content from event---",this.clauseEditor.html.get())
        // console.log("Clause Content from ng-Model---",this.addClause.Description)
        this.addClause.Description = this.clauseEditor.html.get();
      },
    },
  };

  emailBuildorConfig: Object = {
    key: 'cJC7bD6A2E2C2G2D2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5C4C4E3E3D4F2C2==',
    toolbarSticky: false,
    dragInline: true,
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
    // toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting',
    // 'alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote',
    // 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR',
    // 'undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
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
          'pageBreaker',
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
          'pageBreaker',
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
          'pageBreaker',
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
          'pageBreaker',
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
                ']</span>&nbsp;&nbsp'
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

  dropDownEnterValue: '';
  checkBoxEnterValue: '';

  currencyList: any = [];

  addButtonDisable: boolean = true;
  newField: any = {
    Id: null,
    UUID: uuidv4(),
    FieldTypeId: 1,
    Name: '',
    Mandatory: false,
    Watermark: '',
    Format: '',
  };
  selectedSection: string = 'parties';
  selectedSubSection: string = 'partyList';
  templateId: any;
  ReminderDays : any = 7
  activeGroups: any;
  templateData: any = {};
  templateDataMain: any = {};

  //Party
  allParty: any = [];
  addParty: any = {
    Id: 0,
    UUID: uuidv4(),
    PartyName: '',
    PartyTypeId: 7,
    Mandatory: false,
    HasSignature: false,
    HasInitial: false,
    HasIntitialDate: false,
    SMSVerificationRequired: false,
    MaskEmail: false,
    WitnessRequired: false,

    ProofOfIdentity: false,
    SelectProofOfIdentity: 'DriverLicence',
    DriverLicence: false,
    Passport: false,
    MedicalCard: false,
    UtilityBill: false,
    // HasProof: false,
    edit: false,
    PartyFields: [],
    TemplateFields: [],
    TemplateCustomFields: [],
    Color: '',
    ColorCode: '',
  };

  //Clauses
  divMessages: any;
  cls_sect_cls: any = [];

  addSection = {
    UUID: uuidv4(),
    EnableBulleting: true,
    Id: 0,
    Name: '',
    Index: null,
    IsAdded: false,
    TemplateClauses: [],
    edit : false
  };

  addClause: any = {
    Id: 0,
    UUID: uuidv4(),
    Name: '',
    Description: '',
    Index: 1,
    IsSenderEdit: false,
    indexMax: 1,
    IsAdded: false,
    prevSection: null,
  };
  clauseListMain: any;
  clauseList: any;
  focus: boolean = false;
  searchText: '';
  sectionIndex: number;
  clauseIndex: number;

  createClause = false;
  createClause_anim = false;
  clauseEdit: boolean = false;

  //Field
  selectedFieldList;

  //Color Classes
  colorClass = [
    // { colorName: 'yellow', colorCode: '#fdfd96' },
    { colorName: 'blue', colorCode: '#ADD8E6' },
    { colorName: 'green', colorCode: '#90ee90ad' },
    { colorName: 'purple', colorCode: '#CBC3E3' },
    { colorName: 'magenta', colorCode: '#ff77ffa6' },
    { colorName: 'cyan', colorCode: '#E0FFFF' },
    // { colorName: 'orange', colorCode: '#f6742c82' },
    // { colorName: 'pink', colorCode: '#F6ECF5' },
  ];

  //files upload
  fileDrag: boolean = false;
  public files: NgxFileDropEntry[] = [];

  attachedFileSize = 0;

  initialTemplateStatus = 0;

  allApps: any = [];
  activeApp = false
  propertyFilter: any = {
    filterOn: 'Id',
    order: 'Asc',
    app_srt: false,
    status_srt: false,
    search: '',
    status: '',
  };

  Roles: any = [];

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private settings: SettingsService,
    private templateService: TemplateService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    // this.accountNumber = this.authenticationService.selectedAccountNumberValue
    this.Roles = this.route.snapshot.data['roles'];

    this.route.params.subscribe((params) => {
      this.templateId = params['id'];
    });

    this.getTemplate();
    this.getAllClauses(this.accountNumber);
    this.loadScript();
  }

  //email builder
  emailField: any = {
    Subject: '',
    Body: '',
  };
  updateEmail: boolean = false;

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    // this.insertPageBreaker();

    this.initAsyncFunction();
  }

  async initAsyncFunction(){
    this.allApps = await this.getAllApps();
    this.getTemplate();
    this.getAllClauses(this.accountNumber);
    this.getAccount(this.accountNumber);
    this.loadScript();
    this.getPropertyMeTypes();
    this.getpartystatus();
    this.getActiveGroups(this.accountNumber);
    this.getCurrency()

    this.authenticationService.getActiveAccountNumber().subscribe(async(data) => {
      this.currentUser = this.authenticationService.currentUserValue;
      this.accountNumber = data;

      let roleExist = this.Roles.find((role) => role === this.currentUser.role);
      if (!roleExist) {
        this.router.navigate(['/admin/home']);
      } else {
        this.allApps = await this.getAllApps();
        this.getTemplate();
        this.getAllClauses(this.accountNumber);
        this.getAccount(this.accountNumber);
        this.loadScript();
        this.getPropertyMeTypes();
        this.getpartystatus();
        this.getActiveGroups(this.accountNumber);
        this.getCurrency()

      }
    });
  }

  showPreview() {
    var doc = new DOMParser().parseFromString(
      this.editor.html.get(),
      'text/html'
    );

    let froalasectionFields = doc.getElementsByClassName('sections');
    for (var i = 0; i < froalasectionFields.length; i++) {
      // let clauses_content = '';
      let dir_str = froalasectionFields[i].attributes['dir'].value;
      let section = this.templateData.TemplateSections.find((sec) => {
        if (sec.UUID == dir_str) {
          return sec;
        }
      });

      if (section) {
        let clauses_content = '';
        if (section.TemplateClauses && section.TemplateClauses.length > 0) {
          // for(var s=0 ; s < section.TemplateClauses.length;s++){
          //   clauses_content += section.TemplateClauses[s].Description+ '<br>';
          // }

          let secId = section.Name + '-' + section.UUID;
          doc.getElementById(secId).innerHTML = clauses_content;
        }
      }
    }

    // For Clauses
    let froalaClauseFields = doc.getElementsByClassName('clauses');
    for (var j = 0; j < froalaClauseFields.length; j++) {
      let dir_str = froalaClauseFields[j].attributes['dir'].value;
      // console.log("Clause dir str :----",dir_str);
      let spl_dir = dir_str.split('-%n%-');

      if (spl_dir[0] && spl_dir[1]) {
        let section = this.templateData.TemplateSections.find((sec) => {
          if (sec.UUID == spl_dir[0]) {
            return sec;
          }
        });
        // console.log("Split dir::---"+spl_dir[0] + " - "+ spl_dir[1])

        if (section) {
          let clause = section.TemplateClauses.find((cls) => {
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

    this.preview = !this.preview;
    setTimeout(() => {
      this.previewContent = doc.body.outerHTML;
      //---- Work Code Ster----------------

      // let DATA = this.froalaEditor.nativeElement;
      // // console.log('DATA----',DATA);
      // let docs = new jsPDF('p','pt', 'a4');
      // docs.fromHTML(doc.body.outerHTML,15,15);

      // let blob = docs.output('dataurlnewwindow');
      // console.log('blob-----',blob);

      // // var blobURL = window.URL.createObjectURL(blob);
      // var blobURL = window.URL.createObjectURL(blob);

      // console.log('blob URL-----',blobURL);
      // this.pdfSrc = blob;

      // Work Code End-------------

      // let DATA = this.froalaEditor.nativeElement;

      // let docs = new jsPDF('p','pt', 'a4');

      //------------------------------------------------------

      let docs = new jsPDF('p', 'pt', 'letter');

      // docs.setFillColor(204, 204,204,0);

      var width = docs.internal.pageSize.getWidth();
      var height = docs.internal.pageSize.getHeight();
      docs.fromHTML(doc.body.outerHTML, 15, 0, {
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

      var blobPDF = new Blob([docs.output('blob')], {
        type: 'application/pdf',
      });
      var blobUrl = URL.createObjectURL(blobPDF);

      document.getElementById('convertToPdf').setAttribute('src', blobUrl);

      window.scrollTo(0, 0);

      //------------------------------------------

      // ----------- canvas working code start--------------------------

      // var iframe = document.createElement('iframe');
      // iframe.setAttribute("id", "previewHtmlToPdf");
      // iframe.setAttribute("style", "width:55%");
      // document.body.appendChild(iframe);

      // setTimeout(() => {
      //   var iframedoc=iframe.contentDocument||iframe.contentWindow.document;
      //   iframedoc.body.innerHTML=doc.body.outerHTML;

      //   html2canvas(iframedoc.body).then(canvas => {
      //     iframe.setAttribute("style", "display: none;");
      //     console.log("canvas ::----",canvas);

      //     var previewDom = document.getElementById('previewHtmlToPdf');
      //     previewDom.remove();

      //     var imgData = canvas.toDataURL('image/png');

      //     let pdf = new jsPDF('p', 'mm', 'a4');

      //     // var dataURL = canvas.toDataURL();
      //     pdf.addImage(imgData, 'PNG', 10, 1);

      //     var blobPDF = new Blob([pdf.output('blob')], { type : 'application/pdf'});
      //     var blobUrl = URL.createObjectURL(blobPDF)

      //     document.getElementById('convertToPdf').setAttribute("src",blobUrl);
      //     window.scrollTo(0,0)

      //   })

      // }, 10);

      // ----------- Canvas working code end ---------------------
    }, 200);
  }

  closePreview() {
    this.preview = false;
    this.previewContent = '';
  }

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

    if (section == 'fields') {
      this.selectedSubSection = 'fieldList';
      this.loadScript();
    }

    if (section == 'clauses') {
      this.selectedSubSection = 'clauseList'
    }

    if (section == 'mail') {
      if (this.templateData.IsLocked && this.templateData.StatusId == 3) {
        setTimeout(() => {
          this.emailBuilderEditor.edit.off();
        }, 300);
      }
    }

    if (section == 'settings') {
      this.clickedUpdateTemplate();
    }
  }

  changeSubSection(sub_section) {
    if (!this.templateData.IsLocked && this.templateData.StatusId !== 3) {
      this.selectedSubSection = sub_section;
    }
  }

  checkboxChange(type) {

    this.addParty[type] = !this.addParty[type];

    if (type == 'HasSignature' && !this.addParty.HasSignature) {
      this.addParty.HasInitial = false;
      this.addParty.HasIntitialDate = false;
      this.addParty.SMSVerificationRequired = false;
      this.addParty.MaskEmail = false;
    }

    if (type == 'ProofOfIdentity' && !this.addParty.ProofOfIdentity) {
      (this.addParty.SelectProofOfIdentity = 'DriverLicence'),
        (this.addParty.DriverLicence = false);
      this.addParty.Passport = false;
      this.addParty.MedicalCard = false;
      this.addParty.UtilityBill = false;
    }

    if (type == 'ProofOfIdentity' && this.addParty.ProofOfIdentity) {
      (this.addParty.SelectProofOfIdentity = 'DriverLicence'),
        (this.addParty.DriverLicence = true);
    }
  }

  changeSelectProofOfIdentity(value) {
    this.addParty.DriverLicence = false;
    this.addParty.Passport = false;
    this.addParty.MedicalCard = false;

    if (value == 'DriverLicence') {
      this.addParty.DriverLicence = true;
    } else if (value == 'Passport') {
      this.addParty.Passport = true;
    } else if (value == 'MedicalCard') {
      this.addParty.MedicalCard = true;
    } else if (value == 'DriverLicence & Passport') {
      this.addParty.DriverLicence = true;
      this.addParty.Passport = true;
    } else if (value == 'DriverLicence & MedicalCard') {
      this.addParty.DriverLicence = true;
      this.addParty.MedicalCard = true;
    } else if (value == 'Passport & MedicalCard') {
      this.addParty.Passport = true;
      this.addParty.MedicalCard = true;
    } else {
      this.addParty.DriverLicence = false;
      this.addParty.Passport = false;
      this.addParty.MedicalCard = false;
    }

  }

  changeReciApprove(id) {
    this.addParty.PartyTypeId = id;
  }

  editPartys(party, index) {
    if (!this.templateData.IsLocked && this.templateData.StatusId !== 3 && !this.disableField) {
      party.edit = true;
      party.index = index;
      this.addParty = party;
      this.selectedSubSection = 'addParty';
    }
  }

  resetAddParty() {
    this.addParty = {
      Id: 0,
      UUID: uuidv4(),
      PartyName: '',
      PartyTypeId: 7,
      Mandatory: false,
      HasSignature: false,
      HasInitial: false,
      HasIntitialDate: false,
      SMSVerificationRequired: false,
      MaskEmail: false,
      WitnessRequired: false,
      // HasProof: false,
      Order: 0,
      ProofOfIdentity: false,
      SelectProofOfIdentity: 'DriverLicence',
      DriverLicence: false,
      Passport: false,
      MedicalCard: false,
      UtilityBill: false,
      edit: false,
      PartyFields: [],
      TemplateFields: [],
      TemplateCustomFields: [],
      Color: '',
      ColorCode: '',
    };
  }

  dropTable(event: CdkDragDrop<[]>) {
    const prevIndex = this.templateData.TemplateParties.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(
      this.templateData.TemplateParties,
      prevIndex,
      event.currentIndex
    );
    // this.table.renderRows();
  }

  resetaddFieldInParties() {
    this.newField = {
      Id: null,
      UUID: uuidv4(),
      FieldTypeId: 1,
      Name: '',
      Mandatory: false,
      Watermark: '',
      Format: '',
    };
  }

  setFieldId(id) {
    this.newField.FieldTypeId = id;

    // if(id == 18 || id == 19){
    //   this.newField.Format = [];
    // }

    if (
      id == this.constant.DropdownFieldTypeId ||
      id == this.constant.CheckboxFieldTypeId
    ) {
      this.newField.Format = [];
    }

    if(id == this.constant.TimeFieldTypeId){
      this.newField.Format = "12"
    }
  }

  addFieldContentToFroala() { }

  onClickAddContent(
    index,
    subIndex,
    className,
    partyName,
    fieldName,
    party,
    color,
    colorCode,
    fieldTypeId
  ) {

    if (!this.templateData.IsLocked && this.templateData.StatusId !== 3 && !this.disableField) {
      let editor = this.editor;
      // editor.html.insert("<div class=\""+className+"\" id=\""+partyName+"-"+fieldName+"\" draggable=\"true\" dir=\""+index+"-"+subIndex+"\">"+fieldName+"</div>")
      // editor.html.insert("<div class=\""+className+"\" id=\""+partyName+"-"+fieldName+"\" draggable=\"true\" dir=\""+index+"-%n%-"+subIndex+"\" style='color:#"+colorCode+";'>"+ partyName+fieldName+"</div>")
      // editor.html.insert("<span class=\""+className+"\" id=\""+partyName+"-"+fieldName+"\" draggable=\"true\" dir=\""+index+"-%n%-"+subIndex+"\" style='background:#"+colorCode+";'>"+ partyName+' '+fieldName+"</span>&nbsp;&nbsp;")



      if(subIndex == 19){
        editor.html.insert('&nbsp;<span class="sign-wrap ' + className + '" id="' + partyName + '-' + fieldName + '" draggable="true" dir="' + index + '-%n%-' + subIndex + '" style=\'background:' + colorCode + ";text-align:center;padding:13px 20px;'>[" + partyName + '_' + fieldName + ']</span>&nbsp;&nbsp;');
      }else if (fieldTypeId && fieldTypeId == this.constant.ImageFieldTypeId) {
        editor.html.insert('&nbsp;<span class="sign-wrap ' + className + '" id="' + partyName + '-' + fieldName + '" draggable="true" dir="' + index + '-%n%-' + subIndex + '" style=\'background:' + colorCode + ";padding:41px 77px;border: 1px solid;text-align:center;\'>[" + partyName + '_' + fieldName + ']</span> &nbsp;&nbsp;');
      } else {
        editor.html.insert('&nbsp;<span class="' + className + '" id="' + partyName + '-' + fieldName + '" draggable="true" dir="' + index + '-%n%-' + subIndex + '" style=\'background:' + colorCode + ";'>[" + partyName + '_' + fieldName + ']</span>&nbsp;&nbsp;');
      }
      editor.events.focus();
    }
  }

  onDragStart(
    event: DragEvent,
    index,
    subIndex,
    className,
    partyName,
    fieldName,
    Color,
    colorCode,
    fieldTypeId
  ) {
    // console.log(`starting`, event);
    let data = {
      index,
      subIndex,
      className,
      partyName,
      fieldName,
      Color,
      colorCode,
      fieldTypeId
    };
    this.dragData = event.target;
    this.dragData.data = data;
    event.dataTransfer.setData('Id', this.dragData.id);
  }

  onDragEnd(event: DragEvent) {
    // console.log('drag end', event);
  }

  // Property_Me Drag Event
  propertyMeDragStart(
    event: DragEvent,
    index,
    propertyFieldId,
    className,
    propertyFieldName,
    Color,
    colorCode
  ) {
    let data = {
      index,
      propertyFieldId,
      className,
      propertyFieldName,
      Color,
      colorCode,
    };
    this.dragData = event.target;
    this.dragData.data = data;
    event.dataTransfer.setData('PropertyMeFields', this.dragData.id);
  }

  propertyMeDragEnd(event: DragEvent) {
    // console.log('drag end', event);
  }

  onClickAddPropertyMeField(
    index,
    propertyFieldId,
    className,
    propertyFieldName,
    Color,
    colorCode
  ) {
    if (!this.templateData.IsLocked && this.templateData.StatusId !== 3 && !this.disableField) {
      let editor = this.editor;
      editor.html.insert(
        '&nbsp;<span class="' +
        className +
        '" id="' +
        propertyFieldName +
        '-' +
        propertyFieldId +
        '" draggable="true" dir="' +
        propertyFieldName +
        '-%n%-'+
        propertyFieldId+
        '" style=\'background:' +
        colorCode +
        ";'>[" +
        propertyFieldName +
        ']</span>&nbsp;&nbsp;'
      );
      // editor.html.insert("<span class=\""+className+"\" id=\""+propertyFieldName+"-"+propertyFieldId+"\" draggable=\"true\" dir=\""+propertyFieldId+"\" >["+propertyFieldName+"]</span>&nbsp;&nbsp;");
      editor.events.focus();
    }
  }

  focusFunction() {
    let froala = document.getElementById('froalaEditor');
  }

  //For Field List
  // changeSelectedFieldList(index) {
  //   if (this.selectedFieldList == index) {
  //     this.selectedFieldList = 0;
  //   } else {
  //     this.selectedFieldList = index;
  //   }
  // }
  async partySave() {
    let partyArray = [
      { Id: 12, Name: 'First Name' },
      { Id: 13, Name: 'Last Name' },
      { Id: 14, Name: 'Email' },
      { Id: 15, Name: 'Mobile' },
      { Id: 16, Name: 'Company' },
      { Id: 17, Name: 'Position' },
      // {Id: 7, Name: "Phone"},
      // {Id: 8, Name: "Signature"},
      // {Id: 9, Name: "Home Phone"},
      // {Id: 10, Name: "Work Phone"},
      // {Id: 11, Name: "Physical Address"}
    ];

    if (this.addParty.HasSignature) {
      partyArray.push({ Id: 19, Name: 'Signature' });
    }


    if (!this.addParty.edit) {
      let createPartyExist = await this.checkPartyNameExist(
        this.addParty.PartyName,
        null
      );

      if (createPartyExist) {
        this.alertService.error('This party name already taken');
      } else {
        this.addParty.edit = false;
        // this.addParty.color = this.getRandomColor();

        var clr = this.getRandomColor();
        this.addParty.Color = clr.colorName;
        this.addParty.ColorCode = clr.colorCode;
        this.addParty.PartyFields = partyArray;

        if(this.addParty.PartyTypeId == 9){
          this.addParty.Color = 'pink';
          this.addParty.ColorCode = '#F6ECF5';
        }

        if(this.addParty.PartyTypeId == 8){
          this.addParty.Color = 'orange';
          this.addParty.ColorCode = '#F5D5CB';
        }

        if(this.addParty.PartyTypeId == 7){
          // find firstrecipient is there or not
          var recipientExist = this.templateData.TemplateParties.find(party => {
            if(party.PartyTypeId == 7){
              return party
            }
          })

          if(!recipientExist){
            this.addParty.Color = 'yellow';
            this.addParty.ColorCode = '#f7f5cb';
          }
        }



        // data.TemplateParties[i].Color = this.getRandomColor();

        this.templateData.TemplateParties.push(this.addParty);

        this.selectedSubSection = 'partyList';
        this.resetAddParty();
      }
    } else {
      let editPartyExist = await this.checkPartyNameExist(
        this.addParty.PartyName,
        this.addParty.index
      );

      if (editPartyExist) {
        this.alertService.error('This party name already taken');
      } else {
        this.addParty.edit = false;

        // If sign check then add signature in fields.
        var tmp_party = this.addParty.PartyFields;
        const singIndex = tmp_party.findIndex((x) => x.Id == 19);
        if (singIndex >= 0) {
          if (!this.addParty.HasSignature) {
            this.addParty.PartyFields.splice(singIndex, 1);
          }
        } else {
          if (this.addParty.HasSignature) {
            this.addParty.PartyFields.push({ Id: 19, Name: 'Signature' });
          }
        }

        this.templateData.TemplateParties[this.addParty.index] = this.addParty;

        this.selectedSubSection = 'partyList';
        this.resetAddParty();
      }
    }
  }

  // check validation for party name is exist or not
  checkPartyNameExist(partyName, index) {
    let TemplateParties = this.templateData.TemplateParties;
    let exist = false;
    // let splPartyName = partyName.split(" ").join("")
    var splPartyName = partyName.toLowerCase();
    splPartyName = splPartyName.split(/\s/).join('');

    for (var i = 0; i < TemplateParties.length; i++) {
      // let lpPartyName = TemplateParties[i].PartyName.split(" ").join("")
      var lpPartyName = TemplateParties[i].PartyName.toLowerCase();
      lpPartyName = lpPartyName.split(/\s/).join('');
      if (i == index) {
      } else {
        if (splPartyName == lpPartyName) {
          exist = true;
        }
      }
    }

    return exist;
  }

  // new section

  // ------------------------setting screen ---------------------

  clickedUpdateTemplate() {
    this.clickedUpdateTemp = true;
    this.clickedUpdateTemp_anim = true;
    this.getpartystatus();
    this.statusSet = this.templateData.StatusId;
    if (this.templateData.PropertyMeTypeId) {
      this.templateData.IsLinked = 1;
      this.allRoles = [];
      // console.log("event---",event);
      var selectedSection = this.allPropertyMeTypes.find((e) => {
        if (e.Id == this.templateData.PropertyMeTypeId) {
          return e;
        }
      });
      var arrType = Array.isArray(selectedSection.PartyType);
      selectedSection.PartyType.forEach((element) => {
        this.allRoles.push(element);
      });
    } else {
      this.templateData.IsLinked = 0;
    }

    for (let i = 0; i < this.activeGroupsArray.length; i++) {
      // activeGroupsArray
      let exist = this.templateData.Groups.find((x) => {
        if (x == this.activeGroupsArray[i].Id) {
          return x;
        }
      });

      if (exist) {
        this.activeGroupsArray[i].checked = true;
      }
    }

    // this.getPropertyMeTypes();
    // this.getActiveGroups(this.accountNumber);
  }

  closeUpdatetemplate() {
    this.selectedSection = 'parties';
    this.selectedSubSection = 'partyList';
    this.clickedUpdateTemp_anim = false;
    setTimeout(() => {
      this.clickedUpdateTemp = false;
    }, 300);
    // this.template = { IsLocked:0,StatusId: 1,ExpirationDays: 0,ReminderDays: 0 };
  }

  changePermission(val) {
    // this.template.IsLocked = val;
    // console.log("template",this.template);
  }

  updateTemplate() {

    let otherParty = this.templateData.TemplateParties.filter((party) => {
      if (party.PartyTypeId !== 9) {
        return party;
      }
    });
    this.templateData.Groups = [];

    for (var i = 0; i < this.activeGroupsArray.length; i++) {
      if (this.activeGroupsArray[i].checked) {
        this.templateData.Groups.push(this.activeGroupsArray[i].Id)
      }
    }
    if (otherParty.length == 0) {
      this.alertService.error('Please add atleast one party');
    } else if(this.templateData.Groups.length == 0){
      this.alertService.error('Please check one groups');
    } else if(this.checkOneClausePerSection(this.templateData.TemplateSections)){
      this.alertService.error('Please add minimum one cluase in a section');
    } else {
      this.spinner.show();
      this.templateData.ReminderDays[0] = this.ReminderDays
      this.templateService.updateTemplate(this.templateData).subscribe(
        (res) => {
          this.spinner.hide();
          this.clickedUpdateTemp_anim = false;
          this.selectedSection = 'parties';
          this.selectedSubSection = 'partyList';

          setTimeout(() => {
            this.clickedUpdateTemp = false;
          }, 300);
          this.alertService.successPage(res.Messages);
          // window.location.reload();
          // this.router.navigate(['/admin/templates'])
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error.Message);
          this.templateData = this.templateDataMain;
        }
      );
    }
  }

  getpartystatus() {
    this.templateService.getpartystatus().subscribe((res) => {
      this.allPartyStatus = res;
    });
  }

  getAllApps() {
    return new Promise((resolve) => {
      this.settings.getAllApps(this.accountNumber, this.propertyFilter).subscribe(
        (res) => {

          if(res.Data){
            var allApps = res.Data
            allApps.forEach(element => {
              if(element.Active && !this.activeApp){
                this.activeApp = true
              }
            });
            resolve(res.Data);
          }else{
            resolve([]);
          }

          // this.allApps = res.Data;
        },
        (error) => {
          resolve([])
          // console.log('Error ::----', error);
        }
      );
    })

  }

  getPropertyMeTypes() {
    this.templateService.getPropertyMeTypes().subscribe((res) => {
      this.allPropertyMeTypes = res;
      this.allRoles = this.allPropertyMeTypes;
    });
  }

  statusChange(stts) {
    this.statusSet = stts;
    this.templateData.StatusId = stts;
    // this.template.StatusId = this.statusSet;
    // console.log("template---",this.template);
  }

  changeLink(event) {

    if (event !== undefined) {
      if (event == '0' || event == 'null') {
        this.templateData.PropertyMeTypeId = null;
        this.templateData.PartyTypeId = null;
      } else {
        this.templateData.PropertyMeTypeId = null;
        this.templateData.PartyTypeId = null;
      }
    }

  }

  changeSection(event) {
    if (event !== undefined) {
      this.templateData.PartyTypeId = null;
      this.allRoles = [];

      var selectedSection = this.allPropertyMeTypes.find((e) => {
        if (e.Id == event) {
          return e;
        }
      });
      var arrType = Array.isArray(selectedSection.PartyType);

      selectedSection.PartyType.forEach((element) => {
        this.allRoles.push(element);
      });
    }
  }

  changeGroups(index) {
    this.activeGroupsArray[index].checked =
      !this.activeGroupsArray[index].checked;
  }

  //check group validation
  checkGroupValidation() {
    var check = false;
    // if(this.template.Groups.length > 0){
    //   var fnd = this.template.Groups.find(e => {
    //     if(e){
    //       return e
    //     }
    //   })

    //   console.log("fnd----",fnd);
    //   if(fnd){
    //     check = true
    //     return check
    //   }else{
    //     return check
    //   }
    // }else{
    //   return check
    // }

    var fnd = this.activeGroupsArray.find((e) => {
      if (e.checked) {
        return e;
      }
    });

    if (fnd) {
      check = true;
      return check;
    } else {
      return check;
    }
  }

  getActiveGroups(acc) {
    this.templateService.getActiveGroups(acc).subscribe((res) => {
      this.activeGroups = res.slice(0);

      var grps = [];
      for (var i = 0; i < res.length; i++) {
        if (res[i].Name == 'Default') {
          res[i].checked = false;
        } else {
          res[i].checked = false;
        }

        grps.push(res[i]);
      }
      this.activeGroupsArray = grps;
    });
  }

  //----------------------------------- For Clause ---------------------------------

  initializeClauseLink(controls) {
    controls.initialize();
    this.clauseEditor = controls.getEditor();
    this.insertPageBreaker();
  }

  newClause(create) {
    if (!this.templateData.IsLocked && this.templateData.StatusId !== 3) {
      if (create) {
        this.addClause.section = 0;
        this.addClause.indexMax =
          this.templateData.TemplateSections.length > 0
            ? this.templateData.TemplateSections[0].TemplateClauses.length + 1
            : 1;
        this.addClause.Index =
          this.templateData.TemplateSections.length > 0
            ? this.templateData.TemplateSections[0].TemplateClauses.length + 1
            : 1;
      }

      setTimeout(() => {
        this.createClause = true;
        this.createClause_anim = true;
      }, 200);
    }
  }

  closeClause() {
    this.clauseEdit = false;
    // this.createClause = false;
    this.createClause_anim = false;
    this.addClause = {
      Id: 0,
      UUID: uuidv4(),
      Name: '',
      Description: '',
      Index: 1,
      IsSenderEdit: false,
      indexMax: 1,
      IsAdded: false,
      prevSection: null,
    };
    setTimeout(() => {
      this.createClause = false;
    }, 300);
  }
  //add clause
  async addClauseSubmit() {
    if (!this.clauseEdit) {
      let index = this.addClause.section;
      let insertIndex = this.addClause.Index - 1;

      let clauseNameExist = await this.checkClauseNameExist(
        index,
        insertIndex,
        this.addClause.Name,
        false
      );

      if (clauseNameExist) {
        this.alertService.error('This Clause Name Already Taken');
      } else {
        let templateSection = this.templateData.TemplateSections[index];
        delete this.addClause.indexMax;
        // templateSection.TemplateClauses.push(this.addClause);

        // templateSection.TemplateClauses.insert(insertIndex,this.addClause);
        if (templateSection && templateSection.TemplateClauses) {
          templateSection.TemplateClauses.splice(
            insertIndex,
            0,
            this.addClause
          );
          this.alertService.successPage('Clause added successfully');
          this.closeClause();
        }
      }
    } else {
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

          this.templateData.TemplateSections[
            sectionIndex
          ].TemplateClauses.splice(clauseIndex, 1);
          let InsertIndex = this.addClause.Index - 1;
          this.templateData.TemplateSections[
            sectionIndex
          ].TemplateClauses.splice(InsertIndex, 0, this.addClause);

          // this.templateData.TemplateSections[sectionIndex].TemplateClauses[clauseIndex] = this.addClause
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
            this.templateData.TemplateSections[
              previousIndex
            ].TemplateClauses.splice(clauseIndex, 1);
          }
          delete this.addClause.clauseIndex;
          delete this.addClause.section;
          delete this.addClause.indexMax;
          delete this.addClause.prevSection;

          this.templateData.TemplateSections[sectionIndex].TemplateClauses.push(
            this.addClause
          );
          this.alertService.successPage('Clause updated successfully');
          this.closeClause();
        }
      }
    }
  }

  // check Clause Name is Exist or not
  checkClauseNameExist(secIndex, clauseIndex, newClauseName, InSameSection) {
    let clauses = [];
    if (
      this.templateData &&
      this.templateData.TemplateSections[secIndex] &&
      this.templateData.TemplateSections[secIndex].TemplateClauses
    ) {
      clauses = this.templateData.TemplateSections[secIndex].TemplateClauses;
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
    } else {
      this.alertService.error('Please add section and select section');
    }
  }

  senderEdit(value) {
    this.addClause.IsSenderEdit = value;
  }

  editClause(sectionIndex, clauseIndex) {
    this.clauseIndex = clauseIndex;
    this.sectionIndex = sectionIndex;

    this.clauseEdit = true;
    // this.addClause.section = sectionIndex
    // let selectedsection = this.templateData.TemplateSections[sectionIndex];
    // let selectedClause = selectedsection.TemplateClauses[clauseIndex];

    this.templateData.TemplateSections[sectionIndex].TemplateClauses[
      clauseIndex
    ].section = sectionIndex;
    this.templateData.TemplateSections[sectionIndex].TemplateClauses[
      clauseIndex
    ].clauseIndex = clauseIndex;

    // console.log("selected clause--",selectedClause);
    // if(!selectedClause.section){
    //   selectedClause.section = sectionIndex;
    // }
    const data =
      this.templateData.TemplateSections[sectionIndex].TemplateClauses[
      clauseIndex
      ];
    this.addClause = data;
    this.addClause.Index = clauseIndex + 1;
    this.addClause.prevSection = sectionIndex;
    if (
      this.templateData.TemplateSections[sectionIndex].TemplateClauses.length ==
      0
    ) {
      this.addClause.indexMax = 1;
    } else {
      this.addClause.indexMax =
        this.templateData.TemplateSections[sectionIndex].TemplateClauses.length;
    }

    this.newClause(false);
  }

  deleteSection(sectionIndex) {
    if (!this.templateData.IsLocked && this.templateData.StatusId !== 3 && !this.disableField) {
      this.templateData.TemplateSections.splice(sectionIndex, 1);
      this.alertService.successPage('Section deleted successfully');
    }
  }

  editClauseFromSearch(clause) {
    this.clauseEdit = false;
    this.newClause(true);
    this.addClause.Name = clause.Name;
    this.addClause.Id = clause.Id;
    this.addClause.Description = clause.Description ? clause.Description : '';
  }

  updateClause() {
    // console.log("update Claues----",this.clauseIndex,this.addClause);
    let clauseIndex = this.addClause.clauseIndex;
    let sectionIndex = this.addClause.section;
    delete this.addClause.clauseIndex;
    delete this.addClause.section;

    // console.log("Clause-List---",this.templateData.TemplateSections[sectionIndex].TemplateClauses)
    // console.log("temp-Sec---",this.templateData.TemplateSections[sectionIndex]);
    // console.log("clause-Sec---",this.templateData.TemplateSections[sectionIndex].TemplateClauses[clauseIndex]);
    this.templateData.TemplateSections[sectionIndex].TemplateClauses[
      clauseIndex
    ] = this.addClause;
    // console.log("temp-Sec---",this.templateData.TemplateSections[sectionIndex]);
    // console.log("clause-Sec---",this.templateData.TemplateSections[sectionIndex].TemplateClauses[clauseIndex]);

    // let index = this.addClause.section;
    // let templateSection = this.templateData.TemplateSections[index];
    // console.log("template section ----",templateSection);
    this.closeClause();
  }

  multiClause(clause, sectionIndex, clauseIndex) {
    var exist = true;
    var clauseName = clause.Name;
    while (exist) {
      var nameExist = this.templateData.TemplateSections[
        sectionIndex
      ].TemplateClauses.find((fnd_cls) => {
        if (fnd_cls.Name == clauseName) {
          return fnd_cls;
        }
      });

      if (nameExist) {
        clauseName = clauseName + ' Copy';
      } else {
        exist = false;
      }
    }

    if (
      !this.templateData.IsLocked &&
      this.templateData.StatusId !== 3 &&
      !exist
    ) {
      let newclause = {
        Name: clauseName,
        Description: clause.Description,
        IsSenderEdit: clause.IsSenderEdit,
        Index: null,
        Id: 0,
      };

      this.templateData.TemplateSections[sectionIndex].TemplateClauses.push(
        newclause
      );
    }
  }

  deleteClause(sectionIndex, clauseIndex) {
    if (!this.templateData.IsLocked && this.templateData.StatusId !== 3 && !this.disableField) {
      this.templateData.TemplateSections[sectionIndex].TemplateClauses.splice(
        clauseIndex,
        1
      );
    }
  }

  getAllClauses(accountNumber) {
    // this.templateDataMain.TemplateSections = this.templateData.TemplateSections;
    // var clauseArray = [];
    // this.templateData.TemplateSections.forEach((element,i) => {
    //   element.TemplateClauses.forEach((elmnt,j) => {
    //     elmnt.sectionIndex = i;
    //     elmnt.clauseIndex = j;
    //     clauseArray.push(elmnt);
    //   });
    // });
    // this.clauseListMain = clauseArray;
    // console.log("clause array ---",this.clauseListMain);
    // this.clauseList = clauseArray

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

  searchClause(event) {
    let searchString = event.target.value;
    this.clauseList = this.clauseListMain.filter((x) =>
      x.Name.trim().toLowerCase().includes(searchString.trim().toLowerCase())
    );
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

  newSection() {
    if (!this.templateData.IsLocked && this.templateData.StatusId !== 3) {
      let sectionLength = this.templateData.TemplateSections.length;
      let sectionName = '';
      if (sectionLength > 0) {
        let section = this.templateData.TemplateSections[sectionLength - 1];
        let secName = section.Name;
        let splSecNames = secName.split('-');
        let splitedNumber = splSecNames[splSecNames.length - 1];
        let secNumber = Number(splitedNumber) + 1;
        sectionName = 'Clause section-' + secNumber;
      } else {
        sectionName = 'Clause section-' + (sectionLength + 1);
      }

      //sections
      let addSection = {
        UUID: uuidv4(),
        EnableBulleting: true,
        Id: 0,
        Name: sectionName,
        IsAdded: false,
        Index: 1,
        TemplateClauses: [
          //   {
          //   Id: 0,
          //   Name: "Clause-1",
          //   Description :'',
          //   Index : 1,
          //   IsSenderEdit : false,
          //   indexMax : 1
          // }
        ],
      };
      this.templateData.TemplateSections.push(addSection);
      this.addClause.section = this.templateData.TemplateSections.length - 1;
      this.sectionChange(this.templateData.TemplateSections.length - 1);
      this.alertService.successPage('New Section added successfully');
    }
  }

  async addSectionNewFunction(){
    // var secIndexExist = this.templateData.TemplateSections.find(sec => {
    //   if(sec.Index == this.addSection.Index){
    //     return sec;
    //   }
    // });

    var secIndexExist = await this.CheckSectionIndex(this.addSection.Index, this.addSection.UUID)

    if(secIndexExist){
      this.alertService.error("Section number already exist.")
    } else {


      if(this.addSection.edit){
        // Edit Section
        var secIndex = this.templateData.TemplateSections.findIndex(sec => {
          if(sec.UUID == this.addSection.UUID){
            return sec
          }
        })

        this.templateData.TemplateSections[secIndex] = this.addSection;
        this.selectedSubSection = 'clauseList';
        this.resetAddSection();
      } else{
        // Add Section
        this.templateData.TemplateSections.push(this.addSection);
        this.selectedSubSection = 'clauseList';
        this.resetAddSection();
      }
    }


  }

  setEditSection(section){
    this.addSection = section;
    this.addSection.edit = true;

    this.selectedSubSection = 'addSection'
  }

  CheckSectionIndex(index, uuid){
    var exist = false;
    for(var i=0; i < this.templateData.TemplateSections.length; i++){
      if(this.templateData.TemplateSections[i].UUID == uuid){
        // no need to check
      }else{
        if(this.templateData.TemplateSections[i].Index == index){
          exist = true;
        }
      }
    }

    return exist
  }

  resetAddSection(){
    this.addSection = {
      UUID: uuidv4(),
      EnableBulleting: true,
      Id: 0,
      Name: '',
      Index: null,
      IsAdded: false,
      TemplateClauses: [],
      edit : false
    }
  }

  clauseDropTable(i, event: CdkDragDrop<[]>) {
    const prevIndex = this.templateData.TemplateSections[
      i
    ].TemplateClauses.findIndex((d) => d === event.item.data);
    moveItemInArray(
      this.templateData.TemplateSections[i].TemplateClauses,
      prevIndex,
      event.currentIndex
    );

    this.clauseIndexRefresh(i);
  }

  clauseIndexRefresh(sec_index){
    const clauses = this.templateData.TemplateSections[sec_index].TemplateClauses
    for(var i = 0; i < clauses.length; i++){
      this.templateData.TemplateSections[sec_index].TemplateClauses[i].Index = i+1;
    }
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
    if (section.TemplateClauses.length > 0) {
      let editor = this.editor;
      // editor.html.insert("<span class=\""+className+"\" id=\""+fieldName+"-"+uuid+"\" draggable=\"true\" dir=\""+uuid+"\">"+fieldName+"</span>&nbsp;&nbsp;")

      let Clauses = this.templateData.TemplateSections[index].TemplateClauses;
      // -------- For Add Clause Description in froala -------

      // var first_content = "<span class=\""+className+"\" id=\""+fieldName+"-"+uuid+"\" draggable=\"true\" style='background:#EAFADD;' dir=\""+uuid+"\">["+fieldName+"]</span>&nbsp;&nbsp;"
      // var content = ''

      // for(var i=0; i < Clauses.length; i++){
      //   console.log("Clauses::----",Clauses[i]);
      //   content += Clauses[i].Description;
      // }
      // content = first_content + "<div class=delete_clause>"+ content +"</div>";
      // console.log("content---",content)
      // editor.html.insert(content)

      // ------  Add Clause Name in froala --------

      for(var rm = 0; rm < Clauses.length; rm++){
        if(doc.getElementById(uuid+"-"+Clauses[rm].UUID)){
          this.removeClauseFromFroala(uuid, Clauses[rm].UUID);
        }
      }

      // this.templateData.Content = doc.body.outerHTML

      setTimeout(() => {

        // editor.cursor.del();
        editor.cursor.isAtEnd(true);
        editor.events.focus(true);
        // editor.cursor.enter (true)
      }, 300);

      setTimeout(() => {

        var first_content =
          '&nbsp;<span class="' +
          className +
          '" id="' +
          fieldName +
          '-' +
          uuid +
          '" draggable="true" style=\'background:#EAFADD;\' dir="' +
          uuid +
          '">[' +
          fieldName +
          '] </span> &nbsp;&nbsp; </br>';
        var content = '';

        for (var i = 0; i < Clauses.length; i++) {
          var clauseContent =
            '<div><span class="clauses" id="' +
            uuid +
            '-' +
            Clauses[i].UUID +
            '" dir="' +
            uuid +
            '-%n%-' +
            Clauses[i].UUID +
            '">[' +
            Clauses[i].Name +
            ']</span></div>';
          content += clauseContent;
        }

        var nxContent =
          first_content + '<div class=delete_clause>' + content + ' </div> </br>';
        editor.html.insert(nxContent,true);
        editor.events.focus();
        this.alertService.successPage('Section Added in froala');
      }, 500);
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
    // let Clause = this.templateData.TemplateSections[i].TemplateClauses[j]

    let clause =
      '<div><span class="' +
      className +
      '" id="' +
      sectionUUID +
      '-' +
      clauseUUID +
      '" draggable="true" style=\'background:#EAFADD;\' dir="' +
      sectionUUID +
      '-%n%-' +
      clauseUUID +
      '">[' +
      secName +
      '-' +
      clauseName +
      '] &nbsp;&nbsp; </span></div>';

    editor.html.insert(clause);
    editor.events.focus();
    this.alertService.successPage('Clause Added in froala');
  }

  removeClauseFromFroala(secUUID, ClauseUUID) {
    let editor = this.editor;
    var doc = new DOMParser().parseFromString(editor.html.get(), 'text/html');
    // console.log("caluse id exist::---",doc.getElementById(secUUID+"-"+ClauseUUID));

    if (doc.getElementById(secUUID + '-' + ClauseUUID)) {
      doc.getElementById(secUUID + '-' + ClauseUUID).remove();

      // var rmCls = doc.getElementById(secUUID+"-"+ClauseUUID)
      // rmCls.parentNode.removeChild(rmCls)

      this.templateData.Content = doc.body.outerHTML;
    }
  }

  removeSectionFromFroala(index, secName, secUUID) {
    let editor = this.editor;
    var doc = new DOMParser().parseFromString(editor.html.get(), 'text/html');
    // console.log("Section id exist::---",doc.getElementById(secName+"-"+secUUID));

    if (doc.getElementById(secName + '-' + secUUID)) {
      doc.getElementById(secName + '-' + secUUID).remove();
      this.templateData.Content = doc.body.outerHTML;
    }

    let Clauses = this.templateData.TemplateSections[index].TemplateClauses;

    for (var i = 0; i < Clauses.length; i++) {
      if (doc.getElementById(secUUID + '-' + Clauses[i].UUID)) {
        doc.getElementById(secUUID + '-' + Clauses[i].UUID).remove();

        // var rmCls = doc.getElementById(secUUID+"-"+Clauses[i].UUID)
        // rmCls.parentNode.removeChild(rmCls)
      }
    }

    this.templateData.Content = doc.body.outerHTML;
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

  insertAllSectionToFroala() {
    let editor = this.editor;
    for (var i = 0; i < this.templateData.TemplateSections.length; i++) {
      let data = this.templateData.TemplateSections[i];
      // editor.html.insert("<span class=\""+data.Name+"\" id=\""+data.Name+"-"+i+"\" draggable=\"true\" style='background:#EAFADD;' dir=\""+i+"\">["+data.Name+"]</span>&nbsp;&nbsp; </br>")

      var first_content =
        '<span class="sections" id="' +
        data.Name +
        '-' +
        data.UUID +
        '" draggable="true" style=\'background:#EAFADD;\' dir="' +
        data.UUID +
        '">[' +
        data.Name +
        '] </span>&nbsp; </br>';

      let Clauses = this.templateData.TemplateSections[i].TemplateClauses;
      var content = '';

      this.templateData.TemplateSections[i].IsAdded = true;
      for (var j = 0; j < Clauses.length; j++) {
        this.templateData.TemplateSections[i].TemplateClauses[j].IsAdded = true;

        var clauseContent =
          '<div><span class="clauses" id="' +
          data.UUID +
          '-' +
          Clauses[j].UUID +
          '" dir="' +
          data.UUID +
          '-%n%-' +
          Clauses[j].UUID +
          '">[' +
          Clauses[j].Name +
          ']</span> </div>';
        content += clauseContent;
      }

      var nxContent = first_content + content;
      editor.html.insert(nxContent);
      editor.events.focus();
    }
  }

  sectionChange(sectionIndex) {
    if (sectionIndex >= 0 && sectionIndex !== undefined) {
      if (this.clauseEdit) {
        if (
          this.templateData.TemplateSections[sectionIndex].TemplateClauses
            .length == 0
        ) {
          this.addClause.indexMax = 1;
          this.addClause.Index = 1;
        } else {
          if (this.addClause.prevSection == sectionIndex) {
            this.addClause.indexMax =
              this.templateData.TemplateSections[
                sectionIndex
              ].TemplateClauses.length;
            this.addClause.Index =
              this.templateData.TemplateSections[
                sectionIndex
              ].TemplateClauses.length;
          } else {
            this.addClause.indexMax =
              this.templateData.TemplateSections[sectionIndex].TemplateClauses
                .length + 1;
            this.addClause.Index =
              this.templateData.TemplateSections[sectionIndex].TemplateClauses
                .length + 1;
          }
        }
      } else {
        this.addClause.indexMax =
          this.templateData.TemplateSections[sectionIndex].TemplateClauses
            .length + 1;
        this.addClause.Index =
          this.templateData.TemplateSections[sectionIndex].TemplateClauses
            .length + 1;
      }
    }
    // console.log("Clause---",this.addClause)
  }

  setAllClausesIndex() {
    for (var i = 0; i < this.templateData.TemplateSections.length; i++) {
      for (
        var j = 0;
        j < this.templateData.TemplateSections[i].TemplateClauses.length;
        j++
      ) {
        this.templateData.TemplateSections[i].TemplateClauses[j].Index = j + 1;
      }
    }

    for (var j = 0; j < this.templateData.TemplateParties.length; j++) {
      this.templateData.TemplateParties[j].Order = j;
    }

    return true;
  }

  sectionCheckboxChange(value, index, section) {
    // console.log("Section Change Value:---",value);
    this.templateData.TemplateSections[index].IsAdded = value;
    for (let i = 0; i < section.TemplateClauses.length; i++) {
      this.templateData.TemplateSections[index].TemplateClauses[i].IsAdded =
        value;
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
    // console.log("Clause Value:---",value);

    this.templateData.TemplateSections[secIndex].TemplateClauses[
      clauseIndex
    ].IsAdded = value;

    let xyz = this.templateData.TemplateSections[
      secIndex
    ].TemplateClauses.filter((xx) => xx.IsAdded == true);

    if (
      xyz.length ==
      this.templateData.TemplateSections[secIndex].TemplateClauses.length
    ) {
      this.templateData.TemplateSections[secIndex].IsAdded = true;
    }
    if (
      xyz.length !==
      this.templateData.TemplateSections[secIndex].TemplateClauses.length
    ) {
      this.templateData.TemplateSections[secIndex].IsAdded = false;
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
  //------------------------------------ Attach Section ------------------------------------
  attachPdf(file) {

  }

  onFileDropped(event) {

  }

  public async dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    //set class
    // if($('.drag-file-sec').hasClass("border")){
    //   $(".drag-file-sec").removeClass("border")
    //   $(".drag-file-sec").addClass("uploading-bg")
    // }else{
    this.uploding = true;
    $('.drag-file-sec').addClass('uploading-bg');

    // }

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

      $('.drag-file-sec').removeClass('uploading-bg');
      $('.drag-file-sec').removeClass('border');
      this.uploding = false;
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
      // console.log("Form-Data---",formData.get());
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
            this.templateData.Attachments.push(fileRes);
          }
          $('.drag-file-sec').removeClass('uploading-bg');
          $('.drag-file-sec').removeClass('border');
          this.uploding = false;

          // calculate Attachment Size
          this.calculateAttechmentSize();

          //Update attachment in template
          this.updateAttachmentInTemplate();
        },
        (error) => {
          this.spinner.hide();
          $('.drag-file-sec').removeClass('uploading-bg');
          $('.drag-file-sec').removeClass('border');
          this.uploding = false;
          this.alertService.error(
            error.error.ExceptionMessage
              ? error.error.ExceptionMessage
              : error.error.Message
          );
        }
      );
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

  fileOver(event) {
    this.fileDrag = true;
    $('.drag-file-sec').addClass('border');
  }

  fileLeave(event) {
    if ($('.drag-file-sec').hasClass('border')) {
      $('.drag-file-sec').removeClass('border');
    }
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
    let file = this.templateData.Attachments[index].FilePath;
    let request = {
      Url: file,
    };

    this.spinner.show();
    this.templateService.deleteFile(request).subscribe(
      (res) => {
        this.spinner.hide();
        this.templateData.Attachments.splice(index, 1);

        // calculate Attachment Size
        this.calculateAttechmentSize();

        // Update attachment in template
        this.updateAttachmentInTemplate();

        this.alertService.successPage(res);
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error.Message);
      }
    );
  }

  calculateAttechmentSize() {
    var size = 0;
    for (var i = 0; i < this.templateData.Attachments.length; i++) {
      size += parseFloat(this.templateData.Attachments[i].Size);
    }

    this.attachedFileSize = size;
  }

  updateAttachmentInTemplate() {
    this.templateService.updateTemplate(this.templateData).subscribe(
      (res) => {
        // console.log('Update Attachment In Template ----', res);
      },
      (error) => {
        this.alertService.error(error.Message);
      }
    );
  }

  calculateKbToMb(size) {
    var mb = size / 1024;
    return mb.toFixed(2);
  }

  //------------------------------------ Email Builder ----------------
  emailFroalaInit(controls) {
    controls.initialize();
    this.emailBuilderEditor = controls.getEditor();

    setTimeout(() => {
      if(this.disableField == 1){
        this.emailBuilderEditor.edit.off();
      }
    }, 300);

    this.insertPageBreaker();
  }

  builderDragStart(event: DragEvent, name) {
    let data = { name };
    this.dragData = event.target;
    this.dragData.data = data;
    event.dataTransfer.setData('emailBuilderId', this.dragData.id);
  }

  addToEmailBuilder(name) {
    if (name) {
      if (!this.templateData.IsLocked || this.templateData.StatusId !== 3 || !this.disableField) {
        if (name !== 'null') {
          let builderEditor = this.emailBuilderEditor;
          builderEditor.html.insert(
            "<span class='emailBuilder' id='" +
            name +
            "' draggable='true' dir='" +
            name +
            "'>[" +
            name +
            ']</span>&nbsp;&nbsp;'
          );
          builderEditor.events.focus();
        }
      }
    }
  }

  updateEmailBuilder() {
    this.updateEmail = true;

    if (this.updateEmail && this.emailField.Subject != '') {
      this.templateData.EmailBuilder = this.emailField;
      // this.templateData.EmailBuilder = null
      this.alertService.successPage('Email Builder updated successfully');
    }
  }
  //Get Template Detail Api
  getTemplate() {
    this.spinner.show();
    this.templateService.getTemplateById(this.templateId).subscribe(
      (res) => {
        this.spinner.hide();
        this.ReminderDays = res.ReminderDays[0]
        if (res.AccountId !== this.accountNumber) {
          this.router.navigate(['/admin/templates']);
        }
        this.initialTemplateStatus = res.StatusId;

        // check now propertyMe on or not
        // this.allApps.find(app => {
        //   if(app.Id == )
        // })

        // this.templateData = res;
        this.setColorAndUUID(res);

        // calculate Attachment Size
        this.calculateAttechmentSize();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  mandatoryCheckboxChange(value) {
    // console.log("CheckBox Value :--",value)
    this.newField.Mandatory = value;
  }

  async addFieldInParties() {
    // let index = this.templateData.TemplateParties.findIndex(x=>x.Id == this.newField.Id);
    let index = this.newField.Id;

    let fieldNameExist = await this.checkFieldNameExist(
      index,
      this.newField.Name
    );

    if (fieldNameExist) {
      this.alertService.error('This Field Name Already Taken');
    } else {
      this.newField.Id = this.templateData.TemplateParties[index].Id;

      if (this.newField.FieldTypeId == this.constant.CheckboxFieldTypeId ||
        this.newField.FieldTypeId == this.constant.DropdownFieldTypeId
      ) {
        if(this.newField.Format.length == 0){
          this.alertService.error('Please enter value');
        } else {
          this.newField.Format = JSON.stringify(this.newField.Format);

          this.templateData.TemplateParties[index].TemplateCustomFields.push(
            this.newField
          );

          //
          this.selectedSubSection = 'fieldList';
          this.resetaddFieldInParties();
          this.loadScript();
        }
      } else {

        this.templateData.TemplateParties[index].TemplateCustomFields.push(
          this.newField
        );

        //
        this.selectedSubSection = 'fieldList';
        this.resetaddFieldInParties();
        this.loadScript();
      }
    }
  }

  addDropAndCheckBoxValue(value) {
    this.newField.Format.push(value);

    this.dropDownEnterValue = '';
    this.checkBoxEnterValue = '';

    this.addButtonDisable = true;
  }

  removeDropAndCheckBoxValue(index) {
    this.newField.Format.splice(index, 1);
  }

  verifyRegex(value) {
    if (!value) {
      this.addButtonDisable = true;
    } else {
      const regex = new RegExp('(?!^ +$)^.+$');
      const valid = regex.test(value);
      valid ? (this.addButtonDisable = false) : (this.addButtonDisable = true);
    }
  }

  //check Validation For Field Add
  checkFieldNameExist(partyIndex, fieldName) {
    let PartyFields = this.templateData.TemplateParties[partyIndex].PartyFields;
    let TemplateCustomFields =
      this.templateData.TemplateParties[partyIndex].TemplateCustomFields;

    let exist = false;

    // let splFieldName = fieldName.split(" ").join(""); /\s/
    var splFieldName = fieldName.toLowerCase();
    splFieldName = splFieldName.split(/\s/).join('');

    for (var i = 0; i < PartyFields.length; i++) {
      // let lpPartyField = PartyFields[i].Name.split(" ").join("")
      var lpPartyField = PartyFields[i].Name.toLowerCase();
      lpPartyField = lpPartyField.split(/\s/).join('');

      if (splFieldName == lpPartyField) {
        exist = true;
      }
    }

    for (var j = 0; j < TemplateCustomFields.length; j++) {
      // let lpCustomPartyField = TemplateCustomFields[j].Name.split(" ").join("")
      var lpCustomPartyField = TemplateCustomFields[j].Name.toLowerCase();
      lpCustomPartyField = lpCustomPartyField.split(/\s/).join('');

      if (splFieldName == lpCustomPartyField) {
        exist = true;
      }
    }

    return exist;
  }

  // set color and UUID
  setColorAndUUID(data) {
    let partyList = [];

    var ownerRequired = false;
    var tenantRequired = false;
    var buyerRequired = false;
    var sellerRequired = false;

    var firstRecipientExist = false
    for (var i = 0; i < data.TemplateParties.length; i++) {

      if (!data.TemplateParties[i].Color) {
        if (
          data.TemplateParties[i].PartyTypeId !== 8 &&
          data.TemplateParties[i].PartyTypeId !== 9
        ) {
          // data.TemplateParties[i].Color = 'yellow';
          // data.TemplateParties[i].ColorCode = '#fdfd96';

          if(!firstRecipientExist){
            data.TemplateParties[i].Color = 'yellow';
            data.TemplateParties[i].ColorCode = '#f7f5cb';

            firstRecipientExist = true
          }else{
            var clr = this.getRandomColor();
            data.TemplateParties[i].Color = clr.colorName;
            data.TemplateParties[i].ColorCode = clr.colorCode;
          }
        } else {
          if (data.TemplateParties[i].PartyTypeId == 9) {
            data.TemplateParties[i].Color = 'pink';
            data.TemplateParties[i].ColorCode = '#F6ECF5';
          } else if (data.TemplateParties[i].PartyTypeId == 8) {
            data.TemplateParties[i].Color = 'orange';
            data.TemplateParties[i].ColorCode = '#F5D5CB';
          } else {
            var clr = this.getRandomColor();
            data.TemplateParties[i].Color = clr.colorName;
            data.TemplateParties[i].ColorCode = clr.colorCode;
            // data.TemplateParties[i].Color = this.getRandomColor();
          }
        }
      }
      data.TemplateParties[i].TemplateFields = [];
      if (
        data.TemplateParties[i].UUID == '00000000-0000-0000-0000-000000000000'
      ) {
        data.TemplateParties[i].UUID = uuidv4();
      }

      for (var j = 0; j < data.TemplateParties[i].TemplateCustomFields.length;j++) {
        if (
          data.TemplateParties[i].TemplateCustomFields[j].UUID ==
          '00000000-0000-0000-0000-000000000000'
        ) {
          data.TemplateParties[i].TemplateCustomFields[j].UUID = uuidv4();
        }
      }

      // Set first owner, tenant, seller, buyer required
      if(!ownerRequired && data.TemplateParties[i].PartyTypeId == this.constant.PartyTypeId_Rentals_Owner){
        data.TemplateParties[i].Mandatory = true
        ownerRequired = true
      }

      if(!tenantRequired && data.TemplateParties[i].PartyTypeId == this.constant.PartyTypeId_Rentals_Tenant){
        data.TemplateParties[i].Mandatory = true
        tenantRequired = true
      }

      if(!buyerRequired && data.TemplateParties[i].PartyTypeId == this.constant.PartyTypeId_Sales_Buyer){
        data.TemplateParties[i].Mandatory = true
        buyerRequired = true
      }

      if(!sellerRequired && data.TemplateParties[i].PartyTypeId == this.constant.PartyTypeId_Sales_Seller){
        data.TemplateParties[i].Mandatory = true
        sellerRequired = true
      }

      //set party in order wise
      data.TemplateParties.find((tmp_prt) => {
        if (i == tmp_prt.Order) {
          partyList.push(tmp_prt);
        }
      });


    }

    for (var k = 0; k < data.TemplateSections.length; k++) {
      if (
        data.TemplateSections[k].UUID == '00000000-0000-0000-0000-000000000000'
      ) {
        data.TemplateSections[k].UUID = uuidv4();
      }

      for (
        var l = 0;
        l < data.TemplateSections[k].TemplateClauses.length;
        l++
      ) {
        if (
          data.TemplateSections[k].TemplateClauses[l].UUID ==
          '00000000-0000-0000-0000-000000000000'
        ) {
          data.TemplateSections[k].TemplateClauses[l].UUID = uuidv4();
        }
      }
    }



    if (data.EmailBuilder) {
      this.emailField.Subject = data.EmailBuilder.Subject;
      this.emailField.Body = data.EmailBuilder.Body;
    }
    data.TemplateParties = partyList;
    this.templateData = data;
    this.templateDataMain = new Object(data);

    // If No Section available the add one section
    if (data.TemplateSections.length == 0) {
      let sectionLength = this.templateData.TemplateSections.length;
      let sectionName = '';
      if (sectionLength > 0) {
        let section = this.templateData.TemplateSections[sectionLength - 1];
        let secName = section.Name;
        let splSecNames = secName.split('-');
        let splitedNumber = splSecNames[splSecNames.length - 1];
        let secNumber = Number(splitedNumber) + 1;
        sectionName = 'Clause section-' + secNumber;
      } else {
        sectionName = 'Clause section-' + (sectionLength + 1);
      }

      //sections
      let addSection = {
        UUID: uuidv4(),
        EnableBulleting: true,
        Id: 0,
        Index: 1,
        Name: sectionName,
        IsAdded: false,
        TemplateClauses: [],
      };
      this.templateData.TemplateSections.push(addSection);
      this.addClause.section = this.templateData.TemplateSections.length - 1;
      this.sectionChange(this.templateData.TemplateSections.length - 1);
    }

    if (this.templateData.IsLocked || this.templateData.StatusId == 3) {
      this.editor.edit.off();
      // this.clauseEditor.edit.off();
      // this.emailBuilderEditor.edit.off()
    }

    this.getPropertyMeStatus();
  }

  //get Random color class
  getRandomColor() {
    return this.colorClass[Math.floor(Math.random() * this.colorClass.length)];
  }

  //Set UUID in get TemplateParties and TemplateCustomFields

  //Final Template Save Function
  async saveTemplate() {
    // First Check altleat One party is added in TemplateParties or not except Sender

    let otherParty = this.templateData.TemplateParties.filter((party) => {
      if (party.PartyTypeId !== 9) {
        return party;
      }
    });

    //templateData.TemplateSections

    if (otherParty.length == 0) {
      this.alertService.error('Please add atleast one party');
    } else if(this.templateData.Groups.length == 0){
      this.alertService.error('Please check one groups');
    } else if(this.checkOneClausePerSection(this.templateData.TemplateSections)){
      this.alertService.error('Please add minimum one cluase in a section');
    } else {
      await this.setAllClausesIndex();

      // Html DOM Parserhttps://meet.google.com/rkx-ekwn-aoh
      var doc = new DOMParser().parseFromString(
        this.editor.html.get(),
        'text/html'
      );
      let froalaPartyFields = doc.getElementsByClassName('partyFields');
      let froalaPartyCustomFields = doc.getElementsByClassName('customFields');
      let propertyMeFields = doc.getElementsByClassName('propertyMeFields');

      // For Party Field
      for (var i = 0; i < froalaPartyFields.length; i++) {
        let dir_str = froalaPartyFields[i].attributes['dir'].value;
        let spl_dir = dir_str.split('-%n%-');
        if (spl_dir[0] && spl_dir[1]) {
          //Fing UUID In Template Parties
          let party_field = this.templateData.TemplateParties.find((e) => {
            if (e.UUID == spl_dir[0]) {
              let prt_fld = e.PartyFields.find((p_field) => {
                if (p_field.Id == spl_dir[1]) {
                  return p_field;
                }
              });
              // console.log("prt_fld----",prt_fld);
              if (prt_fld) {
                let tempFieldExist = e.TemplateFields.find((temp_fld) => {
                  if (temp_fld.FieldId == prt_fld.Id) {
                    return temp_fld;
                  }
                });

                if (!tempFieldExist) {
                  let prty_fld = {
                    FieldId: prt_fld.Id,
                  };
                  e.TemplateFields.push(prty_fld);
                }
              }
              return e;
            }
          });

          // console.log("TemplateParties---",this.templateData.TemplateParties[parseInt(spl_dir[0])])
          // let party_field = this.templateData.TemplateParties[parseInt(spl_dir[0])].PartyFields[parseInt(spl_dir[1])]
          // console.log("Field---",party_field)
          // // first check it is already exist
          // let tempFieldExist = this.templateData.TemplateParties[parseInt(spl_dir[0])].TemplateFields.find(e => {
          //   if(e.FieldId == party_field.Id){
          //     return e
          //   }
          // });
          // console.log("In-Temp-Party-Field-Exist----",tempFieldExist);
          // if(!tempFieldExist){
          //   let prty_fld = {
          //     FieldId : party_field.Id
          //   }
          //   this.templateData.TemplateParties[parseInt(spl_dir[0])].TemplateFields.push(prty_fld);
          // }
        }
      }

      // For Custom Field
      for (var j = 0; j < froalaPartyCustomFields.length; j++) {
        let dir_custom_str = froalaPartyCustomFields[j].attributes['dir'].value;
        let spl_custom_dir = dir_custom_str.split('-%n%-');
        if (spl_custom_dir[0] && spl_custom_dir[1]) {
          let custom_field = this.templateData.TemplateParties.find((e) => {
            if (e.UUID == spl_custom_dir[0]) {
              let tmpl_custm_fld = e.TemplateCustomFields.find((cutm_fld) => {
                if (cutm_fld.FieldTypeId == spl_custom_dir[1]) {
                  return cutm_fld;
                }
              });

              if (tmpl_custm_fld) {
                let tempFieldExist = e.TemplateFields.find((temp_fld) => {
                  if (temp_fld.FieldId == tmpl_custm_fld.Id) {
                    return temp_fld;
                  }
                });

                if (!tempFieldExist) {
                  let cust_fld = {
                    FieldId: tmpl_custm_fld.FieldTypeId,
                  };
                  e.TemplateFields.push(cust_fld);
                }
              }
            }
          });

          // console.log("Dir----",spl_custom_dir)
          // let custom_field = this.templateData.TemplateParties[parseInt(spl_custom_dir[0])].TemplateCustomFields[parseInt(spl_custom_dir[1])]
          // // first check it is already exist
          // let tempFieldExist = this.templateData.TemplateParties[parseInt(spl_custom_dir[0])].TemplateFields.find(e => {
          //   if(e.FieldId == custom_field.FieldTypeId){
          //     return e
          //   }
          // });
          // console.log("In-Temp-Custom-Field-Exist----",tempFieldExist);
          // if(!tempFieldExist){
          //   let cust_fld = {
          //     FieldId: custom_field.FieldTypeId
          //   }
          //   this.templateData.TemplateParties[parseInt(spl_custom_dir[0])].TemplateFields.push(cust_fld);
          // }
        }
      }

      // For Property Me Field
      for (var k = 0; k < propertyMeFields.length; k++) {
        let propertyId = propertyMeFields[k].attributes['dir'].value;

        let pro_field_exist = this.templateData.TemplatePropertyMeFields.find(
          (temp_prop) => {
            if (temp_prop.PropertyMeFieldId == propertyId) {
              return temp_prop;
            }
          }
        );

        let pro_field = this.templateData.PropertyMeFields.find((pr_field) => {
          if (pr_field.Id == propertyId) {
            return pr_field;
          }
        });

        if (!pro_field_exist && pro_field) {
          let template_property_Field = {
            PropertyMeFieldId: propertyId,
            Name: pro_field.Name,
          };

          this.templateData.TemplatePropertyMeFields.push(
            template_property_Field
          );
        }
      }

      // this.templateDataMain = this.templateData

      // //remove PartyFields from TemplateParties For the request
      // for(var k=0; k < this.templateData.TemplateParties.length; k++){
      //   delete this.templateData.TemplateParties[k].PartyFields
      // }

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

      this.templateData.Content = doc.body.outerHTML;

      // Calling Save API
      this.spinner.show();
      this.templateData.ReminderDays[0] = this.ReminderDays
      this.templateData.Groups = [];

      for (var i = 0; i < this.activeGroupsArray.length; i++) {
        if (this.activeGroupsArray[i].checked) {
          this.templateData.Groups.push(this.activeGroupsArray[i].Id)
        }
      }
      this.templateService.updateTemplate(this.templateData).subscribe(
        (res) => {
          this.spinner.hide();
          this.alertService.successPage(res.Messages);
          this.router.navigate(['/admin/templates']);
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error.Message);
          this.templateData = this.templateDataMain;
        }
      );
    }
  }

  // Check alteast one clause per section
  checkOneClausePerSection(data){
    var val = false

    for(var i=0 ; i < data.length; i++){
      if(data[i].TemplateClauses.length == 0){
        val = true
      }
    }

    return val
  }

  // Restore Template From Archived to Draft
  restoreTemplate(){
    this.templateService.restoreTemplate(this.templateId).subscribe(res => {
      this.ngOnInit();
    })
  }

  // Get List of currency
  getCurrency(){
    this.templateService.getCurrency().subscribe(res => {
      this.currencyList = res
    })
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

  toggleSidebar() {
    $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.page-content').toggleClass('page-expanded page-collapsed');
  }

  insertPageBreaker() {
    FroalaEditor.DefineIcon('pageBreaker', {
      NAME: 'pageBreaker',
      SVG_KEY: 'pageBreaker',
    });
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

  async getPropertyMeStatus(){
    this.allApps = await this.getAllApps();
    this.allApps.forEach(element => {
      if(element.Id == 1){
        this.propertyMeStatus = element.Active;
        if(this.propertyMeStatus == false && this.templateData.PropertyMeTypeId > 0){
          this.disableField = 1;
          this.editor.edit.off();
          this.emailBuilderEditor.edit.off();
          this.clauseEditor.edit.off();

        }
      }
    });

  }
}
