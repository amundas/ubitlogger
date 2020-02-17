import {language as defaultLang} from './language.en';
import {LanguageInterface} from './languageInterface'
/* Depending on the configuration, this file will be replaced with the correct file during build.
   This leads to smaller bundle sizes, and changing language on the fly is not really that important.
   Instead each language should be hosted on a subdomain (e.g en.ubitlogger.com).
*/
export const language = <LanguageInterface>defaultLang;
