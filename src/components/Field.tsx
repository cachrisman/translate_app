import React from 'react';
import { Button, HelpText } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SingleLineEditor } from '@contentful/field-editor-single-line';
const translate = require("deepl");

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface AppInstallationParameters {
  deeplApiKey: string;
}

interface AppInstanceParameters {
  helpText: string;
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
  const current_locale = props.sdk.field.locale
  let default_locale = props.sdk.locales.default

  const translateField = () => {
    const {deeplApiKey} = (props.sdk.parameters.installation as AppInstallationParameters)
    const source_locale = default_locale
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

  let button = null
  if (current_locale === default_locale) button = <Button buttonType="muted" onClick={translateField} >Translate</Button>

  const {helpText} = (props.sdk.parameters.instance as AppInstanceParameters)
  let helptext_component = null
  if (helpText) helptext_component = <HelpText>{ helpText }</HelpText>

  return (
    <div>
      <SingleLineEditor field={props.sdk.field} locales={props.sdk.locales} />
      { helptext_component }
      { button }
    </div>
  )
};

export default Field;
