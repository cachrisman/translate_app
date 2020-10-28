import React from 'react';
import { Button, HelpText } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SingleLineEditor } from '@contentful/field-editor-single-line';
 const translate = require("deepl");

// -----------------------------------
// POST /v2/translate?auth_key=[yourAuthKey]> HTTP/1.0
// Host: api.deepl.com
// User-Agent: YourApp
// Accept: */*
// Content-Length: 54
// Content-Type: application/x-www-form-urlencoded

// auth_key=[yourAuthKey]&text=Hello, world&target_lang=DE
// EXAMPLE RESPONSE
// {
// 	"translations": [{
// 		"detected_source_language":"EN",
// 		"text":"Hallo, Welt!"
// 	}]
// }
// -----------------------------------

// const translate = require("deepl");
//
// translate({
//     text: 'I am a text',
//     target_lang: 'FR',
//     auth_key: 'authkey',
//     // All optional parameters available in the official documentation can be defined here as well.
//   })
//   .then(result => {
//       console.log(result.data);
//   })
//   .catch(error => {
//       console.error(error)
//   });
// RESPONSE
// {
//     "translations": [
//         {
//             "detected_source_language": "EN",
//             "text": "Je suis un texte"
//         }
//     ]
// }

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface AppInstanceParameters {
  deeplApiKey: string;
}

interface DeepLResponse {
  data: {
    translations: {
      detected_source_language: string;
      text: string;
    }[]
  }
}

const Field = (props: FieldProps) => {

  const translateField = () => {
    const {deeplApiKey} = (props.sdk.parameters.instance as AppInstanceParameters)
    const source_locale = props.sdk.locales.default
    const destination_locales = props.sdk.locales.available.filter(locale => {return locale !== source_locale})
    destination_locales.map(destination_locale => {
      translate({
        text: props.sdk.field.getValue(),
        source_lang: source_locale.slice(0,2).toUpperCase(),
        target_lang: destination_locale.slice(0,2).toUpperCase(),
        auth_key: deeplApiKey,
      })
      .then((result: DeepLResponse)  => {
          let translated_text = result.data.translations[0].text
          let field_id = props.sdk.field.id
          console.log(translated_text, field_id);
          props.sdk.entry.fields[field_id].setValue(translated_text, destination_locale)
      })
      .catch((error:Error) => {
          console.error(error)
      });
    })
    console.log('you clicked a button')
    
  }

  console.log(props.sdk)
  

  let button = null
  if (props.sdk.field.locale === props.sdk.locales.default) {
    button = <Button buttonType="muted" onClick={translateField} >Translate</Button>
  }

  return <div>
    <SingleLineEditor field={props.sdk.field} locales={props.sdk.locales} />
    <HelpText>Help Text 123</HelpText>
    { button }

  </div>
};

export default Field;
