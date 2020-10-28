import React from 'react';
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

// const Field = (props: FieldProps) => {
export default class Field extends React.Component<FieldProps> {
  constructor(props: FieldProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  translateField() {
    const {deeplApiKey} = (this.props.sdk.parameters.installation as AppInstallationParameters)
    const source_locale = this.props.sdk.locales.default
    const destination_locales = this.props.sdk.locales.available.filter(locale => {return locale !== source_locale})
    destination_locales.forEach(destination_locale => {
      translate({
        text: this.props.sdk.field.getValue(),
        source_lang: source_locale.slice(0,2).toUpperCase(),
        target_lang: destination_locale.slice(0,2).toUpperCase(),
        auth_key: deeplApiKey,
      }).then((result: DeepLResponse)  => {
        let translated_text = result.data.translations[0].text
        let field_id = this.props.sdk.field.id
        this.props.sdk.entry.fields[field_id].setValue(translated_text, destination_locale)
        console.log(translated_text);
      }).catch((error:Error) => console.error);
    })
  }

  render() {
    const current_locale = this.props.sdk.field.locale
    const default_locale = this.props.sdk.locales.default
    let button = null
    if (current_locale === default_locale) button = <Button 
      icon="Language" 
      buttonType="muted" 
      onClick={this.translateField} >
        Translate
    </Button>

    return (
      <div>
        <SingleLineEditor field={this.props.sdk.field} locales={this.props.sdk.locales} />
        { button }
      </div>
    )
  }
};
