import { Directive, Component, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';

@Directive({ selector: '[hasPermissions]' })
export class HasPermissionsDirective implements OnInit {

  @Input('hasPermissions') permissions: string[];

  constructor(
    private session: SessionService,
    private templateRef: TemplateRef<any>,    
    private viewContainer: ViewContainerRef
  ) {}
  
  ngOnInit(): void {    
    if(this.hasPermissions(this.permissions)){
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  hasPermissions(permissions: string[]): boolean {
    for (const permission of permissions) {
      if (!this.session.getPermissions() || !this.session.getPermissions().includes(permission)) {
        return false;
      }
    }
    return true;
  }
}

@Directive({ selector: '[valueChange]' })
export class ValueChangeDirective {
  private currentValue: any;
  private hasView = false;
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) { }
  @Input() set valueChange(val: any) {
    if (!this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (val !== this.currentValue) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.currentValue = val;
    }
  }
}
