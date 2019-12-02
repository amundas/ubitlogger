import {language as defaultLang} from './language.en';
import {LanguageInterface} from './languageInterface'
/*  TODO:
    When angular-cli 9 is released, one should be able to use multiple configurations when building a project.
    The idea with building for different languages, is that it should be done something like this:
    ng build --prod --configuration=en
    Here both the production and english configuration will be used. In angular.json, file replacements should be set up so that language.ts is 
    replaced with the correct language file
*/
export const language = <LanguageInterface>defaultLang;
