import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[vaFlexAlignmentHack]'
})

export class FlexAlignmentHackDirective {

    @Input() set vaFlexAlignmentHack(count: number) {

        // set default value of count
        count = count || 10;

        this.viewContainerRef.clear();
        for (let i = 0; i < count; i++) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }

    constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {

    }
}
