import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-gtm-script',
  template: '',
})
export class GtmScriptComponent implements OnInit, OnDestroy {
  @Input() tagManagerId: string;

  private script: HTMLScriptElement | undefined;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document) {}

  ngOnInit() {
    this.renderGTMInitScript();
  }

  private renderGTMInitScript(): void {
    if (!this.tagManagerId) return;

    this.script = createGtmScriptTag(this.renderer, this.tagManagerId);
    this.renderer.appendChild(this.document.body, this.script);
  }

  ngOnDestroy() {
    if (this.script) {
      this.script.remove();
    }
  }
}

const createGtmScriptTag = (renderer: Renderer2, tagManagerId: string): HTMLScriptElement => {
  const script = renderer.createElement('script');
  script.type = `text/javascript`;
  script.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', '${tagManagerId}');`;

  return script;
};
