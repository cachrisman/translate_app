import React, { useEffect } from 'react';
import { Button } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SingleLineEditor } from '@contentful/field-editor-single-line';
const translate = require("deepl");

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface AppInstallationParameters {
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

  useEffect(() => {
    props.sdk.window.startAutoResizer();
  })

  const translateField = () => {
    console.log("Field -> translateField")
    const {deeplApiKey} = (props.sdk.parameters.installation as AppInstallationParameters)
    const source_locale = props.sdk.locales.default
    const destination_locales = props.sdk.locales.available.filter(locale => {return locale !== source_locale})
    destination_locales.forEach(destination_locale => {
      translate({
        text: props.sdk.field.getValue(),
        source_lang: source_locale.slice(0,2).toUpperCase(),
        target_lang: destination_locale.slice(0,2).toUpperCase(),
        auth_key: deeplApiKey,
      }).then((result: DeepLResponse)  => {
        let translated_text = result.data.translations[0].text
        let field_id = props.sdk.field.id
        props.sdk.entry.fields[field_id].setValue(translated_text, destination_locale)
        console.log(translated_text);
      }).catch((error:Error) => console.error);
    })
  }

  const current_locale = props.sdk.field.locale
  const default_locale = props.sdk.locales.default
  let button = null
  if (current_locale === default_locale) button = <Button 
    icon="Language" 
    buttonType="muted" 
    onClick={translateField} >
      Translate
  </Button>

  return (
    <div>
      <SingleLineEditor field={props.sdk.field} locales={props.sdk.locales} />
      { button }
    </div>
  )
};

export default Field;