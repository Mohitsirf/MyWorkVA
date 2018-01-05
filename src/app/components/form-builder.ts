import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

@Component({

  selector: 'va-form-builder',
  template: `
    <div #builder></div>
  `,
  styles: []
})
export class FormBuilderComponent implements AfterViewInit {

  @ViewChild('builder') builder: ElementRef;
  @Input() fields: any;

  formBuilder: any;

  ngAfterViewInit() {

// https://github.com/kevinchappell/formBuilder/blob/3e26beed2fe483e7fd43b1193e7a627ba869985f/src/js/form-builder.js

    const config = {
      disableFields: [
        'autocomplete',
        'button',
        'file',
        'header',
        'paragraph'
      ],
      controlOrder: [
        'text',
        'textarea',
        'checkbox-group',
        'radio-group',
        'select',
        'date',
        'number',
        'hidden'
      ],
      disabledActionButtons: ['data', 'clear', 'save'],
      disabledAttrs: ['access', 'description', 'toggle', 'className'],
      typeUserDisabledAttrs: {
        'text': [
          'value',
          'placeholder'
        ],
        'textarea': [
          'value',
          'type',
          'subtype',
          'rows',
          'placeholder'
        ],
        'date': [
          'value',
          'placeholder'
        ],
        'number': [
          'value',
          'placeholder'
        ],
        'select': [
          'multiple',
          'placeholder'
        ],
        'checkbox-group': [
          'other'
        ],
        'radio-group': [
          'other'
        ]
      }
    };

    if (this.fields) {
      config['defaultFields'] = this.fields;
    }
    this.formBuilder = jQuery(this.builder.nativeElement).formBuilder(config);
  }

  getFields() {
    return this.formBuilder.actions.getData('json');
  }
}
