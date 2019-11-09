import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GtmScriptComponent } from './gtm-script.component';

const FAKE_GTM_ID = 'FAKE-GTM-ID';
const EXPECTED_GTM_SCRIPT_PART = `(window,document,'script','dataLayer', '${FAKE_GTM_ID}')`;

describe('GtmScriptComponent', () => {
  let fixture: ComponentFixture<GtmScriptComponent>;
  let component: GtmScriptComponent;
  let document: HTMLDocument;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GtmScriptComponent],
      providers: [Renderer2],
    });

    document = TestBed.get(DOCUMENT);
    fixture = TestBed.createComponent(GtmScriptComponent);
    component = fixture.componentInstance;
  });

  it('should not attach gtm-script to the document when tagManagerId is not given', () => {
    component.tagManagerId = undefined;

    component.ngOnInit();

    const documentScripts = Array.from(document.scripts);
    expect(findGtmScript(documentScripts)).toBeUndefined();
  });

  it('should attach gtm-script to the document when tagManagerId given', () => {
    component.tagManagerId = 'FAKE-GTM-ID';

    component.ngOnInit();

    const documentScripts = Array.from(document.scripts);
    expect(findGtmScript(documentScripts)).toBeTruthy();
  });
});

const findGtmScript = (scripts: HTMLScriptElement[]) =>
  scripts.find(script => script.type === 'text/javascript' && script.text.includes(EXPECTED_GTM_SCRIPT_PART));
