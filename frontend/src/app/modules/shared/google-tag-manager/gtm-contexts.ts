import {InjectionToken} from '@angular/core';

interface GtmContexts {
    [key: string]: string;
}

export const GTM_CONTEXTS = new InjectionToken<GtmContexts>('google-tag-manager-contexts');
