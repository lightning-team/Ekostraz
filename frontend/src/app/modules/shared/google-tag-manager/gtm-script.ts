import { Renderer2 } from '@angular/core';
import { environment } from '@environment';

const GTM_INIT_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', '${environment.tagManagerId}');`;

export function renderGTMInitScript(renderer: Renderer2, DOMElement: Element) {
  const script = renderer.createElement('script');
  script.type = `text/javascript`;
  script.text = GTM_INIT_SCRIPT;

  renderer.appendChild(DOMElement, script);
}
